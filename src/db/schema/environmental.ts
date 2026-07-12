import {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
  boolean,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { departments } from "./departments";
import { emissionFactors } from "./emission-factors";

export const transactionSourceTypeEnum = pgEnum("transaction_source_type_enum", [
  "purchase",
  "manufacturing",
  "expense",
  "fleet",
]);

export const carbonTransactions = pgTable(
  "carbon_transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    departmentId: uuid("department_id").notNull(),
    sourceType: transactionSourceTypeEnum("source_type").notNull(),
    sourceReferenceId: varchar("source_reference_id", { length: 255 }),
    emissionFactorId: uuid("emission_factor_id").notNull(),
    quantity: numeric("quantity").notNull(),
    co2eValue: numeric("co2e_value").notNull(),
    date: timestamp("date").notNull(),
    autoCalculated: boolean("auto_calculated").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    departmentIdIdx: index("carbon_txn_department_id_idx").on(
      table.departmentId
    ),
    emissionFactorIdIdx: index("carbon_txn_ef_id_idx").on(
      table.emissionFactorId
    ),
  })
);

export const carbonTransactionsRelations = relations(
  carbonTransactions,
  ({ one }) => ({
    department: one(departments, {
      fields: [carbonTransactions.departmentId],
      references: [departments.id],
    }),
    emissionFactor: one(emissionFactors, {
      fields: [carbonTransactions.emissionFactorId],
      references: [emissionFactors.id],
    }),
  })
);

export type CarbonTransaction = typeof carbonTransactions.$inferSelect;
export type NewCarbonTransaction = typeof carbonTransactions.$inferInsert;
