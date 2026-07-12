"use server";

import { db } from "@/db";
import { challenges } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getChallenges() {
  return db.select().from(challenges).orderBy(desc(challenges.createdAt));
}
