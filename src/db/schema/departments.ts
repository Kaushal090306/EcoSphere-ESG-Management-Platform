import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { statusEnum } from "./users";

export const departments = pgTable("departments", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  headUserId: uuid("head_user_id"),
  parentDepartmentId: uuid("parent_department_id"),
  employeeCount: integer("employee_count").notNull().default(0),
  status: statusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  headUserIdIdx: index("dept_head_user_id_idx").on(table.headUserId),
  parentDeptIdIdx: index("dept_parent_id_idx").on(table.parentDepartmentId),
}));



export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;



