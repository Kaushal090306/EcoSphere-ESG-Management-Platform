import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const rewardStatusEnum = pgEnum("reward_status", [
  "active",
  "inactive",
  "out_of_stock",
]);

export const rewards = pgTable("rewards", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  pointsRequired: integer("points_required").notNull(),
  stock: integer("stock").notNull().default(0),
  status: rewardStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Reward = typeof rewards.$inferSelect;
export type NewReward = typeof rewards.$inferInsert;
