"use server";

import { db } from "@/db";
import { productEsgProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { productEsgProfileSchema, type ProductEsgProfileFormData } from "@/lib/validations";

export async function getProductProfiles() {
  return db.select().from(productEsgProfiles).orderBy(productEsgProfiles.productName);
}

export async function createProductProfile(data: ProductEsgProfileFormData) {
  const parsed = productEsgProfileSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    const dbData = {
      productName: parsed.data.productName,
      carbonIntensity: parsed.data.carbonIntensity,
      recyclability: parsed.data.recyclabilityPercentage,
      certifications: parsed.data.certifications
        ? parsed.data.certifications.split(",").map((c) => c.trim()).filter(Boolean)
        : [],
      status: parsed.data.status,
    };
    await db.insert(productEsgProfiles).values(dbData);
    revalidatePath("/environmental/product-profiles");
    return { success: true };
  } catch {
    return { error: { _form: ["Failed to create profile"] } };
  }
}

export async function updateProductProfile(id: string, data: ProductEsgProfileFormData) {
  const parsed = productEsgProfileSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    const dbData = {
      productName: parsed.data.productName,
      carbonIntensity: parsed.data.carbonIntensity,
      recyclability: parsed.data.recyclabilityPercentage,
      certifications: parsed.data.certifications
        ? parsed.data.certifications.split(",").map((c) => c.trim()).filter(Boolean)
        : [],
      status: parsed.data.status,
      updatedAt: new Date(),
    };
    await db.update(productEsgProfiles).set(dbData).where(eq(productEsgProfiles.id, id));
    revalidatePath("/environmental/product-profiles");
    return { success: true };
  } catch {
    return { error: { _form: ["Failed to update profile"] } };
  }
}

export async function deleteProductProfile(id: string) {
  try {
    await db.delete(productEsgProfiles).where(eq(productEsgProfiles.id, id));
    revalidatePath("/environmental/product-profiles");
    return { success: true };
  } catch {
    return { error: "Failed to delete profile" };
  }
}
