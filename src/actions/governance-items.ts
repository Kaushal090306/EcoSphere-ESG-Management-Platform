"use server";

import { db } from "@/db";
import { audits, complianceIssues } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getAudits() {
  return db.select().from(audits).orderBy(desc(audits.scheduledDate));
}

export async function getComplianceIssues() {
  return db.select().from(complianceIssues).orderBy(desc(complianceIssues.createdAt));
}
