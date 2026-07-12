"use server";

import { db } from "@/db";
import { diversityMetrics } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function getDiversityMetrics() {
  return db.select().from(diversityMetrics).orderBy(desc(diversityMetrics.createdAt));
}

export async function createDiversityMetric(data: {
  departmentId: string;
  period: string;
  genderBreakdown: any;
  ageBandBreakdown: any;
  ethnicityBreakdown: any;
  disabilityCount: number;
}) {
  await requireRole(["admin", "esg_manager"]);
  await db.insert(diversityMetrics).values(data);
  revalidatePath("/social/diversity");
}

export async function updateDiversityMetric(id: string, data: Partial<{
  departmentId: string;
  period: string;
  genderBreakdown: any;
  ageBandBreakdown: any;
  ethnicityBreakdown: any;
  disabilityCount: number;
}>) {
  await requireRole(["admin", "esg_manager"]);
  await db.update(diversityMetrics).set(data).where(eq(diversityMetrics.id, id));
  revalidatePath("/social/diversity");
}

export async function deleteDiversityMetric(id: string) {
  await requireRole(["admin", "esg_manager"]);
  await db.delete(diversityMetrics).where(eq(diversityMetrics.id, id));
  revalidatePath("/social/diversity");
}
