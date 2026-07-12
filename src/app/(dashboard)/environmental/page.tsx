"use client";

import { TrendingDown, TrendingUp, Leaf, Zap, Droplet, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from "recharts";

const envTrendData = [
  { month: "Jan", emissions: 1500, energy: 3100 },
  { month: "Feb", emissions: 1450, energy: 3000 },
  { month: "Mar", emissions: 1400, energy: 2900 },
  { month: "Apr", emissions: 1350, energy: 2800 },
  { month: "May", emissions: 1300, energy: 2700 },
  { month: "Jun", emissions: 1245, energy: 2450 },
];

export default function EnvironmentalOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Environment Overview</h1>
        <p className="text-muted-foreground">
          Track and manage your environmental impact
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Emissions"
          value="1,245.6"
          subtitle="tCO₂e from last month"
          icon={Leaf}
          trend={{ value: -12.4, label: "vs last month" }}
          color="green"
        />
        <StatCard
          title="Energy Consumption"
          value="2,450.8"
          subtitle="MWh from last month"
          icon={Zap}
          trend={{ value: -8.7, label: "vs last month" }}
          color="green"
        />
        <StatCard
          title="Water Usage"
          value="8,320.5"
          subtitle="m³ from last month"
          icon={Droplet}
          trend={{ value: 3.2, label: "vs last month" }}
          color="blue"
        />
        <StatCard
          title="Waste Generated"
          value="245.6"
          subtitle="tons from last month"
          icon={Trash2}
          trend={{ value: -15.6, label: "vs last month" }}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Carbon Emissions Trend</CardTitle>
            <CardDescription>Monthly CO₂e emission reductions (tonnes)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={envTrendData}>
                <defs>
                  <linearGradient id="emissionsGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2D38" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#181922", border: "1px solid #2A2D38", borderRadius: "12px", color: "#ffffff" }}
                />
                <Area type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={2} fill="url(#emissionsGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Usage Trend</CardTitle>
            <CardDescription>Electricity consumption details (MWh)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={envTrendData}>
                <defs>
                  <linearGradient id="energyGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9B5CF6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#9B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2D38" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#181922", border: "1px solid #2A2D38", borderRadius: "12px", color: "#ffffff" }}
                />
                <Area type="monotone" dataKey="energy" stroke="#9B5CF6" strokeWidth={2} fill="url(#energyGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
