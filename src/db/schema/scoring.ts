import {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { departments } from "./departments";

export const departmentScores = pgTable(
  "department_scores",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    departmentId: uuid("department_id").notNull(),
    environmentalScore: numeric("environmental_score"),
    socialScore: numeric("social_score"),
    governanceScore: numeric("governance_score"),
    totalScore: numeric("total_score"),
    period: varchar("period", { length: 50 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    departmentIdIdx: index("score_department_id_idx").on(table.departmentId),
    uniqueDeptPeriod: unique("unique_department_period_score").on(
      table.departmentId,
      table.period
    ),
  })
);

export const departmentScoresRelations = relations(
  departmentScores,
  ({ one }) => ({
    department: one(departments, {
      fields: [departmentScores.departmentId],
      references: [departments.id],
    }),
  })
);

export type DepartmentScore = typeof departmentScores.$inferSelect;
export type NewDepartmentScore = typeof departmentScores.$inferInsert;
