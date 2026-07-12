"use client";

import { Users, HandHeart, Award, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from "recharts";

const socialTrendData = [
  { department: "Engineering", participation: 85 },
  { department: "Operations", participation: 68 },
  { department: "Marketing", participation: 92 },
  { department: "HR", participation: 95 },
  { department: "Finance", participation: 60 },
];

export default function SocialOverviewPage() {
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
          value="187"
          subtitle="employees active this quarter"
          icon={Users}
          trend={{ value: 8.3, label: "vs last month" }}
          color="teal"
        />
        <StatCard
          title="CSR Activities"
          value="14"
          subtitle="open events organized"
          icon={HandHeart}
          trend={{ value: 12.5, label: "vs last year" }}
          color="teal"
        />
        <StatCard
          title="Training Progress"
          value="88%"
          subtitle="overall compliance rate"
          icon={BookOpen}
          trend={{ value: 4.2, label: "vs last quarter" }}
          color="blue"
        />
        <StatCard
          title="Diversity Score"
          value="78.2"
          subtitle="weighted department score"
          icon={Award}
          trend={{ value: 1.5, label: "vs last month" }}
          color="orange"
        />
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Department CSR Participation Rate</CardTitle>
          <CardDescription>Percentage of active employees participating in CSR events</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={socialTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2D38" vertical={false} />
              <XAxis dataKey="department" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #2A2D38", borderRadius: "12px", color: "#09090b" }}
              />
              <Bar dataKey="participation" radius={[4, 4, 0, 0]} barSize={35}>
                {socialTrendData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#14b8a6" : "#7C3AED"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
