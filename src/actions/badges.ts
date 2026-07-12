"use server";

import { db } from "@/db";
import { badges } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { badgeSchema, type BadgeFormData } from "@/lib/validations";

export async function getBadges() {
  return db.select().from(badges).orderBy(badges.name);
}

export async function createBadge(data: BadgeFormData) {
  const parsed = badgeSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    await db.insert(badges).values({
      name: parsed.data.name,
      description: parsed.data.description,
      unlockRule: {
        type: parsed.data.unlockRuleType,
        threshold: parsed.data.unlockRuleThreshold,
      },
      icon: parsed.data.icon,
      status: parsed.data.status,
    });
    revalidatePath("/gamification/badges");
    return { success: true };
  } catch {
    return { error: { _form: ["Failed to create badge"] } };
  }
}

export async function updateBadge(id: string, data: BadgeFormData) {
  const parsed = badgeSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    await db
      .update(badges)
      .set({
        name: parsed.data.name,
        description: parsed.data.description,
        unlockRule: {
          type: parsed.data.unlockRuleType,
          threshold: parsed.data.unlockRuleThreshold,
        },
        icon: parsed.data.icon,
        status: parsed.data.status,
        updatedAt: new Date(),
      })
      .where(eq(badges.id, id));
    revalidatePath("/gamification/badges");
    return { success: true };
  } catch {
    return { error: { _form: ["Failed to update badge"] } };
  }
}

export async function deleteBadge(id: string) {
  try {
    await db.delete(badges).where(eq(badges.id, id));
    revalidatePath("/gamification/badges");
    return { success: true };
  } catch {
    return { error: "Failed to delete badge" };
  }
}
