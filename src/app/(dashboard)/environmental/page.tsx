"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

// Static sparkline data templates
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

export default function EnvironmentDashboard() {
  const searchParams = useSearchParams();
  const period = searchParams.get("period") || "oct";

  // Configuration mapping based on chosen period selection
  const kpiData = {
    oct: {
      emissions: "1,245.6",
      emissionsTrend: "12.4%",
      emissionsUp: false,
      energy: "2,450.8",
      energyTrend: "8.7%",
      energyUp: false,
      water: "8,320.5",
      waterTrend: "3.2%",
      waterUp: true,
      waste: "245.6",
      wasteTrend: "15.6%",
      wasteUp: false,
      sparkMult1: 1.0,
      sparkMult2: 1.0,
      sparkMult3: 1.0,
      sparkMult4: 1.0,
      scope1: 561.5,
      scope2: 436.0,
      scope3: 248.1,
      electricity: 498.2,
      fuel: 311.4,
      transport: 186.8,
      industrial: 124.6,
      wasteVal: 124.6,
      topDepts: [
        { name: "Manufacturing", value: 456.2, percent: "36.6%" },
        { name: "Operations", value: 324.8, percent: "26.1%" },
        { name: "Logistics", value: 248.1, percent: "19.9%" },
        { name: "Facilities", value: 142.3, percent: "11.4%" },
      ]
    },
    sep: {
      emissions: "1,385.2",
      emissionsTrend: "8.5%",
      emissionsUp: true,
      energy: "2,684.5",
      energyTrend: "5.3%",
      energyUp: true,
      water: "8,060.2",
      waterTrend: "2.1%",
      waterUp: true,
      waste: "291.0",
      wasteTrend: "8.4%",
      wasteUp: true,
      sparkMult1: 1.12,
      sparkMult2: 1.10,
      sparkMult3: 0.97,
      sparkMult4: 1.18,
      scope1: 620.4,
      scope2: 480.8,
      scope3: 284.0,
      electricity: 554.0,
      fuel: 346.3,
      transport: 207.8,
      industrial: 138.5,
      wasteVal: 138.5,
      topDepts: [
        { name: "Manufacturing", value: 507.0, percent: "36.6%" },
        { name: "Operations", value: 361.5, percent: "26.1%" },
        { name: "Logistics", value: 275.6, percent: "19.9%" },
        { name: "Facilities", value: 157.9, percent: "11.4%" },
      ]
    },
    aug: {
      emissions: "1,180.4",
      emissionsTrend: "4.1%",
      emissionsUp: false,
      energy: "2,548.0",
      energyTrend: "1.2%",
      energyUp: true,
      water: "8,240.0",
      waterTrend: "0.8%",
      waterUp: false,
      waste: "268.4",
      wasteTrend: "3.1%",
      wasteUp: false,
      sparkMult1: 0.95,
      sparkMult2: 1.04,
      sparkMult3: 0.99,
      sparkMult4: 1.09,
      scope1: 531.2,
      scope2: 413.1,
      scope3: 236.1,
      electricity: 472.2,
      fuel: 295.1,
      transport: 177.1,
      industrial: 118.0,
      wasteVal: 118.0,
      topDepts: [
        { name: "Manufacturing", value: 432.0, percent: "36.6%" },
        { name: "Operations", value: 308.1, percent: "26.1%" },
        { name: "Logistics", value: 234.9, percent: "19.9%" },
        { name: "Facilities", value: 134.6, percent: "11.4%" },
      ]
    },
    last6: {
      emissions: "7,246.8",
      emissionsTrend: "14.2%",
      emissionsUp: false,
      energy: "15,482.5",
      energyTrend: "6.8%",
      energyUp: false,
      water: "49,320.4",
      waterTrend: "4.5%",
      waterUp: true,
      waste: "1,624.5",
      wasteTrend: "11.2%",
      wasteUp: false,
      sparkMult1: 5.8,
      sparkMult2: 6.3,
      sparkMult3: 5.9,
      sparkMult4: 6.6,
      scope1: 3261.0,
      scope2: 2536.4,
      scope3: 1449.4,
      electricity: 2898.7,
      fuel: 1811.7,
      transport: 1087.0,
      industrial: 724.7,
      wasteVal: 724.7,
      topDepts: [
        { name: "Manufacturing", value: 2652.3, percent: "36.6%" },
        { name: "Operations", value: 1891.4, percent: "26.1%" },
        { name: "Logistics", value: 1442.1, percent: "19.9%" },
        { name: "Facilities", value: 826.1, percent: "11.4%" },
      ]
    }
  }[period as "oct" | "sep" | "aug" | "last6"] || {
    emissions: "1,245.6",
    emissionsTrend: "12.4%",
    emissionsUp: false,
    energy: "2,450.8",
    energyTrend: "8.7%",
    energyUp: false,
    water: "8,320.5",
    waterTrend: "3.2%",
    waterUp: true,
    waste: "245.6",
    wasteTrend: "15.6%",
    wasteUp: false,
    sparkMult1: 1.0,
    sparkMult2: 1.0,
    sparkMult3: 1.0,
    sparkMult4: 1.0,
    scope1: 561.5,
    scope2: 436.0,
    scope3: 248.1,
    electricity: 498.2,
    fuel: 311.4,
    transport: 186.8,
    industrial: 124.6,
    wasteVal: 124.6,
    topDepts: [
      { name: "Manufacturing", value: 456.2, percent: "36.6%" },
      { name: "Operations", value: 324.8, percent: "26.1%" },
      { name: "Logistics", value: 248.1, percent: "19.9%" },
      { name: "Facilities", value: 142.3, percent: "11.4%" },
    ]
  };

  // Sparklines mapped
  const currentSparkline1 = sparklineData1.map(d => ({ val: Math.round(d.val * kpiData.sparkMult1) }));
  const currentSparkline2 = sparklineData2.map(d => ({ val: Math.round(d.val * kpiData.sparkMult2) }));
  const currentSparkline3 = sparklineData3.map(d => ({ val: Math.round(d.val * kpiData.sparkMult3) }));
  const currentSparkline4 = sparklineData4.map(d => ({ val: Math.round(d.val * kpiData.sparkMult4) }));

  // Pie charts mapped
  const currentScopePieData = [
    { name: "Scope 1", value: kpiData.scope1, percentage: 45, color: "#9B5CF6" },
    { name: "Scope 2", value: kpiData.scope2, percentage: 35, color: "#10b981" },
    { name: "Scope 3", value: kpiData.scope3, percentage: 20, color: "#3b82f6" },
  ];

  const currentSourcePieData = [
    { name: "Electricity", value: kpiData.electricity, percentage: 40, color: "#9B5CF6" },
    { name: "Fuel Combustion", value: kpiData.fuel, percentage: 25, color: "#10b981" },
    { name: "Transportation", value: kpiData.transport, percentage: 15, color: "#f59e0b" },
    { name: "Industrial Processes", value: kpiData.industrial, percentage: 10, color: "#f97316" },
    { name: "Waste", value: kpiData.wasteVal, percentage: 10, color: "#ef4444" },
  ];

  // Adjust trend charts
  const currentEmissionsTrendData = emissionsTrendData.map(d => ({
    ...d,
    thisYear: Math.round(d.thisYear * kpiData.sparkMult1),
    lastYear: Math.round(d.lastYear * kpiData.sparkMult1),
  }));

  return (
    <div className="space-y-6 text-white bg-[#f4f4f5] dark:bg-[#0f1016]">
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Emissions */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Leaf className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Total Emissions</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {kpiData.emissions} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">tCO₂e</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-emerald-400">
                  {kpiData.emissionsUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{kpiData.emissionsTrend}</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentSparkline1} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlow1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#7C3AED" strokeWidth={1.8} fill="url(#sparkGlow1)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 2: Energy Consumption */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Zap className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Energy Consumption</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {kpiData.energy} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">MWh</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-emerald-400">
                  {kpiData.energyUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{kpiData.energyTrend}</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentSparkline2} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlow2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#7C3AED" strokeWidth={1.8} fill="url(#sparkGlow2)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 3: Water Usage */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                <Droplet className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Water Usage</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {kpiData.water} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">m³</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-rose-500">
                  {kpiData.waterUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{kpiData.waterTrend}</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentSparkline3} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlow3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#7C3AED" strokeWidth={1.8} fill="url(#sparkGlow3)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 4: Waste Generated */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Waste Generated</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {kpiData.waste} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">tons</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-emerald-400">
                  {kpiData.wasteUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{kpiData.wasteTrend}</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentSparkline4} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlow4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#7C3AED" strokeWidth={1.8} fill="url(#sparkGlow4)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: Trend, Scope, Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Plot 1: Emissions Trend */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 lg:col-span-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Emissions Trend</h4>
            </div>
            <div className="flex items-center gap-2 bg-[#f4f4f5] dark:bg-[#0f1016] border border-[#ececee] dark:border-[#2d2f39] rounded-lg px-2.5 py-1 text-[11px] text-muted-foreground cursor-pointer">
              <span>Monthly</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-3 rounded-full bg-[#7C3AED]" />
              <span>This Year</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-3 rounded-full border border-dashed border-[#4b5563] bg-transparent" />
              <span>Last Year</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={currentEmissionsTrendData} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#252731" vertical={false} />
              <XAxis dataKey="month" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" }} />
              
              {/* This Year Area Plot with exact custom styled bullet dots */}
              <Area 
                type="monotone" 
                dataKey="thisYear" 
                stroke="#7C3AED" 
                strokeWidth={2.5} 
                fill="url(#trendArea)" 
                dot={{ stroke: '#7C3AED', strokeWidth: 2, fill: '#181922', r: 3 }} 
                activeDot={{ r: 5 }} 
              />
              
              {/* Last Year Dotted Plot */}
              <Area 
                type="monotone" 
                dataKey="lastYear" 
                stroke="#4b5563" 
                strokeWidth={1.5} 
                strokeDasharray="4 4" 
                fill="none" 
                dot={false} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Plot 2: Emissions by Scope Donut */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 lg:col-span-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Emissions by Scope</h4>
            <Info className="h-4 w-4 text-muted-foreground/60" />
          </div>

          <div className="relative flex items-center justify-center h-[140px] my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentScopePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {currentScopePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text overlay */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold text-[#09090b] dark:text-[#09090b] dark:text-white leading-none">{kpiData.emissions}</span>
              <span className="text-[8px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">tCO₂e</span>
            </div>
          </div>

          {/* Right/Bottom Legends */}
          <div className="space-y-1.5 mt-2">
            {currentScopePieData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
                <div className="text-right space-x-1.5">
                  <span className="font-semibold text-[#09090b] dark:text-white">{s.percentage}%</span>
                  <span className="text-muted-foreground text-[10px]">{s.value.toFixed(1)} t</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* List 1: Recent Activities */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 lg:col-span-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Recent Activities</h4>
            <Button 
              render={<Link href="/social/participation" />}
              variant="ghost" 
              className="text-[10px] text-[#7C3AED] hover:text-[#6D28D9] p-0 h-auto cursor-pointer"
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
                <p className="font-medium text-[#09090b] dark:text-white leading-normal">New energy data imported</p>
                <p className="text-muted-foreground leading-normal mt-0.5">{kpiData.energy} MWh added</p>
                <span className="text-[9px] text-muted-foreground/60 mt-1 block">2 hours ago</span>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 mt-0.5">
                <Droplet className="h-3.5 w-3.5" />
              </div>
              <div className="text-[11px]">
                <p className="font-medium text-[#09090b] dark:text-white leading-normal">Water usage data updated</p>
                <p className="text-muted-foreground leading-normal mt-0.5">{kpiData.water} m³ recorded</p>
                <span className="text-[9px] text-muted-foreground/60 mt-1 block">5 hours ago</span>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 mt-0.5">
                <Trash2 className="h-3.5 w-3.5" />
              </div>
              <div className="text-[11px]">
                <p className="font-medium text-[#09090b] dark:text-white leading-normal">Waste management data added</p>
                <p className="text-muted-foreground leading-normal mt-0.5">{kpiData.waste} tons recorded</p>
                <span className="text-[9px] text-muted-foreground/60 mt-1 block">1 day ago</span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-center border-t border-[#ececee] dark:border-[#2d2f39]/50 pt-2.5">
            <Link 
              href="/social/participation"
              className="text-[10px] text-[#7C3AED] hover:text-[#6D28D9] h-auto p-0 inline-flex items-center gap-1 cursor-pointer font-medium"
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
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Emissions by Source</h4>
            <Button 
              render={<Link href="/environmental/carbon-transactions" />}
              variant="ghost" 
              className="text-[10px] text-muted-foreground hover:text-[#09090b] dark:hover:text-white p-0 h-auto cursor-pointer"
            >
              View Details
            </Button>
          </div>

          <div className="relative flex items-center justify-center h-[130px] my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentSourcePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={56}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {currentSourcePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold text-[#09090b] dark:text-[#09090b] dark:text-white leading-none">{kpiData.emissions}</span>
              <span className="text-[8px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">tCO₂e</span>
            </div>
          </div>

          <div className="space-y-1 mt-3">
            {currentSourcePieData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
                <div className="text-right space-x-1.5">
                  <span className="font-semibold text-[#09090b] dark:text-white">{s.percentage}%</span>
                  <span className="text-muted-foreground text-[10px]">{s.value.toFixed(1)} t</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Emitters Department Table */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Top Emitters (Departments)</h4>
            <Button 
              render={<Link href="/settings/departments" />}
              variant="ghost" 
              className="text-[10px] text-muted-foreground hover:text-[#09090b] dark:hover:text-white p-0 h-auto cursor-pointer"
            >
              View All
            </Button>
          </div>

          <div className="space-y-3.5 my-auto">
            {kpiData.topDepts.map((d) => (
              <div key={d.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-semibold text-[#09090b] dark:text-white">{d.name}</span>
                  <span className="font-semibold">{d.value.toFixed(1)} t <span className="font-normal text-muted-foreground/60">({d.percent})</span></span>
                </div>
                <div className="h-1.5 w-full bg-[#f4f4f5] dark:bg-[#0f1016] rounded-full overflow-hidden">
                  <div className="h-full bg-[#7C3AED] rounded-full" style={{ width: d.percent }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions List */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 flex flex-col justify-between">
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Quick Actions</h4>
          </div>

          <div className="space-y-3.5 my-auto">
            {/* Action 1 */}
            <Link 
              href="/environmental/carbon-transactions"
              className="flex items-center justify-between bg-[#f4f4f5] dark:bg-[#0f1016] hover:bg-[#22242f]/40 border border-[#ececee] dark:border-[#2d2f39]/50 rounded-xl p-2.5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Plus className="h-4 w-4" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-[#09090b] dark:text-[#09090b] dark:text-white leading-none">Add Environmental Data</p>
                  <p className="text-muted-foreground text-[10px] mt-0.5 leading-none">Manually add new environmental data</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            {/* Action 2 */}
            <Link 
              href="/environmental/carbon-transactions"
              className="flex items-center justify-between bg-[#f4f4f5] dark:bg-[#0f1016] hover:bg-[#22242f]/40 border border-[#ececee] dark:border-[#2d2f39]/50 rounded-xl p-2.5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Upload className="h-4 w-4" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-[#09090b] dark:text-[#09090b] dark:text-white leading-none">Import Data</p>
                  <p className="text-muted-foreground text-[10px] mt-0.5 leading-none">Import data from ERP/IoT systems</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            {/* Action 3 */}
            <Link 
              href="/environmental/emission-factors"
              className="flex items-center justify-between bg-[#f4f4f5] dark:bg-[#0f1016] hover:bg-[#22242f]/40 border border-[#ececee] dark:border-[#2d2f39]/50 rounded-xl p-2.5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-[#09090b] dark:text-[#09090b] dark:text-white leading-none">Manage Emission Factors</p>
                  <p className="text-muted-foreground text-[10px] mt-0.5 leading-none">Update and manage emission factors</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            {/* Action 4 */}
            <Link 
              href="/reports"
              className="flex items-center justify-between bg-[#f4f4f5] dark:bg-[#0f1016] hover:bg-[#22242f]/40 border border-[#ececee] dark:border-[#2d2f39]/50 rounded-xl p-2.5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-[#09090b] dark:text-[#09090b] dark:text-white leading-none">Generate Environmental Report</p>
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
