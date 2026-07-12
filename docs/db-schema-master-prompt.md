ROLE: You are the database architect for EcoSphere, an ESG (Environmental, Social,
Governance) management platform. Implement the complete database schema in one pass
against a Neon Postgres database using Drizzle ORM.

PROJECT CONTEXT:
- Stack: Next.js 16 (App Router) + Drizzle ORM + Neon serverless Postgres +
  Auth.js v5 (credentials provider) + shadcn/ui.
- Full product spec is in /docs/PRD.md — read it fully before writing any schema.
- If a schema file or table already exists in this repo, inspect it first and MATCH
  its existing conventions (id type, timestamp columns, enum declaration style,
  relation declaration style) rather than introducing a second style. Extend, don't
  duplicate.
- Env var DATABASE_URL points at the Neon instance — do not hardcode credentials
  anywhere, do not create a new .env file, just read the existing one.

GOAL: A single, complete, internally consistent schema covering every model in
PRD section 6 (Master Data + Transactional Data), organized into one file per domain
under db/schema/, all re-exported from db/schema/index.ts, pushed live to Neon, and
seeded with realistic demo data.

────────────────────────────────────────────────────────────────
STEP 1 — Conventions (apply to every table below)
────────────────────────────────────────────────────────────────
- Primary key: match whatever the existing tables use (likely text/uuid via
  `.default(sql\`gen_random_uuid()\`)` or Drizzle's own uuid helper — check first).
- Every table gets: created_at timestamp default now(); updated_at timestamp default
  now() where the row is ever mutated after creation (skip updated_at on pure
  append-only log tables like carbon_transactions, notifications).
- Money/points/XP/emission values: numeric or integer — never floating point.
- Every enum-like status/type column: use a Postgres enum via Drizzle's pgEnum, not a
  free-text string with app-level validation only.
- Every foreign key: add an index. Every column used to filter lists in the UI
  (department_id, status, due_date, employee_id): add an index.
- Declare Drizzle relations() for every FK so relational queries
  (db.query.x.findMany({ with: {...} })) work end-to-end.

────────────────────────────────────────────────────────────────
STEP 2 — Master Data tables (db/schema/master.ts, split further if the file gets
long — e.g. keep environmental-only master tables in db/schema/environmental.ts)
────────────────────────────────────────────────────────────────
- departments: id, name, code (unique), head_user_id FK->users nullable,
  parent_department_id FK->departments (self-relation) nullable, employee_count int
  default 0, status enum('active','inactive'), created_at, updated_at
- categories: id, name, type enum('csr_activity','challenge'), status
  enum('active','inactive'), created_at, updated_at
- emission_factors: id, name, source_type enum('fuel','electricity','material',
  'fleet','other'), unit text, factor_value numeric, scope enum('scope_1','scope_2',
  'scope_3'), status enum('active','inactive'), created_at, updated_at
- product_esg_profiles: id, product_name text, carbon_intensity numeric,
  recyclability text, certifications text[], created_at, updated_at
- environmental_goals: id, title, department_id FK->departments, metric text,
  baseline numeric, target numeric, deadline timestamp, status
  enum('active','on_track','at_risk','completed'), created_at, updated_at
- esg_policies: id, title, version text, category_id FK->categories, content text,
  effective_date timestamp, status enum('draft','published','archived'), created_at,
  updated_at
- badges: id, name, description, unlock_rule jsonb (e.g.
  {"metric":"xp","operator":">=","value":500}), icon text, created_at, updated_at
- rewards: id, name, description, points_required integer, stock integer,
  status enum('active','inactive'), created_at, updated_at
- esg_config: id, environmental_weight numeric default 0.4, social_weight numeric
  default 0.3, governance_weight numeric default 0.3, auto_emission_calc boolean
  default false, evidence_required boolean default false, badge_auto_award boolean
  default false, policy_reminder_days integer default 7, created_at, updated_at
  (single-row config table — treat as a singleton, don't build multi-tenant support
  unless the PRD asks for it)
- notification_settings: id, event_type enum('compliance_issue','csr_approval',
  'challenge_approval','policy_reminder','badge_unlock','overdue_issue'),
  in_app_enabled boolean default true, email_enabled boolean default false
  (one row per event_type — seed all six)

If any of these already exist in the repo (likely: departments, categories,
emission_factors, environmental_goals, esg_policies, badges, rewards, some settings
table), do NOT recreate them — verify column names match this spec, add any missing
columns via an ALTER-equivalent Drizzle migration, and move on.

────────────────────────────────────────────────────────────────
STEP 3 — Users (extend, don't recreate)
────────────────────────────────────────────────────────────────
Check the existing users table. Ensure it has: id, name, email (unique),
password_hash, role enum('admin','esg_manager','dept_head','employee','auditor'),
department_id FK->departments nullable, points integer default 0, xp integer
default 0, status enum('active','inactive') default 'active', created_at,
updated_at. Add whichever of points/xp/status are missing — do not duplicate under
different names if an equivalent column already exists.

────────────────────────────────────────────────────────────────
STEP 4 — Transactional Data tables
────────────────────────────────────────────────────────────────

db/schema/environmental.ts
- carbon_transactions: id, department_id FK->departments, source_type
  enum('purchase','manufacturing','expense','fleet'), source_reference_id text,
  emission_factor_id FK->emission_factors, quantity numeric, co2e_value numeric,
  date timestamp, auto_calculated boolean default false, created_at

db/schema/social.ts
- csr_activities: id, title, category_id FK->categories, description,
  department_id FK->departments, date timestamp, location text, max_participants
  integer, status enum('draft','open','closed'), created_at, updated_at
- employee_participations: id, employee_id FK->users, activity_id
  FK->csr_activities, proof_url text nullable, approval_status
  enum('pending','approved','rejected') default 'pending', points_earned integer
  default 0, completion_date timestamp nullable, created_at
- diversity_metrics: id, department_id FK->departments, gender_breakdown jsonb,
  age_band_breakdown jsonb, ethnicity_breakdown jsonb, disability_count integer,
  period text, created_at
- training_records: id, employee_id FK->users, course_name text, status
  enum('not_started','in_progress','completed'), completed_at timestamp nullable,
  created_at

db/schema/governance.ts
- policy_acknowledgements: id, employee_id FK->users, policy_id FK->esg_policies,
  acknowledged_at timestamp, ip_address text, UNIQUE(employee_id, policy_id)
- audits: id, title, department_id FK->departments, auditor_id FK->users,
  scheduled_date timestamp, status enum('scheduled','in_progress','completed',
  'under_review'), findings_summary text, created_at, updated_at
- compliance_issues: id, audit_id FK->audits, severity
  enum('low','medium','high','critical'), description text, owner_id FK->users
  NOT NULL, due_date timestamp NOT NULL, status enum('open','in_progress','resolved',
  'closed') default 'open', overdue_flag boolean default false, created_at,
  updated_at

db/schema/gamification.ts
- challenges: id, title, category_id FK->categories, description, xp integer,
  difficulty enum('easy','medium','hard'), evidence_required boolean default false,
  deadline timestamp, status enum('draft','active','under_review','completed',
  'archived') default 'draft', created_at, updated_at
- challenge_participations: id, challenge_id FK->challenges, employee_id FK->users,
  progress_pct integer default 0, proof_url text nullable, approval_status
  enum('pending','approved','rejected') default 'pending', xp_awarded integer
  default 0, created_at
- reward_redemptions: id, employee_id FK->users, reward_id FK->rewards, points_spent
  integer, redeemed_at timestamp default now()

db/schema/scoring.ts
- department_scores: id, department_id FK->departments, environmental_score numeric,
  social_score numeric, governance_score numeric, total_score numeric, period text,
  UNIQUE(department_id, period), created_at

db/schema/notifications.ts
- notifications: id, user_id FK->users, type enum('compliance_issue','csr_approval',
  'challenge_approval','policy_reminder','badge_unlock','overdue_issue'), message
  text, read boolean default false, created_at

────────────────────────────────────────────────────────────────
STEP 5 — Wire it up
────────────────────────────────────────────────────────────────
1. Re-export every table and every relations() object from db/schema/index.ts so any
   future code can `import { challenges, csrActivities, ... } from '@/db/schema'`.
2. Push the schema to Neon using whatever command this repo already uses for schema
   sync (check package.json scripts — most likely `npx drizzle-kit push`, or
   `generate` + `migrate` if migrations are being tracked in db/migrations — follow
   the existing pattern, don't switch strategies). Fix any push errors yourself
   (enum conflicts, type mismatches, missing extensions like pgcrypto for UUID
   generation) before reporting done.
3. Extend the existing seed script (find it — likely db/seed.ts or an /api/seed
   route) so every new table has realistic rows:
   - 2+ carbon transactions per seeded department, spread across source types
   - 3-4 CSR activities across draft/open/closed with mixed participation approval
     states, at least one activity that requires evidence and has a pending
     participation with no proof (to test the evidence-required rule)
   - diversity_metrics and training_records for at least 2 departments
   - 2 audits with at least one compliance_issue that is Open with a due_date in the
     past (to test the overdue flag) and one that is Resolved
   - 4 challenges spread across all 5 statuses, with participations in mixed
     approval states
   - at least 1 reward_redemption
   - department_scores rows for 2 different periods (so a trend chart has something
     to show) with varying scores across departments
   - notification_settings: exactly 6 rows, one per event_type, sensible defaults
   - esg_config: exactly 1 row with default weights
4. Run the seed script against Neon and confirm it completes without error.
5. Commit as: "feat: complete EcoSphere transactional + master schema, seeded".

────────────────────────────────────────────────────────────────
ACCEPTANCE CRITERIA — verify all of these before reporting done
────────────────────────────────────────────────────────────────
- [ ] Schema pushes to Neon with zero errors on a clean run.
- [ ] Every table listed above exists with the exact column set specified (spot-check
      column names against this prompt, not just "a table with roughly these fields").
- [ ] No duplicate/near-duplicate columns on users, departments, or any pre-existing
      table (e.g. both a `points` and a `points_balance` column would be a failure).
- [ ] All FKs resolve — open Drizzle Studio (or run a relational query) and confirm a
      challenge_participation joins correctly to both its challenge and its employee.
- [ ] Seed script populates every new table with the volumes specified in Step 5.3.
- [ ] db/schema/index.ts exports everything — grep for any table NOT re-exported there.
- [ ] Enums match PRD status lists exactly, especially challenge status
      (draft/active/under_review/completed/archived) and compliance_issue status
      (open/in_progress/resolved/closed).

DO NOT write any UI, server action, or API route in this task. Schema + seed only.
That work is scoped separately once this lands on main.
