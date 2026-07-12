import {
  pgTable,
  uuid,
  varchar,
  decimal,
  date,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { departments } from "./departments";

export const goalStatusEnum = pgEnum("goal_status", [
  "active",
  "achieved",
  "missed",
  "cancelled",
]);

export const environmentalGoals = pgTable("environmental_goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  departmentId: uuid("department_id")
    .notNull()
    .references(() => departments.id),
  metric: varchar("metric", { length: 100 }).notNull(),
  baselineValue: decimal("baseline_value", {
    precision: 12,
    scale: 2,
  }).notNull(),
  targetValue: decimal("target_value", {
    precision: 12,
    scale: 2,
  }).notNull(),
  currentValue: decimal("current_value", {
    precision: 12,
    scale: 2,
  })
    .notNull()
    .default("0"),
  deadline: date("deadline").notNull(),
  status: goalStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type EnvironmentalGoal = typeof environmentalGoals.$inferSelect;
export type NewEnvironmentalGoal = typeof environmentalGoals.$inferInsert;
