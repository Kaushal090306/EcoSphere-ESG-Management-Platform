"use server";

import { db } from "@/db";
import { emissionFactors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { emissionFactorSchema, type EmissionFactorFormData } from "@/lib/validations";

import { checkRole } from "@/lib/auth-utils";

export async function getEmissionFactors() {
  return db.select().from(emissionFactors).orderBy(emissionFactors.name);
}

export async function createEmissionFactor(data: EmissionFactorFormData) {
  try {
    await checkRole(["admin", "esg_manager"]);
  } catch (err: any) {
    return { error: { _form: [err.message || "Unauthorized"] } };
  }

  const parsed = emissionFactorSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await db.insert(emissionFactors).values(parsed.data);
    revalidatePath("/environmental/emission-factors");
    return { success: true };
  } catch {
    return { error: { _form: ["Failed to create emission factor"] } };
  }
}

export async function updateEmissionFactor(id: string, data: EmissionFactorFormData) {
  try {
    await checkRole(["admin", "esg_manager"]);
  } catch (err: any) {
    return { error: { _form: [err.message || "Unauthorized"] } };
  }

  const parsed = emissionFactorSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await db
      .update(emissionFactors)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(emissionFactors.id, id));
    revalidatePath("/environmental/emission-factors");
    return { success: true };
  } catch {
    return { error: { _form: ["Failed to update emission factor"] } };
  }
}

export async function deleteEmissionFactor(id: string) {
  try {
    await checkRole(["admin", "esg_manager"]);
  } catch (err: any) {
    return { error: err.message || "Unauthorized" };
  }

  try {
    await db.delete(emissionFactors).where(eq(emissionFactors.id, id));
    revalidatePath("/environmental/emission-factors");
    return { success: true };
  } catch {
    return { error: "Failed to delete emission factor" };
  }
}
