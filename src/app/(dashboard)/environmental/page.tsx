"use client";

import Link from "next/link";
import { 
  Leaf, 
  Zap, 
  Droplet, 
  Trash2, 
  Calendar, 
  Download, 
  TrendingDown, 
  TrendingUp, 
  Info, 
  ArrowRight, 
  ChevronRight,
  ChevronDown,
  Plus,
  Upload,
  SlidersHorizontal,
  FileText
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";

// Static data matching image plots
const sparklineData1 = [
  { val: 30 }, { val: 25 }, { val: 35 }, { val: 20 }, { val: 40 }, 
  { val: 30 }, { val: 45 }, { val: 35 }, { val: 50 }, { val: 40 }, { val: 55 }
];
const sparklineData2 = [
  { val: 40 }, { val: 45 }, { val: 30 }, { val: 50 }, { val: 35 }, 
  { val: 55 }, { val: 40 }, { val: 60 }, { val: 45 }, { val: 65 }, { val: 50 }
];
const sparklineData3 = [
  { val: 20 }, { val: 15 }, { val: 25 }, { val: 20 }, { val: 30 }, 
  { val: 25 }, { val: 35 }, { val: 30 }, { val: 45 }, { val: 40 }, { val: 48 }
];
const sparklineData4 = [
  { val: 50 }, { val: 48 }, { val: 45 }, { val: 40 }, { val: 38 }, 
  { val: 35 }, { val: 30 }, { val: 28 }, { val: 25 }, { val: 20 }, { val: 18 }
];

const emissionsTrendData = [
  { month: "Jan", thisYear: 600, lastYear: 900 },
  { month: "Feb", thisYear: 750, lastYear: 880 },
  { month: "Mar", thisYear: 700, lastYear: 920 },
  { month: "Apr", thisYear: 950, lastYear: 850 },
  { month: "May", thisYear: 900, lastYear: 1000 },
  { month: "Jun", thisYear: 780, lastYear: 980 },
  { month: "Jul", thisYear: 980, lastYear: 950 },
  { month: "Aug", thisYear: 1150, lastYear: 930 },
  { month: "Sep", thisYear: 1080, lastYear: 910 },
  { month: "Oct", thisYear: 1000, lastYear: 890 },
  { month: "Nov", thisYear: 1100, lastYear: 850 },
  { month: "Dec", thisYear: 950, lastYear: 800 },
];

const scopePieData = [
  { name: "Scope 1", value: 561.5, percentage: 45, color: "#9B5CF6" },
  { name: "Scope 2", value: 436.0, percentage: 35, color: "#10b981" },
  { name: "Scope 3", value: 248.1, percentage: 20, color: "#3b82f6" },
];

const sourcePieData = [
  { name: "Electricity", value: 498.2, percentage: 40, color: "#9B5CF6" },
  { name: "Fuel Combustion", value: 311.4, percentage: 25, color: "#10b981" },
  { name: "Transportation", value: 186.8, percentage: 15, color: "#f59e0b" },
  { name: "Industrial Processes", value: 124.6, percentage: 10, color: "#f97316" },
  { name: "Waste", value: 124.6, percentage: 10, color: "#ef4444" },
];

export default function EnvironmentDashboard() {
  return (
    <div className="space-y-6 text-[#09090b] bg-[#f4f4f5]">
      {/* Top Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Green rounded leaf icon box */}
          <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-emerald-500/10 text-emerald-400">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">
              <span>Dashboard</span>
              <ChevronRight className="h-2.5 w-2.5" />
              <span className="text-muted-foreground/60">Environment</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-0.5">Environment Overview</h1>
            <p className="text-xs text-muted-foreground">
              Track and manage your environmental impact
            </p>
          </div>
        </div>

        {/* Date filter & export action */}
        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="flex items-center gap-2 bg-white border border-[#ececee] rounded-[14px] px-3 py-1.5 text-xs text-muted-foreground font-medium">
            <Calendar className="h-4 w-4 text-muted-foreground/80" />
            <span>Oct 1 – Oct 31, 2024</span>
          </div>
          <Button 
            onClick={() => window.print()}
            className="bg-[#09090b] hover:bg-[#18181b] text-white text-xs px-3 py-1.5 h-8.5 rounded-[14px] font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Emissions */}
        <Card className="bg-white border border-[#ececee] rounded-[28px] overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              {/* Left circle icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Leaf className="h-5 w-5" />
              </div>
              {/* Right text stack */}
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] font-medium block">Total Emissions</span>
                <h3 className="text-[26px] font-normal text-[#09090b] leading-none flex items-baseline gap-1.5 mt-1">
                  1,245.6 <span className="text-[11px] text-[#71717a] font-semibold">tCO₂e</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold pt-1">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>12.4%</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          {/* Sparkline area */}
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData1} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlow1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#09090b" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#09090b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#09090b" strokeWidth={1.8} fill="url(#sparkGlow1)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 2: Energy Consumption */}
        <Card className="bg-white border border-[#ececee] rounded-[28px] overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Zap className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] font-medium block">Energy Consumption</span>
                <h3 className="text-[26px] font-normal text-[#09090b] leading-none flex items-baseline gap-1.5 mt-1">
                  2,450.8 <span className="text-[11px] text-[#71717a] font-semibold">MWh</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold pt-1">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>8.7%</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData2} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlow2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#09090b" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#09090b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#09090b" strokeWidth={1.8} fill="url(#sparkGlow2)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 3: Water Usage */}
        <Card className="bg-white border border-[#ececee] rounded-[28px] overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                <Droplet className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] font-medium block">Water Usage</span>
                <h3 className="text-[26px] font-normal text-[#09090b] leading-none flex items-baseline gap-1.5 mt-1">
                  8,320.5 <span className="text-[11px] text-[#71717a] font-semibold">m³</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-rose-500 font-semibold pt-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>3.2%</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData3} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlow3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#09090b" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#09090b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#09090b" strokeWidth={1.8} fill="url(#sparkGlow3)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 4: Waste Generated */}
        <Card className="bg-white border border-[#ececee] rounded-[28px] overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] font-medium block">Waste Generated</span>
                <h3 className="text-[26px] font-normal text-[#09090b] leading-none flex items-baseline gap-1.5 mt-1">
                  245.6 <span className="text-[11px] text-[#71717a] font-semibold">tons</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold pt-1">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>15.6%</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData4} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlow4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#09090b" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#09090b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#09090b" strokeWidth={1.8} fill="url(#sparkGlow4)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: Trend, Scope, Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Plot 1: Emissions Trend */}
        <Card className="bg-white border border-[#ececee] rounded-[20px] p-5 lg:col-span-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-[#09090b]">Emissions Trend</h4>
            </div>
            <div className="flex items-center gap-2 bg-[#f4f4f5] border border-[#ececee] rounded-lg px-2.5 py-1 text-[11px] text-muted-foreground cursor-pointer">
              <span>Monthly</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-3 rounded-full bg-[#09090b]" />
              <span>This Year</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-3 rounded-full border border-dashed border-[#4b5563] bg-transparent" />
              <span>Last Year</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={emissionsTrendData} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#09090b" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#09090b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ececee" vertical={false} />
              <XAxis dataKey="month" stroke="#d4d4d8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#d4d4d8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #ececee", borderRadius: "12px" }} />
              
              {/* This Year Area Plot with exact custom styled bullet dots */}
              <Area 
                type="monotone" 
                dataKey="thisYear" 
                stroke="#09090b" 
                strokeWidth={2.5} 
                fill="url(#trendArea)" 
                dot={{ stroke: '#09090b', strokeWidth: 2, fill: '#ffffff', r: 3 }} 
                activeDot={{ r: 5 }} 
              />
              
              {/* Last Year Dotted Plot */}
              <Area 
                type="monotone" 
                dataKey="lastYear" 
                stroke="#d4d4d8" 
                strokeWidth={1.5} 
                strokeDasharray="4 4" 
                fill="none" 
                dot={false} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Plot 2: Emissions by Scope Donut */}
        <Card className="bg-white border border-[#ececee] rounded-[20px] p-5 lg:col-span-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-[#09090b]">Emissions by Scope</h4>
            <Info className="h-4 w-4 text-muted-foreground/60" />
          </div>

          <div className="relative flex items-center justify-center h-[140px] my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scopePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {scopePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text overlay */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold text-[#09090b] leading-none">1,245.6</span>
              <span className="text-[8px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">tCO₂e</span>
            </div>
          </div>

          {/* Right/Bottom Legends */}
          <div className="space-y-1.5 mt-2">
            {scopePieData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
                <div className="text-right space-x-1.5">
                  <span className="font-semibold text-[#09090b]">{s.percentage}%</span>
                  <span className="text-muted-foreground text-[10px]">{s.value} t</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* List 1: Recent Activities */}
        <Card className="bg-white border border-[#ececee] rounded-[20px] p-5 lg:col-span-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#09090b]">Recent Activities</h4>
            <Button 
              render={<Link href="/social/participation" />}
              nativeButton={false}
              variant="ghost" 
              className="text-[10px] text-[#52525b] hover:text-[#6D28D9] p-0 h-auto cursor-pointer"
            >
              View All
            </Button>
          </div>

          <div className="space-y-3.5 my-auto">
            <div className="flex gap-2.5 items-start">
              <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mt-0.5">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <div className="text-[11px]">
                <p className="font-medium text-[#09090b] leading-normal">New energy data imported</p>
                <p className="text-muted-foreground leading-normal mt-0.5">2,450.8 MWh added</p>
                <span className="text-[9px] text-muted-foreground/60 mt-1 block">2 hours ago</span>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 mt-0.5">
                <Droplet className="h-3.5 w-3.5" />
              </div>
              <div className="text-[11px]">
                <p className="font-medium text-[#09090b] leading-normal">Water usage data updated</p>
                <p className="text-muted-foreground leading-normal mt-0.5">8,320.5 m³ recorded</p>
                <span className="text-[9px] text-muted-foreground/60 mt-1 block">5 hours ago</span>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 mt-0.5">
                <Trash2 className="h-3.5 w-3.5" />
              </div>
              <div className="text-[11px]">
                <p className="font-medium text-[#09090b] leading-normal">Waste management data added</p>
                <p className="text-muted-foreground leading-normal mt-0.5">245.6 tons recorded</p>
                <span className="text-[9px] text-muted-foreground/60 mt-1 block">1 day ago</span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-center border-t border-[#ececee]/50 pt-2.5">
            <Link 
              href="/social/participation"
              className="text-[10px] text-[#52525b] hover:text-[#6D28D9] h-auto p-0 inline-flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>View All Activities</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </Card>

      </div>

      {/* Row 3: Source, Top Emitters, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Source Pie Chart */}
        <Card className="bg-white border border-[#ececee] rounded-[20px] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#09090b]">Emissions by Source</h4>
            <Button 
              render={<Link href="/environmental/carbon-transactions" />}
              nativeButton={false}
              variant="ghost" 
              className="text-[10px] text-muted-foreground hover:text-[#09090b] p-0 h-auto cursor-pointer"
            >
              View Details
            </Button>
          </div>

          <div className="relative flex items-center justify-center h-[130px] my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourcePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={56}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sourcePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold text-[#09090b] leading-none">1,245.6</span>
              <span className="text-[8px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">tCO₂e</span>
            </div>
          </div>

          <div className="space-y-1 mt-3">
            {sourcePieData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
                <div className="text-right space-x-1.5">
                  <span className="font-semibold text-[#09090b]">{s.percentage}%</span>
                  <span className="text-muted-foreground text-[10px]">{s.value} t</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Emitters Department Table */}
        <Card className="bg-white border border-[#ececee] rounded-[20px] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#09090b]">Top Emitters (Departments)</h4>
            <Button 
              render={<Link href="/settings/departments" />}
              nativeButton={false}
              variant="ghost" 
              className="text-[10px] text-muted-foreground hover:text-[#09090b] p-0 h-auto cursor-pointer"
            >
              View All
            </Button>
          </div>

          <div className="space-y-3.5 my-auto">
            {/* Dept 1: Manufacturing */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-semibold text-[#09090b]">Manufacturing</span>
                <span className="font-semibold">456.2 t <span className="font-normal text-muted-foreground/60">(36.6%)</span></span>
              </div>
              <div className="h-1.5 w-full bg-[#f4f4f5] rounded-full overflow-hidden">
                <div className="h-full bg-[#09090b] rounded-full" style={{ width: "36.6%" }} />
              </div>
            </div>

            {/* Dept 2: Operations */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-semibold text-[#09090b]">Operations</span>
                <span className="font-semibold">324.8 t <span className="font-normal text-muted-foreground/60">(26.1%)</span></span>
              </div>
              <div className="h-1.5 w-full bg-[#f4f4f5] rounded-full overflow-hidden">
                <div className="h-full bg-[#09090b] rounded-full" style={{ width: "26.1%" }} />
              </div>
            </div>

            {/* Dept 3: Logistics */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-semibold text-[#09090b]">Logistics</span>
                <span className="font-semibold">248.1 t <span className="font-normal text-muted-foreground/60">(19.9%)</span></span>
              </div>
              <div className="h-1.5 w-full bg-[#f4f4f5] rounded-full overflow-hidden">
                <div className="h-full bg-[#09090b] rounded-full" style={{ width: "19.9%" }} />
              </div>
            </div>

            {/* Dept 4: Facilities */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-semibold text-[#09090b]">Facilities</span>
                <span className="font-semibold">142.3 t <span className="font-normal text-muted-foreground/60">(11.4%)</span></span>
              </div>
              <div className="h-1.5 w-full bg-[#f4f4f5] rounded-full overflow-hidden">
                <div className="h-full bg-[#09090b] rounded-full" style={{ width: "11.4%" }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions List */}
        <Card className="bg-white border border-[#ececee] rounded-[20px] p-5 flex flex-col justify-between">
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-[#09090b]">Quick Actions</h4>
          </div>

          <div className="space-y-3.5 my-auto">
            {/* Action 1 */}
            <Link 
              href="/environmental/carbon-transactions"
              className="flex items-center justify-between bg-[#f4f4f5] hover:bg-[#22242f]/40 border border-[#ececee]/50 rounded-[14px] p-2.5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Plus className="h-4 w-4" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-[#09090b] leading-none">Add Environmental Data</p>
                  <p className="text-muted-foreground text-[10px] mt-0.5 leading-none">Manually add new environmental data</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            {/* Action 2 */}
            <Link 
              href="/environmental/carbon-transactions"
              className="flex items-center justify-between bg-[#f4f4f5] hover:bg-[#22242f]/40 border border-[#ececee]/50 rounded-[14px] p-2.5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Upload className="h-4 w-4" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-[#09090b] leading-none">Import Data</p>
                  <p className="text-muted-foreground text-[10px] mt-0.5 leading-none">Import data from ERP/IoT systems</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            {/* Action 3 */}
            <Link 
              href="/environmental/emission-factors"
              className="flex items-center justify-between bg-[#f4f4f5] hover:bg-[#22242f]/40 border border-[#ececee]/50 rounded-[14px] p-2.5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-[#09090b] leading-none">Manage Emission Factors</p>
                  <p className="text-muted-foreground text-[10px] mt-0.5 leading-none">Update and manage emission factors</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            {/* Action 4 */}
            <Link 
              href="/reports"
              className="flex items-center justify-between bg-[#f4f4f5] hover:bg-[#22242f]/40 border border-[#ececee]/50 rounded-[14px] p-2.5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-[#09090b] leading-none">Generate Environmental Report</p>
                  <p className="text-muted-foreground text-[10px] mt-0.5 leading-none">Create detailed environmental reports</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}
