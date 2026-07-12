"use server";

import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function getUserNotifications() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) {
    throw new Error("Unauthorized");
  }

  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, sessionUser.id))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(id: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, sessionUser.id)));

    revalidatePath("/notifications");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to mark notification as read." };
  }
}

export async function markAllNotificationsAsRead() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.userId, sessionUser.id), eq(notifications.read, false)));

    revalidatePath("/notifications");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to mark all notifications as read." };
  }
}

export async function getUnreadNotificationsCount() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) {
    return 0;
  }

  const results = await db
    .select()
    .from(notifications)
    .where(and(eq(notifications.userId, sessionUser.id), eq(notifications.read, false)));

  return results.length;
}
