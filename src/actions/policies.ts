"use server";

import { db } from "@/db";
import { policies, policyAcknowledgements } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { policySchema, type PolicyFormData } from "@/lib/validations";

import { checkRole, getSessionUser } from "@/lib/auth-utils";
import { awardXp } from "@/actions/gamification";

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

export async function getPolicyAcknowledgements() {
  const user = await getSessionUser();
  if (!user?.id) return [];
  return db
    .select()
    .from(policyAcknowledgements)
    .where(eq(policyAcknowledgements.employeeId, user.id));
}

export async function acknowledgePolicy(policyId: string) {
  const user = await getSessionUser();
  if (!user?.id) return { error: "Please sign in to acknowledge policies." };

  try {
    const [existing] = await db
      .select()
      .from(policyAcknowledgements)
      .where(
        and(
          eq(policyAcknowledgements.employeeId, user.id),
          eq(policyAcknowledgements.policyId, policyId)
        )
      )
      .limit(1);

    if (existing) {
      return { success: true, alreadyAcknowledged: true };
    }

    const [inserted] = await db
      .insert(policyAcknowledgements)
      .values({
        employeeId: user.id,
        policyId,
        ipAddress: "127.0.0.1",
      })
      .returning();

    // Award +5 XP for policy acknowledgement (referenceId is the acknowledgement record ID)
    if (inserted) {
      await awardXp(user.id, 5, "policy_acknowledgement", inserted.id);
    }

    revalidatePath("/governance/policies");
    return { success: true };
  } catch (error: any) {
    console.error("Error acknowledging policy:", error);
    return { error: error.message || "Failed to acknowledge policy." };
  }
}

