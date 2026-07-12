"use client";

import Link from "next/link";
import { Users, HandHeart, Award, BookOpen, TrendingUp, TrendingDown, Info, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export interface RecentActivity {
  id: string;
  type: "registration" | "training" | "badge";
  title: string;
  description: string;
  timeLabel: string;
  color: string;
}

interface SocialOverviewClientProps {
  activeParticipants: number;
  openActivities: number;
  trainingProgress: number;
  divScore: number;
  recentActivities: RecentActivity[];
}

const sparkline1 = [{ val: 12 }, { val: 15 }, { val: 13 }, { val: 18 }, { val: 16 }, { val: 22 }, { val: 20 }];
const sparkline2 = [{ val: 2 }, { val: 3 }, { val: 2 }, { val: 4 }, { val: 3 }, { val: 5 }, { val: 4 }];
const sparkline3 = [{ val: 10 }, { val: 15 }, { val: 20 }, { val: 22 }, { val: 28 }, { val: 30 }, { val: 33 }];
const sparkline4 = [{ val: 80 }, { val: 82 }, { val: 83 }, { val: 83 }, { val: 84 }, { val: 85 }, { val: 85 }];

const socialTrendData = [
  { month: "Jan", thisYear: 40, lastYear: 35 },
  { month: "Feb", thisYear: 48, lastYear: 38 },
  { month: "Mar", thisYear: 45, lastYear: 40 },
  { month: "Apr", thisYear: 58, lastYear: 42 },
  { month: "May", thisYear: 55, lastYear: 44 },
  { month: "Jun", thisYear: 64, lastYear: 45 },
  { month: "Jul", thisYear: 60, lastYear: 48 },
  { month: "Aug", thisYear: 70, lastYear: 50 },
  { month: "Sep", thisYear: 68, lastYear: 52 },
  { month: "Oct", thisYear: 75, lastYear: 54 },
  { month: "Nov", thisYear: 72, lastYear: 58 },
  { month: "Dec", thisYear: 82, lastYear: 60 },
];

const categoryPieData = [
  { name: "Environmental CSR", value: 50, percentage: 50, color: "#14b8a6" },
  { name: "Social Initiatives", value: 30, percentage: 30, color: "#9B5CF6" },
  { name: "Diversity & Inclusion", value: 20, percentage: 20, color: "#3b82f6" },
];

export function SocialOverviewClient({
  activeParticipants,
  openActivities,
  trainingProgress,
  divScore,
  recentActivities,
}: SocialOverviewClientProps) {
  return (
    <div className="space-y-6">
      {/* Row 1: 4 KPI Cards with Sparklines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Active Participants */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-teal-400">
                <Users className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Active Participants</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {activeParticipants} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">employees</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+8.3%</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">vs last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkline1} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkSocial1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#14b8a6" strokeWidth={1.8} fill="url(#sparkSocial1)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 2: CSR Activities */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-teal-400">
                <HandHeart className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">CSR Activities</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {openActivities} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">open events</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+12.5%</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">vs last year</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkline2} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkSocial2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#14b8a6" strokeWidth={1.8} fill="url(#sparkSocial2)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 3: Training Progress */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Training Progress</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {trainingProgress}% <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">compliance</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+4.2%</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">vs last quarter</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkline3} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkSocial3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9B5CF6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#9B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#9B5CF6" strokeWidth={1.8} fill="url(#sparkSocial3)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 4: Diversity Score */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                <Award className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Diversity Score</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {divScore} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">index</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+1.5%</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">vs last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkline4} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkSocial4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#f59e0b" strokeWidth={1.8} fill="url(#sparkSocial4)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Trend Area Chart (6 columns) */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 lg:col-span-6 flex flex-col justify-between shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Social Engagement Trend</h4>
            <div className="flex items-center gap-2 bg-[#f4f4f5] dark:bg-[#0f1016] border border-[#ececee] dark:border-[#2d2f39] rounded-lg px-2.5 py-1 text-[11px] text-muted-foreground cursor-pointer">
              <span>Monthly</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-3 rounded-full bg-[#9B5CF6]" />
              <span>This Year</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-3 rounded-full border border-dashed border-[#4b5563] bg-transparent" />
              <span>Last Year</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={socialTrendData} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="trendSocialGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9B5CF6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#9B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--foreground)" }} />
              <Area 
                type="monotone" 
                dataKey="thisYear" 
                stroke="#9B5CF6" 
                strokeWidth={2.5} 
                fill="url(#trendSocialGlow)" 
                dot={{ stroke: '#9B5CF6', strokeWidth: 2, fill: 'var(--card)', r: 3 }} 
                activeDot={{ r: 5 }} 
              />
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

        {/* Donut Chart (3 columns) */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 lg:col-span-3 flex flex-col justify-between shadow-none">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">CSR Type Split</h4>
            <Info className="h-4 w-4 text-muted-foreground/60" />
          </div>

          <div className="relative flex items-center justify-center h-[140px] my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold text-[#09090b] dark:text-white leading-none">{openActivities}</span>
              <span className="text-[8px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">Events</span>
            </div>
          </div>

          <div className="space-y-1.5 mt-2">
            {categoryPieData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-muted-foreground truncate max-w-[100px]">{s.name}</span>
                </div>
                <div className="text-right space-x-1.5">
                  <span className="font-semibold text-[#09090b] dark:text-white">{s.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activities Feed (3 columns) */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 lg:col-span-3 flex flex-col justify-between shadow-none">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Recent Activities</h4>
            <Link href="/social/participation" className="text-[10px] text-[#9B5CF6] hover:text-violet-600 font-semibold">
              View All
            </Link>
          </div>

          <div className="space-y-3.5 my-auto">
            {recentActivities.map((act) => {
              const Icon = act.type === "registration" ? HandHeart : act.type === "training" ? BookOpen : Sparkles;
              return (
                <div key={act.id} className="flex gap-2.5 items-start">
                  <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 mt-0.5" style={{ color: act.color, backgroundColor: `${act.color}15` }}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-[11px] min-w-0">
                    <p className="font-semibold text-[#09090b] dark:text-white truncate">{act.title}</p>
                    <p className="text-muted-foreground truncate">{act.description}</p>
                    <span className="text-[9px] text-muted-foreground/60 mt-0.5 block">{act.timeLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-center border-t border-[#ececee] dark:border-[#2d2f39]/50 pt-2.5">
            <Link 
              href="/social/participation"
              className="text-[10px] text-[#9B5CF6] hover:text-violet-600 h-auto p-0 inline-flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>View All Activities</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}
