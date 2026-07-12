"use server";

import { db } from "@/db";
import { environmentalGoals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { environmentalGoalSchema, type EnvironmentalGoalFormData } from "@/lib/validations";

export async function getEnvironmentalGoals() {
  return db.select().from(environmentalGoals).orderBy(environmentalGoals.title);
}

export async function createEnvironmentalGoal(data: EnvironmentalGoalFormData) {
  const parsed = environmentalGoalSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    await db.insert(environmentalGoals).values(parsed.data);
    revalidatePath("/environmental/goals");
    return { success: true };
  } catch {
    return { error: { _form: ["Failed to create goal"] } };
  }
}

export async function updateEnvironmentalGoal(id: string, data: EnvironmentalGoalFormData) {
  const parsed = environmentalGoalSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    await db.update(environmentalGoals).set({ ...parsed.data, updatedAt: new Date() }).where(eq(environmentalGoals.id, id));
    revalidatePath("/environmental/goals");
    return { success: true };
  } catch {
    return { error: { _form: ["Failed to update goal"] } };
  }
}

export async function deleteEnvironmentalGoal(id: string) {
  try {
    await db.delete(environmentalGoals).where(eq(environmentalGoals.id, id));
    revalidatePath("/environmental/goals");
    return { success: true };
  } catch {
    return { error: "Failed to delete goal" };
  }
}
