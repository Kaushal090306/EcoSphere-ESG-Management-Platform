"use server";

import { db } from "@/db";
import { csrActivities, employeeParticipations, notifications, esgSettings } from "@/db/schema";
import { desc, eq, and, count } from "drizzle-orm";
import { requireAuth, requireRole, requireDeptHead } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function getCsrActivities() {
  return db.select().from(csrActivities).orderBy(desc(csrActivities.createdAt));
}

export async function getEmployeeParticipations() {
  return db.select().from(employeeParticipations).orderBy(desc(employeeParticipations.createdAt));
}

export async function createCsrActivity(data: {
  title: string;
  categoryId: string;
  description?: string;
  departmentId?: string;
  date?: string;
  location?: string;
  maxParticipants?: number;
  status: "draft" | "open" | "closed";
}) {
  await requireRole(["admin", "esg_manager", "dept_head"]);
  await db.insert(csrActivities).values({
    ...data,
    date: data.date ? new Date(data.date) : null,
  });
  revalidatePath("/social/csr-activities");
}

export async function updateCsrActivity(id: string, data: Partial<{
  title: string;
  categoryId: string;
  description?: string;
  departmentId?: string;
  date?: string;
  location?: string;
  maxParticipants?: number;
  status: "draft" | "open" | "closed";
}>) {
  await requireRole(["admin", "esg_manager", "dept_head"]);
  
  const updateData: any = { ...data };
  if (data.date !== undefined) {
    updateData.date = data.date ? new Date(data.date) : null;
  }
  updateData.updatedAt = new Date();

  await db.update(csrActivities).set(updateData).where(eq(csrActivities.id, id));
  revalidatePath("/social/csr-activities");
}

export async function deleteCsrActivity(id: string) {
  await requireRole(["admin", "esg_manager"]);
  await db.delete(csrActivities).where(eq(csrActivities.id, id));
  revalidatePath("/social/csr-activities");
}

export async function joinActivity(activityId: string, proofUrl?: string) {
  const user = await requireAuth();

  // Enforce max participants
  const [activity] = await db.select().from(csrActivities).where(eq(csrActivities.id, activityId)).limit(1);
  if (!activity) throw new Error("Activity not found");
  
  if (activity.maxParticipants) {
    const [participations] = await db.select({ count: count() }).from(employeeParticipations).where(eq(employeeParticipations.activityId, activityId));
    if (participations.count >= activity.maxParticipants) {
      throw new Error("Activity is full");
    }
  }

  // Check if already joined
  const existing = await db.select().from(employeeParticipations).where(and(eq(employeeParticipations.activityId, activityId), eq(employeeParticipations.employeeId, user.id as string))).limit(1);
  if (existing.length > 0) {
    throw new Error("You have already joined this activity");
  }

  await db.insert(employeeParticipations).values({
    employeeId: user.id as string,
    activityId,
    proofUrl: proofUrl || null,
    approvalStatus: "pending",
  });
  revalidatePath("/social/csr-activities");
  revalidatePath("/social/participation");
}

export async function approveParticipation(participationId: string, pointsToAward: number) {
  const [participation] = await db.select().from(employeeParticipations).where(eq(employeeParticipations.id, participationId)).limit(1);
  if (!participation) throw new Error("Participation not found");
  
  const [activity] = await db.select().from(csrActivities).where(eq(csrActivities.id, participation.activityId)).limit(1);
  
  // Enforce RBAC
  await requireDeptHead(activity?.departmentId || null);

  // Check evidence required
  const [settings] = await db.select().from(esgSettings).limit(1);
  if (settings?.evidenceRequired && !participation.proofUrl) {
    throw new Error("Evidence is required to approve this participation.");
  }

  await db.update(employeeParticipations).set({
    approvalStatus: "approved",
    pointsEarned: pointsToAward,
    completionDate: new Date(),
  }).where(eq(employeeParticipations.id, participationId));

  // Notify user
  await db.insert(notifications).values({
    userId: participation.employeeId,
    type: "csr_approval",
    message: `Your participation in "${activity?.title}" has been approved! You earned ${pointsToAward} XP.`,
  });

  revalidatePath("/social/participation");
}

export async function rejectParticipation(participationId: string) {
  const [participation] = await db.select().from(employeeParticipations).where(eq(employeeParticipations.id, participationId)).limit(1);
  if (!participation) throw new Error("Participation not found");
  
  const [activity] = await db.select().from(csrActivities).where(eq(csrActivities.id, participation.activityId)).limit(1);
  
  // Enforce RBAC
  await requireDeptHead(activity?.departmentId || null);

  await db.update(employeeParticipations).set({
    approvalStatus: "rejected",
    completionDate: new Date(),
  }).where(eq(employeeParticipations.id, participationId));

  // Notify user
  await db.insert(notifications).values({
    userId: participation.employeeId,
    type: "csr_approval",
    message: `Your participation in "${activity?.title}" has been rejected.`,
  });

  revalidatePath("/social/participation");
}
