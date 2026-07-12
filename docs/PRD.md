# EcoSphere — Product Requirements Document (PRD)

> **Version**: 1.0  
> **Date**: 2026-07-12  
> **Status**: Draft  

---

## 1. Purpose

EcoSphere is an ESG (Environmental, Social & Governance) Management Platform that helps organizations measure, manage, and improve their sustainability performance. It plugs into day-to-day ERP operations so that carbon tracking, employee engagement, and governance compliance happen automatically — not as an afterthought in a spreadsheet.

---

## 2. Problem Statement

| Pain Point | Impact |
|---|---|
| ESG reporting is manual and disconnected from ERP data | Delayed, inaccurate sustainability reports |
| No real-time visibility into carbon emissions | Missed reduction targets |
| Employee participation in CSR is hard to track | Low engagement, no accountability |
| Governance policies lack centralized acknowledgement tracking | Compliance gaps and audit risk |
| No incentive mechanism for sustainable behavior | Sustainability stays a top-down mandate |

---

## 3. Goals & Success Metrics

| Goal | Metric | Target |
|---|---|---|
| Automate carbon accounting | % of emissions auto-calculated from ERP records | > 90% |
| Increase CSR participation | Active employee participation rate | > 60% |
| Ensure governance compliance | Policy acknowledgement rate | 100% |
| Drive engagement via gamification | Monthly active challenge participants | > 40% of workforce |
| Real-time ESG visibility | Dashboard data freshness | ≤ 24 hours |

---

## 4. Users & Personas

| Persona | Role | Key Needs |
|---|---|---|
| **ESG Manager** | Configures emission factors, goals, policies; reviews reports | Full platform access, report builder, dashboard |
| **Department Head** | Monitors department ESG score; approves CSR participation | Department-scoped dashboard, approval workflows |
| **Employee** | Participates in CSR activities & challenges; earns XP/badges | Self-service portal, challenge feed, reward catalog |
| **Auditor** | Conducts governance audits; raises compliance issues | Audit management, compliance tracker |
| **Admin** | Manages system settings, departments, categories | Settings panel, notification config |

---

## 5. Core Modules

### 5.1 Environmental

Track and reduce the organization's carbon footprint.

| Feature | Description |
|---|---|
| Emission Factor Configuration | Maintain emission factors (CO₂e per unit) for fuel, electricity, materials, fleet, etc. |
| Carbon Transaction Recording | Auto-calculate or manually log emissions from Purchase, Manufacturing, Expense, and Fleet records. |
| Department Carbon Tracking | Aggregate emissions by department for accountability. |
| Sustainability Goals | Set time-bound reduction targets (e.g., "Reduce Scope 2 by 15% by Q4 2026"). Track progress. |
| Product ESG Profile | Attach ESG metadata (carbon intensity, recyclability) to products. |
| Environmental Dashboard | Real-time charts: total emissions trend, department breakdown, goal progress, top emission sources. |

### 5.2 Social

Promote employee well-being, diversity, and community impact.

| Feature | Description |
|---|---|
| CSR Activities | Create and manage company-organized social initiatives (tree planting, blood drives, mentorship). |
| Employee Participation | Employees sign up for activities, submit proof of completion, and earn points upon approval. |
| Diversity Metrics | Track workforce diversity across gender, ethnicity, age, and disability status at the department level. |
| Training Completion | Monitor ESG-related training and certification progress. |
| Social Dashboard | Participation rates, diversity charts, top contributors. |

### 5.3 Governance

Ensure policy compliance and audit readiness.

| Feature | Description |
|---|---|
| ESG Policies | Create, version, and publish governance policies (anti-bribery, whistleblower, environmental). |
| Policy Acknowledgements | Employees digitally acknowledge policies; track completion rates with reminders. |
| Audits | Schedule and conduct internal ESG audits; record findings. |
| Compliance Issues | Log violations discovered during audits with severity, owner, due date; auto-flag overdue issues. |
| Governance Dashboard | Policy compliance %, open audit findings, overdue issues. |

### 5.4 Gamification

Drive sustainable behavior through incentives.

| Feature | Description |
|---|---|
| Challenges | Create sustainability challenges with full lifecycle: **Draft → Active → Under Review → Completed** (can be **Archived** at any point). Each challenge has XP reward, difficulty level, deadline, and optional evidence requirement. |
| XP System | Employees earn XP from challenge completion and CSR participation. |
| Badges | Auto-awarded when an employee's XP or completed-challenge count meets a Badge's Unlock Rule. |
| Rewards | Catalog of redeemable incentives. Employees spend earned points; stock is tracked and decremented. |
| Leaderboards | Rank employees and departments by XP, badges, and participation. |

### 5.5 Settings & Administration

| Feature | Description |
|---|---|
| Department Management | CRUD departments with hierarchy (parent department), head, employee count. |
| Category Management | Shared categories for CSR Activities and Challenges. |
| ESG Configuration | Weight distribution for overall score (default: Environmental 40%, Social 30%, Governance 30%). |
| Notification Settings | Toggle in-app / email notifications per event type. |
| System Toggles | Auto Emission Calculation, Evidence Requirement, Badge Auto-Award. |

---

## 6. Data Model

### 6.1 Master Data

| Model | Purpose | Key Fields |
|---|---|---|
| **Department** | Organizational hierarchy & ESG ownership | Name, Code, Head, Parent Department, Employee Count, Status |
| **Category** | Shared categories across Social & Gamification | Name, Type (`CSR Activity` / `Challenge`), Status |
| **Emission Factor** | CO₂e conversion values for carbon calculations | Name, Source Type, Unit, Factor Value, Scope (1/2/3), Status |
| **Product ESG Profile** | ESG metadata linked to products | Product, Carbon Intensity, Recyclability, Certifications |
| **Environmental Goal** | Sustainability reduction targets | Title, Department, Metric, Baseline, Target, Deadline, Status |
| **ESG Policy** | Governance policy documents | Title, Version, Category, Content, Effective Date, Status |
| **Badge** | Employee achievement definitions | Name, Description, Unlock Rule, Icon |
| **Reward** | Redeemable incentive catalog | Name, Description, Points Required, Stock, Status |

### 6.2 Transactional Data

| Model | Purpose | Key Fields |
|---|---|---|
| **Carbon Transaction** | Calculated emissions from ERP operations | Department, Source Type, Source Reference, Emission Factor, Quantity, CO₂e Value, Date, Auto-calculated Flag |
| **CSR Activity** | Social initiatives organized by the company | Title, Category, Description, Department, Date, Location, Max Participants, Status |
| **Employee Participation** | Employee involvement in CSR Activities | Employee, Activity, Proof (file), Approval Status, Points Earned, Completion Date |
| **Challenge** | Sustainability challenges | Title, Category, Description, XP, Difficulty, Evidence Required, Deadline, Status (`Draft` / `Active` / `Under Review` / `Completed` / `Archived`) |
| **Challenge Participation** | Employee progress within challenges | Challenge, Employee, Progress (%), Proof (file), Approval Status, XP Awarded |
| **Policy Acknowledgement** | Employee policy acceptance | Employee, Policy, Acknowledged At, IP Address |
| **Audit** | Governance audit records | Title, Department, Auditor, Scheduled Date, Status, Findings Summary |
| **Compliance Issue** | Governance violations | Audit, Severity (`Low`/`Medium`/`High`/`Critical`), Description, Owner, Due Date, Status (`Open`/`In Progress`/`Resolved`/`Closed`) |
| **Department Score** | Aggregated ESG performance | Department, Environmental Score, Social Score, Governance Score, Total Score, Period |

---

## 7. Business Workflow

```
Master Configuration
  ├── Departments, Categories, Emission Factors
  ├── Product ESG Profiles, Environmental Goals
  └── Policies, Badges, Rewards, Challenges
          │
          ▼
  Daily ERP Operations
  (Purchase · Manufacturing · Expenses · Fleet)
          │
          ▼
  Carbon Transactions (auto or manual)
          │
          ▼
  Employee Activities
  ├── CSR Participation → Approval → Points
  ├── Challenge Participation → Approval → XP
  ├── Policy Acknowledgements
  └── Audits → Compliance Issues
          │
          ▼
  Score Calculation
  ├── Environmental Score (per department)
  ├── Social Score (per department)
  └── Governance Score (per department)
          │
          ▼
  Department Total Score
          │
          ▼
  Organization ESG Score
  (weighted average: E 40% · S 30% · G 30%, configurable)
          │
          ▼
  Dashboard & Reports
```

---

## 8. Scoring Logic

### 8.1 Department Score

Each department receives three sub-scores (0–100):

| Dimension | Inputs |
|---|---|
| **Environmental** | Carbon reduction vs. goal, emissions trend, product ESG profile completeness |
| **Social** | CSR participation rate, diversity metrics, training completion |
| **Governance** | Policy acknowledgement rate, open compliance issues, audit completion |

**Department Total** = (Environmental × E_weight) + (Social × S_weight) + (Governance × G_weight)

### 8.2 Organization ESG Score

**Org Score** = Weighted average of all Department Total Scores (weighted by employee count).

Default weights: **Environmental 40% / Social 30% / Governance 30%** — configurable per organization in Settings → ESG Configuration.

---

## 9. Core Business Rules

These are mandatory, in-scope requirements:

| Rule | Behavior |
|---|---|
| **Reward Redemption** | Employees redeem earned Points/XP for catalog Rewards. Redemption deducts points and decrements stock. Cannot redeem if insufficient points or zero stock. |
| **Notification System** | In-app and/or email notifications for: new compliance issue, CSR/Challenge approval decisions, policy acknowledgement reminders, badge unlocks, overdue compliance issues. Configurable in Settings → Notification Settings. |
| **Auto Emission Calculation** | When enabled (Settings toggle), Carbon Transactions are auto-generated from linked Purchase/Manufacturing/Expense/Fleet records using the relevant Emission Factor. |
| **Evidence Requirement** | When enabled (Settings toggle), CSR Activity participation cannot be approved without an attached proof file. |
| **Badge Auto-Award** | When enabled (Settings toggle), Badges are automatically assigned the moment an employee's XP, completed-challenge count, or other metric satisfies the Badge's Unlock Rule. |
| **Compliance Issue Ownership** | Every Compliance Issue must have an assigned Owner and Due Date. Issues past Due Date while still Open are auto-flagged and trigger notifications. |

---

## 10. Reports

### 10.1 Standard Reports

| Report | Contents |
|---|---|
| Environmental Report | Emissions by department, source, scope; trend analysis; goal progress |
| Social Report | CSR participation, diversity breakdown, training status |
| Governance Report | Policy compliance, audit results, open issues |
| ESG Summary Report | Combined scorecard across all three dimensions |

### 10.2 Custom Report Builder

Users can build ad-hoc reports by combining filters and export in **PDF / Excel / CSV**:

| Filter | Options |
|---|---|
| Department | Single / multiple selection |
| Date Range | Start date – End date |
| Module | Environmental / Social / Governance |
| Employee | Single / multiple selection |
| Challenge | Single / multiple selection |
| ESG Category | Single / multiple selection |

---

## 11. Non-Functional Requirements

| Requirement | Target |
|---|---|
| **Performance** | Dashboard loads in < 3 seconds; report generation < 10 seconds |
| **Responsiveness** | Mobile-responsive interface across all modules |
| **Security** | Role-based access control; audit trail for all data modifications |
| **Scalability** | Support organizations with 500+ employees and 50+ departments |
| **Data Integrity** | All financial and emission calculations maintain decimal precision |
| **Accessibility** | WCAG 2.1 AA compliance |

---

## 12. Bonus / Future Scope

| Feature | Description |
|---|---|
| Department ESG Rankings | Public leaderboard of departments by ESG score |
| Smart Dashboard Visualizations | AI-driven anomaly detection and trend predictions |
| Mobile App | Native mobile experience for employee participation and challenges |
| External API | Expose ESG scores and reports for third-party integrations |
| Carbon Offset Marketplace | Let departments purchase verified carbon offsets |

---

## 13. Glossary

| Term | Definition |
|---|---|
| **ESG** | Environmental, Social & Governance — a framework for measuring sustainability |
| **CO₂e** | Carbon dioxide equivalent — a standard unit for measuring greenhouse gas emissions |
| **Scope 1** | Direct emissions from owned or controlled sources |
| **Scope 2** | Indirect emissions from purchased electricity, steam, heating, cooling |
| **Scope 3** | All other indirect emissions in the value chain |
| **XP** | Experience points earned through challenge and activity completion |
| **CSR** | Corporate Social Responsibility |
| **ERP** | Enterprise Resource Planning — the operational system EcoSphere integrates with |
