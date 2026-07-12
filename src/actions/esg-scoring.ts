"use server";

import { db } from "@/db";
import { departments, departmentScores, esgSettings } from "@/db/schema";
import { desc } from "drizzle-orm";

export interface DeptScoreRow {
  id: string;
  name: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  totalScore: number;
  period: string;
}

export interface EsgScoringData {
  weights: {
    environmental: number; // 0-100
    social: number;
    governance: number;
  };
  scores: {
    overall: number;
    environment: number;
    social: number;
    governance: number;
  };
  departments: DeptScoreRow[];
  trend: { month: string; overall: number; environment: number; social: number; governance: number }[];
  auditLog: { id: string; timestamp: string; trigger: string; oldScore: number; newScore: number; delta: number }[];
}

export async function getEsgScoringData(): Promise<EsgScoringData> {
  // Fetch settings
  const settingsRows = await db.select().from(esgSettings).limit(1);
  const settings = settingsRows[0];
  const envW = settings ? Math.round(Number(settings.environmentalWeight) * 100) : 40;
  const socW = settings ? Math.round(Number(settings.socialWeight) * 100) : 30;
  const govW = settings ? Math.round(Number(settings.governanceWeight) * 100) : 30;

  // Fetch latest department scores (Q2 2026)
  const allDepts = await db.select().from(departments);
  const deptMap = new Map(allDepts.map((d) => [d.id, d.name]));

  const latestScores = await db
    .select()
    .from(departmentScores)
    .orderBy(desc(departmentScores.createdAt))
    .limit(20);

  // Group by department, take latest
  const deptScoreMap = new Map<string, typeof latestScores[0]>();
  for (const s of latestScores) {
    if (!deptScoreMap.has(s.departmentId)) deptScoreMap.set(s.departmentId, s);
  }

  const deptRows: DeptScoreRow[] = [];
  for (const [deptId, s] of deptScoreMap) {
    deptRows.push({
      id: s.id,
      name: deptMap.get(deptId) || "Unknown",
      environmentalScore: Number(s.environmentalScore) || 0,
      socialScore: Number(s.socialScore) || 0,
      governanceScore: Number(s.governanceScore) || 0,
      totalScore: Number(s.totalScore) || 0,
      period: s.period,
    });
  }

  // Fallback mock data if DB empty
  if (deptRows.length === 0) {
    deptRows.push(
      { id: "1", name: "Engineering", environmentalScore: 78, socialScore: 84, governanceScore: 91, totalScore: 83.5, period: "2026-Q2" },
      { id: "2", name: "Operations", environmentalScore: 62, socialScore: 70, governanceScore: 68, totalScore: 66.2, period: "2026-Q2" },
      { id: "3", name: "HR", environmentalScore: 85, socialScore: 92, governanceScore: 88, totalScore: 88.0, period: "2026-Q2" },
      { id: "4", name: "Finance", environmentalScore: 71, socialScore: 75, governanceScore: 80, totalScore: 74.8, period: "2026-Q2" },
    );
  }

  // Aggregate company-wide scores
  const avgEnv = deptRows.reduce((s, r) => s + r.environmentalScore, 0) / deptRows.length;
  const avgSoc = deptRows.reduce((s, r) => s + r.socialScore, 0) / deptRows.length;
  const avgGov = deptRows.reduce((s, r) => s + r.governanceScore, 0) / deptRows.length;
  const overall = (avgEnv * envW + avgSoc * socW + avgGov * govW) / 100;

  // Mock trend (6 months)
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const trend = months.map((month, i) => {
    const factor = 0.78 + i * 0.044;
    return {
      month,
      overall: Math.round(overall * factor * 10) / 10,
      environment: Math.round(avgEnv * factor * 10) / 10,
      social: Math.round(avgSoc * factor * 10) / 10,
      governance: Math.round(avgGov * factor * 10) / 10,
    };
  });

  // Mock audit log
  const auditLog = [
    { id: "al1", timestamp: "2026-10-12 14:32", trigger: "Manual Recalculation", oldScore: 76.4, newScore: 78.6, delta: 2.2 },
    { id: "al2", timestamp: "2026-10-10 09:15", trigger: "New Carbon Transaction", oldScore: 74.1, newScore: 76.4, delta: 2.3 },
    { id: "al3", timestamp: "2026-10-08 16:44", trigger: "Policy Acknowledged", oldScore: 73.0, newScore: 74.1, delta: 1.1 },
    { id: "al4", timestamp: "2026-10-05 11:20", trigger: "Weight Configuration Updated", oldScore: 71.5, newScore: 73.0, delta: 1.5 },
    { id: "al5", timestamp: "2026-10-01 08:00", trigger: "Quarterly Recalculation", oldScore: 69.2, newScore: 71.5, delta: 2.3 },
  ];

  return {
    weights: { environmental: envW, social: socW, governance: govW },
    scores: {
      overall: Math.round(overall * 10) / 10,
      environment: Math.round(avgEnv * 10) / 10,
      social: Math.round(avgSoc * 10) / 10,
      governance: Math.round(avgGov * 10) / 10,
    },
    departments: deptRows.sort((a, b) => b.totalScore - a.totalScore),
    trend,
    auditLog,
  };
}
