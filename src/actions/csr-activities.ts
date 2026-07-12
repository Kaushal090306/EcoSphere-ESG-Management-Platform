"use server";

import { db } from "@/db";
import { csrActivities, employeeParticipations } from "@/db/schema";
import { desc, and, eq } from "drizzle-orm";
import { checkRole, getSessionUser } from "@/lib/auth-utils";
import { awardXp } from "./gamification";
import { revalidatePath } from "next/cache";

export async function getCsrActivities() {
  return db.select().from(csrActivities).orderBy(desc(csrActivities.createdAt));
}

export async function getEmployeeParticipations() {
  return db.select().from(employeeParticipations).orderBy(desc(employeeParticipations.createdAt));
}

/**
 * Join a CSR activity.
 */
export async function joinCsrAction(activityId: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) {
    return { error: "Please sign in to join CSR activities." };
  }

  try {
    const [existing] = await db
      .select()
      .from(employeeParticipations)
      .where(
        and(
          eq(employeeParticipations.activityId, activityId),
          eq(employeeParticipations.employeeId, sessionUser.id)
        )
      )
      .limit(1);

    if (existing) {
      return { error: "You are already registered for this activity." };
    }

    await db.insert(employeeParticipations).values({
      activityId,
      employeeId: sessionUser.id,
      approvalStatus: "pending",
      pointsEarned: 0,
    });

    revalidatePath("/social");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error joining CSR activity:", error);
    return { error: error.message || "Failed to join activity." };
  }
}

/**
 * Submit evidence for a CSR activity.
 */
export async function submitCsrEvidenceAction(activityId: string, proofUrl: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) {
    return { error: "Please sign in to submit evidence." };
  }

  try {
    const [existing] = await db
      .select()
      .from(employeeParticipations)
      .where(
        and(
          eq(employeeParticipations.activityId, activityId),
          eq(employeeParticipations.employeeId, sessionUser.id)
        )
      )
      .limit(1);

    if (!existing) {
      // Auto-join and submit evidence
      await db.insert(employeeParticipations).values({
        activityId,
        employeeId: sessionUser.id,
        proofUrl,
        approvalStatus: "pending",
        pointsEarned: 0,
      });
    } else {
      await db
        .update(employeeParticipations)
        .set({
          proofUrl,
          approvalStatus: "pending",
        })
        .where(eq(employeeParticipations.id, existing.id));
    }

    revalidatePath("/social");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error submitting CSR evidence:", error);
    return { error: error.message || "Failed to submit evidence." };
  }
}

/**
 * Approve a CSR participation and award XP/points.
 */
export async function approveCsrParticipationAction(participationId: string) {
  try {
    await checkRole(["admin", "esg_manager", "dept_head"]);
  } catch (err: any) {
    return { error: err.message || "Unauthorized" };
  }

  try {
    const [participation] = await db
      .select()
      .from(employeeParticipations)
      .where(eq(employeeParticipations.id, participationId))
      .limit(1);

    if (!participation) {
      return { error: "Participation record not found." };
    }

    if (participation.approvalStatus === "approved") {
      return { error: "Already approved." };
    }

    // CSR activities award 50 XP/points by default
    const xpReward = 50;

    await db.transaction(async (tx) => {
      await tx
        .update(employeeParticipations)
        .set({
          approvalStatus: "approved",
          pointsEarned: xpReward,
          completionDate: new Date(),
        })
        .where(eq(employeeParticipations.id, participationId));
    });

    // Award XP
    await awardXp(
      participation.employeeId,
      xpReward,
      "csr_participation",
      participationId
    );

    revalidatePath("/social");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error approving CSR participation:", error);
    return { error: error.message || "Failed to approve." };
  }
}

/**
 * Reject a CSR participation.
 */
export async function rejectCsrParticipationAction(participationId: string) {
  try {
    await checkRole(["admin", "esg_manager", "dept_head"]);
  } catch (err: any) {
    return { error: err.message || "Unauthorized" };
  }

  try {
    await db
      .update(employeeParticipations)
      .set({
        approvalStatus: "rejected",
      })
      .where(eq(employeeParticipations.id, participationId));

    revalidatePath("/social");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error rejecting CSR participation:", error);
    return { error: error.message || "Failed to reject." };
  }
}
