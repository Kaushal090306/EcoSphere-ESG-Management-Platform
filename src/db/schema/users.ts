import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "esg_manager",
  "dept_head",
  "employee",
  "auditor",
]);

export const statusEnum = pgEnum("status", ["active", "inactive"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("employee"),
  departmentId: uuid("department_id"),
  status: statusEnum("status").notNull().default("active"),
  points: integer("points").notNull().default(0),
  xp: integer("xp").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  departmentIdIdx: index("user_department_id_idx").on(table.departmentId),
}));



export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;




