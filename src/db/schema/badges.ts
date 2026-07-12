import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { statusEnum } from "./users";

export const badges = pgTable("badges", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  unlockRule: jsonb("unlock_rule")
    .notNull()
    .$type<{ type: "xp" | "challenges"; threshold: number }>(),
  icon: varchar("icon", { length: 100 }).notNull().default("award"),
  status: statusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type NewBadge = typeof badges.$inferInsert;
