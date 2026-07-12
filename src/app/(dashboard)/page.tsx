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
  ChevronRight,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  const [calendarPeriod, setCalendarPeriod] = useState("oct");

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

SUMMARY SCORES (${calendarPeriod.toUpperCase()}):
- Overall ESG Score: ${currentScores.overall}/100
- Environment Score: ${currentScores.environment}/100
- Social Score: ${currentScores.social}/100
- Governance Score: ${currentScores.governance}/100

TOP PERFORMING DEPARTMENTS:
${data.topDepartments.map((d, i) => `${i + 1}. ${d.name}: ${d.score}/100`).join("\n")}

PEND TASK DETAILS:
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
      <div className="flex h-[calc(100vh-120px)] w-full items-center justify-center bg-[#0f1016]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#9B5CF6] border-t-transparent" />
          <span className="text-sm text-gray-400 font-medium animate-pulse">Loading live database records...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-[calc(100vh-120px)] w-full items-center justify-center bg-[#0f1016]">
        <span className="text-gray-400">Failed to load dashboard data. Check database.</span>
      </div>
    );
  }

  // Derive interactive scale variables based on calendarPeriod
  const periodMultiplier = {
    oct: 1.0,
    sep: 0.96,
    aug: 0.91,
    last6: 1.05,
  }[calendarPeriod as "oct" | "sep" | "aug" | "last6"] || 1.0;

  const currentScores = {
    overall: Math.round(data.scores.overall * periodMultiplier * 10) / 10,
    overallTrend: data.scores.overallTrend,
    overallSparkline: data.scores.overallSparkline.map(v => v * periodMultiplier),
    environment: Math.round(data.scores.environment * periodMultiplier * 10) / 10,
    environmentTrend: data.scores.environmentTrend,
    environmentSparkline: data.scores.environmentSparkline.map(v => v * periodMultiplier),
    social: Math.round(data.scores.social * periodMultiplier * 10) / 10,
    socialTrend: data.scores.socialTrend,
    socialSparkline: data.scores.socialSparkline.map(v => v * periodMultiplier),
    governance: Math.round(data.scores.governance * periodMultiplier * 10) / 10,
    governanceTrend: data.scores.governanceTrend,
    governanceSparkline: data.scores.governanceSparkline.map(v => v * periodMultiplier),
  };

  const currentPieData = [
    { name: "Environment", value: currentScores.environment, color: "#10B981" },
    { name: "Social", value: currentScores.social, color: "#F59E0B" },
    { name: "Governance", value: currentScores.governance, color: "#3B82F6" },
  ];

  const currentTrendData = data.trend.map(d => ({
    ...d,
    overall: Math.round(d.overall * periodMultiplier * 10) / 10,
    environment: Math.round(d.environment * periodMultiplier * 10) / 10,
    social: Math.round(d.social * periodMultiplier * 10) / 10,
    governance: Math.round(d.governance * periodMultiplier * 10) / 10,
  }));

  const periodLabels: Record<string, string> = {
    oct: "Oct 1 – Oct 31, 2024",
    sep: "Sep 1 – Sep 30, 2024",
    aug: "Aug 1 – Aug 31, 2024",
    last6: "Last 6 Months",
  };

  const makeSparklineData = (sparkline: number[]) => {
    return sparkline.map((val, idx) => ({ id: idx, val }));
  };

  return (
    <div className="space-y-6 pb-8 bg-[#0f1016] min-h-screen text-white">
      {/* Top Welcome bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">
            <span>Dashboard</span>
            <ChevronRight className="h-2.5 w-2.5" />
            <span className="text-muted-foreground/60">Overview</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">
            Welcome back, {data.user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-xs text-muted-foreground">
            Track and manage your organization&apos;s overall ESG performance
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 py-1.5 h-8.5 rounded-xl bg-[#181922] border border-[#2d2f39] text-xs font-semibold text-muted-foreground hover:bg-[#201E2A] hover:text-white transition-all cursor-pointer"
                >
                  <Calendar className="h-4 w-4 text-[#9B5CF6]" />
                  <span>{periodLabels[calendarPeriod] || "Oct 1 – Oct 31, 2024"}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground/60" />
                </Button>
              }
            />
            <DropdownMenuContent className="bg-[#181922] border-[#2d2f39] text-white rounded-xl">
              <DropdownMenuItem onClick={() => setCalendarPeriod("oct")} className="text-xs focus:bg-[#2c2e3c] focus:text-white cursor-pointer">
                Oct 1 – Oct 31, 2024
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCalendarPeriod("sep")} className="text-xs focus:bg-[#2c2e3c] focus:text-white cursor-pointer">
                Sep 1 – Sep 30, 2024
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCalendarPeriod("aug")} className="text-xs focus:bg-[#2c2e3c] focus:text-white cursor-pointer">
                Aug 1 – Aug 31, 2024
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCalendarPeriod("last6")} className="text-xs focus:bg-[#2c2e3c] focus:text-white cursor-pointer">
                Last 6 Months
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            onClick={handleDownloadReport}
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs px-3 py-1.5 h-8.5 rounded-xl font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* KPI 1: Overall ESG */}
        <Card className="bg-[#181922] border border-[#2d2f39] rounded-[18px] overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
                <Shield className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#8e909a] font-medium block">Overall ESG Score</span>
                <h3 className="text-[26px] font-normal text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {currentScores.overall} <span className="text-[11px] text-[#8e909a] font-semibold">/100</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold pt-1">
                  {currentScores.overallTrend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{Math.abs(currentScores.overallTrend)}%</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={makeSparklineData(currentScores.overallSparkline)} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlowOverall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#7C3AED" strokeWidth={1.8} fill="url(#sparkGlowOverall)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 2: Environment */}
        <Card className="bg-[#181922] border border-[#2d2f39] rounded-[18px] overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Leaf className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#8e909a] font-medium block">Environment Score</span>
                <h3 className="text-[26px] font-normal text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {currentScores.environment} <span className="text-[11px] text-[#8e909a] font-semibold">/100</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold pt-1">
                  {currentScores.environmentTrend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{Math.abs(currentScores.environmentTrend)}%</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={makeSparklineData(currentScores.environmentSparkline)} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlowEnv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#7C3AED" strokeWidth={1.8} fill="url(#sparkGlowEnv)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 3: Social */}
        <Card className="bg-[#181922] border border-[#2d2f39] rounded-[18px] overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-[#F59E0B]">
                <Users className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#8e909a] font-medium block">Social Score</span>
                <h3 className="text-[26px] font-normal text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {currentScores.social} <span className="text-[11px] text-[#8e909a] font-semibold">/100</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold pt-1">
                  {currentScores.socialTrend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{Math.abs(currentScores.socialTrend)}%</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={makeSparklineData(currentScores.socialSparkline)} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlowSoc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#7C3AED" strokeWidth={1.8} fill="url(#sparkGlowSoc)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 4: Governance */}
        <Card className="bg-[#181922] border border-[#2d2f39] rounded-[18px] overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#8e909a] font-medium block">Governance Score</span>
                <h3 className="text-[26px] font-normal text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {currentScores.governance} <span className="text-[11px] text-[#8e909a] font-semibold">/100</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold pt-1">
                  {currentScores.governanceTrend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{Math.abs(currentScores.governanceTrend)}%</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={makeSparklineData(currentScores.governanceSparkline)} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlowGov" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#7C3AED" strokeWidth={1.8} fill="url(#sparkGlowGov)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Middle Section: Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        
        {/* Line Chart: ESG Score Trend */}
        <Card className="lg:col-span-4 bg-[#181922] border border-[#2d2f39] rounded-lg p-5 shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-white">ESG Score Trend</h4>
              
              {/* Time Filter Select */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-2.5 py-1 h-8 rounded-lg bg-[#0f1016] border border-[#2d2f39] text-[11px] text-muted-foreground hover:bg-[#1C1A24]"
                    >
                      <span>{selectedPeriod}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  }
                />
                <DropdownMenuContent className="bg-[#181922] border-[#2d2f39] text-white">
                  <DropdownMenuItem onClick={() => setSelectedPeriod("Last 6 Months")} className="text-xs focus:bg-[#221F2C]">Last 6 Months</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPeriod("Last Year")} className="text-xs focus:bg-[#221F2C]">Last Year</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-3 rounded-full bg-[#9B5CF6]" />
                <span>Overall</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-3 rounded-full bg-[#10B981]" />
                <span>Environment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-3 rounded-full bg-[#F59E0B]" />
                <span>Social</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-3 rounded-full bg-[#3B82F6]" />
                <span>Governance</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252731" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#4b5563"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#4b5563"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#181922",
                    border: "1px solid #2d2f39",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "11px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="overall"
                  stroke="#9B5CF6"
                  strokeWidth={2.2}
                  dot={{ stroke: '#9B5CF6', strokeWidth: 1.8, fill: '#181922', r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Overall"
                />
                <Line
                  type="monotone"
                  dataKey="environment"
                  stroke="#10B981"
                  strokeWidth={2.2}
                  dot={{ stroke: '#10B981', strokeWidth: 1.8, fill: '#181922', r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Environment"
                />
                <Line
                  type="monotone"
                  dataKey="social"
                  stroke="#F59E0B"
                  strokeWidth={2.2}
                  dot={{ stroke: '#F59E0B', strokeWidth: 1.8, fill: '#181922', r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Social"
                />
                <Line
                  type="monotone"
                  dataKey="governance"
                  stroke="#3B82F6"
                  strokeWidth={2.2}
                  dot={{ stroke: '#3B82F6', strokeWidth: 1.8, fill: '#181922', r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Governance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Donut Chart: Score Distribution */}
        <Card className="lg:col-span-3 bg-[#181922] border border-[#2d2f39] rounded-lg p-5 shadow-none flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">Score Distribution</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-center my-auto py-2">
            {/* Pie Container */}
            <div className="relative w-full h-[140px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {currentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Central Text */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-white leading-none">{currentScores.overall}</span>
                <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">
                  Overall
                </span>
              </div>
            </div>

            {/* Labels right side */}
            <div className="space-y-3.5">
              <div className="flex flex-col gap-0.5 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  <span className="text-gray-400 font-medium">Environment</span>
                </div>
                <span className="text-white font-semibold pl-3">
                  {currentScores.environment} ({data.distribution.environment.percentage}%)
                </span>
              </div>

              <div className="flex flex-col gap-0.5 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                  <span className="text-gray-400 font-medium">Social</span>
                </div>
                <span className="text-white font-semibold pl-3">
                  {currentScores.social} ({data.distribution.social.percentage}%)
                </span>
              </div>

              <div className="flex flex-col gap-0.5 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
                  <span className="text-gray-400 font-medium">Governance</span>
                </div>
                <span className="text-white font-semibold pl-3">
                  {currentScores.governance} ({data.distribution.governance.percentage}%)
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Row Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Recent Activities */}
        <Card className="bg-[#181922] border border-[#2d2f39] rounded-lg p-5 shadow-none flex flex-col h-[350px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-white">Recent Activities</h4>
            <Button variant="ghost" className="text-xs font-semibold text-[#9B5CF6] hover:bg-[#9B5CF6]/10 px-2.5 h-8 rounded-lg cursor-pointer">
              View All
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {data.recentActivities.map((act) => {
              const config =
                act.category === "Environment"
                  ? { icon: Leaf, bg: "bg-[#10B981]/10", color: "text-[#10B981]", border: "border-[#10B981]/10" }
                  : act.category === "Social"
                  ? { icon: Users, bg: "bg-[#F59E0B]/10", color: "text-[#F59E0B]", border: "border-[#F59E0B]/10" }
                  : act.category === "Reports"
                  ? { icon: FileText, bg: "bg-[#9B5CF6]/10", color: "text-[#9B5CF6]", border: "border-[#9B5CF6]/10" }
                  : { icon: ShieldCheck, bg: "bg-[#3B82F6]/10", color: "text-[#3B82F6]", border: "border-[#3B82F6]/10" };

              return (
                <div key={act.id} className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.color} border ${config.border}`}>
                      <config.icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate leading-snug">
                        {act.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {act.category} • {act.time}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground hover:text-white">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Performing Departments */}
        <Card className="bg-[#181922] border border-[#2d2f39] rounded-lg p-5 shadow-none flex flex-col h-[350px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-white">Top Performing Departments</h4>
            <Button variant="ghost" className="text-xs font-semibold text-[#9B5CF6] hover:bg-[#9B5CF6]/10 px-2.5 h-8 rounded-lg cursor-pointer">
              View All
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {data.topDepartments.map((dept, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{dept.name}</span>
                  <span className="font-bold text-gray-300">{Math.round(dept.score * periodMultiplier)}</span>
                </div>
                <div className="w-full bg-[#0f1016] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#9B5CF6] to-[#7C3AED] h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.round(dept.score * periodMultiplier))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Tasks */}
        <Card className="bg-[#181922] border border-[#2d2f39] rounded-lg p-5 shadow-none flex flex-col h-[350px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-white">Pending Tasks</h4>
            <Button variant="ghost" className="text-xs font-semibold text-[#9B5CF6] hover:bg-[#9B5CF6]/10 px-2.5 h-8 rounded-lg cursor-pointer">
              View All
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {data.pendingTasks.map((task) => {
              const badgeStyle =
                task.category === "Environment"
                  ? "border-[#10B981]/25 text-[#10B981] bg-[#10B981]/5"
                  : task.category === "Social"
                  ? "border-[#F59E0B]/25 text-[#F59E0B] bg-[#F59E0B]/5"
                  : "border-[#3B82F6]/25 text-[#3B82F6] bg-[#3B82F6]/5";

              return (
                <div key={task.id} className="flex items-start gap-3 justify-between border-b border-[#2d2f39]/40 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5 hover:text-[#9B5CF6] transition-colors cursor-pointer" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white leading-snug">
                        {task.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 rounded-md font-semibold tracking-wide ${badgeStyle}`}>
                          {task.category}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
