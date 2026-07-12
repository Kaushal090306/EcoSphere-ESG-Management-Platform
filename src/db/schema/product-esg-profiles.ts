import {
  pgTable,
  uuid,
  varchar,
  decimal,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { statusEnum } from "./users";

export const productEsgProfiles = pgTable("product_esg_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  carbonIntensity: decimal("carbon_intensity", {
    precision: 10,
    scale: 4,
  }).notNull(),
  recyclability: text("recyclability"),
  certifications: text("certifications").array(),
  status: statusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ProductEsgProfile = typeof productEsgProfiles.$inferSelect;
export type NewProductEsgProfile = typeof productEsgProfiles.$inferInsert;
