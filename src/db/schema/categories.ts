import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { statusEnum } from "./users";

export const categoryTypeEnum = pgEnum("category_type", [
  "csr_activity",
  "challenge",
]);

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: categoryTypeEnum("type").notNull(),
  status: statusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
