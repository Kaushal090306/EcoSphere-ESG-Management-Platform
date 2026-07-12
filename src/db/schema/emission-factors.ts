import {
  pgTable,
  uuid,
  varchar,
  decimal,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { statusEnum } from "./users";

export const sourceTypeEnum = pgEnum("source_type", [
  "fuel",
  "electricity",
  "materials",
  "fleet",
  "waste",
  "other",
]);

export const scopeEnum = pgEnum("emission_scope", [
  "scope_1",
  "scope_2",
  "scope_3",
]);

export const emissionFactors = pgTable("emission_factors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  sourceType: sourceTypeEnum("source_type").notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  factorValue: decimal("factor_value", { precision: 10, scale: 6 }).notNull(),
  scope: scopeEnum("scope").notNull(),
  status: statusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type EmissionFactor = typeof emissionFactors.$inferSelect;
export type NewEmissionFactor = typeof emissionFactors.$inferInsert;
