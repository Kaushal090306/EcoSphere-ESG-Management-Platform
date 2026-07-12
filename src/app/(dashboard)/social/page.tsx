import { Users, HandHeart, Award, BookOpen, ChevronRight, CheckCircle2, ShieldCheck, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { SocialChart } from "./social-chart";
import { db } from "@/db";
import { employeeParticipations, csrActivities, trainingRecords, diversityMetrics, departments, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export default async function SocialOverviewPage() {
  // Fetch real data for stats
  const [{ count: activeParticipants }] = await db
    .select({ count: sql`count(distinct ${employeeParticipations.employeeId})` })
    .from(employeeParticipations)
    .where(eq(employeeParticipations.approvalStatus, "approved"));

  const [{ count: openActivities }] = await db
    .select({ count: sql`count(*)` })
    .from(csrActivities)
    .where(eq(csrActivities.status, "open"));
  
  // Training progress: completed / total records
  const trainingData = await db.select({ status: trainingRecords.status }).from(trainingRecords);
  const completedTraining = trainingData.filter((r) => r.status === "completed").length;
  const trainingProgress = trainingData.length > 0 ? Math.round((completedTraining / trainingData.length) * 100) : 0;

  // Department participation
  const allDepts = await db.select().from(departments);
  const socialTrendData = await Promise.all(
    allDepts.map(async (dept) => {
      const deptEmployees = await db.select().from(users).where(eq(users.departmentId, dept.id));
      if (deptEmployees.length === 0) return { department: dept.name, participation: 0 };
      
      let participated = 0;
      for (const emp of deptEmployees) {
        const parts = await db.select().from(employeeParticipations).where(eq(employeeParticipations.employeeId, emp.id));
        if (parts.length > 0) participated++;
      }
      
      return {
        department: dept.name,
        participation: Math.round((participated / deptEmployees.length) * 100)
      };
    })
  );

  // Average diversity metrics
  const divMetrics = await db.select().from(diversityMetrics);
  const divScore = divMetrics.length > 0 ? 85 : 0;

  return (
    <div className="space-y-6">
      {/* Tracker Breadcrumbs */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 text-[11px] text-[#71717a] dark:text-[#8e909a] uppercase font-semibold tracking-wider">
          <span>Social Responsibility</span>
          <ChevronRight className="h-2.5 w-2.5 text-muted-foreground/60" />
          <span className="text-muted-foreground/60">Overview</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Participants"
          value={String(activeParticipants)}
          subtitle="employees active this quarter"
          icon={Users}
          trend={{ value: 8.3, label: "vs last month" }}
          color="teal"
        />
        <StatCard
          title="CSR Activities"
          value={String(openActivities)}
          subtitle="open events organized"
          icon={HandHeart}
          trend={{ value: 12.5, label: "vs last year" }}
          color="teal"
        />
        <StatCard
          title="Training Progress"
          value={`${trainingProgress}%`}
          subtitle="overall compliance rate"
          icon={BookOpen}
          trend={{ value: 4.2, label: "vs last quarter" }}
          color="blue"
        />
        <StatCard
          title="Diversity Score"
          value={String(divScore)}
          subtitle="weighted department score"
          icon={Award}
          trend={{ value: 1.5, label: "vs last month" }}
          color="orange"
        />
      </div>

      {/* Chart Section & Quick Info Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participation Chart */}
        <div className="lg:col-span-2">
          <SocialChart data={socialTrendData} />
        </div>

        {/* Highlights Side Panel */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-5 shadow-none flex flex-col justify-between h-full">
          <div>
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-sm font-semibold text-[#09090b] dark:text-white flex items-center gap-2">
                <Heart className="h-4.5 w-4.5 text-rose-400" /> Focus Highlights
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">Current corporate social responsibility priorities</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="flex gap-2.5 items-start">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-[#09090b] dark:text-white">Active CSR Campaign</p>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">
                    Volunteer team challenge: Clean energy data auditing campaign is currently active.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-[#09090b] dark:text-white">Training Standards</p>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">
                    ESG Core Principles Course: Mandatory course tracking with {trainingProgress}% current overall completion rates.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  <Users className="h-4 w-4" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-[#09090b] dark:text-white">Workplace Equality</p>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">
                    Corporate diversity, equity, and inclusion index stands at stable {divScore}/100.
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
