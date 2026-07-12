"use client";

import { Trophy, Award, Flame, Calendar, Coins, Sparkles, Star, ShieldCheck, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell, AreaChart, Area } from "recharts";
import { useTheme } from "next-themes";
import { formatDate } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  reason: string;
  createdAt: Date;
}

interface UnlockedBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

interface OverviewClientProps {
  user: {
    name: string;
    xp: number;
    points: number;
    level: number;
    percentProgress: number;
  };
  stats: {
    activeChallengesCount: number;
    totalBadgesCount: number;
    totalXpDistributed: number;
    userRank: number;
  };
  recentTransactions: Transaction[];
  unlockedBadges: UnlockedBadge[];
  chartData: { name: string; completedCount: number }[];
}

const reasonLabels: Record<string, string> = {
  emission_entry: "Submitting emission factor entry",
  policy_acknowledgement: "Acknowledging governance policy",
  challenge_completion: "Completing sustainability quest",
};

export function OverviewClient({
  user,
  stats,
  recentTransactions,
  unlockedBadges,
  chartData,
}: OverviewClientProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const tooltipStyle = {
    backgroundColor: isDark ? "#121118" : "#ffffff",
    border: `1px solid ${isDark ? "#221f2c" : "#ececee"}`,
    borderRadius: "8px",
    color: isDark ? "#ffffff" : "#09090b",
    fontSize: "12px",
    boxShadow: "rgba(0,0,0,0.06) 0px 4px 12px 0px",
  };
  const tooltipItemStyle = { padding: "1px 0", color: isDark ? "#a1a1aa" : "#52525b" };

  // Sparkline data trends to match environment page style
  const sparklineData1 = [
    { val: 2 },
    { val: 4 },
    { val: 3 },
    { val: 5 },
    { val: 4 },
    { val: stats.activeChallengesCount || 6 }
  ];
  
  const sparklineData2 = [
    { val: 0 },
    { val: 0 },
    { val: 1 },
    { val: 1 },
    { val: Math.max(1, unlockedBadges.length - 1) },
    { val: unlockedBadges.length || 1 }
  ];

  const sparklineData3 = [
    { val: 100 },
    { val: 180 },
    { val: 240 },
    { val: 350 },
    { val: 420 },
    { val: user.points || 510 }
  ];

  const sparklineData4 = [
    { val: 25 },
    { val: 20 },
    { val: 18 },
    { val: 12 },
    { val: 10 },
    { val: stats.userRank || 8 }
  ];

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards Row with Sparklines */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* KPI 1: Active Challenges */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                <Flame className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Active Challenges</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {stats.activeChallengesCount} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">live</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+15.6%</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData1} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlow1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#f97316" strokeWidth={1.8} fill="url(#sparkGlow1)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 2: My Badges */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
                <Award className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">My Badges</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {unlockedBadges.length} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">unlocked</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+1 new</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">this month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData2} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlow2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#a855f7" strokeWidth={1.8} fill="url(#sparkGlow2)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 3: My Points */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
                <Coins className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">My Points</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {user.points.toLocaleString()} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">pts</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+120 pts</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">this week</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData3} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlow3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#eab308" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#eab308" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#eab308" strokeWidth={1.8} fill="url(#sparkGlow3)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 4: Leaderboard Rank */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-teal-500">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Leaderboard Rank</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {stats.userRank > 0 ? `#${stats.userRank}` : "N/A"} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">rank</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Top 10%</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">of all employees</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData4} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGlow4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#14b8a6" strokeWidth={1.8} fill="url(#sparkGlow4)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* Row 2: Quest Activity, Unlocked Badges, Transaction Ledger in a 6+3+3 Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Quest Activity Chart - lg:col-span-6 */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 lg:col-span-6 flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Quest Activity</h4>
            <p className="text-muted-foreground text-[11px] mt-0.5">Overview of challenge participation trends</p>
          </div>
          <div className="h-[210px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#221f2c" : "#ececee"} vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                <Bar dataKey="completedCount" radius={[4, 4, 0, 0]} barSize={25}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#14b8a6" : "#8b5cf6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Unlocked Badges List - lg:col-span-3 */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 lg:col-span-3 flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Unlocked Badges</h4>
            <p className="text-muted-foreground text-[11px] mt-0.5">Milestone rewards you have collected</p>
          </div>
          <div className="h-[210px] overflow-y-auto space-y-3 pr-1 scrollbar-thin mt-2">
            {unlockedBadges.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-xs">
                No badges unlocked yet. Keep completing quests to earn rewards!
              </div>
            ) : (
              unlockedBadges.map((badge) => (
                <div key={badge.id} className="flex items-start gap-2.5 p-2 bg-[#f4f4f5]/40 dark:bg-[#0c0a0e]/20 border border-[#ececee] dark:border-[#221f2c] rounded-lg">
                  <div className="p-1.5 bg-purple-500/10 text-purple-500 rounded-lg flex-shrink-0 border border-purple-500/10">
                    <Star className="h-4 w-4 fill-purple-500" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-semibold text-xs text-[#09090b] dark:text-white truncate">{badge.name}</h5>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{badge.description}</p>
                    <span className="text-[9px] text-muted-foreground/60 block mt-1 font-mono">
                      Unlocked {formatDate(badge.unlockedAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent XP Updates / Transaction Ledger - lg:col-span-3 */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 lg:col-span-3 flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Recent XP Updates</h4>
            <p className="text-muted-foreground text-[11px] mt-0.5">Audit ledger of earned points</p>
          </div>
          <div className="h-[210px] overflow-y-auto space-y-3.5 pr-1 scrollbar-thin mt-2">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-xs">
                No XP ledger history logged yet.
              </div>
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-full flex-shrink-0">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#09090b] dark:text-white truncate">
                        {reasonLabels[tx.reason] || tx.reason}
                      </p>
                      <p className="text-[9px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {formatDate(tx.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono text-[#f59e0b] shrink-0">
                    +{tx.amount} XP
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}
