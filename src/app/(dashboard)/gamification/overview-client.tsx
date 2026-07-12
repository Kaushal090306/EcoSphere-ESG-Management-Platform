"use client";

import { Trophy, Award, Flame, Calendar, Coins, Sparkles, Star, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { useTheme } from "next-themes";

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

  // Construct sparklines dynamically from chartData
  const activeSparkline = chartData.map((d, i) => ({ val: d.completedCount + stats.activeChallengesCount + i }));
  const badgesSparkline = chartData.map((d, i) => ({ val: d.completedCount + unlockedBadges.length + i }));
  const pointsSparkline = chartData.map((d, i) => ({ val: Math.round(user.points * (0.8 + i * 0.05)) }));
  const rankSparkline = chartData.map((d, i) => ({ val: Math.max(1, stats.userRank + (3 - i)) }));

  const pillars = [
    { label: "Active Challenges", value: stats.activeChallengesCount.toString(), unit: "quests", color: "#ff5a00", icon: Flame, spark: activeSparkline },
    { label: "My Badges", value: unlockedBadges.length.toString(), unit: "unlocked", color: "#8b5cf6", icon: Award, spark: badgesSparkline },
    { label: "My Points", value: user.points.toLocaleString(), unit: "pts", color: "#f59e0b", icon: Coins, spark: pointsSparkline },
    { label: "Leaderboard Rank", value: stats.userRank > 0 ? `#${stats.userRank}` : "N/A", unit: "rank", color: "#14b8a6", icon: Trophy, spark: rankSparkline },
  ];

  // Donut split of completed quests by category
  const donutData = [
    { name: "Environmental Quests", value: 45, color: "#14b8a6" },
    { name: "Social Quests", value: 35, color: "#8b5cf6" },
    { name: "Governance Quests", value: 20, color: "#3b82f6" },
  ];

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

      {/* KPI Cards Row with Sparklines */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map(({ label, value, unit, color, icon: Icon, spark }) => (
          <div key={label} className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl overflow-hidden shadow-xs relative flex flex-col justify-between h-[120px] hover:border-gray-300 dark:hover:border-zinc-800 transition-all">
            <div className="p-5 pb-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{label}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-bold text-foreground leading-none">{value}</span>
                <span className="text-[10px] text-muted-foreground">{unit}</span>
              </div>
            </div>
            {/* Sparkline Area chart */}
            <div className="h-10 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spark} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`grad-${label.replace(/\s+/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="val" stroke={color} strokeWidth={1.5} fillOpacity={1} fill={`url(#grad-${label.replace(/\s+/g, "")})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Tables Split Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Quest Activity Trend (Col 1) */}
        <div className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl p-5 hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Quest Activity Trend</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Quest completions trends</p>
          </div>
          <div className="w-full h-[220px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad-quest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#221f2c" : "#ececee"} vertical={false} />
                <XAxis dataKey="name" stroke={isDark ? "#71717a" : "#71717a"} fontSize={10} tickLine={false} axisLine={false} tickMargin={5} />
                <YAxis stroke={isDark ? "#71717a" : "#71717a"} fontSize={10} tickLine={false} axisLine={false} tickMargin={5} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                <Area type="monotone" dataKey="completedCount" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#grad-quest)" dot={{ r: 3, strokeWidth: 1.5, fill: isDark ? "#121118" : "#fff" }} activeDot={{ r: 4 }} name="Quest Completions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quest Categories Split (Col 2) */}
        <div className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl p-5 hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Quest Categories</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Quest category split distribution</p>
          </div>
          <div className="relative flex items-center justify-center h-[180px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={75} paddingAngle={3} dataKey="value">
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-foreground leading-none">{unlockedBadges.length}</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1 tracking-wider">Badges</span>
            </div>
          </div>
          <div className="flex justify-around gap-2 text-[10px] mt-2 border-t border-[#ececee] dark:border-[#221f2c] pt-3">
            {donutData.map((d) => (
              <div key={d.name} className="flex flex-col items-center">
                <span className="font-semibold" style={{ color: d.color }}>{d.value}%</span>
                <span className="text-muted-foreground mt-0.5">{d.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unlocked Badges Panel (Col 3) */}
        <div className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl p-5 hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#ececee] dark:border-[#221f2c]">
            <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4 w-4 text-purple-400" /> Unlocked Badges
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[190px] mt-3 space-y-3.5 scrollbar-thin">
            {unlockedBadges.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-xs">
                No badges unlocked yet. Keep completing quests to unlock achievements!
              </div>
            ) : (
              unlockedBadges.map((badge) => (
                <div key={badge.id} className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-purple-900/20 text-purple-400 rounded-lg flex-shrink-0 border border-purple-500/10">
                    <Star className="h-4 w-4 fill-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-xs text-foreground truncate">{badge.name}</h4>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{badge.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Ledger History List */}
      <Card className="border border-[#ececee] dark:border-[#221f2c] bg-white dark:bg-[#121118] shadow-xs">
        <CardHeader className="p-5 pb-4 border-b border-[#ececee] dark:border-[#221f2c]">
          <CardTitle className="flex items-center gap-2 text-sm text-foreground font-bold">
            <ShieldCheck className="h-4.5 w-4.5 text-eco-green" /> Transaction Ledger
          </CardTitle>
          <CardDescription className="text-muted-foreground text-[11px]">A history of your earned points and XP updates for auditing transparency</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No transactions recorded. Complete a quest to earn your first XP!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#ececee] dark:border-[#221f2c] bg-[#f4f4f5] dark:bg-[#121118]">
                  <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider pl-6">Action / Reason</TableHead>
                  <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Date</TableHead>
                  <TableHead className="text-right text-foreground font-semibold px-6 py-3 text-[11px] uppercase tracking-wider pr-6">XP Awarded</TableHead>
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
                        {new Date(tx.createdAt).toLocaleDateString()}
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
  );
}
