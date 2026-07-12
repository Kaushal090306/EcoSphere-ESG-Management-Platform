"use client";

import { Shield, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from "recharts";

const govChartData = [
  { category: "Anti-Bribery", compliance: 100 },
  { category: "Environmental", compliance: 95 },
  { category: "Whistleblower", compliance: 85 },
  { category: "Privacy", compliance: 90 },
];

export default function GovernanceOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Governance Overview</h1>
        <p className="text-muted-foreground">
          Track and manage your policy audits, compliance logs, and risk controls
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Policy Compliance"
          value="94%"
          subtitle="employees acknowledged"
          icon={CheckCircle2}
          trend={{ value: 2.1, label: "vs last quarter" }}
          color="blue"
        />
        <StatCard
          title="Active Policies"
          value="12"
          subtitle="published procedures"
          icon={FileText}
          trend={{ value: 0, label: "no change" }}
          color="blue"
        />
        <StatCard
          title="Compliance Audits"
          value="8"
          subtitle="scheduled and completed"
          icon={Shield}
          trend={{ value: 14.3, label: "vs last year" }}
          color="blue"
        />
        <StatCard
          title="Open Issues"
          value="2"
          subtitle="active risk alerts"
          icon={AlertTriangle}
          trend={{ value: -50.0, label: "vs last month" }}
          color="red"
        />
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Compliance Rate by Category</CardTitle>
          <CardDescription>Percentage of employee training and acknowledgement completions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={govChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2D38" vertical={false} />
              <XAxis dataKey="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#181922", border: "1px solid #2A2D38", borderRadius: "12px", color: "#09090b" }}
              />
              <Bar dataKey="compliance" radius={[4, 4, 0, 0]} barSize={35}>
                {govChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#3b82f6" : "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
