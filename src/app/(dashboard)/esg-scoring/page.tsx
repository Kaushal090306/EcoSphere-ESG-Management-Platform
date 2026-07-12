"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts";
import {
  Leaf, Users, ShieldCheck, RefreshCw, Save,
  TrendingUp, TrendingDown, Building2, Clock, Activity,
} from "lucide-react";
import { toast } from "sonner";
import { getEsgScoringData, type EsgScoringData } from "@/actions/esg-scoring";
import { updateEsgSettings } from "@/actions/esg-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/* ── circular ring gauge (same as score-card but inline) ── */
function RingGauge({ score, color, size = 120 }: { score: number; color: string; size?: number }) {
  const r = size / 2 - 9;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(score, 100) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="currentColor" strokeWidth={8} className="text-[#ececee] dark:text-[#1c1a24]" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }} />
    </svg>
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
    backgroundColor: isDark ? "#121118" : "#ffffff",
    border: `1px solid ${isDark ? "#221f2c" : "#ececee"}`,
    borderRadius: "8px",
    color: isDark ? "#ffffff" : "#09090b",
    fontSize: "12px",
    boxShadow: "rgba(0,0,0,0.06) 0px 4px 12px 0px",
  };
  const tooltipItemStyle = { padding: "1px 0", color: isDark ? "#a1a1aa" : "#52525b" };

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
    ? Math.round(((data.scores.environment * envW + data.scores.social * socW + data.scores.governance * govW) / 100) * 10) / 10
    : 0;

  async function handleRecalc() {
    setRecalculating(true);
    await new Promise((r) => setTimeout(r, 1400));
    setRecalculating(false);
    toast.success("Scores recalculated successfully");
  }

  async function handleSaveWeights() {
    if (!isValidWeights) { toast.error("Weights must sum to 100%"); return; }
    setSaving(true);
    const res = await updateEsgSettings({
      environmentalWeight: envW, socialWeight: socW, governanceWeight: govW,
      autoEmissionCalculation: false, evidenceRequired: false, badgeAutoAward: false,
    });
    setSaving(false);
    if ("success" in res) toast.success("Weight configuration saved");
    else toast.error(res.error || "Failed to save");
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#09090b] border-t-transparent dark:border-white dark:border-t-transparent" />
      </div>
    );
  }
  if (!data) return <p className="text-[#71717a]">No data available.</p>;

  const overallGrade = data.scores.overall >= 85 ? "A" : data.scores.overall >= 70 ? "B" : data.scores.overall >= 55 ? "C" : "D";

  const pillars = [
    { label: "Environmental", score: data.scores.environment, color: "#14b8a6", icon: Leaf, weight: envW },
    { label: "Social",        score: data.scores.social,       color: "#8b5cf6", icon: Users, weight: socW },
    { label: "Governance",    score: data.scores.governance,   color: "#3b82f6", icon: ShieldCheck, weight: govW },
  ];

  const sliders = [
    { label: "Environmental", color: "#14b8a6", val: envW, set: setEnvW },
    { label: "Social",        color: "#8b5cf6", val: socW, set: setSocW },
    { label: "Governance",    color: "#3b82f6", val: govW, set: setGovW },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
            Governance & Analytics · ESG Engine
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
            ESG Scoring
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRecalc}
            disabled={recalculating}
            className="flex items-center gap-2 px-3.5 h-9 rounded-lg bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] text-xs font-semibold hover:bg-black/90 dark:hover:bg-white/95 transition-all shadow-none disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${recalculating ? "animate-spin" : ""}`} />
            {recalculating ? "Recalculating…" : "Recalculate All"}
          </Button>
        </div>
      </div>

      {/* ── KPI Row: Overall + 3 pillars ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Overall score card */}
        <div className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs">
          <div className="relative">
            <RingGauge score={data.scores.overall} color="#ff5a00" size={120} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[28px] font-bold text-[#ff5a00] leading-none">{data.scores.overall}</span>
              <span className="text-[10px] text-muted-foreground font-medium">/100</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Overall ESG Score</p>
            <span className="inline-flex mt-1.5 items-center rounded-full bg-[#ff5a00]/10 px-3 py-0.5 text-[10px] font-bold text-[#ff5a00]">
              Grade {overallGrade}
            </span>
          </div>
        </div>

        {/* E / S / G cards */}
        {pillars.map(({ label, score, color, icon: Icon, weight }) => {
          const grade = score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : "D";
          return (
            <div key={label}
              className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl p-6 relative overflow-hidden hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{label}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ececee] dark:border-[#221f2c]"
                  style={{ backgroundColor: `${color}12` }}>
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[40px] font-bold text-foreground leading-none">{score}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-bold text-xs" style={{ color }}>Grade {grade}</span>
                <span>·</span>
                <span>Weight: {weight}%</span>
              </div>
              {/* mini progress bar at bottom */}
              <div className="mt-4 w-full h-1 rounded-full bg-[#e4e4e7]/60 dark:bg-[#1c1a24] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${score}%`, backgroundColor: color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-7">
        {/* Trend Line Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl p-6 hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-foreground">6-Month Score Trend</h3>
              <div className="flex flex-wrap gap-4 text-xs mt-2.5">
                {[
                  { label: "Overall",     color: "#ff5a00" },
                  { label: "Environment", color: "#14b8a6" },
                  { label: "Social",      color: "#8b5cf6" },
                  { label: "Governance",  color: "#3b82f6" },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-muted-foreground text-[11px]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#221f2c" : "#ececee"} vertical={false} />
                <XAxis dataKey="month" stroke={isDark ? "#71717a" : "#71717a"} fontSize={11}
                  tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke={isDark ? "#71717a" : "#71717a"} fontSize={11}
                  tickLine={false} axisLine={false} domain={[40, 100]}
                  ticks={[40, 55, 70, 85, 100]} tickMargin={10} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                <Line type="monotone" dataKey="overall"     stroke="#ff5a00" strokeWidth={2} dot={{ r: 3, strokeWidth: 1.5, fill: isDark ? "#121118" : "#fff" }} activeDot={{ r: 4 }} name="Overall" />
                <Line type="monotone" dataKey="environment" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3, strokeWidth: 1.5, fill: isDark ? "#121118" : "#fff" }} activeDot={{ r: 4 }} name="Environment" />
                <Line type="monotone" dataKey="social"      stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, strokeWidth: 1.5, fill: isDark ? "#121118" : "#fff" }} activeDot={{ r: 4 }} name="Social" />
                <Line type="monotone" dataKey="governance"  stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, strokeWidth: 1.5, fill: isDark ? "#121118" : "#fff" }} activeDot={{ r: 4 }} name="Governance" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Configuration */}
        <div className="lg:col-span-3 bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl p-6 flex flex-col hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">Weight Configuration</h3>
          </div>
          <p className="text-[11px] text-muted-foreground mb-4">Adjust pillar weights. Must sum to 100%.</p>

          {/* Live formula */}
          <div className="rounded-lg bg-[#e4e4e7]/60 dark:bg-[#0c0a0e] border border-[#ececee] dark:border-[#221f2c] px-4 py-3 mb-4 font-mono text-[11px] text-muted-foreground">
            <span>ESG = ({envW}%·E) + ({socW}%·S) + ({govW}%·G)</span>
            <br />
            <span className="font-bold text-[#ff5a00]">≈ {liveOverall} / 100</span>
          </div>

          <div className="space-y-4 flex-1">
            {sliders.map(({ label, color, val, set }) => (
              <div key={label}>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="font-semibold text-xs" style={{ color }}>{label}</span>
                  <span className="font-bold text-foreground">{val}%</span>
                </div>
                <input type="range" min={0} max={100} value={val}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-100 dark:bg-[#1c1a24]"
                  style={{ accentColor: color }} />
              </div>
            ))}
          </div>

          <div className={`text-[12px] font-semibold mt-4 mb-3 ${isValidWeights ? "text-[#14b8a6]" : "text-red-500"}`}>
            Total: {totalW}% {!isValidWeights && "· must equal 100%"}
          </div>

          <Button onClick={handleSaveWeights} disabled={saving || !isValidWeights}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] text-xs font-semibold h-9 hover:bg-black/90 dark:hover:bg-white/95 transition-all shadow-none disabled:opacity-60">
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving…" : "Save Weights"}
          </Button>
        </div>
      </div>

      {/* ── Bottom Row: Department Table + Audit Trail ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Department Scorecard – takes 2 cols */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs">
          <div className="px-6 py-4 border-b border-[#ececee] dark:border-[#221f2c] flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">Department Scorecards</h3>
            <span className="ml-auto text-[11px] text-muted-foreground">{data.departments[0]?.period || "2026-Q2"}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#ececee] dark:border-[#221f2c] bg-[#f4f4f5] dark:bg-[#121118]">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-foreground uppercase tracking-wider">Dept</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#14b8a6]">Env</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#8b5cf6]">Soc</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#3b82f6]">Gov</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#ff5a00]">Total</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-foreground uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody>
                {data.departments.map((dept, i) => (
                  <tr key={dept.id} className="border-b border-[#ececee] dark:border-[#221f2c] last:border-0 hover:bg-[#f4f4f5] dark:hover:bg-[#16141f]/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-4">#{i + 1}</span>
                        <span className="font-semibold text-foreground">{dept.name}</span>
                      </div>
                    </td>
                    {[
                      { v: dept.environmentalScore, c: "#14b8a6" },
                      { v: dept.socialScore,        c: "#8b5cf6" },
                      { v: dept.governanceScore,    c: "#3b82f6" },
                      { v: dept.totalScore,         c: "#ff5a00" },
                    ].map(({ v, c }, j) => (
                      <td key={j} className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center rounded px-2 py-0.5 text-[11px] font-bold"
                          style={{ backgroundColor: `${c}15`, color: c }}>
                          {v.toFixed(1)}
                        </span>
                      </td>
                    ))}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-[#e4e4e7]/60 dark:bg-[#1c1a24] overflow-hidden">
                          <div className="h-full rounded-full bg-[#ff5a00] transition-all duration-700"
                            style={{ width: `${Math.min(dept.totalScore, 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-7 text-right">{dept.totalScore.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Trail */}
        <div className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-zinc-800 transition-all flex flex-col shadow-xs">
          <div className="px-6 py-4 border-b border-[#ececee] dark:border-[#221f2c] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-bold text-foreground">Audit Trail</h3>
            </div>
            <span className="text-[11px] text-muted-foreground">Last 5</span>
          </div>
          <div className="flex-1 divide-y divide-[#ececee] dark:divide-[#221f2c]">
            {data.auditLog.map((entry) => (
              <div key={entry.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-[#f4f4f5] dark:hover:bg-[#16141f]/50 transition-colors">
                <div className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${
                  entry.delta >= 0 ? "bg-[#f0fdf4] dark:bg-[#14b8a6]/10" : "bg-red-50 dark:bg-red-500/10"
                }`}>
                  {entry.delta >= 0
                    ? <TrendingUp className="h-4 w-4 text-[#14b8a6]" />
                    : <TrendingDown className="h-4 w-4 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-foreground truncate">{entry.trigger}</p>
                  <p className="text-[10px] text-muted-foreground">{entry.timestamp}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  entry.delta >= 0 ? "bg-[#f0fdf4] dark:bg-[#14b8a6]/10 text-[#14b8a6]" : "bg-red-50 dark:bg-red-500/10 text-red-500"
                }`}>
                  {entry.delta >= 0 ? "+" : ""}{entry.delta.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
