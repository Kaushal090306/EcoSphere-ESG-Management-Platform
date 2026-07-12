import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { departments } from "./departments";
import { categories } from "./categories";
import { users } from "./users";

export const csrActivityStatusEnum = pgEnum("csr_activity_status", [
  "draft",
  "open",
  "closed",
]);

export const approvalStatusEnum = pgEnum("approval_status", [
  "pending",
  "approved",
  "rejected",
]);

export const trainingStatusEnum = pgEnum("training_status", [
  "not_started",
  "in_progress",
  "completed",
]);

export const csrActivities = pgTable(
  "csr_activities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    categoryId: uuid("category_id").notNull(),
    description: text("description"),
    departmentId: uuid("department_id"),
    date: timestamp("date"),
    location: varchar("location", { length: 255 }),
    maxParticipants: integer("max_participants"),
    status: csrActivityStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    categoryIdIdx: index("csr_category_id_idx").on(table.categoryId),
    departmentIdIdx: index("csr_department_id_idx").on(table.departmentId),
  })
);

export const employeeParticipations = pgTable(
  "employee_participations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    employeeId: uuid("employee_id").notNull(),
    activityId: uuid("activity_id").notNull(),
    proofUrl: text("proof_url"),
    approvalStatus: approvalStatusEnum("approval_status")
      .notNull()
      .default("pending"),
    pointsEarned: integer("points_earned").notNull().default(0),
    completionDate: timestamp("completion_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    employeeIdIdx: index("emp_part_employee_id_idx").on(table.employeeId),
    activityIdIdx: index("emp_part_activity_id_idx").on(table.activityId),
  })
);

export const diversityMetrics = pgTable(
  "diversity_metrics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    departmentId: uuid("department_id").notNull(),
    genderBreakdown: jsonb("gender_breakdown"),
    ageBandBreakdown: jsonb("age_band_breakdown"),
    ethnicityBreakdown: jsonb("ethnicity_breakdown"),
    disabilityCount: integer("disability_count").default(0),
    period: varchar("period", { length: 50 }).notNull(), // e.g. "2026-Q3"
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    departmentIdIdx: index("diversity_department_id_idx").on(
      table.departmentId
    ),
  })
);

export const trainingRecords = pgTable(
  "training_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    employeeId: uuid("employee_id").notNull(),
    courseName: varchar("course_name", { length: 255 }).notNull(),
    status: trainingStatusEnum("status").notNull().default("not_started"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    employeeIdIdx: index("training_employee_id_idx").on(table.employeeId),
  })
);

export const csrActivitiesRelations = relations(csrActivities, ({ one, many }) => ({
  category: one(categories, {
    fields: [csrActivities.categoryId],
    references: [categories.id],
  }),
  department: one(departments, {
    fields: [csrActivities.departmentId],
    references: [departments.id],
  }),
  participations: many(employeeParticipations),
}));

export const employeeParticipationsRelations = relations(
  employeeParticipations,
  ({ one }) => ({
    employee: one(users, {
      fields: [employeeParticipations.employeeId],
      references: [users.id],
    }),
    activity: one(csrActivities, {
      fields: [employeeParticipations.activityId],
      references: [csrActivities.id],
    }),
  })
);

export const diversityMetricsRelations = relations(
  diversityMetrics,
  ({ one }) => ({
    department: one(departments, {
      fields: [diversityMetrics.departmentId],
      references: [departments.id],
    }),
  })
);

export const trainingRecordsRelations = relations(
  trainingRecords,
  ({ one }) => ({
    employee: one(users, {
      fields: [trainingRecords.employeeId],
      references: [users.id],
    }),
  })
);

export type CsrActivity = typeof csrActivities.$inferSelect;
export type NewCsrActivity = typeof csrActivities.$inferInsert;
export type EmployeeParticipation = typeof employeeParticipations.$inferSelect;
export type NewEmployeeParticipation = typeof employeeParticipations.$inferInsert;
export type DiversityMetric = typeof diversityMetrics.$inferSelect;
export type NewDiversityMetric = typeof diversityMetrics.$inferInsert;
export type TrainingRecord = typeof trainingRecords.$inferSelect;
export type NewTrainingRecord = typeof trainingRecords.$inferInsert;
