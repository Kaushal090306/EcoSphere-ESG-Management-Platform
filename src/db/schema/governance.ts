import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { departments } from "./departments";
import { users } from "./users";
import { policies } from "./policies";

export const auditStatusEnum = pgEnum("audit_status", [
  "scheduled",
  "in_progress",
  "completed",
  "under_review",
]);

export const issueSeverityEnum = pgEnum("issue_severity", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const issueStatusEnum = pgEnum("issue_status", [
  "open",
  "in_progress",
  "resolved",
  "closed",
]);

export const policyAcknowledgements = pgTable(
  "policy_acknowledgements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    employeeId: uuid("employee_id").notNull(),
    policyId: uuid("policy_id").notNull(),
    acknowledgedAt: timestamp("acknowledged_at").defaultNow().notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
  },
  (table) => ({
    employeeIdIdx: index("policy_ack_employee_id_idx").on(table.employeeId),
    policyIdIdx: index("policy_ack_policy_id_idx").on(table.policyId),
    uniqueAck: unique("unique_employee_policy_ack").on(
      table.employeeId,
      table.policyId
    ),
  })
);

export const audits = pgTable(
  "audits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    departmentId: uuid("department_id").notNull(),
    auditorId: uuid("auditor_id").notNull(),
    scheduledDate: timestamp("scheduled_date").notNull(),
    status: auditStatusEnum("status").notNull().default("scheduled"),
    findingsSummary: text("findings_summary"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    departmentIdIdx: index("audit_department_id_idx").on(table.departmentId),
    auditorIdIdx: index("audit_auditor_id_idx").on(table.auditorId),
  })
);

export const complianceIssues = pgTable(
  "compliance_issues",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    auditId: uuid("audit_id").notNull(),
    severity: issueSeverityEnum("severity").notNull(),
    description: text("description").notNull(),
    ownerId: uuid("owner_id").notNull(),
    dueDate: timestamp("due_date").notNull(),
    status: issueStatusEnum("status").notNull().default("open"),
    overdueFlag: boolean("overdue_flag").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    auditIdIdx: index("issue_audit_id_idx").on(table.auditId),
    ownerIdIdx: index("issue_owner_id_idx").on(table.ownerId),
    dueDateIdx: index("issue_due_date_idx").on(table.dueDate),
  })
);

export const policyAcknowledgementsRelations = relations(
  policyAcknowledgements,
  ({ one }) => ({
    employee: one(users, {
      fields: [policyAcknowledgements.employeeId],
      references: [users.id],
    }),
    policy: one(policies, {
      fields: [policyAcknowledgements.policyId],
      references: [policies.id],
    }),
  })
);

export const auditsRelations = relations(audits, ({ one, many }) => ({
  department: one(departments, {
    fields: [audits.departmentId],
    references: [departments.id],
  }),
  auditor: one(users, {
    fields: [audits.auditorId],
    references: [users.id],
  }),
  issues: many(complianceIssues),
}));

export const complianceIssuesRelations = relations(
  complianceIssues,
  ({ one }) => ({
    audit: one(audits, {
      fields: [complianceIssues.auditId],
      references: [audits.id],
    }),
    owner: one(users, {
      fields: [complianceIssues.ownerId],
      references: [users.id],
    }),
  })
);

export type PolicyAcknowledgement = typeof policyAcknowledgements.$inferSelect;
export type NewPolicyAcknowledgement = typeof policyAcknowledgements.$inferInsert;
export type Audit = typeof audits.$inferSelect;
export type NewAudit = typeof audits.$inferInsert;
export type ComplianceIssue = typeof complianceIssues.$inferSelect;
export type NewComplianceIssue = typeof complianceIssues.$inferInsert;
