"use client";

import { Trophy, Award, Flame, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from "recharts";

const gamificationTrendData = [
  { name: "Green Champion", completedCount: 45 },
  { name: "Office Energy Saver", completedCount: 30 },
  { name: "Commute Master", completedCount: 22 },
  { name: "Zero Waste Hero", completedCount: 15 },
];

export default function GamificationOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Gamification Overview</h1>
        <p className="text-muted-foreground">
          Encourage employee sustainability participation with rewards, points, and challenges
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Challenges"
          value="12"
          subtitle="live team challenges"
          icon={Flame}
          trend={{ value: 20.0, label: "vs last month" }}
          color="orange"
        />
        <StatCard
          title="Badges Awarded"
          value="142"
          subtitle="milestones unlocked"
          icon={Award}
          trend={{ value: 15.4, label: "vs last year" }}
          color="orange"
        />
        <StatCard
          title="Points Distributed"
          value="15,400"
          subtitle="XP earned by employees"
          icon={Trophy}
          trend={{ value: 8.7, label: "vs last month" }}
          color="orange"
        />
        <StatCard
          title="Active Competitors"
          value="84%"
          subtitle="of total staff active"
          icon={Users}
          trend={{ value: 2.1, label: "vs last quarter" }}
          color="teal"
        />
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Challenges</CardTitle>
          <CardDescription>Number of employees who successfully unlocked these challenges</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={gamificationTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2D38" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#181922", border: "1px solid #2A2D38", borderRadius: "12px", color: "#ffffff" }}
              />
              <Bar dataKey="completedCount" radius={[4, 4, 0, 0]} barSize={35}>
                {gamificationTrendData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#f59e0b" : "#9B5CF6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
