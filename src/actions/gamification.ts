"use server";

import { db } from "@/db";
import {
  userXpTransactions,
  users,
  badges,
  userBadges,
  notifications,
  challenges,
  challengeParticipations,
  rewardRedemptions,
  rewards,
  departments,
} from "@/db/schema";
import { and, eq, gte, desc, sql } from "drizzle-orm";
import { checkRole, getSessionUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

/**
 * Award XP to a user with idempotency and daily limits.
 */
export async function awardXp(
  userId: string,
  amount: number,
  reason: string,
  referenceId: string,
  overrideLimit = false
) {
  try {
    // 1. Idempotency Check
    const [existing] = await db
      .select()
      .from(userXpTransactions)
      .where(
        and(
          eq(userXpTransactions.userId, userId),
          eq(userXpTransactions.referenceId, referenceId)
        )
      )
      .limit(1);

    if (existing) {
      return { success: true, reason: "duplicate_ignored" };
    }

    // 2. Daily Limit Check (max 200 XP/day unless override)
    let amountToAward = amount;
    if (!overrideLimit) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todayTx = await db
        .select({ amount: userXpTransactions.amount })
        .from(userXpTransactions)
        .where(
          and(
            eq(userXpTransactions.userId, userId),
            gte(userXpTransactions.createdAt, startOfDay)
          )
        );

      const sumTodayXp = todayTx.reduce((sum, tx) => sum + tx.amount, 0);

      if (sumTodayXp >= 200) {
        return { success: false, reason: "daily_limit_reached" };
      }
      amountToAward = Math.min(amount, 200 - sumTodayXp);
    }

    if (amountToAward <= 0) {
      return { success: false, reason: "zero_amount" };
    }

    // 3. Get user's old XP for level up check
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return { success: false, reason: "user_not_found" };
    }

    const oldXp = user.xp;
    const newXp = oldXp + amountToAward;

    // 4. Update user profile
    await db
      .update(users)
      .set({
        xp: newXp,
        points: user.points + amountToAward,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // 5. Log transaction
    await db.insert(userXpTransactions).values({
      userId,
      amount: amountToAward,
      reason,
      referenceId,
    });

    // 6. Check for level up notification
    const oldLevel = Math.floor(oldXp / 100) + 1; // 100 XP per level as per level rules (floor(XP / 100) + 1)
    const newLevel = Math.floor(newXp / 100) + 1;

    if (newLevel > oldLevel) {
      await db.insert(notifications).values({
        userId,
        type: "badge_unlock",
        message: `Congratulations! You leveled up to Level ${newLevel}! 🎉`,
      });
    }

    // 7. Check Badge Unlocks
    const activeBadges = await db
      .select()
      .from(badges)
      .where(eq(badges.status, "active"));

    for (const badge of activeBadges) {
      const unlockRule = badge.unlockRule;
      let qualifies = false;

      if (unlockRule.type === "xp") {
        qualifies = newXp >= unlockRule.threshold;
      } else if (unlockRule.type === "challenges") {
        const [approvedCount] = await db
          .select({ count: sql<number>`count(${challengeParticipations.id})::int` })
          .from(challengeParticipations)
          .where(
            and(
              eq(challengeParticipations.employeeId, userId),
              eq(challengeParticipations.approvalStatus, "approved")
            )
          );
        qualifies = (approvedCount?.count || 0) >= unlockRule.threshold;
      }

      if (qualifies) {
        // Check if user already unlocked this badge
        const [alreadyUnlocked] = await db
          .select()
          .from(userBadges)
          .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badge.id)))
          .limit(1);

        if (!alreadyUnlocked) {
          await db.insert(userBadges).values({
            userId,
            badgeId: badge.id,
          });

          await db.insert(notifications).values({
            userId,
            type: "badge_unlock",
            message: `New Badge Unlocked: ${badge.name}! 🏆`,
          });
        }
      }
    }

    return { success: true, xpAwarded: amountToAward };
  } catch (error) {
    console.error("Error in awardXp:", error);
    return { success: false, reason: "internal_error" };
  }
}

/**
 * Fetch employee and department leaderboards.
 */
export async function getLeaderboards() {
  const employees = await db
    .select({
      id: users.id,
      name: users.name,
      xp: users.xp,
      points: users.points,
      role: users.role,
      departmentName: departments.name,
    })
    .from(users)
    .leftJoin(departments, eq(users.departmentId, departments.id))
    .orderBy(desc(users.xp))
    .limit(10);

  const departmentsLeaderboard = await db
    .select({
      id: departments.id,
      name: departments.name,
      totalXp: sql<number>`COALESCE(sum(${users.xp}), 0)::int`,
      employeeCount: sql<number>`count(${users.id})::int`,
    })
    .from(departments)
    .leftJoin(users, eq(users.departmentId, departments.id))
    .groupBy(departments.id, departments.name)
    .orderBy(desc(sql`COALESCE(sum(${users.xp}), 0)`))
    .limit(10);

  return {
    employees,
    departments: departmentsLeaderboard,
  };
}

/**
 * Redeem a reward using points.
 */
export async function redeemRewardAction(rewardId: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) {
    return { error: "Please sign in to redeem rewards." };
  }

  try {
    const [reward] = await db
      .select()
      .from(rewards)
      .where(eq(rewards.id, rewardId))
      .limit(1);

    if (!reward) {
      return { error: "Reward not found." };
    }

    if (reward.status !== "active") {
      return { error: "This reward is currently unavailable." };
    }

    if (reward.stock !== null && reward.stock <= 0) {
      return { error: "This reward is out of stock." };
    }

    // Retrieve fresh user points
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, sessionUser.id))
      .limit(1);

    if (!user) {
      return { error: "User not found." };
    }

    if (user.points < reward.pointsRequired) {
      return { error: `Insufficient points. You need ${reward.pointsRequired} points but have ${user.points}.` };
    }

    // Perform redemption
    await db.transaction(async (tx) => {
      // Deduct points
      await tx
        .update(users)
        .set({
          points: user.points - reward.pointsRequired,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      // Decrement stock
      if (reward.stock !== null) {
        await tx
          .update(rewards)
          .set({
            stock: reward.stock - 1,
            updatedAt: new Date(),
          })
          .where(eq(rewards.id, reward.id));
      }

      // Add redemption record
      await tx.insert(rewardRedemptions).values({
        employeeId: user.id,
        rewardId: reward.id,
        pointsSpent: reward.pointsRequired,
      });

      // Notify user
      await tx.insert(notifications).values({
        userId: user.id,
        type: "csr_approval",
        message: `Successfully redeemed "${reward.name}"! ${reward.pointsRequired} points deducted.`,
      });
    });

    revalidatePath("/gamification/rewards");
    revalidatePath("/gamification/overview");
    return { success: true };
  } catch (error: any) {
    console.error("Error redeeming reward:", error);
    return { error: error.message || "Failed to redeem reward." };
  }
}

/**
 * Join an active challenge.
 */
export async function joinChallengeAction(challengeId: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) {
    return { error: "Please sign in to join challenges." };
  }

  try {
    const [challenge] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, challengeId))
      .limit(1);

    if (!challenge) {
      return { error: "Challenge not found." };
    }

    const [existing] = await db
      .select()
      .from(challengeParticipations)
      .where(
        and(
          eq(challengeParticipations.challengeId, challengeId),
          eq(challengeParticipations.employeeId, sessionUser.id)
        )
      )
      .limit(1);

    if (existing) {
      return { error: "You are already participating in this challenge." };
    }

    await db.insert(challengeParticipations).values({
      challengeId,
      employeeId: sessionUser.id,
      progressPct: 0,
      approvalStatus: "pending",
    });

    revalidatePath("/gamification/challenges");
    return { success: true };
  } catch (error: any) {
    console.error("Error joining challenge:", error);
    return { error: error.message || "Failed to join challenge." };
  }
}

/**
 * Submit evidence (URL/text) for a challenge completion under review.
 */
export async function submitChallengeEvidenceAction(
  challengeId: string,
  proofUrl: string
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) {
    return { error: "Please sign in to submit challenge evidence." };
  }

  try {
    const [participation] = await db
      .select()
      .from(challengeParticipations)
      .where(
        and(
          eq(challengeParticipations.challengeId, challengeId),
          eq(challengeParticipations.employeeId, sessionUser.id)
        )
      )
      .limit(1);

    if (!participation) {
      // Auto-join and submit in one go
      await db.insert(challengeParticipations).values({
        challengeId,
        employeeId: sessionUser.id,
        progressPct: 100,
        proofUrl,
        approvalStatus: "pending",
      });
    } else {
      await db
        .update(challengeParticipations)
        .set({
          progressPct: 100,
          proofUrl,
          approvalStatus: "pending",
        })
        .where(eq(challengeParticipations.id, participation.id));
    }

    revalidatePath("/gamification/challenges");
    return { success: true };
  } catch (error: any) {
    console.error("Error submitting evidence:", error);
    return { error: error.message || "Failed to submit evidence." };
  }
}

/**
 * Approve a challenge participation.
 */
export async function approveChallengeParticipationAction(participationId: string) {
  try {
    await checkRole(["admin", "esg_manager", "dept_head"]);
  } catch (err: any) {
    return { error: err.message || "Unauthorized" };
  }

  try {
    const [participation] = await db
      .select()
      .from(challengeParticipations)
      .where(eq(challengeParticipations.id, participationId))
      .limit(1);

    if (!participation) {
      return { error: "Participation record not found." };
    }

    if (participation.approvalStatus === "approved") {
      return { error: "Already approved." };
    }

    const [challenge] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, participation.challengeId))
      .limit(1);

    if (!challenge) {
      return { error: "Challenge not found." };
    }

    // Perform approval in a transaction
    await db.transaction(async (tx) => {
      await tx
        .update(challengeParticipations)
        .set({
          approvalStatus: "approved",
          xpAwarded: challenge.xp,
        })
        .where(eq(challengeParticipations.id, participationId));
    });

    // Award XP (idempotency handled by using participation ID as referenceId)
    await awardXp(
      participation.employeeId,
      challenge.xp,
      "challenge_completion",
      participationId
    );

    revalidatePath("/gamification/challenges");
    return { success: true };
  } catch (error: any) {
    console.error("Error approving challenge:", error);
    return { error: error.message || "Failed to approve challenge." };
  }
}

/**
 * Fetch participations details.
 */
export async function getChallengeParticipations() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) return [];

  // If user is manager/admin, return all pending. Otherwise, return user's own.
  const isManager = ["admin", "esg_manager", "dept_head"].includes(
    (sessionUser as any).role || ""
  );

  if (isManager) {
    return db
      .select({
        id: challengeParticipations.id,
        employeeName: users.name,
        challengeTitle: challenges.title,
        challengeXp: challenges.xp,
        proofUrl: challengeParticipations.proofUrl,
        approvalStatus: challengeParticipations.approvalStatus,
        createdAt: challengeParticipations.createdAt,
      })
      .from(challengeParticipations)
      .innerJoin(challenges, eq(challengeParticipations.challengeId, challenges.id))
      .innerJoin(users, eq(challengeParticipations.employeeId, users.id))
      .orderBy(desc(challengeParticipations.createdAt));
  } else {
    return db
      .select({
        id: challengeParticipations.id,
        challengeTitle: challenges.title,
        challengeXp: challenges.xp,
        proofUrl: challengeParticipations.proofUrl,
        approvalStatus: challengeParticipations.approvalStatus,
        createdAt: challengeParticipations.createdAt,
      })
      .from(challengeParticipations)
      .innerJoin(challenges, eq(challengeParticipations.challengeId, challenges.id))
      .where(eq(challengeParticipations.employeeId, sessionUser.id))
      .orderBy(desc(challengeParticipations.createdAt));
  }
}

/**
 * Fetch own unlocked badges.
 */
export async function getOwnUnlockedBadges() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) return [];

  return db
    .select({
      id: badges.id,
      name: badges.name,
      description: badges.description,
      icon: badges.icon,
      unlockedAt: userBadges.unlockedAt,
    })
    .from(userBadges)
    .innerJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, sessionUser.id))
    .orderBy(desc(userBadges.unlockedAt));
}

/**
 * Reject a challenge participation.
 */
export async function rejectChallengeParticipationAction(participationId: string) {
  try {
    await checkRole(["admin", "esg_manager", "dept_head"]);
  } catch (err: any) {
    return { error: err.message || "Unauthorized" };
  }

  try {
    await db
      .update(challengeParticipations)
      .set({
        approvalStatus: "rejected",
      })
      .where(eq(challengeParticipations.id, participationId));

    revalidatePath("/gamification/challenges");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error rejecting challenge:", error);
    return { error: error.message || "Failed to reject challenge." };
  }
}

/**
 * Fetch own gamification profile details.
 */
export async function getOwnGamificationProfile() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) return null;

  const [dbUser] = await db
    .select({
      xp: users.xp,
      points: users.points,
    })
    .from(users)
    .where(eq(users.id, sessionUser.id))
    .limit(1);

  if (!dbUser) return null;

  const level = Math.floor(dbUser.xp / 100) + 1;
  const progressInLevel = dbUser.xp % 100;

  return {
    xp: dbUser.xp,
    points: dbUser.points,
    level,
    progressInLevel,
  };
}
