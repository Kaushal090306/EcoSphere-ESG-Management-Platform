"use server";

import { db } from "@/db";
import { esgSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getEsgSettings() {
  const settings = await db.select().from(esgSettings).limit(1);
  if (settings.length === 0) {
    // Create default settings
    const [created] = await db
      .insert(esgSettings)
      .values({})
      .returning();
    return created;
  }
  return settings[0];
}

export async function updateEsgSettings(data: {
  environmentalWeight: number;
  socialWeight: number;
  governanceWeight: number;
  autoEmissionCalculation: boolean;
  evidenceRequired: boolean;
  badgeAutoAward: boolean;
}) {
  const total = data.environmentalWeight + data.socialWeight + data.governanceWeight;
  if (total !== 100) {
    return { error: "Weights must sum to 100%" };
  }

  try {
    const existing = await db.select().from(esgSettings).limit(1);
    if (existing.length === 0) {
      await db.insert(esgSettings).values({
        ...data,
      });
    } else {
      await db
        .update(esgSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(esgSettings.id, existing[0].id));
    }
    revalidatePath("/settings");
    return { success: true };
  } catch {
    return { error: "Failed to update settings" };
  }
}
