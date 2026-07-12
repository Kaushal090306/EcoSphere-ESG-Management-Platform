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
    
    // Generate text report matching database state
    const reportText = `EcoSphere ESG Performance Summary Report
Generated on: ${new Date().toLocaleDateString()}
Organization: GreenTech Solutions

SUMMARY SCORES:
- Overall ESG Score: ${data.scores.overall}/100 (${data.scores.overallTrend >= 0 ? '+' : ''}${data.scores.overallTrend}% vs last month)
- Environment Score: ${data.scores.environment}/100 (${data.scores.environmentTrend >= 0 ? '+' : ''}${data.scores.environmentTrend}% vs last month)
- Social Score: ${data.scores.social}/100 (${data.scores.socialTrend >= 0 ? '+' : ''}${data.scores.socialTrend}% vs last month)
- Governance Score: ${data.scores.governance}/100 (${data.scores.governanceTrend >= 0 ? '+' : ''}${data.scores.governanceTrend}% vs last month)

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
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#9B5CF6] border-t-transparent" />
          <span className="text-sm text-gray-400 font-medium animate-pulse">Loading live database records...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-[calc(100vh-120px)] w-full items-center justify-center">
        <span className="text-gray-400">Failed to load dashboard data. Check database.</span>
      </div>
    );
  }

  // Pre-process sparklines into coordinates for Recharts
  const makeSparklineData = (sparkline: number[]) => {
    return sparkline.map((val, idx) => ({ id: idx, val }));
  };

  // Pie chart data for distribution
  const pieData = [
    { name: "Environment", value: data.distribution.environment.score, color: "#10B981" },
    { name: "Social", value: data.distribution.social.score, color: "#F59E0B" },
    { name: "Governance", value: data.distribution.governance.score, color: "#3B82F6" },
  ];

  return (
    <div className="space-y-6 pb-8 bg-[#08070B] min-h-screen text-white">
      {/* Top Welcome bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Welcome back, {data.user.name.split(" ")[0]}! 👋
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-0.5">
            Here&apos;s your ESG overview
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Download Button */}
          <Button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 h-10 rounded-xl bg-[#121016] border border-[#221F2C] text-xs font-semibold text-gray-300 hover:bg-[#1A1722] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </Button>

          {/* Date Picker Select */}
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-4 py-2 h-10 rounded-xl bg-[#121016] border border-[#221F2C] text-xs font-semibold text-gray-300 hover:bg-[#1A1722] hover:text-white transition-all cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-[#9B5CF6]" />
            <span>Oct 1 - Oct 31, 2024</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Overall Card */}
        <Card className="bg-[#121016] border-[#1D1A27] rounded-[24px] overflow-hidden flex flex-col justify-between h-[155px] hover:border-[#9B5CF6]/30 transition-all group">
          <CardContent className="p-5 flex flex-col justify-between h-full relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                  Overall ESG Score
                </span>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-3xl font-extrabold text-white">{data.scores.overall}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9B5CF6]/10 text-[#9B5CF6] border border-[#9B5CF6]/10">
                <Shield className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-semibold mt-2 z-10">
              <span>↑ {data.scores.overallTrend}%</span>
              <span className="text-muted-foreground font-normal">from last month</span>
            </div>

            {/* Sparkline wave background */}
            <div className="absolute bottom-0 left-0 right-0 h-11 w-full overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={makeSparklineData(data.scores.overallSparkline)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sparkline-purple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9B5CF6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#9B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#9B5CF6"
                    strokeWidth={1.5}
                    fill="url(#sparkline-purple)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Environment Card */}
        <Card className="bg-[#121016] border-[#1D1A27] rounded-[24px] overflow-hidden flex flex-col justify-between h-[155px] hover:border-[#10B981]/30 transition-all group">
          <CardContent className="p-5 flex flex-col justify-between h-full relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                  Environment Score
                </span>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-3xl font-extrabold text-white">{data.scores.environment}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/10">
                <Leaf className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-semibold mt-2 z-10">
              <span>↑ {data.scores.environmentTrend}%</span>
              <span className="text-muted-foreground font-normal">from last month</span>
            </div>

            {/* Sparkline wave background */}
            <div className="absolute bottom-0 left-0 right-0 h-11 w-full overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={makeSparklineData(data.scores.environmentSparkline)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sparkline-green" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#10B981"
                    strokeWidth={1.5}
                    fill="url(#sparkline-green)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Social Card */}
        <Card className="bg-[#121016] border-[#1D1A27] rounded-[24px] overflow-hidden flex flex-col justify-between h-[155px] hover:border-[#F59E0B]/30 transition-all group">
          <CardContent className="p-5 flex flex-col justify-between h-full relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                  Social Score
                </span>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-3xl font-extrabold text-white">{data.scores.social}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/10">
                <Users className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-semibold mt-2 z-10">
              <span>↑ {data.scores.socialTrend}%</span>
              <span className="text-muted-foreground font-normal">from last month</span>
            </div>

            {/* Sparkline wave background */}
            <div className="absolute bottom-0 left-0 right-0 h-11 w-full overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={makeSparklineData(data.scores.socialSparkline)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sparkline-orange" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#F59E0B"
                    strokeWidth={1.5}
                    fill="url(#sparkline-orange)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Governance Card */}
        <Card className="bg-[#121016] border-[#1D1A27] rounded-[24px] overflow-hidden flex flex-col justify-between h-[155px] hover:border-[#3B82F6]/30 transition-all group">
          <CardContent className="p-5 flex flex-col justify-between h-full relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                  Governance Score
                </span>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-3xl font-extrabold text-white">{data.scores.governance}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/10">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-semibold mt-2 z-10">
              <span>↑ {data.scores.governanceTrend}%</span>
              <span className="text-muted-foreground font-normal">from last month</span>
            </div>

            {/* Sparkline wave background */}
            <div className="absolute bottom-0 left-0 right-0 h-11 w-full overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={makeSparklineData(data.scores.governanceSparkline)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sparkline-blue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#3B82F6"
                    strokeWidth={1.5}
                    fill="url(#sparkline-blue)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section: Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        
        {/* Line Chart: ESG Score Trend */}
        <Card className="lg:col-span-4 bg-[#121016] border-[#1D1A27] rounded-[24px] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-white">ESG Score Trend</h3>
              {/* Custom Legend */}
              <div className="flex flex-wrap gap-4 text-xs mt-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded-full bg-[#9B5CF6]" />
                  <span className="text-gray-400">Overall</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded-full bg-[#10B981]" />
                  <span className="text-gray-400">Environment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded-full bg-[#F59E0B]" />
                  <span className="text-gray-400">Social</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded-full bg-[#3B82F6]" />
                  <span className="text-gray-400">Governance</span>
                </div>
              </div>
            </div>

            {/* Time Filter Select */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-1.5 h-8 rounded-lg bg-[#181620] border border-[#2A2735] text-xs font-semibold text-gray-300 hover:bg-[#201E2A]"
                  >
                    <span>{selectedPeriod}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                }
              />
              <DropdownMenuContent className="bg-[#121016] border-[#221F2C] text-white">
                <DropdownMenuItem onClick={() => setSelectedPeriod("Last 6 Months")} className="text-xs focus:bg-[#221F2C]">Last 6 Months</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPeriod("Last Year")} className="text-xs focus:bg-[#221F2C]">Last Year</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#221F2C" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#4B5563"
                  fontSize={11}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <YAxis
                  stroke="#4B5563"
                  fontSize={11}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickMargin={10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#121016",
                    border: "1px solid #221F2C",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "12px",
                  }}
                  itemStyle={{ padding: "1px 0" }}
                />
                <Line
                  type="monotone"
                  dataKey="overall"
                  stroke="#9B5CF6"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, strokeWidth: 1.5, fill: "#08070B" }}
                  activeDot={{ r: 5 }}
                  name="Overall"
                />
                <Line
                  type="monotone"
                  dataKey="environment"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, strokeWidth: 1.5, fill: "#08070B" }}
                  activeDot={{ r: 5 }}
                  name="Environment"
                />
                <Line
                  type="monotone"
                  dataKey="social"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, strokeWidth: 1.5, fill: "#08070B" }}
                  activeDot={{ r: 5 }}
                  name="Social"
                />
                <Line
                  type="monotone"
                  dataKey="governance"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, strokeWidth: 1.5, fill: "#08070B" }}
                  activeDot={{ r: 5 }}
                  name="Governance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Donut Chart: Score Distribution */}
        <Card className="lg:col-span-3 bg-[#121016] border-[#1D1A27] rounded-[24px] p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Score Distribution</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center my-auto py-2">
            {/* Pie Container */}
            <div className="relative w-full h-[180px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Central Text */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-white">{data.scores.overall}</span>
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                  Overall
                </span>
              </div>
            </div>

            {/* Labels right side */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#10B981]" />
                  <span className="text-gray-300 font-medium">Environment</span>
                </div>
                <span className="text-white font-bold">
                  {data.scores.environment} ({data.distribution.environment.percentage}%)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                  <span className="text-gray-300 font-medium">Social</span>
                </div>
                <span className="text-white font-bold">
                  {data.scores.social} ({data.distribution.social.percentage}%)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#3B82F6]" />
                  <span className="text-gray-300 font-medium">Governance</span>
                </div>
                <span className="text-white font-bold">
                  {data.scores.governance} ({data.distribution.governance.percentage}%)
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Row Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Recent Activities */}
        <Card className="bg-[#121016] border-[#1D1A27] rounded-[24px] p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-white">Recent Activities</h3>
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
        <Card className="bg-[#121016] border-[#1D1A27] rounded-[24px] p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-white">Top Performing Departments</h3>
            <Button variant="ghost" className="text-xs font-semibold text-[#9B5CF6] hover:bg-[#9B5CF6]/10 px-2.5 h-8 rounded-lg cursor-pointer">
              View All
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4.5 pr-1">
            {data.topDepartments.map((dept, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{dept.name}</span>
                  <span className="font-bold text-gray-300">{dept.score}</span>
                </div>
                {/* Custom purple progress bar */}
                <div className="w-full bg-[#1C1A24] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#9B5CF6] to-[#7C3AED] h-full rounded-full"
                    style={{ width: `${dept.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Tasks */}
        <Card className="bg-[#121016] border-[#1D1A27] rounded-[24px] p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-white">Pending Tasks</h3>
            <Button variant="ghost" className="text-xs font-semibold text-[#9B5CF6] hover:bg-[#9B5CF6]/10 px-2.5 h-8 rounded-lg cursor-pointer">
              View All
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {data.pendingTasks.map((task) => {
              const badgeStyle =
                task.category === "Environment"
                  ? "border-[#10B981]/25 text-[#10B981] bg-[#10B981]/5"
                  : task.category === "Social"
                  ? "border-[#F59E0B]/25 text-[#F59E0B] bg-[#F59E0B]/5"
                  : "border-[#3B82F6]/25 text-[#3B82F6] bg-[#3B82F6]/5";

              return (
                <div key={task.id} className="flex items-start gap-3 justify-between border-b border-[#1C1A24]/60 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-muted-foreground mt-0.5 hover:text-[#9B5CF6] transition-colors cursor-pointer" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white leading-snug">
                        {task.title}
                      </p>
                      {/* Flex wrapper for relative date and dynamic badge */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
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
