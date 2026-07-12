"use client";

import {
  Leaf,
  Users,
  ShieldCheck,
  Trophy,
  TrendingDown,
  Activity,
  Target,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { ScoreCard } from "@/components/dashboard/score-card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

// Sample data for charts
const emissionsData = [
  { month: "Jan", emissions: 4200 },
  { month: "Feb", emissions: 3800 },
  { month: "Mar", emissions: 3600 },
  { month: "Apr", emissions: 3900 },
  { month: "May", emissions: 3400 },
  { month: "Jun", emissions: 3100 },
  { month: "Jul", emissions: 2900 },
  { month: "Aug", emissions: 2700 },
  { month: "Sep", emissions: 2500 },
  { month: "Oct", emissions: 2300 },
  { month: "Nov", emissions: 2100 },
  { month: "Dec", emissions: 1900 },
];

const departmentScores = [
  { name: "Engineering", score: 82, color: "#10b981" },
  { name: "Operations", score: 71, color: "#14b8a6" },
  { name: "Marketing", score: 88, color: "#10b981" },
  { name: "HR", score: 91, color: "#10b981" },
  { name: "Finance", score: 67, color: "#f59e0b" },
];

const recentActivities = [
  {
    id: 1,
    action: "Carbon emissions calculated",
    department: "Operations",
    time: "2 hours ago",
    type: "environmental",
  },
  {
    id: 2,
    action: "CSR Activity completed",
    department: "Engineering",
    time: "4 hours ago",
    type: "social",
  },
  {
    id: 3,
    action: "Policy acknowledged",
    department: "Marketing",
    time: "5 hours ago",
    type: "governance",
  },
  {
    id: 4,
    action: "Badge earned: Green Champion",
    department: "HR",
    time: "1 day ago",
    type: "gamification",
  },
  {
    id: 5,
    action: "Compliance issue resolved",
    department: "Finance",
    time: "1 day ago",
    type: "governance",
  },
];

const activityTypeColors: Record<string, string> = {
  environmental: "bg-eco-green/10 text-eco-green border-eco-green/20",
  social: "bg-eco-teal/10 text-eco-teal border-eco-teal/20",
  governance: "bg-eco-blue/10 text-eco-blue border-eco-blue/20",
  gamification: "bg-eco-orange/10 text-eco-orange border-eco-orange/20",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ESG Dashboard</h1>
        <p className="text-muted-foreground">
          Organization-wide sustainability overview
        </p>
      </div>

      {/* ESG Score Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreCard title="Environmental" score={76} color="green" />
        <ScoreCard title="Social" score={82} color="teal" />
        <ScoreCard title="Governance" score={89} color="blue" />
        <ScoreCard title="Overall ESG" score={81} color="orange" size="sm" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Emissions"
          value="2,340"
          subtitle="tonnes CO₂e this year"
          icon={TrendingDown}
          trend={{ value: -12.5, label: "vs last year" }}
          color="green"
        />
        <StatCard
          title="Active Participants"
          value="187"
          subtitle="in CSR & challenges"
          icon={Users}
          trend={{ value: 8.3, label: "vs last month" }}
          color="teal"
        />
        <StatCard
          title="Policy Compliance"
          value="94%"
          subtitle="acknowledgement rate"
          icon={ShieldCheck}
          trend={{ value: 2.1, label: "vs last quarter" }}
          color="blue"
        />
        <StatCard
          title="Active Challenges"
          value="12"
          subtitle="across all departments"
          icon={Trophy}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Emissions Trend */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-eco-green" />
              Carbon Emissions Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={emissionsData}>
                <defs>
                  <linearGradient id="emissionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9B5CF6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#9B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2A2D38"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#181922",
                    border: "1px solid #2A2D38",
                    borderRadius: "12px",
                    color: "#ffffff",
                  }}
                  formatter={(value) => [`${Number(value).toLocaleString()} t`, "CO₂e"]}
                />
                <Area
                  type="monotone"
                  dataKey="emissions"
                  stroke="#9B5CF6"
                  strokeWidth={2}
                  fill="url(#emissionGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Scores */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-eco-teal" />
              Department ESG Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentScores} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2A2D38"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#181922",
                    border: "1px solid #2A2D38",
                    borderRadius: "12px",
                    color: "#ffffff",
                  }}
                  formatter={(value) => [`${value}/100`, "Score"]}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                  {departmentScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-lg p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.department}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={activityTypeColors[activity.type]}
                    >
                      {activity.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats / Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-eco-orange" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-lg border border-eco-red/20 bg-eco-red/5 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-eco-red animate-pulse" />
                  <p className="text-sm font-medium">2 Overdue Compliance Issues</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Finance dept — Anti-bribery policy audit finding
                </p>
              </div>
              <div className="rounded-lg border border-eco-orange/20 bg-eco-orange/5 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-eco-orange" />
                  <p className="text-sm font-medium">5 Pending Policy Acknowledgements</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Environmental Policy v2.1 — 5 employees pending
                </p>
              </div>
              <div className="rounded-lg border border-eco-teal/20 bg-eco-teal/5 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-eco-teal" />
                  <p className="text-sm font-medium">3 CSR Participations Awaiting Approval</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tree Planting Drive — submitted 2 days ago
                </p>
              </div>
              <div className="rounded-lg border border-eco-green/20 bg-eco-green/5 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-eco-green" />
                  <p className="text-sm font-medium">Environmental Goal Near Target</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Scope 2 reduction at 92% — 8% remaining by Q4
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
