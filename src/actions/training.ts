"use server";

import { db } from "@/db";
import { trainingRecords } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function getTrainingRecords() {
  return db.select().from(trainingRecords).orderBy(desc(trainingRecords.createdAt));
}

export async function createTrainingRecord(data: {
  employeeId: string;
  courseName: string;
  status: "not_started" | "in_progress" | "completed";
}) {
  await requireRole(["admin", "esg_manager", "dept_head"]);
  await db.insert(trainingRecords).values({
    ...data,
    completedAt: data.status === "completed" ? new Date() : null,
  });
  revalidatePath("/social/training");
}

export async function updateTrainingRecord(id: string, data: Partial<{
  employeeId: string;
  courseName: string;
  status: "not_started" | "in_progress" | "completed";
}>) {
  await requireRole(["admin", "esg_manager", "dept_head"]);
  const updateData: any = { ...data };
  if (data.status === "completed") {
    updateData.completedAt = new Date();
  } else if (data.status) {
    updateData.completedAt = null;
  }

  await db.update(trainingRecords).set(updateData).where(eq(trainingRecords.id, id));
  revalidatePath("/social/training");
}

export async function deleteTrainingRecord(id: string) {
  await requireRole(["admin", "esg_manager"]);
  await db.delete(trainingRecords).where(eq(trainingRecords.id, id));
  revalidatePath("/social/training");
}
