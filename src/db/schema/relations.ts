import { relations } from "drizzle-orm";
import { users } from "./users";
import { departments } from "./departments";
import { categories } from "./categories";
import { emissionFactors } from "./emission-factors";
import { policies } from "./policies";
import { badges } from "./badges";
import { rewards } from "./rewards";

import { carbonTransactions } from "./environmental";
import {
  csrActivities,
  employeeParticipations,
  diversityMetrics,
  trainingRecords,
} from "./social";
import {
  policyAcknowledgements,
  audits,
  complianceIssues,
} from "./governance";
import {
  challenges,
  challengeParticipations,
  rewardRedemptions,
} from "./gamification";
import { departmentScores } from "./scoring";
import { notifications } from "./notifications";

export const usersRelations = relations(users, ({ one }) => ({
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
}));

export const departmentsRelations = relations(departments, ({ one }) => ({
  parentDepartment: one(departments, {
    fields: [departments.parentDepartmentId],
    references: [departments.id],
  }),
}));

export const carbonTransactionsRelations = relations(
  carbonTransactions,
  ({ one }) => ({
    department: one(departments, {
      fields: [carbonTransactions.departmentId],
      references: [departments.id],
    }),
    emissionFactor: one(emissionFactors, {
      fields: [carbonTransactions.emissionFactorId],
      references: [emissionFactors.id],
    }),
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

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  category: one(categories, {
    fields: [challenges.categoryId],
    references: [categories.id],
  }),
  participations: many(challengeParticipations),
}));

export const challengeParticipationsRelations = relations(
  challengeParticipations,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeParticipations.challengeId],
      references: [challenges.id],
    }),
    employee: one(users, {
      fields: [challengeParticipations.employeeId],
      references: [users.id],
    }),
  })
);

export const rewardRedemptionsRelations = relations(
  rewardRedemptions,
  ({ one }) => ({
    employee: one(users, {
      fields: [rewardRedemptions.employeeId],
      references: [users.id],
    }),
    reward: one(rewards, {
      fields: [rewardRedemptions.rewardId],
      references: [rewards.id],
    }),
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

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
