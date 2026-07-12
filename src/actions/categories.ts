"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { categorySchema, type CategoryFormData } from "@/lib/validations";

export async function getCategories() {
  return db.select().from(categories).orderBy(categories.name);
}

export async function createCategory(data: CategoryFormData) {
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await db.insert(categories).values(parsed.data);
    revalidatePath("/settings/categories");
    return { success: true };
  } catch {
    return { error: { _form: ["Failed to create category"] } };
  }
}

export async function updateCategory(id: string, data: CategoryFormData) {
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await db
      .update(categories)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(categories.id, id));
    revalidatePath("/settings/categories");
    return { success: true };
  } catch {
    return { error: { _form: ["Failed to update category"] } };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/settings/categories");
    return { success: true };
  } catch {
    return { error: "Failed to delete category" };
  }
}
