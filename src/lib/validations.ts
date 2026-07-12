import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  code: z.string().min(1, "Code is required").max(50),
  headId: z.string().uuid().nullable().optional(),
  parentDepartmentId: z.string().uuid().nullable().optional(),
  employeeCount: z.coerce.number().int().min(0).default(0),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  type: z.enum(["csr_activity", "challenge"]),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const emissionFactorSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  sourceType: z.enum(["fuel", "electricity", "materials", "fleet", "waste", "other"]),
  unit: z.string().min(1, "Unit is required").max(50),
  factorValue: z.string().min(1, "Factor value is required"),
  scope: z.enum(["scope_1", "scope_2", "scope_3"]),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type EmissionFactorFormData = z.infer<typeof emissionFactorSchema>;

export const environmentalGoalSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  departmentId: z.string().uuid("Department is required"),
  metric: z.string().min(1, "Metric is required").max(100),
  baselineValue: z.string().min(1, "Baseline value is required"),
  targetValue: z.string().min(1, "Target value is required"),
  currentValue: z.string().optional().default("0"),
  deadline: z.string().min(1, "Deadline is required"),
  status: z.enum(["active", "achieved", "missed", "cancelled"]).default("active"),
});

export type EnvironmentalGoalFormData = z.infer<typeof environmentalGoalSchema>;

export const productEsgProfileSchema = z.object({
  productName: z.string().min(1, "Product name is required").max(255),
  carbonIntensity: z.string().min(1, "Carbon intensity is required"),
  recyclabilityPercentage: z.string().min(1, "Recyclability is required"),
  certifications: z.string().optional().default(""),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type ProductEsgProfileFormData = z.infer<typeof productEsgProfileSchema>;

export const policySchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  version: z.string().min(1, "Version is required").max(20).default("1.0"),
  category: z.string().min(1, "Category is required").max(100),
  content: z.string().min(1, "Content is required"),
  effectiveDate: z.string().min(1, "Effective date is required"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export type PolicyFormData = z.infer<typeof policySchema>;

export const badgeSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().min(1, "Description is required"),
  unlockRuleType: z.enum(["xp", "challenges"]),
  unlockRuleThreshold: z.coerce.number().int().min(1, "Threshold must be at least 1"),
  icon: z.string().min(1, "Icon is required").max(100).default("award"),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type BadgeFormData = z.infer<typeof badgeSchema>;

export const rewardSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().min(1, "Description is required"),
  pointsRequired: z.coerce.number().int().min(1, "Points must be at least 1"),
  stock: z.coerce.number().int().min(0).default(0),
  status: z.enum(["active", "inactive", "out_of_stock"]).default("active"),
});

export type RewardFormData = z.infer<typeof rewardSchema>;
