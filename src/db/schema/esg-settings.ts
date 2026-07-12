import {
  pgTable,
  uuid,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const esgSettings = pgTable("esg_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  environmentalWeight: integer("environmental_weight").notNull().default(40),
  socialWeight: integer("social_weight").notNull().default(30),
  governanceWeight: integer("governance_weight").notNull().default(30),
  autoEmissionCalculation: boolean("auto_emission_calculation")
    .notNull()
    .default(true),
  evidenceRequired: boolean("evidence_required").notNull().default(true),
  badgeAutoAward: boolean("badge_auto_award").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type EsgSettings = typeof esgSettings.$inferSelect;
export type NewEsgSettings = typeof esgSettings.$inferInsert;
