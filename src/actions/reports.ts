"use server";

import { db } from "@/db";
import {
  departments,
  users,
  challenges,
  categories,
  carbonTransactions,
  csrActivities,
  employeeParticipations,
  trainingRecords,
  diversityMetrics,
  policyAcknowledgements,
  policies,
  audits,
  complianceIssues,
  emissionFactors,
  departmentScores
} from "@/db/schema";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { requireAuth } from "@/lib/rbac";

export interface ReportFilters {
  departmentId?: string;
  startDate?: string;
  endDate?: string;
  moduleId?: string; // 'environmental' | 'social' | 'governance' | 'all'
  employeeId?: string;
  challengeId?: string;
  categoryId?: string;
}

/**
 * Fetches all available filter option lists based on user role scoping.
 */
export async function getReportFilterOptions() {
  const sessionUser = await requireAuth();
  
  let allowedDepts = await db.select().from(departments).orderBy(departments.name);
  let allowedUsers = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    departmentId: users.departmentId,
    role: users.role
  }).from(users).orderBy(users.name);

  // Apply Role Scoping for filters
  if (sessionUser.role === "dept_head") {
    allowedDepts = allowedDepts.filter(d => d.id === sessionUser.departmentId);
    allowedUsers = allowedUsers.filter(u => u.departmentId === sessionUser.departmentId);
  } else if (sessionUser.role === "employee") {
    allowedDepts = allowedDepts.filter(d => d.id === sessionUser.departmentId);
    allowedUsers = allowedUsers.filter(u => u.id === sessionUser.id);
  }

  const allChallenges = await db.select().from(challenges).orderBy(challenges.title);
  const allCategories = await db.select().from(categories).orderBy(categories.name);

  return {
    departments: allowedDepts,
    employees: allowedUsers,
    challenges: allChallenges,
    categories: allCategories
  };
}

/**
 * Fetches filtered report data for the given report type and filters.
 */
export async function getReportData(reportType: string, filters: ReportFilters) {
  const sessionUser = await requireAuth();

  // Enforce Role-Based Scoping
  let finalFilters = { ...filters };
  if (sessionUser.role === "dept_head") {
    finalFilters.departmentId = sessionUser.departmentId;
  } else if (sessionUser.role === "employee") {
    finalFilters.departmentId = sessionUser.departmentId;
    finalFilters.employeeId = sessionUser.id;
  }

  // 1. Environmental Data Query
  const getEnvironmentalData = async () => {
    const conditions = [];
    if (finalFilters.departmentId) {
      conditions.push(eq(carbonTransactions.departmentId, finalFilters.departmentId));
    }
    if (finalFilters.startDate) {
      conditions.push(gte(carbonTransactions.date, new Date(finalFilters.startDate)));
    }
    if (finalFilters.endDate) {
      conditions.push(lte(carbonTransactions.date, new Date(finalFilters.endDate)));
    }
    // Filter carbon transactions using categoryId mapping
    // Note: emission factors have Category
    const query = db
      .select({
        id: carbonTransactions.id,
        date: carbonTransactions.date,
        quantity: carbonTransactions.quantity,
        co2eValue: carbonTransactions.co2eValue,
        sourceType: carbonTransactions.sourceType,
        departmentName: departments.name,
        factorName: emissionFactors.name,
        scope: emissionFactors.scope,
      })
      .from(carbonTransactions)
      .leftJoin(departments, eq(carbonTransactions.departmentId, departments.id))
      .leftJoin(emissionFactors, eq(carbonTransactions.emissionFactorId, emissionFactors.id));

    let results = await (conditions.length > 0 ? query.where(and(...conditions)) : query);

    if (finalFilters.categoryId) {
      // Find matching category name
      const [cat] = await db.select().from(categories).where(eq(categories.id, finalFilters.categoryId)).limit(1);
      if (cat) {
        results = results.filter(r => r.factorName?.toLowerCase().includes(cat.name.toLowerCase()));
      }
    }

    return results;
  };

  // 2. Social Data Query
  const getSocialData = async () => {
    // CSR Participations
    const csrConditions = [];
    if (finalFilters.employeeId) {
      csrConditions.push(eq(employeeParticipations.employeeId, finalFilters.employeeId));
    }
    if (finalFilters.departmentId) {
      csrConditions.push(eq(csrActivities.departmentId, finalFilters.departmentId));
    }
    if (finalFilters.categoryId) {
      csrConditions.push(eq(csrActivities.categoryId, finalFilters.categoryId));
    }
    if (finalFilters.startDate) {
      csrConditions.push(gte(employeeParticipations.createdAt, new Date(finalFilters.startDate)));
    }
    if (finalFilters.endDate) {
      csrConditions.push(lte(employeeParticipations.createdAt, new Date(finalFilters.endDate)));
    }

    const csrQuery = db
      .select({
        id: employeeParticipations.id,
        employeeName: users.name,
        activityTitle: csrActivities.title,
        status: employeeParticipations.approvalStatus,
        pointsEarned: employeeParticipations.pointsEarned,
        date: employeeParticipations.createdAt,
        type: sql<string>`'CSR Activity'`
      })
      .from(employeeParticipations)
      .leftJoin(users, eq(employeeParticipations.employeeId, users.id))
      .leftJoin(csrActivities, eq(employeeParticipations.activityId, csrActivities.id));

    const csrResults = await (csrConditions.length > 0 ? csrQuery.where(and(...csrConditions)) : csrQuery);

    // Training Records
    const trainingConditions = [];
    if (finalFilters.employeeId) {
      trainingConditions.push(eq(trainingRecords.employeeId, finalFilters.employeeId));
    }
    if (finalFilters.departmentId) {
      trainingConditions.push(eq(users.departmentId, finalFilters.departmentId));
    }
    if (finalFilters.startDate) {
      trainingConditions.push(gte(trainingRecords.createdAt, new Date(finalFilters.startDate)));
    }
    if (finalFilters.endDate) {
      trainingConditions.push(lte(trainingRecords.createdAt, new Date(finalFilters.endDate)));
    }

    const trainingQuery = db
      .select({
        id: trainingRecords.id,
        employeeName: users.name,
        courseName: trainingRecords.courseName,
        status: trainingRecords.status,
        date: trainingRecords.createdAt,
      })
      .from(trainingRecords)
      .leftJoin(users, eq(trainingRecords.employeeId, users.id));

    const trainingResults = await (trainingConditions.length > 0 ? trainingQuery.where(and(...trainingConditions)) : trainingQuery);

    // Diversity metrics
    const divConditions = [];
    if (finalFilters.departmentId) {
      divConditions.push(eq(diversityMetrics.departmentId, finalFilters.departmentId));
    }
    const diversityResults = await db.select().from(diversityMetrics).where(and(...divConditions));

    return {
      csr: csrResults,
      training: trainingResults,
      diversity: diversityResults
    };
  };

  // 3. Governance Data Query
  const getGovernanceData = async () => {
    // Policy acknowledgements
    const ackConditions = [];
    if (finalFilters.employeeId) {
      ackConditions.push(eq(policyAcknowledgements.employeeId, finalFilters.employeeId));
    }
    if (finalFilters.departmentId) {
      ackConditions.push(eq(users.departmentId, finalFilters.departmentId));
    }
    if (finalFilters.categoryId) {
      ackConditions.push(eq(policies.category, sql<string>`(SELECT name FROM categories WHERE id = ${finalFilters.categoryId} LIMIT 1)`));
    }
    if (finalFilters.startDate) {
      ackConditions.push(gte(policyAcknowledgements.acknowledgedAt, new Date(finalFilters.startDate)));
    }
    if (finalFilters.endDate) {
      ackConditions.push(lte(policyAcknowledgements.acknowledgedAt, new Date(finalFilters.endDate)));
    }

    const ackQuery = db
      .select({
        id: policyAcknowledgements.id,
        employeeName: users.name,
        policyTitle: policies.title,
        version: policies.version,
        date: policyAcknowledgements.acknowledgedAt,
      })
      .from(policyAcknowledgements)
      .leftJoin(users, eq(policyAcknowledgements.employeeId, users.id))
      .leftJoin(policies, eq(policyAcknowledgements.policyId, policies.id));

    const ackResults = await (ackConditions.length > 0 ? ackQuery.where(and(...ackConditions)) : ackQuery);

    // Compliance issues
    const issueConditions = [];
    if (finalFilters.employeeId) {
      issueConditions.push(eq(complianceIssues.ownerId, finalFilters.employeeId));
    }
    if (finalFilters.departmentId) {
      issueConditions.push(eq(audits.departmentId, finalFilters.departmentId));
    }
    if (finalFilters.startDate) {
      issueConditions.push(gte(complianceIssues.createdAt, new Date(finalFilters.startDate)));
    }
    if (finalFilters.endDate) {
      issueConditions.push(lte(complianceIssues.createdAt, new Date(finalFilters.endDate)));
    }

    const issueQuery = db
      .select({
        id: complianceIssues.id,
        severity: complianceIssues.severity,
        status: complianceIssues.status,
        description: complianceIssues.description,
        dueDate: complianceIssues.dueDate,
        ownerName: users.name,
        auditTitle: audits.title,
      })
      .from(complianceIssues)
      .leftJoin(users, eq(complianceIssues.ownerId, users.id))
      .leftJoin(audits, eq(complianceIssues.auditId, audits.id));

    const issueResults = await (issueConditions.length > 0 ? issueQuery.where(and(...issueConditions)) : issueQuery);

    // Audits
    const auditConditions = [];
    if (finalFilters.departmentId) {
      auditConditions.push(eq(audits.departmentId, finalFilters.departmentId));
    }
    if (finalFilters.startDate) {
      auditConditions.push(gte(audits.scheduledDate, new Date(finalFilters.startDate)));
    }
    if (finalFilters.endDate) {
      auditConditions.push(lte(audits.scheduledDate, new Date(finalFilters.endDate)));
    }

    const auditQuery = db
      .select({
        id: audits.id,
        title: audits.title,
        scheduledDate: audits.scheduledDate,
        status: audits.status,
        departmentName: departments.name,
      })
      .from(audits)
      .leftJoin(departments, eq(audits.departmentId, departments.id));

    const auditResults = await (auditConditions.length > 0 ? auditQuery.where(and(...auditConditions)) : auditQuery);

    return {
      policyAcks: ackResults,
      complianceIssues: issueResults,
      audits: auditResults
    };
  };

  // 4. ESG Summary Report Query
  const getEsgSummaryData = async () => {
    const env = await getEnvironmentalData();
    const soc = await getSocialData();
    const gov = await getGovernanceData();

    // Calculations
    const totalEmissions = env.reduce((acc, curr) => acc + parseFloat(curr.co2eValue || "0"), 0);
    const totalCsr = soc.csr.filter(c => c.status === "approved").length;
    const completedTrainings = soc.training.filter(t => t.status === "completed").length;
    const trainingRate = soc.training.length > 0 ? Math.round((completedTrainings / soc.training.length) * 100) : 0;
    
    // Policy ack rate
    const totalPolicies = await db.select().from(policies).where(eq(policies.status, "published"));
    const totalPossibleAcks = totalPolicies.length * (finalFilters.employeeId ? 1 : (soc.training.length || 10)); // estimate base users count
    const ackRate = totalPossibleAcks > 0 ? Math.round((gov.policyAcks.length / totalPossibleAcks) * 100) : 0;

    const openCompliance = gov.complianceIssues.filter(i => i.status === "open" || i.status === "in_progress").length;

    const scoreConditions = [];
    if (finalFilters.departmentId) {
      scoreConditions.push(eq(departmentScores.departmentId, finalFilters.departmentId));
    }
    const scores = await (scoreConditions.length > 0
      ? db.select().from(departmentScores).where(and(...scoreConditions))
      : db.select().from(departmentScores));
    const avgE = scores.reduce((acc, curr) => acc + parseFloat(curr.environmentalScore || "0"), 0) / (scores.length || 1);
    const avgS = scores.reduce((acc, curr) => acc + parseFloat(curr.socialScore || "0"), 0) / (scores.length || 1);
    const avgG = scores.reduce((acc, curr) => acc + parseFloat(curr.governanceScore || "0"), 0) / (scores.length || 1);
    const avgTotal = scores.reduce((acc, curr) => acc + parseFloat(curr.totalScore || "0"), 0) / (scores.length || 1);

    return {
      environmental: {
        totalEmissions: totalEmissions.toFixed(2),
        carbonTxCount: env.length,
        score: avgE ? avgE.toFixed(1) : "75.0"
      },
      social: {
        csrParticipationCount: totalCsr,
        trainingCompletionRate: trainingRate,
        score: avgS ? avgS.toFixed(1) : "80.0"
      },
      governance: {
        policyAcknowledgementRate: ackRate > 100 ? 100 : ackRate,
        openComplianceIssues: openCompliance,
        score: avgG ? avgG.toFixed(1) : "85.0"
      },
      overallScore: avgTotal ? avgTotal.toFixed(1) : "80.0"
    };
  };

  // Switch by Report Type
  switch (reportType) {
    case "environmental":
      return { environmental: await getEnvironmentalData() };
    case "social":
      return { social: await getSocialData() };
    case "governance":
      return { governance: await getGovernanceData() };
    case "esg-summary":
      return { esgSummary: await getEsgSummaryData() };
    case "custom":
    default:
      // Return combined data sets matching the filters
      const customEnv = finalFilters.moduleId === "social" || finalFilters.moduleId === "governance" ? [] : await getEnvironmentalData();
      const customSoc = finalFilters.moduleId === "environmental" || finalFilters.moduleId === "governance" ? { csr: [], training: [], diversity: [] } : await getSocialData();
      const customGov = finalFilters.moduleId === "environmental" || finalFilters.moduleId === "social" ? { policyAcks: [], complianceIssues: [], audits: [] } : await getGovernanceData();

      return {
        custom: {
          emissions: customEnv,
          csr: customSoc.csr,
          training: customSoc.training,
          policyAcks: customGov.policyAcks,
          complianceIssues: customGov.complianceIssues,
          audits: customGov.audits
        }
      };
  }
}
