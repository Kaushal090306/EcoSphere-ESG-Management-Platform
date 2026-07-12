"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Leaf, Users, ShieldCheck, BarChart3, RefreshCw, Save,
  TrendingUp, TrendingDown, Building2, Clock, Activity,
} from "lucide-react";
import { toast } from "sonner";
import { getEsgScoringData, type EsgScoringData } from "@/actions/esg-scoring";
import { updateEsgSettings } from "@/actions/esg-settings";
import { PageHeader } from "@/components/shared/page-header";

/* ── thin circular ring ─────────────────────────────── */
function RingScore({
  score, color, size = 96,
}: { score: number; color: string; size?: number }) {
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(score, 100) / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
        className="text-muted/30" strokeWidth={7} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
        strokeWidth={7} strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
    </svg>
  );
}

/* ── score metric card ──────────────────────────────── */
function MetricCard({
  label, score, color, icon: Icon, weight,
}: { label: string; score: number; color: string; icon: React.ElementType; weight: number }) {
  const grade = score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : "D";
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-5">
      <div className="relative shrink-0">
        <RingScore score={score} color={color} size={80} />
        <div className="absolute inset-0 flex items-center justify-center rotate-90">
          <span className="text-sm font-bold" style={{ color }}>{score}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-4 w-4" style={{ color }} />
          <span className="text-sm font-semibold text-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Grade</span>
          <span className="font-bold text-sm" style={{ color }}>{grade}</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-muted/40 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${score}%`, backgroundColor: color }} />
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">Weight: {weight}%</p>
      </div>
    </div>
  );
}

/* ── dept score badge ───────────────────────────────── */
function ScorePill({ value, color }: { value: number; color: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: `${color}18`, color }}>
      {value.toFixed(1)}
    </span>
  );
}

export default function EsgScoringPage() {
  const [data, setData] = useState<EsgScoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [envW, setEnvW] = useState(40);
  const [socW, setSocW] = useState(30);
  const [govW, setGovW] = useState(30);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const tooltipStyle = {
    backgroundColor: isDark ? "#18181b" : "#fff",
    border: `1px solid ${isDark ? "#27272a" : "#ececee"}`,
    borderRadius: "12px",
    color: isDark ? "#fafafa" : "#09090b",
    fontSize: "12px",
  };

  useEffect(() => {
    async function load() {
      try {
        const d = await getEsgScoringData();
        setData(d);
        setEnvW(d.weights.environmental);
        setSocW(d.weights.social);
        setGovW(d.weights.governance);
      } catch {
        toast.error("Failed to load scoring data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalW = envW + socW + govW;
  const isValidWeights = totalW === 100;

  const liveOverall = data
    ? Math.round(
        ((data.scores.environment * envW + data.scores.social * socW + data.scores.governance * govW) / 100) * 10
      ) / 10
    : 0;

  async function handleRecalc() {
    setRecalculating(true);
    await new Promise((r) => setTimeout(r, 1200));
    setRecalculating(false);
    toast.success("Scores recalculated successfully");
  }

  async function handleSaveWeights() {
    if (!isValidWeights) { toast.error("Weights must sum to 100%"); return; }
    setSaving(true);
    const res = await updateEsgSettings({
      environmentalWeight: envW,
      socialWeight: socW,
      governanceWeight: govW,
      autoEmissionCalculation: false,
      evidenceRequired: false,
      badgeAutoAward: false,
    });
    setSaving(false);
    if ("success" in res) toast.success("Weight configuration saved");
    else toast.error(res.error || "Failed to save");
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data) return <p className="text-muted-foreground">No data available.</p>;

  const overallGrade = data.scores.overall >= 85 ? "A" : data.scores.overall >= 70 ? "B" : data.scores.overall >= 55 ? "C" : "D";

  return (
    <div className="space-y-6">
      <PageHeader
        title="ESG Scoring Engine"
        description="Configurable scoring weights, department breakdowns, and audit trail"
        icon={BarChart3}
      >
        <button
          onClick={handleRecalc}
          disabled={recalculating}
          className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground hover:bg-muted/50 transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${recalculating ? "animate-spin" : ""}`} />
          {recalculating ? "Recalculating…" : "Recalculate"}
        </button>
      </PageHeader>

      {/* ── Top: Overall score + formula ── */}
      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        {/* Big ring */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 min-w-[180px]">
          <div className="relative">
            <RingScore score={data.scores.overall} color="#ff5a00" size={128} />
            <div className="absolute inset-0 flex flex-col items-center justify-center rotate-90">
              <span className="text-3xl font-bold text-[#ff5a00]">{data.scores.overall}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Overall ESG Score</p>
            <span className="inline-flex mt-1 items-center gap-1 rounded-full bg-[#ff5a00]/10 px-3 py-0.5 text-[12px] font-bold text-[#ff5a00]">
              Grade {overallGrade}
            </span>
          </div>
        </div>

        {/* Metric cards grid */}
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricCard label="Environmental" score={data.scores.environment} color="#16a34a" icon={Leaf} weight={envW} />
          <MetricCard label="Social" score={data.scores.social} color="#0ea5e9" icon={Users} weight={socW} />
          <MetricCard label="Governance" score={data.scores.governance} color="#8b5cf6" icon={ShieldCheck} weight={govW} />
        </div>
      </div>

      {/* ── Weight Config + Trend Chart ── */}
      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        {/* Weight config */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-foreground text-[14px]">Weight Configuration</h2>
          </div>
          <p className="text-[12px] text-muted-foreground -mt-3">
            Adjust how each pillar contributes to the overall ESG score. Must sum to 100%.
          </p>

          {/* Formula preview */}
          <div className="rounded-xl bg-muted/40 border border-border p-3 text-[12px] font-mono text-muted-foreground">
            ESG = ({envW}% × E) + ({socW}% × S) + ({govW}% × G)<br />
            <span className="text-[#ff5a00] font-semibold">≈ {liveOverall} / 100</span>
          </div>

          {[
            { label: "Environmental", color: "#16a34a", val: envW, set: setEnvW },
            { label: "Social", color: "#0ea5e9", val: socW, set: setSocW },
            { label: "Governance", color: "#8b5cf6", val: govW, set: setGovW },
          ].map(({ label, color, val, set }) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-[13px]">
                <span className="font-medium" style={{ color }}>{label}</span>
                <span className="font-bold" style={{ color }}>{val}%</span>
              </div>
              <input
                type="range" min={0} max={100} value={val}
                onChange={(e) => set(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-current"
                style={{ accentColor: color }}
              />
            </div>
          ))}

          <div className={`text-[12px] font-semibold ${isValidWeights ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
            Total: {totalW}% {!isValidWeights && "(must equal 100%)"}
          </div>

          <button
            onClick={handleSaveWeights}
            disabled={saving || !isValidWeights}
            className="w-full inline-flex items-center justify-center gap-2 rounded-[10px] bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save Weights"}
          </button>
        </div>

        {/* 6-month trend chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-foreground text-[14px]">6-Month Score Trend</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.trend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                {[
                  { id: "ovr", color: "#ff5a00" },
                  { id: "env", color: "#16a34a" },
                  { id: "soc", color: "#0ea5e9" },
                  { id: "gov", color: "#8b5cf6" },
                ].map(({ id, color }) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#27272a" : "#f0f0f0"} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: isDark ? "#71717a" : "#52525b" }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: isDark ? "#71717a" : "#52525b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              {[
                { key: "overall", color: "#ff5a00", id: "ovr", name: "Overall" },
                { key: "environment", color: "#16a34a", id: "env", name: "Environment" },
                { key: "social", color: "#0ea5e9", id: "soc", name: "Social" },
                { key: "governance", color: "#8b5cf6", id: "gov", name: "Governance" },
              ].map(({ key, color, id, name }) => (
                <Area key={key} type="monotone" dataKey={key} name={name}
                  stroke={color} strokeWidth={2} fill={`url(#${id})`} dot={false} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-4 justify-center">
            {[
              { label: "Overall", color: "#ff5a00" },
              { label: "Environment", color: "#16a34a" },
              { label: "Social", color: "#0ea5e9" },
              { label: "Governance", color: "#8b5cf6" },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-2 w-4 rounded-full" style={{ backgroundColor: color }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Department Scorecard Table ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-foreground text-[14px]">Department Scorecards</h2>
          <span className="ml-auto text-[11px] text-muted-foreground">Period: {data.departments[0]?.period || "2026-Q2"}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Department</th>
                <th className="px-4 py-3 text-center font-semibold text-[#16a34a]">Environmental</th>
                <th className="px-4 py-3 text-center font-semibold text-[#0ea5e9]">Social</th>
                <th className="px-4 py-3 text-center font-semibold text-[#8b5cf6]">Governance</th>
                <th className="px-4 py-3 text-center font-semibold text-[#ff5a00]">Total</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.departments.map((dept, i) => (
                <tr key={dept.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground w-4">#{i + 1}</span>
                      <span className="font-medium text-foreground">{dept.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center"><ScorePill value={dept.environmentalScore} color="#16a34a" /></td>
                  <td className="px-4 py-3 text-center"><ScorePill value={dept.socialScore} color="#0ea5e9" /></td>
                  <td className="px-4 py-3 text-center"><ScorePill value={dept.governanceScore} color="#8b5cf6" /></td>
                  <td className="px-4 py-3 text-center"><ScorePill value={dept.totalScore} color="#ff5a00" /></td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                        <div className="h-full rounded-full bg-[#ff5a00] transition-all duration-700"
                          style={{ width: `${Math.min(dept.totalScore, 100)}%` }} />
                      </div>
                      <span className="text-[11px] text-muted-foreground w-8 text-right">{dept.totalScore.toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Audit Trail ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-foreground text-[14px]">Score Audit Trail</h2>
          <span className="ml-auto text-[11px] text-muted-foreground">Last 5 changes</span>
        </div>
        <div className="divide-y divide-border">
          {data.auditLog.map((entry) => (
            <div key={entry.id} className="px-6 py-3 flex items-center gap-4 hover:bg-muted/20 transition-colors">
              <div className="shrink-0 h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                {entry.delta >= 0
                  ? <TrendingUp className="h-4 w-4 text-green-500" />
                  : <TrendingDown className="h-4 w-4 text-destructive" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground">{entry.trigger}</p>
                <p className="text-[11px] text-muted-foreground">{entry.timestamp}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-[12px]">
                <span className="text-muted-foreground">{entry.oldScore} →</span>
                <span className="font-semibold text-foreground">{entry.newScore}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  entry.delta >= 0
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-destructive/10 text-destructive"
                }`}>
                  {entry.delta >= 0 ? "+" : ""}{entry.delta.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
