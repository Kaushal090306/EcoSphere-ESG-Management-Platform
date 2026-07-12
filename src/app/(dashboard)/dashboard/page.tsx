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
  Trophy,
  Award,
  Gift,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Check,
  X,
  ExternalLink,
  ClipboardList,
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
import { acknowledgePolicy } from "@/actions/policies";
import {
  submitChallengeEvidenceAction,
  approveChallengeParticipationAction,
  rejectChallengeParticipationAction,
} from "@/actions/gamification";
import {
  approveCsrParticipationAction,
  rejectCsrParticipationAction,
} from "@/actions/csr-activities";
import { toast } from "sonner";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 Months");
  const [calendarPeriod, setCalendarPeriod] = useState("oct");
  const [evidenceText, setEvidenceText] = useState("");
  const [evidenceChallengeId, setEvidenceChallengeId] = useState<string | null>(null);
  const [submittingEvidence, setSubmittingEvidence] = useState(false);

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

  const handleAcknowledgePolicy = async (policyId: string) => {
    try {
      const res = await acknowledgePolicy(policyId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Policy acknowledged successfully! +5 XP earned.");
        const updatedData = await getDashboardData();
        setData(updatedData);
      }
    } catch {
      toast.error("Failed to acknowledge policy.");
    }
  };

  const handleSubmitEvidence = async (challengeId: string) => {
    if (!evidenceText.trim()) {
      toast.error("Please enter evidence details or proof URL.");
      return;
    }
    setSubmittingEvidence(true);
    try {
      const res = await submitChallengeEvidenceAction(challengeId, evidenceText);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Evidence submitted successfully for review!");
        setEvidenceChallengeId(null);
        setEvidenceText("");
        const updatedData = await getDashboardData();
        setData(updatedData);
      }
    } catch {
      toast.error("Failed to submit evidence.");
    } finally {
      setSubmittingEvidence(false);
    }
  };

  const handleApproveChallenge = async (participationId: string) => {
    try {
      const res = await approveChallengeParticipationAction(participationId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Challenge submission approved! XP awarded to employee.");
        const updatedData = await getDashboardData();
        setData(updatedData);
      }
    } catch {
      toast.error("Failed to approve challenge.");
    }
  };

  const handleRejectChallenge = async (participationId: string) => {
    try {
      const res = await rejectChallengeParticipationAction(participationId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Challenge submission rejected.");
        const updatedData = await getDashboardData();
        setData(updatedData);
      }
    } catch {
      toast.error("Failed to reject challenge.");
    }
  };

  const handleApproveCsr = async (participationId: string) => {
    try {
      const res = await approveCsrParticipationAction(participationId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("CSR participation approved! XP/points awarded.");
        const updatedData = await getDashboardData();
        setData(updatedData);
      }
    } catch {
      toast.error("Failed to approve CSR.");
    }
  };

  const handleRejectCsr = async (participationId: string) => {
    try {
      const res = await rejectCsrParticipationAction(participationId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("CSR participation rejected.");
        const updatedData = await getDashboardData();
        setData(updatedData);
      }
    } catch {
      toast.error("Failed to reject CSR.");
    }
  };



  if (loading) {
    return (
      <div className="flex h-[calc(100vh-120px)] w-full items-center justify-center bg-[#f4f4f5] dark:bg-[#0f1016]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#9B5CF6] border-t-transparent" />
          <span className="text-sm text-[#71717a] dark:text-gray-400 font-medium animate-pulse">Loading live database records...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-[calc(100vh-120px)] w-full items-center justify-center bg-[#f4f4f5] dark:bg-[#0f1016]">
        <span className="text-[#71717a] dark:text-gray-400">Failed to load dashboard data. Check database.</span>
      </div>
    );
  }

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

  // --- SUB-RENDER 1: EMPLOYEE DASHBOARD ---
  const renderEmployeeDashboard = () => {
    const stats = data.employeeStats;
    if (!stats) return null;

    return (
      <div className="space-y-6">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Level Progress */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 shadow-none flex flex-col justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">My Level</span>
                <h3 className="text-xl font-bold leading-none text-[#09090b] dark:text-white">Level {stats.level}</h3>
                <span className="text-[10px] text-muted-foreground block">{stats.xp} Total XP</span>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                <span>Progress to Next Level</span>
                <span>{stats.levelProgressPct}%</span>
              </div>
              <div className="w-full bg-[#f4f4f5] dark:bg-[#0f1016] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#9B5CF6] to-[#7C3AED] h-full rounded-full"
                  style={{ width: `${stats.levelProgressPct}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Points Balance */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 shadow-none flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <Gift className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1 min-w-0">
              <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Redeemable Points</span>
              <h3 className="text-2xl font-bold leading-none text-[#09090b] dark:text-white">{stats.points} pts</h3>
              <span className="text-[10px] text-muted-foreground block">Available in Reward Catalog</span>
            </div>
          </Card>

          {/* CSR Completed */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 shadow-none flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1 min-w-0">
              <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">CSR Participation</span>
              <h3 className="text-2xl font-bold leading-none text-[#09090b] dark:text-white">{stats.completedCsrsCount}</h3>
              <span className="text-[10px] text-muted-foreground block">Offset events completed</span>
            </div>
          </Card>

          {/* Challenges Completed */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 shadow-none flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
              <Award className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1 min-w-0">
              <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Challenges Completed</span>
              <h3 className="text-2xl font-bold leading-none text-[#09090b] dark:text-white">{stats.completedChallengesCount}</h3>
              <span className="text-[10px] text-muted-foreground block">Approved badge items</span>
            </div>
          </Card>
        </div>

        {/* Dash Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Joined Challenges & Proof Submissions */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-5 shadow-none lg:col-span-2 flex flex-col min-h-[400px]">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white mb-4">My Challenge Submissions</h4>
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {stats.activeChallenges.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <ClipboardList className="h-10 w-10 text-muted-foreground/60 mb-2" />
                  <p className="text-xs text-muted-foreground">You have not joined any challenges yet.</p>
                </div>
              ) : (
                stats.activeChallenges.map((ch) => (
                  <div key={ch.id} className="border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-xs font-bold text-[#09090b] dark:text-white">{ch.title}</h5>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Reward: +{ch.xp} XP / Points</p>
                      </div>
                      <div>
                        {ch.approvalStatus === "approved" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 rounded-md text-[9px]">Approved</Badge>
                        ) : ch.approvalStatus === "rejected" ? (
                          <Badge className="bg-rose-500/10 text-rose-500 border border-rose-500/25 rounded-md text-[9px]">Rejected</Badge>
                        ) : ch.proofUrl ? (
                          <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/25 rounded-md text-[9px]">Under Review</Badge>
                        ) : (
                          <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/25 rounded-md text-[9px]">Joined (Evidence Needed)</Badge>
                        )}
                      </div>
                    </div>

                    {ch.approvalStatus !== "approved" && ch.approvalStatus !== "rejected" && !ch.proofUrl && (
                      <div className="space-y-2">
                        {evidenceChallengeId === ch.id ? (
                          <div className="space-y-2 pt-1">
                            <input
                              type="text"
                              value={evidenceText}
                              onChange={(e) => setEvidenceText(e.target.value)}
                              placeholder="Enter evidence URL (e.g. Google Drive link or document text)"
                              className="w-full bg-[#f4f4f5] dark:bg-[#0f1016] border border-[#ececee] dark:border-[#2d2f39] rounded-md px-3 py-1.5 text-xs text-[#09090b] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#9B5CF6]"
                            />
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEvidenceChallengeId(null)}
                                className="text-[10px] h-7 rounded-md cursor-pointer"
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSubmitEvidence(ch.id)}
                                disabled={submittingEvidence}
                                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[10px] h-7 px-3 rounded-md cursor-pointer"
                              >
                                {submittingEvidence ? "Submitting..." : "Submit Proof"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => {
                              setEvidenceChallengeId(ch.id);
                              setEvidenceText("");
                            }}
                            className="bg-[#9B5CF6]/10 hover:bg-[#9B5CF6]/20 text-[#9B5CF6] border border-[#9B5CF6]/25 text-[10px] h-7 px-3 rounded-md w-full font-semibold cursor-pointer"
                          >
                            Submit Completion Evidence
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Signed Policies Checklist */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-5 shadow-none flex flex-col min-h-[400px]">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white mb-4">ESG Policy Checklist</h4>
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {stats.policies.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No published policies available.</p>
              ) : (
                stats.policies.map((p) => (
                  <div key={p.id} className="flex items-start justify-between border-b border-[#ececee] dark:border-[#2d2f39]/40 pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-[#09090b] dark:text-white truncate">{p.title}</p>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">
                        {p.acknowledged
                          ? `Signed on: ${new Date(p.acknowledgedAt!).toLocaleDateString()}`
                          : "Requires review"}
                      </span>
                    </div>
                    {p.acknowledged ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAcknowledgePolicy(p.id)}
                        className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[10px] h-7 px-2.5 rounded-md shrink-0 cursor-pointer font-semibold"
                      >
                        Sign (+5 XP)
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Secondary Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Badge Gallery */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-5 shadow-none flex flex-col h-[380px]">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white mb-4">My Badge Gallery</h4>
            <div className="flex-1 overflow-y-auto pr-1">
              {stats.badges.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-6">
                  <Award className="h-10 w-10 text-muted-foreground/40 mb-2" />
                  <p className="text-xs text-muted-foreground">Complete challenges or gain XP to unlock badges.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {stats.badges.map((b) => (
                    <div key={b.id} className="border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-3 flex items-start gap-3 bg-[#fafafa] dark:bg-[#131118]/45">
                      <div className="h-10 w-10 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h6 className="text-[11px] font-bold text-[#09090b] dark:text-white truncate">{b.name}</h6>
                        <p className="text-[9px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">{b.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* XP Transactions History */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-5 shadow-none flex flex-col h-[380px]">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white mb-4">XP & Activity History</h4>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {stats.xpTransactions.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No historical records found.</p>
              ) : (
                stats.xpTransactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center border-b border-[#ececee] dark:border-[#2d2f39]/35 pb-2.5 last:border-0 last:pb-0">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-[#09090b] dark:text-white truncate">
                        {tx.reason.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                      </p>
                      <span className="text-[9px] text-muted-foreground block mt-0.5">
                        {new Date(tx.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">+{tx.amount} XP</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // --- SUB-RENDER 2: MANAGER DASHBOARD ---
  const renderManagerDashboard = () => {
    const stats = data.managerStats;
    if (!stats) {
      return (
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-8 text-center shadow-none flex flex-col items-center justify-center min-h-[300px]">
          <AlertCircle className="h-10 w-10 text-amber-500 mb-3 animate-pulse" />
          <h3 className="text-base font-bold text-[#09090b] dark:text-white">Department Mapping Required</h3>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto leading-relaxed">
            You are logged in as a Department Manager, but your account is not yet assigned to a department. Please ask the administrator to assign your profile to a department in user settings to unlock your metrics.
          </p>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Department Score */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 shadow-none flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1 min-w-0">
              <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">{stats.departmentName} Score</span>
              <h3 className="text-2xl font-bold leading-none text-[#09090b] dark:text-white">{stats.departmentScore} /100</h3>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">Ranked #{stats.departmentRank} in Company</span>
            </div>
          </Card>

          {/* Department Members */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 shadow-none flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1 min-w-0">
              <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Department Staff</span>
              <h3 className="text-2xl font-bold leading-none text-[#09090b] dark:text-white">{stats.employeeCount} active</h3>
              <span className="text-[10px] text-muted-foreground block">Average Team XP: {stats.averageXp}</span>
            </div>
          </Card>

          {/* Awaiting Review items count */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 shadow-none flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1 min-w-0">
              <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Pending Approvals</span>
              <h3 className="text-2xl font-bold leading-none text-[#09090b] dark:text-white">
                {stats.pendingChallengeApprovals.length + stats.pendingCsrApprovals.length} Items
              </h3>
              <span className="text-[10px] text-muted-foreground block">Requires evidence checks</span>
            </div>
          </Card>

          {/* Compliance alerts count */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 shadow-none flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1 min-w-0">
              <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Compliance Warnings</span>
              <h3 className="text-2xl font-bold leading-none text-[#09090b] dark:text-white">{stats.complianceIssues.length} Alerts</h3>
              <span className="text-[10px] text-rose-400 font-semibold block">Awaiting audit answers</span>
            </div>
          </Card>
        </div>

        {/* Approvals and Rosters Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Pending Approvals Actions Queue */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-5 shadow-none lg:col-span-2 flex flex-col min-h-[400px]">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white mb-4">Pending Approvals Queue</h4>
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {stats.pendingChallengeApprovals.length === 0 && stats.pendingCsrApprovals.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
                  <p className="text-xs text-muted-foreground">Excellent! Approvals queue is completely empty.</p>
                </div>
              ) : (
                <>
                  {/* CSR approvals */}
                  {stats.pendingCsrApprovals.map((csr) => (
                    <div key={csr.id} className="border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-4 space-y-3.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/25 rounded-md text-[9px] mb-1">CSR Participation</Badge>
                          <h5 className="text-xs font-bold text-[#09090b] dark:text-white">{csr.csrTitle}</h5>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Submitted by: <span className="font-semibold">{csr.employeeName}</span></p>
                        </div>
                        <span className="text-[9px] text-muted-foreground">{new Date(csr.createdAt).toLocaleDateString()}</span>
                      </div>
                      {csr.proofUrl && (
                        <div className="bg-[#f4f4f5] dark:bg-[#0f1016]/40 p-2.5 rounded-md border border-[#ececee] dark:border-[#2d2f39]/50 text-[10px]">
                          <span className="font-semibold block text-muted-foreground">Uploaded Evidence Link/Detail:</span>
                          <a href={csr.proofUrl} target="_blank" rel="noopener noreferrer" className="text-[#9B5CF6] hover:underline flex items-center gap-1.5 mt-1 font-medium break-all">
                            {csr.proofUrl} <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleRejectCsr(csr.id)}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/25 text-[10px] h-7.5 px-3 rounded-md cursor-pointer font-bold"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveCsr(csr.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] h-7.5 px-3 rounded-md cursor-pointer font-bold"
                        >
                          Approve (+50 XP)
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Challenge approvals */}
                  {stats.pendingChallengeApprovals.map((ch) => (
                    <div key={ch.id} className="border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-4 space-y-3.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/25 rounded-md text-[9px] mb-1">Challenge Completion</Badge>
                          <h5 className="text-xs font-bold text-[#09090b] dark:text-white">{ch.challengeTitle}</h5>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Submitted by: <span className="font-semibold">{ch.employeeName}</span></p>
                        </div>
                        <span className="text-[9px] text-muted-foreground">{new Date(ch.createdAt).toLocaleDateString()}</span>
                      </div>
                      {ch.proofUrl && (
                        <div className="bg-[#f4f4f5] dark:bg-[#0f1016]/40 p-2.5 rounded-md border border-[#ececee] dark:border-[#2d2f39]/50 text-[10px]">
                          <span className="font-semibold block text-muted-foreground">Uploaded Evidence Link/Detail:</span>
                          <a href={ch.proofUrl} target="_blank" rel="noopener noreferrer" className="text-[#9B5CF6] hover:underline flex items-center gap-1.5 mt-1 font-medium break-all">
                            {ch.proofUrl} <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleRejectChallenge(ch.id)}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/25 text-[10px] h-7.5 px-3 rounded-md cursor-pointer font-bold"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveChallenge(ch.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] h-7.5 px-3 rounded-md cursor-pointer font-bold"
                        >
                          Approve (+{ch.challengeXp} XP)
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </Card>

          {/* Department Staff List */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-5 shadow-none flex flex-col min-h-[400px]">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white mb-4">Department Leaderboard</h4>
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {stats.departmentEmployees.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No active employees found.</p>
              ) : (
                stats.departmentEmployees.map((emp, index) => (
                  <div key={emp.id} className="flex justify-between items-center border-b border-[#ececee] dark:border-[#2d2f39]/40 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-4">{index + 1}</span>
                      <div>
                        <p className="text-xs font-semibold text-[#09090b] dark:text-white">{emp.name}</p>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">{emp.xp} XP</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-[#7C3AED]/25 text-[#7C3AED] bg-[#7C3AED]/5 font-semibold text-[9px] py-0.5 rounded-md">
                      {emp.points} pts
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Department Compliance and Audits list */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-5 shadow-none">
          <h4 className="text-sm font-semibold text-[#09090b] dark:text-white mb-4">Active Department Compliance Warnings</h4>
          <div className="overflow-x-auto rounded-md overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#f4f4f5] dark:bg-[#1a1822] border-b border-[#ececee] dark:border-[#2d2f39] text-[#71717a] dark:text-gray-400">
                  <th className="p-3 font-semibold">Description</th>
                  <th className="p-3 font-semibold text-center">Severity</th>
                  <th className="p-3 font-semibold text-center">Due Date</th>
                  <th className="p-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.complianceIssues.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground">No compliance warnings found.</td>
                  </tr>
                ) : (
                  stats.complianceIssues.map((issue) => {
                    const badgeColor =
                      issue.severity === "critical"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/25"
                        : issue.severity === "high"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/25"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/25";

                    return (
                      <tr key={issue.id} className="border-b border-[#ececee] dark:border-[#2d2f39] last:border-0 hover:bg-muted/10 text-[#09090b] dark:text-white">
                        <td className="p-3 font-medium leading-snug">{issue.description}</td>
                        <td className="p-3 text-center">
                          <Badge className={`${badgeColor} rounded-md text-[9px] font-semibold border`}>
                            {issue.severity.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-3 text-center text-muted-foreground">
                          {new Date(issue.dueDate).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="border-[#7C3AED]/25 text-[#7C3AED] bg-[#7C3AED]/5 font-semibold text-[9px] py-0.5 rounded-md">
                            {issue.status.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  // --- SUB-RENDER 3: ADMIN/MANAGER OVERVIEW DASHBOARD ---
  const renderAdminDashboard = () => {
    return (
      <div className="space-y-6">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* KPI 1: Overall ESG */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
            <CardContent className="p-5 pb-2 space-y-3.5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Overall ESG Score</span>
                  <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                    {currentScores.overall} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">/100</span>
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
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
            <CardContent className="p-5 pb-2 space-y-3.5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <Leaf className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Environment Score</span>
                  <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                    {currentScores.environment} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">/100</span>
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
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={1.8} fill="url(#sparkGlowEnv)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* KPI 3: Social */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
            <CardContent className="p-5 pb-2 space-y-3.5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                  <Users className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Social Score</span>
                  <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                    {currentScores.social} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">/100</span>
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
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="val" stroke="#F59E0B" strokeWidth={1.8} fill="url(#sparkGlowSoc)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* KPI 4: Governance */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
            <CardContent className="p-5 pb-2 space-y-3.5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Governance Score</span>
                  <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                    {currentScores.governance} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">/100</span>
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
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={1.8} fill="url(#sparkGlowGov)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ESG Trend Area Chart */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-5 shadow-none lg:col-span-2 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">ESG Score Trend</h4>
                <p className="text-[11px] text-muted-foreground">Historical performance metrics overview</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-2.5 py-1 h-8 rounded-lg bg-[#f4f4f5] dark:bg-[#0f1016] border border-[#ececee] dark:border-[#2d2f39] text-[11px] text-muted-foreground hover:bg-[#f4f4f5]/60 dark:hover:bg-[#1C1A24] cursor-pointer"
                    >
                      <span>{selectedPeriod}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  }
                />
                <DropdownMenuContent className="bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-[#09090b] dark:text-white rounded-lg">
                  <DropdownMenuItem onClick={() => setSelectedPeriod("Last 6 Months")} className="text-xs text-[#09090b] dark:text-white focus:bg-[#f4f4f5] dark:focus:bg-[#2c2e3c] cursor-pointer">Last 6 Months</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPeriod("Last Year")} className="text-xs text-[#09090b] dark:text-white focus:bg-[#f4f4f5] dark:focus:bg-[#2c2e3c] cursor-pointer">Last Year</DropdownMenuItem>
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

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="glowOverall" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9B5CF6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#9B5CF6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="glowEnv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#8e909a" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8e909a" fontSize={10} tickLine={false} axisLine={false} domain={[50, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                    labelStyle={{ color: "var(--foreground)", fontSize: "11px", fontWeight: "bold" }}
                    itemStyle={{ fontSize: "11px" }}
                  />
                  <Area type="monotone" dataKey="overall" stroke="#9B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#glowOverall)" />
                  <Area type="monotone" dataKey="environment" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#glowEnv)" />
                  <Line type="monotone" dataKey="social" stroke="#F59E0B" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="governance" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* ESG Breakdown Pie Chart */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-5 shadow-none flex flex-col h-[400px]">
            <div>
              <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">ESG Score Distribution</h4>
              <p className="text-[11px] text-muted-foreground">Current score composition ratios</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center min-h-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {currentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                    itemStyle={{ fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[28px] font-bold text-[#09090b] dark:text-white leading-none">
                  {currentScores.overall}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">
                  Overall Score
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs border-b border-[#ececee] dark:border-[#2d2f39]/50 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                  <span className="font-medium text-muted-foreground">Environment</span>
                </div>
                <span className="font-bold text-[#09090b] dark:text-white">
                  {currentScores.environment} /100 ({data.distribution.environment.percentage}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-[#ececee] dark:border-[#2d2f39]/50 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                  <span className="font-medium text-muted-foreground">Social</span>
                </div>
                <span className="font-bold text-[#09090b] dark:text-white">
                  {currentScores.social} /100 ({data.distribution.social.percentage}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#3B82F6]" />
                  <span className="font-medium text-muted-foreground">Governance</span>
                </div>
                <span className="font-bold text-[#09090b] dark:text-white">
                  {currentScores.governance} /100 ({data.distribution.governance.percentage}%)
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Activities */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-5 shadow-none flex flex-col h-[350px]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Recent Activities</h4>
              <Button variant="ghost" className="text-xs font-semibold text-[#9B5CF6] hover:bg-[#9B5CF6]/10 px-2.5 h-8 rounded-lg cursor-pointer">
                View All
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {data.recentActivities.map((act) => {
                const borderStyle =
                  act.category === "Environment"
                    ? "bg-[#10B981]"
                    : act.category === "Social"
                    ? "bg-[#F59E0B]"
                    : act.category === "Governance"
                    ? "bg-[#3B82F6]"
                    : "bg-[#7C3AED]";

                return (
                  <div key={act.id} className="flex gap-3 relative min-w-0">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`h-2 w-2 rounded-full ${borderStyle} ring-4 ring-white dark:ring-[#181922] mt-1.5`} />
                      <div className="w-0.5 bg-[#ececee] dark:bg-[#2d2f39] flex-1 mt-1" />
                    </div>
                    <div className="min-w-0 pb-2">
                      <p className="text-xs font-semibold text-[#09090b] dark:text-white leading-snug break-words">
                        {act.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground/80 font-medium">
                          {act.category}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60">•</span>
                        <span className="text-[10px] text-muted-foreground/60">
                          {act.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Top Performing Departments */}
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-5 shadow-none flex flex-col h-[350px]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Top Performing Departments</h4>
              <Button variant="ghost" className="text-xs font-semibold text-[#9B5CF6] hover:bg-[#9B5CF6]/10 px-2.5 h-8 rounded-lg cursor-pointer">
                View All
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {data.topDepartments.map((dept, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#09090b] dark:text-white">{dept.name}</span>
                    <span className="font-bold text-[#52525b] dark:text-gray-300">{Math.round(dept.score * periodMultiplier)}</span>
                  </div>
                  <div className="w-full bg-[#f4f4f5] dark:bg-[#0f1016] h-2 rounded-full overflow-hidden">
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
          <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-5 shadow-none flex flex-col h-[350px]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Pending Tasks</h4>
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
                  <div key={task.id} className="flex items-start gap-3 justify-between border-b border-[#ececee] dark:border-[#2d2f39]/40 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5 hover:text-[#9B5CF6] transition-colors cursor-pointer" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#09090b] dark:text-white leading-snug">
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
  };

  const isEmployee = data.user.role.toLowerCase() === "employee";
  const isDeptHead = data.user.role.toLowerCase() === "dept_head";

  const renderDashboardContent = () => {
    if (isEmployee) {
      return renderEmployeeDashboard();
    }
    if (isDeptHead) {
      return renderManagerDashboard();
    }
    return renderAdminDashboard();
  };

  return (
    <div className="space-y-6 pb-8 bg-[#f4f4f5] dark:bg-[#0f1016] min-h-screen text-[#09090b] dark:text-white">
      {/* Top Welcome bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">
            <span>Dashboard</span>
            <ChevronRight className="h-2.5 w-2.5" />
            <span className="text-muted-foreground/60">{isEmployee ? "Employee Stats" : isDeptHead ? "Manager overview" : "Overview"}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">
            Welcome back, {data.user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-xs text-muted-foreground">
            {isEmployee
              ? "Track your individual ESG challenge scores and badge accomplishments"
              : isDeptHead
              ? `Manage and review task metrics for the ${data.managerStats?.departmentName || "department"} team`
              : "Track and manage your organization's overall ESG performance"}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {!isEmployee && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-1.5 h-8.5 rounded-lg bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] text-xs font-semibold text-muted-foreground hover:bg-[#f4f4f5] dark:hover:bg-[#201E2A] hover:text-[#09090b] dark:hover:text-white transition-all cursor-pointer"
                  >
                    <Calendar className="h-4 w-4 text-[#9B5CF6]" />
                    <span>{periodLabels[calendarPeriod] || "Oct 1 – Oct 31, 2024"}</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground/60" />
                  </Button>
                }
              />
              <DropdownMenuContent className="bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-[#09090b] dark:text-white rounded-lg">
                <DropdownMenuItem onClick={() => setCalendarPeriod("oct")} className="text-xs text-[#09090b] dark:text-white focus:bg-[#f4f4f5] dark:focus:bg-[#2c2e3c] cursor-pointer">
                  Oct 1 – Oct 31, 2024
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCalendarPeriod("sep")} className="text-xs text-[#09090b] dark:text-white focus:bg-[#f4f4f5] dark:focus:bg-[#2c2e3c] cursor-pointer">
                  Sep 1 – Sep 30, 2024
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCalendarPeriod("aug")} className="text-xs text-[#09090b] dark:text-white focus:bg-[#f4f4f5] dark:focus:bg-[#2c2e3c] cursor-pointer">
                  Aug 1 – Aug 31, 2024
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCalendarPeriod("last6")} className="text-xs text-[#09090b] dark:text-white focus:bg-[#f4f4f5] dark:focus:bg-[#2c2e3c] cursor-pointer">
                  Last 6 Months
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button 
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs px-3 py-1.5 h-8.5 rounded-lg font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </Button>
              }
            />
            <DropdownMenuContent className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-lg z-50">
              <DropdownMenuItem 
                onClick={() => window.print()}
                className="text-xs text-[#09090b] dark:text-white focus:bg-[#f4f4f5] dark:focus:bg-[#1c1a24] cursor-pointer"
              >
                Download PDF Report
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  if (!data) return;
                  const headers = "Section,Metric,Value,Unit,Period\n";
                  const rows = [
                    ["Dashboard Summary", "Overall ESG Score", `${currentScores.overall}`, "/100", calendarPeriod.toUpperCase()],
                    ["Dashboard Summary", "Environment Score", `${currentScores.environment}`, "/100", calendarPeriod.toUpperCase()],
                    ["Dashboard Summary", "Social Score", `${currentScores.social}`, "/100", calendarPeriod.toUpperCase()],
                    ["Dashboard Summary", "Governance Score", `${currentScores.governance}`, "/100", calendarPeriod.toUpperCase()],
                    ...data.topDepartments.map((d, i) => [
                      "Top Departments",
                      `Rank #${i + 1} - ${d.name}`,
                      `${d.score}`,
                      "/100",
                      calendarPeriod.toUpperCase(),
                    ]),
                    ...data.pendingTasks.map((t) => [
                      "Pending Tasks",
                      t.title,
                      "Pending",
                      t.dueDate,
                      calendarPeriod.toUpperCase(),
                    ]),
                  ].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
                  const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", `esg_dashboard_report_${calendarPeriod}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  toast.success("CSV Dataset downloaded successfully!");
                }}
                className="text-xs text-[#09090b] dark:text-white focus:bg-[#f4f4f5] dark:focus:bg-[#1c1a24] cursor-pointer"
              >
                Download CSV Dataset
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {renderDashboardContent()}
    </div>
  );
}
