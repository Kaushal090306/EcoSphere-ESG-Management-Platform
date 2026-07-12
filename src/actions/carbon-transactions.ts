"use server";

import { db } from "@/db";
import { carbonTransactions } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getCarbonTransactions() {
  return db.select().from(carbonTransactions).orderBy(desc(carbonTransactions.date));
}
