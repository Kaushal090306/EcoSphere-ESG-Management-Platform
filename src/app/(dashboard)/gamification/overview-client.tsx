"use client";

import { Trophy, Award, Flame, Users, Calendar, Coins, Sparkles, Star, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";

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
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 p-6 bg-gradient-to-br from-[#1C182B] to-[#120E1C] border border-[#2B233D] rounded-[20px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="space-y-2 relative z-10">
          <span className="text-purple-400 text-xs font-semibold tracking-wider uppercase flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> ESG Gamification Profile
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#09090b] dark:text-white">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground text-sm max-w-md">
            Earn levels, unlock rewards, and compete with colleagues by keeping EcoSphere's ESG metrics updated.
          </p>
        </div>

        {/* Level and Progress Block */}
        <div className="flex items-center gap-4 bg-slate-950/40 border border-[#2B233D] p-4 rounded-[14px] relative z-10 w-full md:w-80">
          <div className="flex flex-col items-center justify-center bg-purple-900/30 text-purple-300 border border-purple-500/20 w-16 h-16 rounded-[14px] flex-shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Level</span>
            <span className="text-2xl font-extrabold font-mono leading-none mt-0.5">{user.level}</span>
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">XP Progress</span>
              <span className="font-semibold text-purple-300 font-mono">
                {user.xp % 100} / 100 XP
              </span>
            </div>
            <div className="h-2 w-full bg-[#181524] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#09090b] transition-all duration-300"
                style={{ width: `${user.percentProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Challenges"
          value={stats.activeChallengesCount.toString()}
          subtitle="live team challenges"
          icon={Flame}
          color="orange"
        />
        <StatCard
          title="My Badges"
          value={unlockedBadges.length.toString()}
          subtitle="milestones unlocked"
          icon={Award}
          color="orange"
        />
        <StatCard
          title="My Points"
          value={user.points.toLocaleString()}
          subtitle="redeemable points"
          icon={Coins}
          color="orange"
        />
        <StatCard
          title="Leaderboard Rank"
          value={stats.userRank > 0 ? `#${stats.userRank}` : "N/A"}
          subtitle="among all employees"
          icon={Trophy}
          color="teal"
        />
      </div>

      {/* Profile & History details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Unlocked Badges Panel */}
        <Card className="border border-[#ececee] lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-[#09090b] dark:text-white">
              <Award className="h-4.5 w-4.5 text-purple-400" /> Unlocked Badges
            </CardTitle>
            <CardDescription>Milestone rewards you have collected</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[340px] space-y-4">
            {unlockedBadges.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No badges unlocked yet. Keep completing quests to unlock your first badge!
              </div>
            ) : (
              unlockedBadges.map((badge) => (
                <div key={badge.id} className="flex items-start gap-3 p-3 bg-slate-900/30 border border-[#ececee] rounded-lg">
                  <div className="p-2 bg-purple-900/20 text-purple-400 rounded-lg flex-shrink-0 border border-purple-500/10">
                    <Star className="h-5 w-5 fill-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#09090b] dark:text-white">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{badge.description}</p>
                    <span className="text-[10px] text-muted-foreground block mt-1.5 font-mono">
                      Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* XP Ledger History */}
        <Card className="border border-[#ececee] lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-[#09090b] dark:text-white">
              <ShieldCheck className="h-4.5 w-4.5 text-eco-green" /> Transaction Ledger
            </CardTitle>
            <CardDescription>A history of your earned points and XP updates for auditing transparency</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {recentTransactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No transactions recorded. Complete a task to earn your first XP!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#ececee]">
                    <TableHead className="text-muted-foreground pl-6">Action / Reason</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-right text-muted-foreground pr-6">XP Awarded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((tx) => (
                    <TableRow key={tx.id} className="border-b border-[#ececee] hover:bg-slate-900/20">
                      <TableCell className="font-medium text-[#09090b] dark:text-white pl-6">
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

      {/* Chart Section */}
      <Card className="border border-[#ececee]">
        <CardHeader>
          <CardTitle className="text-[#09090b] dark:text-white">Quest Activity</CardTitle>
          <CardDescription>Overview of challenge participation trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#221F2C" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #ececee", borderRadius: "12px", color: "#09090b" }}
              />
              <Bar dataKey="completedCount" radius={[4, 4, 0, 0]} barSize={35}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#f59e0b" : "#9B5CF6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
