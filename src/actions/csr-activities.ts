"use server";

import { db } from "@/db";
import { csrActivities, employeeParticipations } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getCsrActivities() {
  return db.select().from(csrActivities).orderBy(desc(csrActivities.createdAt));
}

export async function getEmployeeParticipations() {
  return db.select().from(employeeParticipations).orderBy(desc(employeeParticipations.createdAt));
}
