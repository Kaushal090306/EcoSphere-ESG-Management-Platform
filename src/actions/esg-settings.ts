"use server";

import { db } from "@/db";
import { esgSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { checkRole } from "@/lib/auth-utils";

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
  try {
    await checkRole(["admin"]);
  } catch (err: any) {
    return { error: err.message || "Unauthorized" };
  }

  const total = data.environmentalWeight + data.socialWeight + data.governanceWeight;
  if (total !== 100) {
    return { error: "Weights must sum to 100%" };
  }

  try {
    const existing = await db.select().from(esgSettings).limit(1);
    const dbData = {
      environmentalWeight: String(data.environmentalWeight / 100),
      socialWeight: String(data.socialWeight / 100),
      governanceWeight: String(data.governanceWeight / 100),
      autoEmissionCalc: data.autoEmissionCalculation,
      evidenceRequired: data.evidenceRequired,
      badgeAutoAward: data.badgeAutoAward,
    };

    if (existing.length === 0) {
      await db.insert(esgSettings).values(dbData);
    } else {
      await db
        .update(esgSettings)
        .set({ ...dbData, updatedAt: new Date() })
        .where(eq(esgSettings.id, existing[0].id));
    }
    revalidatePath("/settings");
    return { success: true };
  } catch {
    return { error: "Failed to update settings" };
  }
}
