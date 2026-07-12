import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const policyStatusEnum = pgEnum("policy_status", [
  "draft",
  "published",
  "archived",
]);

export const policies = pgTable("policies", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  version: varchar("version", { length: 20 }).notNull().default("1.0"),
  category: varchar("category", { length: 100 }).notNull(),
  content: text("content").notNull(),
  effectiveDate: date("effective_date").notNull(),
  status: policyStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Policy = typeof policies.$inferSelect;
export type NewPolicy = typeof policies.$inferInsert;
