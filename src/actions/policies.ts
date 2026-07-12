"use server";

import { db } from "@/db";
import { policies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { policySchema, type PolicyFormData } from "@/lib/validations";

import { checkRole } from "@/lib/auth-utils";

export async function getPolicies() {
  return db.select().from(policies).orderBy(policies.title);
}

export async function createPolicy(data: PolicyFormData) {
  try {
    await checkRole(["admin", "esg_manager", "dept_head"]);
  } catch (err: any) {
    return { error: { _form: [err.message || "Unauthorized"] } };
  }

  const parsed = policySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    await db.insert(policies).values(parsed.data);
    revalidatePath("/governance/policies");
    return { success: true };
  } catch {
    return { error: { _form: ["Failed to create policy"] } };
  }
}

export async function updatePolicy(id: string, data: PolicyFormData) {
  try {
    await checkRole(["admin", "esg_manager", "dept_head"]);
  } catch (err: any) {
    return { error: { _form: [err.message || "Unauthorized"] } };
  }

  const parsed = policySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    await db.update(policies).set({ ...parsed.data, updatedAt: new Date() }).where(eq(policies.id, id));
    revalidatePath("/governance/policies");
    return { success: true };
  } catch {
    return { error: { _form: ["Failed to update policy"] } };
  }
}

export async function deletePolicy(id: string) {
  try {
    await checkRole(["admin", "esg_manager", "dept_head"]);
  } catch (err: any) {
    return { error: err.message || "Unauthorized" };
  }

  try {
    await db.delete(policies).where(eq(policies.id, id));
    revalidatePath("/governance/policies");
    return { success: true };
  } catch {
    return { error: "Failed to delete policy" };
  }
}
