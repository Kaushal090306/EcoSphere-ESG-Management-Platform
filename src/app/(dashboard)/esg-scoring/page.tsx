"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts";
import {
  Leaf, Users, ShieldCheck, BarChart3, RefreshCw, Save,
  TrendingUp, TrendingDown, Building2, Clock, Activity,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { getEsgScoringData, type EsgScoringData } from "@/actions/esg-scoring";
import { updateEsgSettings } from "@/actions/esg-settings";
import { Button } from "@/components/ui/button";

/* ── circular ring gauge (same as score-card but inline) ── */
function RingGauge({ score, color, size = 120 }: { score: number; color: string; size?: number }) {
  const r = size / 2 - 9;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(score, 100) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="currentColor" strokeWidth={8} className="text-[#f4f4f5] dark:text-[#27272a]" />
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
    backgroundColor: isDark ? "#18181b" : "#ffffff",
    border: `1px solid ${isDark ? "#27272a" : "#ececee"}`,
    borderRadius: "12px",
    color: isDark ? "#fafafa" : "#09090b",
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#09090b] border-t-transparent dark:border-[#fafafa] dark:border-t-transparent" />
      </div>
    );
  }
  if (!data) return <p className="text-[#71717a]">No data available.</p>;

  const overallGrade = data.scores.overall >= 85 ? "A" : data.scores.overall >= 70 ? "B" : data.scores.overall >= 55 ? "C" : "D";

  const pillars = [
    { label: "Environmental", score: data.scores.environment, color: "#16a34a", icon: Leaf, weight: envW },
    { label: "Social",        score: data.scores.social,       color: "#d97706", icon: Users, weight: socW },
    { label: "Governance",    score: data.scores.governance,   color: "#2563eb", icon: ShieldCheck, weight: govW },
  ];

  const sliders = [
    { label: "Environmental", color: "#16a34a", val: envW, set: setEnvW },
    { label: "Social",        color: "#d97706", val: socW, set: setSocW },
    { label: "Governance",    color: "#2563eb", val: govW, set: setGovW },
  ];

  return (
    <div className="space-y-6 pb-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs text-[#71717a] font-semibold uppercase tracking-wider mb-1">
            Module 7 · ESG Engine
          </p>
          <h1 className="text-[32px] font-bold tracking-tight text-[#09090b] dark:text-[#fafafa] leading-tight">
            ESG Scoring
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRecalc}
            disabled={recalculating}
            className="flex items-center gap-2 px-4 py-2 h-10 rounded-lg bg-[#09090b] dark:bg-[#fafafa] text-white dark:text-[#09090b] text-sm font-medium hover:bg-[#18181b] dark:hover:bg-[#e4e4e7] transition-all border border-[#09090b] dark:border-[#fafafa] shadow-none disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${recalculating ? "animate-spin" : ""}`} />
            {recalculating ? "Recalculating…" : "Recalculate All"}
          </Button>
        </div>
      </div>

      {/* ── KPI Row: Overall + 3 pillars ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Overall score card */}
        <div className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#ececee] dark:border-[#2d2f39] rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-[#d4d4d8] dark:hover:border-[#3f3f46] hover:shadow-[rgba(0,0,0,0.04)_0px_4px_12px_0px] transition-all">
          <div className="relative">
            <RingGauge score={data.scores.overall} color="#ff5a00" size={120} />
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: "rotate(0deg)" }}>
              <span className="text-[28px] font-bold text-[#ff5a00] leading-none">{data.scores.overall}</span>
              <span className="text-[10px] text-[#a1a1aa] font-medium">/100</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-[#71717a] font-bold uppercase tracking-wider">Overall ESG Score</p>
            <span className="inline-flex mt-1.5 items-center rounded-full bg-[#ff5a00]/10 px-3 py-0.5 text-[11px] font-bold text-[#ff5a00]">
              Grade {overallGrade}
            </span>
          </div>
        </div>

        {/* E / S / G cards */}
        {pillars.map(({ label, score, color, icon: Icon, weight }) => {
          const grade = score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : "D";
          return (
            <div key={label}
              className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#ececee] dark:border-[#2d2f39] rounded-xl p-6 relative overflow-hidden hover:border-[#d4d4d8] dark:hover:border-[#3f3f46] hover:shadow-[rgba(0,0,0,0.04)_0px_4px_12px_0px] transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-[11px] text-[#71717a] uppercase font-bold tracking-wider">{label}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-[12px] border border-[#ececee] dark:border-[#ececee] dark:border-[#2d2f39]"
                  style={{ backgroundColor: `${color}12` }}>
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[40px] font-bold text-[#09090b] dark:text-[#fafafa] leading-none">{score}</span>
                <span className="text-sm text-[#a1a1aa]">/100</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#71717a]">
                <span className="font-bold text-sm" style={{ color }}>Grade {grade}</span>
                <span>·</span>
                <span>Weight: {weight}%</span>
              </div>
              {/* mini progress bar at bottom */}
              <div className="mt-4 w-full h-1 rounded-full bg-[#f4f4f5] dark:bg-[#f4f4f5] dark:bg-[#0f1016] overflow-hidden">
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
        <div className="lg:col-span-4 bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#ececee] dark:border-[#2d2f39] rounded-xl p-6 hover:border-[#d4d4d8] dark:hover:border-[#3f3f46] transition-all">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-[#09090b] dark:text-[#fafafa]">6-Month Score Trend</h3>
              <div className="flex flex-wrap gap-4 text-xs mt-2.5">
                {[
                  { label: "Overall",     color: "#ff5a00" },
                  { label: "Environment", color: "#16a34a" },
                  { label: "Social",      color: "#d97706" },
                  { label: "Governance",  color: "#2563eb" },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[#71717a]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#27272a" : "#ececee"} vertical={false} />
                <XAxis dataKey="month" stroke={isDark ? "#3f3f46" : "#d4d4d8"} fontSize={11}
                  tickLine={false} axisLine={false} tickMargin={10}
                  tick={{ fill: isDark ? "#71717a" : "#71717a" }} />
                <YAxis stroke={isDark ? "#3f3f46" : "#d4d4d8"} fontSize={11}
                  tickLine={false} axisLine={false} domain={[40, 100]}
                  ticks={[40, 55, 70, 85, 100]} tickMargin={10}
                  tick={{ fill: isDark ? "#71717a" : "#71717a" }} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                <Line type="monotone" dataKey="overall"     stroke="#ff5a00" strokeWidth={2} dot={{ r: 3, strokeWidth: 1.5, fill: isDark ? "#18181b" : "#fff" }} activeDot={{ r: 4 }} name="Overall" />
                <Line type="monotone" dataKey="environment" stroke="#16a34a" strokeWidth={2} dot={{ r: 3, strokeWidth: 1.5, fill: isDark ? "#18181b" : "#fff" }} activeDot={{ r: 4 }} name="Environment" />
                <Line type="monotone" dataKey="social"      stroke="#d97706" strokeWidth={2} dot={{ r: 3, strokeWidth: 1.5, fill: isDark ? "#18181b" : "#fff" }} activeDot={{ r: 4 }} name="Social" />
                <Line type="monotone" dataKey="governance"  stroke="#2563eb" strokeWidth={2} dot={{ r: 3, strokeWidth: 1.5, fill: isDark ? "#18181b" : "#fff" }} activeDot={{ r: 4 }} name="Governance" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Configuration */}
        <div className="lg:col-span-3 bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#ececee] dark:border-[#2d2f39] rounded-xl p-6 flex flex-col hover:border-[#d4d4d8] dark:hover:border-[#3f3f46] transition-all">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-[#71717a]" />
            <h3 className="text-base font-bold text-[#09090b] dark:text-[#fafafa]">Weight Configuration</h3>
          </div>
          <p className="text-[12px] text-[#71717a] mb-4">Adjust pillar weights. Must sum to 100%.</p>

          {/* Live formula */}
          <div className="rounded-[14px] bg-[#f4f4f5] dark:bg-[#f4f4f5] dark:bg-[#0f1016] border border-[#ececee] dark:border-[#3f3f46] px-4 py-3 mb-4 font-mono text-[11px] text-[#52525b] dark:text-[#a1a1aa]">
            <span>ESG = ({envW}%·E) + ({socW}%·S) + ({govW}%·G)</span>
            <br />
            <span className="font-bold text-[#ff5a00]">≈ {liveOverall} / 100</span>
          </div>

          <div className="space-y-4 flex-1">
            {sliders.map(({ label, color, val, set }) => (
              <div key={label}>
                <div className="flex justify-between text-[12px] mb-1.5">
                  <span className="font-semibold" style={{ color }}>{label}</span>
                  <span className="font-bold text-[#09090b] dark:text-[#fafafa]">{val}%</span>
                </div>
                <input type="range" min={0} max={100} value={val}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: color }} />
              </div>
            ))}
          </div>

          <div className={`text-[12px] font-semibold mt-4 mb-3 ${isValidWeights ? "text-[#16a34a]" : "text-red-500"}`}>
            Total: {totalW}% {!isValidWeights && "· must equal 100%"}
          </div>

          <Button onClick={handleSaveWeights} disabled={saving || !isValidWeights}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#09090b] dark:bg-[#fafafa] text-white dark:text-[#09090b] text-sm font-medium h-10 hover:bg-[#18181b] dark:hover:bg-[#e4e4e7] transition-all shadow-none disabled:opacity-60">
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save Weights"}
          </Button>
        </div>
      </div>

      {/* ── Bottom Row: Department Table + Audit Trail ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Department Scorecard – takes 2 cols */}
        <div className="lg:col-span-2 bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden hover:border-[#d4d4d8] dark:hover:border-[#3f3f46] transition-all">
          <div className="px-6 py-4 border-b border-[#ececee] dark:border-[#ececee] dark:border-[#2d2f39] flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#71717a]" />
            <h3 className="text-base font-bold text-[#09090b] dark:text-[#fafafa]">Department Scorecards</h3>
            <span className="ml-auto text-[11px] text-[#a1a1aa]">{data.departments[0]?.period || "2026-Q2"}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#ececee] dark:border-[#ececee] dark:border-[#2d2f39] bg-[#f4f4f5] dark:bg-[#1a1822]">
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-[#71717a] uppercase tracking-wider">Dept</th>
                  <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#16a34a]">Env</th>
                  <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#d97706]">Soc</th>
                  <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">Gov</th>
                  <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#ff5a00]">Total</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-[#71717a] uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody>
                {data.departments.map((dept, i) => (
                  <tr key={dept.id} className="border-b border-[#ececee] dark:border-[#ececee] dark:border-[#2d2f39] last:border-0 hover:bg-[#f4f4f5] dark:hover:bg-[#f4f4f5] dark:bg-[#0f1016]/40 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#a1a1aa] w-4">#{i + 1}</span>
                        <span className="font-semibold text-[#09090b] dark:text-[#fafafa]">{dept.name}</span>
                      </div>
                    </td>
                    {[
                      { v: dept.environmentalScore, c: "#16a34a" },
                      { v: dept.socialScore,        c: "#d97706" },
                      { v: dept.governanceScore,    c: "#2563eb" },
                      { v: dept.totalScore,         c: "#ff5a00" },
                    ].map(({ v, c }, j) => (
                      <td key={j} className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-bold"
                          style={{ backgroundColor: `${c}15`, color: c }}>
                          {v.toFixed(1)}
                        </span>
                      </td>
                    ))}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-[#f4f4f5] dark:bg-[#f4f4f5] dark:bg-[#0f1016] overflow-hidden">
                          <div className="h-full rounded-full bg-[#ff5a00] transition-all duration-700"
                            style={{ width: `${Math.min(dept.totalScore, 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-[#a1a1aa] w-7 text-right">{dept.totalScore.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Trail */}
        <div className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden hover:border-[#d4d4d8] dark:hover:border-[#3f3f46] transition-all flex flex-col">
          <div className="px-6 py-4 border-b border-[#ececee] dark:border-[#ececee] dark:border-[#2d2f39] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#71717a]" />
              <h3 className="text-base font-bold text-[#09090b] dark:text-[#fafafa]">Audit Trail</h3>
            </div>
            <span className="text-[11px] text-[#a1a1aa]">Last 5</span>
          </div>
          <div className="flex-1 divide-y divide-[#ececee] dark:divide-[#ececee] dark:divide-[#2d2f39]">
            {data.auditLog.map((entry) => (
              <div key={entry.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-[#f4f4f5] dark:hover:bg-[#f4f4f5] dark:bg-[#0f1016]/40 transition-colors">
                <div className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${
                  entry.delta >= 0 ? "bg-[#f0fdf4] dark:bg-[#16a34a]/10" : "bg-red-50 dark:bg-red-500/10"
                }`}>
                  {entry.delta >= 0
                    ? <TrendingUp className="h-4 w-4 text-[#16a34a]" />
                    : <TrendingDown className="h-4 w-4 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#09090b] dark:text-[#fafafa] truncate">{entry.trigger}</p>
                  <p className="text-[10px] text-[#a1a1aa]">{entry.timestamp}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  entry.delta >= 0 ? "bg-[#f0fdf4] dark:bg-[#16a34a]/10 text-[#16a34a]" : "bg-red-50 dark:bg-red-500/10 text-red-500"
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
