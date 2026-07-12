import {
  pgTable,
  uuid,
  numeric,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const esgSettings = pgTable("esg_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  environmentalWeight: numeric("environmental_weight").notNull().default("0.4"),
  socialWeight: numeric("social_weight").notNull().default("0.3"),
  governanceWeight: numeric("governance_weight").notNull().default("0.3"),
  autoEmissionCalc: boolean("auto_emission_calc")
    .notNull()
    .default(false),
  evidenceRequired: boolean("evidence_required").notNull().default(false),
  badgeAutoAward: boolean("badge_auto_award").notNull().default(false),
  policyReminderDays: integer("policy_reminder_days").notNull().default(7),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type EsgSettings = typeof esgSettings.$inferSelect;
export type NewEsgSettings = typeof esgSettings.$inferInsert;
