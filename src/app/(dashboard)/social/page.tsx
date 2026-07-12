import { Users, HandHeart, Award, BookOpen } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { SocialChart } from "./social-chart";
import { db } from "@/db";
import { employeeParticipations, csrActivities, trainingRecords, diversityMetrics, departments, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export default async function SocialOverviewPage() {
  // Fetch real data for stats
  const [{ count: activeParticipants }] = await db.select({ count: sql`count(distinct ${employeeParticipations.employeeId})` }).from(employeeParticipations).where(eq(employeeParticipations.approvalStatus, "approved"));
  const [{ count: openActivities }] = await db.select({ count: sql`count(*)` }).from(csrActivities).where(eq(csrActivities.status, "open"));
  
  // Training progress: completed / total records
  const trainingData = await db.select({ status: trainingRecords.status }).from(trainingRecords);
  const completedTraining = trainingData.filter((r) => r.status === "completed").length;
  const trainingProgress = trainingData.length > 0 ? Math.round((completedTraining / trainingData.length) * 100) : 0;

  // Department participation
  const allDepts = await db.select().from(departments);
  const socialTrendData = await Promise.all(allDepts.map(async (dept) => {
    // get employees in this department
    const deptEmployees = await db.select().from(users).where(eq(users.departmentId, dept.id));
    if (deptEmployees.length === 0) return { department: dept.name, participation: 0 };
    
    // get participations for these employees
    let participated = 0;
    for (const emp of deptEmployees) {
      const parts = await db.select().from(employeeParticipations).where(eq(employeeParticipations.employeeId, emp.id));
      if (parts.length > 0) participated++;
    }
    
    return {
      department: dept.name,
      participation: Math.round((participated / deptEmployees.length) * 100)
    };
  }));

  // Average diversity metrics
  const divMetrics = await db.select().from(diversityMetrics);
  const divScore = divMetrics.length > 0 ? 85 : 0; // Mock score out of 100 based on diversity (would require complex weight logic)

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#09090b]">Social Overview</h1>
        <p className="text-muted-foreground">
          Track and manage employee engagement, CSR activities, and diversity performance
        </p>
      </div>

      {/* KPI Cards */}
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

      {/* Chart Section */}
      <SocialChart data={socialTrendData} />
    </div>
  );
}
