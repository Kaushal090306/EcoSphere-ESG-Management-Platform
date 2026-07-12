"use client";

import { Trophy, Award, Flame, Calendar, Coins, Sparkles, Star, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from "recharts";
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

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 p-6 bg-gradient-to-br from-[#151221] to-[#0b0912] border border-[#2b233d] rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="space-y-2 relative z-10 text-white">
          <span className="text-purple-400 text-xs font-bold tracking-wider uppercase flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" /> ESG Gamification Profile
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-300 text-sm max-w-md">
            Earn levels, unlock rewards, and compete with colleagues by keeping EcoSphere's ESG metrics updated.
          </p>
        </div>

        {/* Level and Progress Block */}
        <div className="flex items-center gap-4 bg-[#0c0a0e]/40 border border-[#2b233d] p-4 rounded-lg relative z-10 w-full md:w-80">
          <div className="flex flex-col items-center justify-center bg-purple-900/30 text-purple-300 border border-purple-500/20 w-16 h-16 rounded-lg flex-shrink-0">
            <span className="text-[9px] uppercase font-bold tracking-wider opacity-60">Level</span>
            <span className="text-2xl font-extrabold font-mono leading-none mt-0.5">{user.level}</span>
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300">XP Progress</span>
              <span className="font-semibold text-purple-300 font-mono">
                {user.xp % 100} / 100 XP
              </span>
            </div>
            <div className="h-2 w-full bg-[#181524] rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${user.percentProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Challenges */}
        <div className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl p-6 flex flex-col justify-between hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Active Challenges</span>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground leading-none">{stats.activeChallengesCount}</h2>
            <p className="text-xs text-muted-foreground mt-1">live team challenges</p>
          </div>
        </div>

        {/* My Badges */}
        <div className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl p-6 flex flex-col justify-between hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">My Badges</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground leading-none">{unlockedBadges.length}</h2>
            <p className="text-xs text-muted-foreground mt-1">milestones unlocked</p>
          </div>
        </div>

        {/* My Points */}
        <div className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl p-6 flex flex-col justify-between hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">My Points</span>
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground leading-none">{user.points.toLocaleString()}</h2>
            <p className="text-xs text-muted-foreground mt-1">redeemable points</p>
          </div>
        </div>

        {/* Leaderboard Rank */}
        <div className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl p-6 flex flex-col justify-between hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Leaderboard Rank</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500 border border-teal-500/20">
              <Trophy className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground leading-none">{stats.userRank > 0 ? `#${stats.userRank}` : "N/A"}</h2>
            <p className="text-xs text-muted-foreground mt-1">among all employees</p>
          </div>
        </div>
      </div>

      {/* Profile & History details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Unlocked Badges Panel */}
        <Card className="border border-[#ececee] dark:border-[#221f2c] bg-white dark:bg-[#121118] lg:col-span-1 flex flex-col shadow-xs">
          <CardHeader className="p-5 pb-4 border-b border-[#ececee] dark:border-[#221f2c]">
            <CardTitle className="flex items-center gap-2 text-sm text-foreground font-bold">
              <Award className="h-4.5 w-4.5 text-purple-400" /> Unlocked Badges
            </CardTitle>
            <CardDescription className="text-muted-foreground text-[11px]">Milestone rewards you have collected</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[340px] p-5 space-y-4">
            {unlockedBadges.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No badges unlocked yet. Keep completing quests to unlock your first badge!
              </div>
            ) : (
              unlockedBadges.map((badge) => (
                <div key={badge.id} className="flex items-start gap-3 p-3 bg-[#f4f4f5]/60 dark:bg-[#0c0a0e]/40 border border-[#ececee] dark:border-[#221f2c] rounded-lg">
                  <div className="p-2 bg-purple-900/20 text-purple-400 rounded-lg flex-shrink-0 border border-purple-500/10">
                    <Star className="h-5 w-5 fill-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{badge.description}</p>
                    <span className="text-[10px] text-muted-foreground block mt-1.5 font-mono">
                      Unlocked {formatDate(badge.unlockedAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* XP Ledger History */}
        <Card className="border border-[#ececee] dark:border-[#221f2c] bg-white dark:bg-[#121118] lg:col-span-2 shadow-xs">
          <CardHeader className="p-5 pb-4 border-b border-[#ececee] dark:border-[#221f2c]">
            <CardTitle className="flex items-center gap-2 text-sm text-foreground font-bold">
              <ShieldCheck className="h-4.5 w-4.5 text-eco-green" /> Transaction Ledger
            </CardTitle>
            <CardDescription className="text-muted-foreground text-[11px]">A history of your earned points and XP updates for auditing transparency</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {recentTransactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No transactions recorded. Complete a task to earn your first XP!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#ececee] dark:border-[#221f2c] bg-[#f4f4f5] dark:bg-[#121118]">
                    <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Action / Reason</TableHead>
                    <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Date</TableHead>
                    <TableHead className="text-right text-foreground font-semibold px-6 py-3 text-right text-[11px] uppercase tracking-wider pr-6">XP Awarded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((tx) => (
                    <TableRow key={tx.id} className="border-b border-[#ececee] dark:border-[#221f2c] hover:bg-[#f4f4f5] dark:hover:bg-[#16141f]/50 transition-colors">
                      <TableCell className="font-medium text-foreground pl-6">
                        {reasonLabels[tx.reason] || tx.reason}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(tx.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6 font-bold font-mono text-[#f59e0b]">
                        +{tx.amount} XP
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="border border-[#ececee] dark:border-[#221f2c] bg-white dark:bg-[#121118] shadow-xs">
        <CardHeader className="p-5 pb-4 border-b border-[#ececee] dark:border-[#221f2c]">
          <CardTitle className="text-sm font-bold text-foreground">Quest Activity</CardTitle>
          <CardDescription className="text-muted-foreground text-[11px]">Overview of challenge participation trends</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#221f2c" : "#ececee"} vertical={false} />
              <XAxis dataKey="name" stroke={isDark ? "#71717a" : "#71717a"} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={isDark ? "#71717a" : "#71717a"} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
              <Bar dataKey="completedCount" radius={[4, 4, 0, 0]} barSize={35}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#14b8a6" : "#8b5cf6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
