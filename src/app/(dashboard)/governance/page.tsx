"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Shield, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  Info,
  Clock,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  AreaChart,
  Area
} from "recharts";

// Static sparklines templates
const sparklineData1 = [
  { val: 85 }, { val: 87 }, { val: 86 }, { val: 89 }, { val: 91 }, 
  { val: 90 }, { val: 93 }, { val: 91 }, { val: 92 }, { val: 90 }, { val: 94 }
];
const sparklineData2 = [
  { val: 8 }, { val: 8 }, { val: 9 }, { val: 9 }, { val: 10 }, 
  { val: 10 }, { val: 11 }, { val: 11 }, { val: 12 }, { val: 12 }, { val: 12 }
];
const sparklineData3 = [
  { val: 1 }, { val: 2 }, { val: 2 }, { val: 3 }, { val: 4 }, 
  { val: 4 }, { val: 5 }, { val: 6 }, { val: 7 }, { val: 7 }, { val: 8 }
];
const sparklineData4 = [
  { val: 5 }, { val: 6 }, { val: 4 }, { val: 5 }, { val: 3 }, 
  { val: 4 }, { val: 2 }, { val: 3 }, { val: 1 }, { val: 2 }, { val: 2 }
];

export default function GovernanceOverviewPage() {
  const searchParams = useSearchParams();
  const period = searchParams.get("period") || "oct";

  const kpiData = {
    oct: {
      compliance: "94%",
      complianceTrend: "2.1%",
      complianceUp: true,
      active: "12",
      activeTrend: "0%",
      activeUp: true,
      audits: "8",
      auditsTrend: "14.3%",
      auditsUp: true,
      issues: "2",
      issuesTrend: "50.0%",
      issuesUp: false,
      sparkMult1: 1.0,
      sparkMult2: 1.0,
      sparkMult3: 1.0,
      sparkMult4: 1.0,
      chart: [
        { category: "Anti-Bribery", compliance: 100 },
        { category: "Environmental", compliance: 95 },
        { category: "Whistleblower", compliance: 85 },
        { category: "Privacy", compliance: 90 },
      ],
      issuesList: [
        { name: "Vendor audit outstanding", severity: "Medium", status: "Open" },
        { name: "Privacy training pending", severity: "Low", status: "Open" }
      ],
      logs: [
        { title: "Quarterly ESG Report Audit", result: "Passed", time: "2 hours ago" },
        { title: "Anti-Bribery Policy Update", result: "Published", time: "1 day ago" },
        { title: "GDPR Privacy Assessment", result: "Passed", time: "3 days ago" }
      ]
    },
    sep: {
      compliance: "92%",
      complianceTrend: "1.5%",
      complianceUp: true,
      active: "11",
      activeTrend: "0%",
      activeUp: true,
      audits: "7",
      auditsTrend: "10.0%",
      auditsUp: true,
      issues: "4",
      issuesTrend: "33.3%",
      issuesUp: true,
      sparkMult1: 0.98,
      sparkMult2: 0.92,
      sparkMult3: 0.88,
      sparkMult4: 2.0,
      chart: [
        { category: "Anti-Bribery", compliance: 98 },
        { category: "Environmental", compliance: 92 },
        { category: "Whistleblower", compliance: 82 },
        { category: "Privacy", compliance: 88 },
      ],
      issuesList: [
        { name: "Vendor audit outstanding", severity: "Medium", status: "Open" },
        { name: "Privacy training pending", severity: "Low", status: "Open" },
        { name: "Emissions data signature missing", severity: "High", status: "Open" },
        { name: "Scope 3 verification delay", severity: "Medium", status: "Open" }
      ],
      logs: [
        { title: "Data Security Audit", result: "Passed", time: "1 week ago" },
        { title: "Health & Safety Policy review", result: "Passed", time: "1 week ago" }
      ]
    },
    aug: {
      compliance: "90%",
      complianceTrend: "0.8%",
      complianceUp: true,
      active: "10",
      activeTrend: "0%",
      activeUp: true,
      audits: "6",
      auditsTrend: "5.0%",
      auditsUp: true,
      issues: "3",
      issuesTrend: "15.0%",
      issuesUp: false,
      sparkMult1: 0.95,
      sparkMult2: 0.83,
      sparkMult3: 0.75,
      sparkMult4: 1.5,
      chart: [
        { category: "Anti-Bribery", compliance: 95 },
        { category: "Environmental", compliance: 90 },
        { category: "Whistleblower", compliance: 80 },
        { category: "Privacy", compliance: 85 },
      ],
      issuesList: [
        { name: "Vendor audit outstanding", severity: "Medium", status: "Open" },
        { name: "Privacy training pending", severity: "Low", status: "Open" },
        { name: "Vendor risk analysis required", severity: "Medium", status: "Open" }
      ],
      logs: [
        { title: "Code of Conduct Training Audit", result: "Passed", time: "2 weeks ago" },
        { title: "Supplier Integrity Review", result: "Passed", time: "3 weeks ago" }
      ]
    },
    last6: {
      compliance: "93%",
      complianceTrend: "3.2%",
      complianceUp: true,
      active: "12",
      activeTrend: "9.1%",
      activeUp: true,
      audits: "41",
      auditsTrend: "18.4%",
      auditsUp: true,
      issues: "18",
      issuesTrend: "12.0%",
      issuesUp: false,
      sparkMult1: 5.8,
      sparkMult2: 6.2,
      sparkMult3: 6.0,
      sparkMult4: 5.9,
      chart: [
        { category: "Anti-Bribery", compliance: 97 },
        { category: "Environmental", compliance: 93 },
        { category: "Whistleblower", compliance: 82 },
        { category: "Privacy", compliance: 87 },
      ],
      issuesList: [
        { name: "Cumulative audit backlog", severity: "Medium", status: "Open" },
        { name: "Annual verification delay", severity: "High", status: "Open" }
      ],
      logs: [
        { title: "Bi-Annual Governance Audit", result: "Passed", time: "1 month ago" },
        { title: "Information Security Compliance Assessment", result: "Passed", time: "2 months ago" }
      ]
    }
  }[period as "oct" | "sep" | "aug" | "last6"] || {
    compliance: "94%",
    complianceTrend: "2.1%",
    complianceUp: true,
    active: "12",
    activeTrend: "0%",
    activeUp: true,
    audits: "8",
    auditsTrend: "14.3%",
    auditsUp: true,
    issues: "2",
    issuesTrend: "50.0%",
    issuesUp: false,
    sparkMult1: 1.0,
    sparkMult2: 1.0,
    sparkMult3: 1.0,
    sparkMult4: 1.0,
    chart: [
      { category: "Anti-Bribery", compliance: 100 },
      { category: "Environmental", compliance: 95 },
      { category: "Whistleblower", compliance: 85 },
      { category: "Privacy", compliance: 90 },
    ],
    issuesList: [
      { name: "Vendor audit outstanding", severity: "Medium", status: "Open" },
      { name: "Privacy training pending", severity: "Low", status: "Open" }
    ],
    logs: [
      { title: "Quarterly ESG Report Audit", result: "Passed", time: "2 hours ago" },
      { title: "Anti-Bribery Policy Update", result: "Published", time: "1 day ago" },
      { title: "GDPR Privacy Assessment", result: "Passed", time: "3 days ago" }
    ]
  };

  // Build local period sparklines
  const currentSpark1 = sparklineData1.map(d => ({ val: Math.round(d.val * kpiData.sparkMult1) }));
  const currentSpark2 = sparklineData2.map(d => ({ val: Math.round(d.val * kpiData.sparkMult2) }));
  const currentSpark3 = sparklineData3.map(d => ({ val: Math.round(d.val * kpiData.sparkMult3) }));
  const currentSpark4 = sparklineData4.map(d => ({ val: Math.round(d.val * kpiData.sparkMult4) }));

  return (
    <div className="space-y-6 text-[#09090b] dark:text-white bg-[#f4f4f5] dark:bg-[#0f1016]">
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Policy Compliance */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Policy Compliance</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {kpiData.compliance} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">acknowledged</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-emerald-400">
                  {kpiData.complianceUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{kpiData.complianceTrend}</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">vs last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentSpark1} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
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

        {/* KPI 2: Active Policies */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                <FileText className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Active Policies</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {kpiData.active} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">published</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-emerald-400">
                  {kpiData.activeUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{kpiData.activeTrend}</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentSpark2} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
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

        {/* KPI 3: Compliance Audits */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                <Shield className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Compliance Audits</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {kpiData.audits} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">completed</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-emerald-400">
                  {kpiData.auditsUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{kpiData.auditsTrend}</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">vs last year</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentSpark3} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
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

        {/* KPI 4: Open Issues */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl overflow-hidden flex flex-col justify-between shadow-none [--card-spacing:0px] py-0">
          <CardContent className="p-5 pb-2 space-y-3.5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[13px] text-[#71717a] dark:text-[#8e909a] font-medium block">Open Issues</span>
                <h3 className="text-[26px] font-normal text-[#09090b] dark:text-white leading-none flex items-baseline gap-1.5 mt-1">
                  {kpiData.issues} <span className="text-[11px] text-[#71717a] dark:text-[#8e909a] font-semibold">active</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold pt-1 text-emerald-400">
                  {kpiData.issuesUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{kpiData.issuesTrend}</span>
                  <span className="text-muted-foreground/60 font-normal ml-0.5">vs last month</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-11 w-full overflow-hidden mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentSpark4} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
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

      {/* Row 2: Compliance Rates and History Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Plot 1: Compliance rates by category */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 lg:col-span-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Policy Compliance by Category</h4>
            </div>
            <div className="flex items-center gap-2 bg-[#f4f4f5] dark:bg-[#0f1016] border border-[#ececee] dark:border-[#2d2f39] rounded-lg px-2.5 py-1 text-[11px] text-muted-foreground cursor-pointer">
              <span>Overall Rate</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={kpiData.chart} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#252731" vertical={false} />
              <XAxis dataKey="category" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" }} />
              <Bar dataKey="compliance" fill="url(#barGlow)" radius={[4, 4, 0, 0]} barSize={28}>
                {kpiData.chart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "url(#barGlow)" : "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Card 2: Recent Audit History */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 lg:col-span-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Recent Audits</h4>
            <Button 
              render={<Link href="/governance/audits" />}
              variant="ghost" 
              className="text-[10px] text-[#7C3AED] hover:text-[#6D28D9] p-0 h-auto cursor-pointer"
            >
              View All
            </Button>
          </div>

          <div className="space-y-3.5 my-auto">
            {kpiData.logs.map((log, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 mt-0.5">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <div className="text-[11px]">
                  <p className="font-medium text-[#09090b] dark:text-white leading-normal">{log.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-emerald-400 font-semibold">{log.result}</span>
                    <span className="text-muted-foreground/60">•</span>
                    <span className="text-muted-foreground/60">{log.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-center border-t border-[#ececee] dark:border-[#2d2f39]/50 pt-2.5">
            <Link 
              href="/governance/audits"
              className="text-[10px] text-[#7C3AED] hover:text-[#6D28D9] h-auto p-0 inline-flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>View Audit Logs</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </Card>

        {/* Card 3: Active Compliance Alerts */}
        <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl p-5 lg:col-span-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#09090b] dark:text-white">Active Alerts</h4>
            <Button 
              render={<Link href="/governance/compliance-issues" />}
              variant="ghost" 
              className="text-[10px] text-muted-foreground hover:text-[#09090b] dark:hover:text-white p-0 h-auto cursor-pointer"
            >
              View All
            </Button>
          </div>

          <div className="space-y-3.5 my-auto">
            {kpiData.issuesList.map((issue, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-semibold text-[#09090b] dark:text-white truncate max-w-[130px]">{issue.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    issue.severity === "High" ? "bg-red-500/10 text-red-400" :
                    issue.severity === "Medium" ? "bg-amber-500/10 text-amber-400" :
                    "bg-blue-500/10 text-blue-400"
                  }`}>{issue.severity}</span>
                </div>
                <div className="h-1.5 w-full bg-[#f4f4f5] dark:bg-[#0f1016] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${
                    issue.severity === "High" ? "bg-red-500" :
                    issue.severity === "Medium" ? "bg-amber-500" :
                    "bg-blue-500"
                  }`} style={{ width: issue.severity === "High" ? "90%" : issue.severity === "Medium" ? "60%" : "30%" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
