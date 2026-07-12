"use server";

import { db } from "@/db";
import { rewards } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { rewardSchema, type RewardFormData } from "@/lib/validations";

export async function getRewards() {
  return db.select().from(rewards).orderBy(rewards.name);
}

export async function createReward(data: RewardFormData) {
  const parsed = rewardSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    await db.insert(rewards).values(parsed.data);
    revalidatePath("/gamification/rewards");
    return { success: true };
  } catch {
    return { error: { _form: ["Failed to create reward"] } };
  }
}

export async function updateReward(id: string, data: RewardFormData) {
  const parsed = rewardSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    await db.update(rewards).set({ ...parsed.data, updatedAt: new Date() }).where(eq(rewards.id, id));
    revalidatePath("/gamification/rewards");
    return { success: true };
  } catch {
    return { error: { _form: ["Failed to update reward"] } };
  }
}

export async function deleteReward(id: string) {
  try {
    await db.delete(rewards).where(eq(rewards.id, id));
    revalidatePath("/gamification/rewards");
    return { success: true };
  } catch {
    return { error: "Failed to delete reward" };
  }
}
