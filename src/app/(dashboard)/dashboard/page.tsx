"use client";

import { useState, useEffect } from "react";
import {
  Leaf,
  Users,
  ShieldCheck,
  Shield,
  Calendar,
  Download,
  MoreVertical,
  CheckCircle2,
  ChevronDown,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getDashboardData, type DashboardData } from "@/actions/dashboard";
import { toast } from "sonner";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 Months");

  useEffect(() => {
    async function loadData() {
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast.error("Could not fetch database records.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDownloadReport = () => {
    if (!data) return;
    const reportText = `EcoSphere ESG Performance Summary Report
Generated on: ${new Date().toLocaleDateString()}
Organization: GreenTech Solutions

SUMMARY SCORES:
- Overall ESG Score: ${data.scores.overall}/100 (${data.scores.overallTrend >= 0 ? "+" : ""}${data.scores.overallTrend}% vs last month)
- Environment Score: ${data.scores.environment}/100 (${data.scores.environmentTrend >= 0 ? "+" : ""}${data.scores.environmentTrend}% vs last month)
- Social Score: ${data.scores.social}/100 (${data.scores.socialTrend >= 0 ? "+" : ""}${data.scores.socialTrend}% vs last month)
- Governance Score: ${data.scores.governance}/100 (${data.scores.governanceTrend >= 0 ? "+" : ""}${data.scores.governanceTrend}% vs last month)

TOP PERFORMING DEPARTMENTS:
${data.topDepartments.map((d, i) => `${i + 1}. ${d.name}: ${d.score}/100`).join("\n")}

PENDING TASKS:
${data.pendingTasks.map((t, i) => `${i + 1}. [ ] ${t.title} (${t.dueDate})`).join("\n")}
`;
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ESG-Report-GreenTech-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("ESG Report downloaded successfully!");
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-120px)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#09090b] border-t-transparent" />
          <span className="text-sm text-[#71717a] font-medium animate-pulse">
            Loading live database records...
          </span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-[calc(100vh-120px)] w-full items-center justify-center">
        <span className="text-[#71717a]">Failed to load dashboard data. Check database.</span>
      </div>
    );
  }

  const makeSparklineData = (sparkline: number[]) =>
    sparkline.map((val, idx) => ({ id: idx, val }));

  const pieData = [
    { name: "Environment", value: data.distribution.environment.score, color: "#16a34a" },
    { name: "Social", value: data.distribution.social.score, color: "#d97706" },
    { name: "Governance", value: data.distribution.governance.score, color: "#2563eb" },
  ];

  // KPI card config
  const kpiCards = [
    {
      label: "Overall ESG Score",
      value: data.scores.overall,
      trend: data.scores.overallTrend,
      sparkline: data.scores.overallSparkline,
      icon: Shield,
      color: "#09090b",
      sparkColor: "#09090b",
      gradientId: "g-overall",
    },
    {
      label: "Environment Score",
      value: data.scores.environment,
      trend: data.scores.environmentTrend,
      sparkline: data.scores.environmentSparkline,
      icon: Leaf,
      color: "#16a34a",
      sparkColor: "#16a34a",
      gradientId: "g-env",
    },
    {
      label: "Social Score",
      value: data.scores.social,
      trend: data.scores.socialTrend,
      sparkline: data.scores.socialSparkline,
      icon: Users,
      color: "#d97706",
      sparkColor: "#d97706",
      gradientId: "g-social",
    },
    {
      label: "Governance Score",
      value: data.scores.governance,
      trend: data.scores.governanceTrend,
      sparkline: data.scores.governanceSparkline,
      icon: ShieldCheck,
      color: "#2563eb",
      sparkColor: "#2563eb",
      gradientId: "g-gov",
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs text-[#71717a] font-semibold uppercase tracking-wider mb-1">
            Welcome back, {data.user.name.split(" ")[0]} 👋
          </p>
          <h1 className="text-[32px] font-bold tracking-tight text-[#09090b] leading-tight">
            ESG Overview
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 h-10 rounded-[14px] bg-[#09090b] text-white text-sm font-medium hover:bg-[#18181b] transition-all border border-[#09090b] cursor-pointer shadow-none"
          >
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </Button>

          <Button
            variant="ghost"
            className="flex items-center gap-2 px-4 py-2 h-10 rounded-[14px] bg-white border border-[#ececee] text-sm text-[#52525b] font-medium hover:bg-[#f4f4f5] hover:border-[#d4d4d8] transition-all cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-[#52525b]" />
            <span>Oct 1 – Oct 31, 2024</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#a1a1aa]" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const isPositive = card.trend >= 0;
          return (
            <div
              key={card.label}
              className="bg-white border border-[#ececee] rounded-[28px] p-6 relative overflow-hidden hover:border-[#d4d4d8] hover:shadow-[rgba(0,0,0,0.04)_0px_4px_12px_0px] transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-[11px] text-[#71717a] uppercase font-bold tracking-wider">
                  {card.label}
                </p>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-[12px] border border-[#ececee]"
                  style={{ backgroundColor: `${card.color}10` }}
                >
                  <Icon className="h-4 w-4" style={{ color: card.color }} />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-[40px] font-bold text-[#09090b] leading-none">
                  {card.value}
                </span>
                <span className="text-sm text-[#a1a1aa]">/100</span>
              </div>

              <div className="flex items-center gap-1.5 mt-2">
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 text-[#16a34a]" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                )}
                <span
                  className={`text-xs font-semibold ${isPositive ? "text-[#16a34a]" : "text-red-500"}`}
                >
                  {isPositive ? "+" : ""}{card.trend}%
                </span>
                <span className="text-xs text-[#a1a1aa]">from last month</span>
              </div>

              {/* Sparkline */}
              <div className="absolute bottom-0 left-0 right-0 h-12 w-full overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={makeSparklineData(card.sparkline)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={card.gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={card.sparkColor} stopOpacity={0.12} />
                        <stop offset="100%" stopColor={card.sparkColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="val"
                      stroke={card.sparkColor}
                      strokeWidth={1.5}
                      fill={`url(#${card.gradientId})`}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-7">
        {/* Line Chart */}
        <div className="lg:col-span-4 bg-white border border-[#ececee] rounded-[28px] p-6 hover:border-[#d4d4d8] transition-all">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-[#09090b]">ESG Score Trend</h3>
              <div className="flex flex-wrap gap-4 text-xs mt-2.5">
                {[
                  { label: "Overall", color: "#09090b" },
                  { label: "Environment", color: "#16a34a" },
                  { label: "Social", color: "#d97706" },
                  { label: "Governance", color: "#2563eb" },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[#71717a]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-1.5 h-8 rounded-[10px] bg-[#f4f4f5] border border-[#ececee] text-xs font-medium text-[#52525b] hover:bg-white hover:border-[#d4d4d8] transition-all"
                  >
                    <span>{selectedPeriod}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-[#a1a1aa]" />
                  </Button>
                }
              />
              <DropdownMenuContent className="bg-white border-[#ececee] shadow-md rounded-[12px] text-[#09090b]">
                <DropdownMenuItem onClick={() => setSelectedPeriod("Last 6 Months")} className="text-xs focus:bg-[#f4f4f5] rounded-lg">Last 6 Months</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPeriod("Last Year")} className="text-xs focus:bg-[#f4f4f5] rounded-lg">Last Year</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ececee" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#d4d4d8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: "#71717a" }}
                />
                <YAxis
                  stroke="#d4d4d8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickMargin={10}
                  tick={{ fill: "#71717a" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #ececee",
                    borderRadius: "12px",
                    color: "#09090b",
                    fontSize: "12px",
                    boxShadow: "rgba(0,0,0,0.04) 0px 4px 12px 0px",
                  }}
                  itemStyle={{ padding: "1px 0", color: "#52525b" }}
                />
                <Line type="monotone" dataKey="overall" stroke="#09090b" strokeWidth={2} dot={{ r: 3, strokeWidth: 1.5, fill: "#ffffff" }} activeDot={{ r: 4 }} name="Overall" />
                <Line type="monotone" dataKey="environment" stroke="#16a34a" strokeWidth={2} dot={{ r: 3, strokeWidth: 1.5, fill: "#ffffff" }} activeDot={{ r: 4 }} name="Environment" />
                <Line type="monotone" dataKey="social" stroke="#d97706" strokeWidth={2} dot={{ r: 3, strokeWidth: 1.5, fill: "#ffffff" }} activeDot={{ r: 4 }} name="Social" />
                <Line type="monotone" dataKey="governance" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, strokeWidth: 1.5, fill: "#ffffff" }} activeDot={{ r: 4 }} name="Governance" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="lg:col-span-3 bg-white border border-[#ececee] rounded-[28px] p-6 flex flex-col hover:border-[#d4d4d8] transition-all">
          <h3 className="text-base font-bold text-[#09090b] mb-4">Score Distribution</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center my-auto py-2">
            <div className="relative w-full h-[180px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-[#09090b]">{data.scores.overall}</span>
                <span className="text-[9px] text-[#71717a] uppercase font-bold tracking-wider">Overall</span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Environment", color: "#16a34a", score: data.scores.environment, pct: data.distribution.environment.percentage },
                { label: "Social", color: "#d97706", score: data.scores.social, pct: data.distribution.social.percentage },
                { label: "Governance", color: "#2563eb", score: data.scores.governance, pct: data.distribution.governance.percentage },
              ].map(({ label, color, score, pct }) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[#52525b] font-medium">{label}</span>
                    </div>
                    <span className="text-[#09090b] font-bold">{score} <span className="text-[#a1a1aa] font-normal">({pct}%)</span></span>
                  </div>
                  <div className="w-full bg-[#f4f4f5] h-1.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Recent Activities */}
        <div className="bg-white border border-[#ececee] rounded-[28px] p-6 flex flex-col h-[400px] hover:border-[#d4d4d8] transition-all">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-[#09090b]">Recent Activities</h3>
            <Button
              variant="ghost"
              className="text-xs font-semibold text-[#52525b] hover:bg-[#f4f4f5] px-2.5 h-7 rounded-[10px] cursor-pointer border border-transparent hover:border-[#ececee] transition-all"
            >
              View All
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {data.recentActivities.map((act) => {
              const config =
                act.category === "Environment"
                  ? { icon: Leaf, bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" }
                  : act.category === "Social"
                  ? { icon: Users, bg: "#fffbeb", color: "#d97706", border: "#fde68a" }
                  : act.category === "Reports"
                  ? { icon: FileText, bg: "#f4f4f5", color: "#52525b", border: "#ececee" }
                  : { icon: ShieldCheck, bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" };

              return (
                <div key={act.id} className="flex items-center gap-3 justify-between p-3 rounded-[14px] hover:bg-[#f4f4f5] transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border"
                      style={{ backgroundColor: config.bg, borderColor: config.border }}
                    >
                      <config.icon className="h-4 w-4" style={{ color: config.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#09090b] truncate leading-snug">
                        {act.title}
                      </p>
                      <p className="text-xs text-[#71717a] mt-0.5">
                        {act.category} · {act.time}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 rounded-lg text-[#a1a1aa] hover:text-[#52525b] opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performing Departments */}
        <div className="bg-white border border-[#ececee] rounded-[28px] p-6 flex flex-col h-[400px] hover:border-[#d4d4d8] transition-all">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-[#09090b]">Top Departments</h3>
            <Button
              variant="ghost"
              className="text-xs font-semibold text-[#52525b] hover:bg-[#f4f4f5] px-2.5 h-7 rounded-[10px] cursor-pointer border border-transparent hover:border-[#ececee] transition-all"
            >
              View All
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            {data.topDepartments.map((dept, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#09090b]">{dept.name}</span>
                  <span className="font-bold text-[#52525b] text-xs">{dept.score}/100</span>
                </div>
                <div className="w-full bg-[#f4f4f5] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#09090b] transition-all duration-500"
                    style={{ width: `${dept.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white border border-[#ececee] rounded-[28px] p-6 flex flex-col h-[400px] hover:border-[#d4d4d8] transition-all">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-[#09090b]">Pending Tasks</h3>
            <Button
              variant="ghost"
              className="text-xs font-semibold text-[#52525b] hover:bg-[#f4f4f5] px-2.5 h-7 rounded-[10px] cursor-pointer border border-transparent hover:border-[#ececee] transition-all"
            >
              View All
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {data.pendingTasks.map((task) => {
              const catStyle =
                task.category === "Environment"
                  ? { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" }
                  : task.category === "Social"
                  ? { bg: "#fffbeb", text: "#d97706", border: "#fde68a" }
                  : { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" };

              return (
                <div
                  key={task.id}
                  className="flex items-start gap-3 py-3 border-b border-[#f4f4f5] last:border-0 group hover:bg-[#fafafa] rounded-[12px] px-2 transition-all"
                >
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-[#d4d4d8] mt-0.5 hover:text-[#09090b] transition-colors cursor-pointer" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#09090b] leading-snug">
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <Badge
                        variant="outline"
                        className="text-[9px] px-2 py-0 rounded-[8px] font-semibold border"
                        style={{
                          backgroundColor: catStyle.bg,
                          color: catStyle.text,
                          borderColor: catStyle.border,
                        }}
                      >
                        {task.category}
                      </Badge>
                      <span className="text-[10px] text-[#a1a1aa]">{task.dueDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
