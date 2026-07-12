"use server";

import { db } from "@/db";
import { departments, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { departmentSchema, type DepartmentFormData } from "@/lib/validations";

export async function getDepartments() {
  return db
    .select({
      id: departments.id,
      name: departments.name,
      code: departments.code,
      headUserId: departments.headUserId,
      parentDepartmentId: departments.parentDepartmentId,
      employeeCount: sql<number>`count(${users.id})::int`,
      status: departments.status,
      createdAt: departments.createdAt,
      updatedAt: departments.updatedAt,
    })
    .from(departments)
    .leftJoin(users, eq(users.departmentId, departments.id))
    .groupBy(departments.id)
    .orderBy(departments.name);
}

export async function getDepartmentById(id: string) {
  const [department] = await db
    .select()
    .from(departments)
    .where(eq(departments.id, id))
    .limit(1);
  return department;
}

export async function createDepartment(data: DepartmentFormData) {
  const parsed = departmentSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await db.insert(departments).values({
      name: parsed.data.name,
      code: parsed.data.code,
      headUserId: parsed.data.headId || null,
      parentDepartmentId: parsed.data.parentDepartmentId || null,
      employeeCount: parsed.data.employeeCount,
      status: parsed.data.status,
    });
    revalidatePath("/settings/departments");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("unique")) {
      return { error: { code: ["Department code already exists"] } };
    }
    return { error: { _form: ["Failed to create department"] } };
  }
}

export async function updateDepartment(id: string, data: DepartmentFormData) {
  const parsed = departmentSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await db
      .update(departments)
      .set({
        name: parsed.data.name,
        code: parsed.data.code,
        headUserId: parsed.data.headId || null,
        parentDepartmentId: parsed.data.parentDepartmentId || null,
        employeeCount: parsed.data.employeeCount,
        status: parsed.data.status,
        updatedAt: new Date(),
      })
      .where(eq(departments.id, id));
    revalidatePath("/settings/departments");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("unique")) {
      return { error: { code: ["Department code already exists"] } };
    }
    return { error: { _form: ["Failed to update department"] } };
  }
}

export async function deleteDepartment(id: string) {
  try {
    await db.delete(departments).where(eq(departments.id, id));
    revalidatePath("/settings/departments");
    return { success: true };
  } catch {
    return { error: "Failed to delete department" };
  }
}
