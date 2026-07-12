import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { users } from "./users";
import { rewards } from "./rewards";

export const challengeDifficultyEnum = pgEnum("challenge_difficulty", [
  "easy",
  "medium",
  "hard",
]);

export const challengeStatusEnum = pgEnum("challenge_status", [
  "draft",
  "active",
  "under_review",
  "completed",
  "archived",
]);

export const participationStatusEnum = pgEnum("participation_status", [
  "pending",
  "approved",
  "rejected",
]);

export const challenges = pgTable(
  "challenges",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    categoryId: uuid("category_id").notNull(),
    description: text("description"),
    xp: integer("xp").notNull().default(0),
    difficulty: challengeDifficultyEnum("difficulty").notNull().default("easy"),
    evidenceRequired: boolean("evidence_required").notNull().default(false),
    deadline: timestamp("deadline"),
    status: challengeStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    categoryIdIdx: index("challenge_category_id_idx").on(table.categoryId),
  })
);

export const challengeParticipations = pgTable(
  "challenge_participations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    challengeId: uuid("challenge_id").notNull(),
    employeeId: uuid("employee_id").notNull(),
    progressPct: integer("progress_pct").notNull().default(0),
    proofUrl: text("proof_url"),
    approvalStatus: participationStatusEnum("approval_status")
      .notNull()
      .default("pending"),
    xpAwarded: integer("xp_awarded").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    challengeIdIdx: index("chall_part_challenge_id_idx").on(table.challengeId),
    employeeIdIdx: index("chall_part_employee_id_idx").on(table.employeeId),
  })
);

export const rewardRedemptions = pgTable(
  "reward_redemptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    employeeId: uuid("employee_id").notNull(),
    rewardId: uuid("reward_id").notNull(),
    pointsSpent: integer("points_spent").notNull(),
    redeemedAt: timestamp("redeemed_at").defaultNow().notNull(),
  },
  (table) => ({
    employeeIdIdx: index("reward_redemp_employee_id_idx").on(table.employeeId),
    rewardIdIdx: index("reward_redemp_reward_id_idx").on(table.rewardId),
  })
);





export const userXpTransactions = pgTable(
  "user_xp",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    amount: integer("amount").notNull(),
    reason: varchar("reason", { length: 255 }).notNull(),
    referenceId: varchar("reference_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_xp_user_id_idx").on(table.userId),
    uniqueReference: unique("unique_user_xp_reference").on(
      table.userId,
      table.referenceId
    ),
  })
);

export type Challenge = typeof challenges.$inferSelect;
export type NewChallenge = typeof challenges.$inferInsert;
export type ChallengeParticipation = typeof challengeParticipations.$inferSelect;
export type NewChallengeParticipation = typeof challengeParticipations.$inferInsert;
export type RewardRedemption = typeof rewardRedemptions.$inferSelect;
export type NewRewardRedemption = typeof rewardRedemptions.$inferInsert;
export type UserXpTransaction = typeof userXpTransactions.$inferSelect;
export type NewUserXpTransaction = typeof userXpTransactions.$inferInsert;



