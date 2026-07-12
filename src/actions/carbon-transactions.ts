"use server";

import { db } from "@/db";
import { carbonTransactions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCarbonTransactions() {
  return db.select().from(carbonTransactions).orderBy(desc(carbonTransactions.date));
}

export async function createCarbonTransaction(data: {
  departmentId: string;
  sourceType: "purchase" | "manufacturing" | "expense" | "fleet";
  emissionFactorId: string;
  quantity: string;
  co2eValue: string;
  date: string;
  autoCalculated: boolean;
}) {
  try {
    const result = await db.insert(carbonTransactions).values({
      ...data,
      date: new Date(data.date),
    }).returning();
    revalidatePath("/environmental/carbon-transactions");
    return { success: true, transaction: result[0] };
  } catch (error) {
    console.error(error);
    return { error: String(error) };
  }
}

export async function updateCarbonTransaction(
  id: string,
  data: {
    departmentId: string;
    sourceType: "purchase" | "manufacturing" | "expense" | "fleet";
    emissionFactorId: string;
    quantity: string;
    co2eValue: string;
    date: string;
    autoCalculated: boolean;
  }
) {
  try {
    const result = await db.update(carbonTransactions).set({
      ...data,
      date: new Date(data.date),
      createdAt: new Date(), // touch update timestamp if needed, or omit
    }).where(eq(carbonTransactions.id, id)).returning();
    revalidatePath("/environmental/carbon-transactions");
    return { success: true, transaction: result[0] };
  } catch (error) {
    console.error(error);
    return { error: String(error) };
  }
}

export async function deleteCarbonTransaction(id: string) {
  try {
    await db.delete(carbonTransactions).where(eq(carbonTransactions.id, id));
    revalidatePath("/environmental/carbon-transactions");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: String(error) };
  }
}
