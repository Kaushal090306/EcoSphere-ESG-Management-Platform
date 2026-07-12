CREATE TYPE "public"."category_type" AS ENUM('csr_activity', 'challenge');--> statement-breakpoint
CREATE TYPE "public"."goal_status" AS ENUM('active', 'achieved', 'missed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."policy_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."reward_status" AS ENUM('active', 'inactive', 'out_of_stock');--> statement-breakpoint
CREATE TYPE "public"."emission_scope" AS ENUM('scope_1', 'scope_2', 'scope_3');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('fuel', 'electricity', 'materials', 'fleet', 'waste', 'other');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'esg_manager', 'dept_head', 'employee', 'auditor');--> statement-breakpoint
CREATE TYPE "public"."transaction_source_type_enum" AS ENUM('purchase', 'manufacturing', 'expense', 'fleet');--> statement-breakpoint
CREATE TYPE "public"."approval_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."csr_activity_status" AS ENUM('draft', 'open', 'closed');--> statement-breakpoint
CREATE TYPE "public"."training_status" AS ENUM('not_started', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."audit_status" AS ENUM('scheduled', 'in_progress', 'completed', 'under_review');--> statement-breakpoint
CREATE TYPE "public"."issue_severity" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."issue_status" AS ENUM('open', 'in_progress', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."challenge_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."challenge_status" AS ENUM('draft', 'active', 'under_review', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."participation_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('compliance_issue', 'csr_approval', 'challenge_approval', 'policy_reminder', 'badge_unlock', 'overdue_issue');--> statement-breakpoint
CREATE TABLE "badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"unlock_rule" jsonb NOT NULL,
	"icon" varchar(100) DEFAULT 'award' NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "category_type" NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(50) NOT NULL,
	"head_user_id" uuid,
	"parent_department_id" uuid,
	"employee_count" integer DEFAULT 0 NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "departments_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "emission_factors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"source_type" "source_type" NOT NULL,
	"unit" varchar(50) NOT NULL,
	"factor_value" numeric(10, 6) NOT NULL,
	"scope" "emission_scope" NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "environmental_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"department_id" uuid NOT NULL,
	"metric" varchar(100) NOT NULL,
	"baseline_value" numeric(12, 2) NOT NULL,
	"target_value" numeric(12, 2) NOT NULL,
	"current_value" numeric(12, 2) DEFAULT '0' NOT NULL,
	"deadline" date NOT NULL,
	"status" "goal_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "esg_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"environmental_weight" numeric DEFAULT '0.4' NOT NULL,
	"social_weight" numeric DEFAULT '0.3' NOT NULL,
	"governance_weight" numeric DEFAULT '0.3' NOT NULL,
	"auto_emission_calc" boolean DEFAULT false NOT NULL,
	"evidence_required" boolean DEFAULT false NOT NULL,
	"badge_auto_award" boolean DEFAULT false NOT NULL,
	"policy_reminder_days" integer DEFAULT 7 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"version" varchar(20) DEFAULT '1.0' NOT NULL,
	"category" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"effective_date" date NOT NULL,
	"status" "policy_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_esg_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"carbon_intensity" numeric(10, 4) NOT NULL,
	"recyclability" text,
	"certifications" text[],
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"points_required" integer NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"status" "reward_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'employee' NOT NULL,
	"department_id" uuid,
	"status" "status" DEFAULT 'active' NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "carbon_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"department_id" uuid NOT NULL,
	"source_type" "transaction_source_type_enum" NOT NULL,
	"source_reference_id" varchar(255),
	"emission_factor_id" uuid NOT NULL,
	"quantity" numeric NOT NULL,
	"co2e_value" numeric NOT NULL,
	"date" timestamp NOT NULL,
	"auto_calculated" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "csr_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"category_id" uuid NOT NULL,
	"description" text,
	"department_id" uuid,
	"date" timestamp,
	"location" varchar(255),
	"max_participants" integer,
	"status" "csr_activity_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diversity_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"department_id" uuid NOT NULL,
	"gender_breakdown" jsonb,
	"age_band_breakdown" jsonb,
	"ethnicity_breakdown" jsonb,
	"disability_count" integer DEFAULT 0,
	"period" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employee_participations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"activity_id" uuid NOT NULL,
	"proof_url" text,
	"approval_status" "approval_status" DEFAULT 'pending' NOT NULL,
	"points_earned" integer DEFAULT 0 NOT NULL,
	"completion_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"course_name" varchar(255) NOT NULL,
	"status" "training_status" DEFAULT 'not_started' NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"department_id" uuid NOT NULL,
	"auditor_id" uuid NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"status" "audit_status" DEFAULT 'scheduled' NOT NULL,
	"findings_summary" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "compliance_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audit_id" uuid NOT NULL,
	"severity" "issue_severity" NOT NULL,
	"description" text NOT NULL,
	"owner_id" uuid NOT NULL,
	"due_date" timestamp NOT NULL,
	"status" "issue_status" DEFAULT 'open' NOT NULL,
	"overdue_flag" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "policy_acknowledgements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"policy_id" uuid NOT NULL,
	"acknowledged_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" varchar(45),
	CONSTRAINT "unique_employee_policy_ack" UNIQUE("employee_id","policy_id")
);
--> statement-breakpoint
CREATE TABLE "challenge_participations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"progress_pct" integer DEFAULT 0 NOT NULL,
	"proof_url" text,
	"approval_status" "participation_status" DEFAULT 'pending' NOT NULL,
	"xp_awarded" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"category_id" uuid NOT NULL,
	"description" text,
	"xp" integer DEFAULT 0 NOT NULL,
	"difficulty" "challenge_difficulty" DEFAULT 'easy' NOT NULL,
	"evidence_required" boolean DEFAULT false NOT NULL,
	"deadline" timestamp,
	"status" "challenge_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reward_redemptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"reward_id" uuid NOT NULL,
	"points_spent" integer NOT NULL,
	"redeemed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "department_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"department_id" uuid NOT NULL,
	"environmental_score" numeric,
	"social_score" numeric,
	"governance_score" numeric,
	"total_score" numeric,
	"period" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_department_period_score" UNIQUE("department_id","period")
);
--> statement-breakpoint
CREATE TABLE "notification_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" text NOT NULL,
	"in_app_enabled" boolean DEFAULT true NOT NULL,
	"email_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notification_settings_event_type_unique" UNIQUE("event_type")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "environmental_goals" ADD CONSTRAINT "environmental_goals_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dept_head_user_id_idx" ON "departments" USING btree ("head_user_id");--> statement-breakpoint
CREATE INDEX "dept_parent_id_idx" ON "departments" USING btree ("parent_department_id");--> statement-breakpoint
CREATE INDEX "user_department_id_idx" ON "users" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "carbon_txn_department_id_idx" ON "carbon_transactions" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "carbon_txn_ef_id_idx" ON "carbon_transactions" USING btree ("emission_factor_id");--> statement-breakpoint
CREATE INDEX "csr_category_id_idx" ON "csr_activities" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "csr_department_id_idx" ON "csr_activities" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "diversity_department_id_idx" ON "diversity_metrics" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "emp_part_employee_id_idx" ON "employee_participations" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "emp_part_activity_id_idx" ON "employee_participations" USING btree ("activity_id");--> statement-breakpoint
CREATE INDEX "training_employee_id_idx" ON "training_records" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "audit_department_id_idx" ON "audits" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "audit_auditor_id_idx" ON "audits" USING btree ("auditor_id");--> statement-breakpoint
CREATE INDEX "issue_audit_id_idx" ON "compliance_issues" USING btree ("audit_id");--> statement-breakpoint
CREATE INDEX "issue_owner_id_idx" ON "compliance_issues" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "issue_due_date_idx" ON "compliance_issues" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "policy_ack_employee_id_idx" ON "policy_acknowledgements" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "policy_ack_policy_id_idx" ON "policy_acknowledgements" USING btree ("policy_id");--> statement-breakpoint
CREATE INDEX "chall_part_challenge_id_idx" ON "challenge_participations" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX "chall_part_employee_id_idx" ON "challenge_participations" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "challenge_category_id_idx" ON "challenges" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "reward_redemp_employee_id_idx" ON "reward_redemptions" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "reward_redemp_reward_id_idx" ON "reward_redemptions" USING btree ("reward_id");--> statement-breakpoint
CREATE INDEX "score_department_id_idx" ON "department_scores" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "notification_user_id_idx" ON "notifications" USING btree ("user_id");