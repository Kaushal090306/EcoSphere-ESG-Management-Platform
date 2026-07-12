"use client";

import { useState, useEffect, useTransition } from "react";
import { 
  FileText, 
  Download, 
  Search, 
  Calendar, 
  SlidersHorizontal, 
  Lock, 
  Leaf, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Clock
} from "lucide-react";
import { getReportData, ReportFilters } from "@/actions/reports";
import { toast } from "sonner";

interface Option {
  id: string;
  name: string;
  [key: string]: any;
}

interface ReportsClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    departmentId: string | null;
  };
  options: {
    departments: Option[];
    employees: Option[];
    challenges: Option[];
    categories: Option[];
  };
}

export function ReportsClient({ user, options }: ReportsClientProps) {
  const [reportType, setReportType] = useState<string>("esg-summary");
  const [isPending, startTransition] = useTransition();
  const [reportData, setReportData] = useState<any>(null);

  // Filter states
  const [departmentId, setDepartmentId] = useState<string>(
    user.role === "admin" || user.role === "esg_manager" || user.role === "auditor" 
      ? "" 
      : user.departmentId || ""
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [moduleId, setModuleId] = useState<string>("all");
  const [employeeId, setEmployeeId] = useState<string>(
    user.role === "employee" ? user.id : ""
  );
  const [challengeId, setChallengeId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");

  // Is a filter locked based on role
  const isDeptLocked = user.role !== "admin" && user.role !== "esg_manager" && user.role !== "auditor";
  const isEmployeeLocked = user.role === "employee";

  // Trigger report fetch
  const fetchReport = () => {
    const filters: ReportFilters = {
      departmentId: departmentId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      moduleId: moduleId !== "all" ? moduleId : undefined,
      employeeId: employeeId || undefined,
      challengeId: challengeId || undefined,
      categoryId: categoryId || undefined,
    };

    startTransition(async () => {
      try {
        const res = await getReportData(reportType, filters);
        setReportData(res);
      } catch (err: any) {
        toast.error("Failed to generate report data: " + err.message);
      }
    });
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, departmentId, startDate, endDate, moduleId, employeeId, challengeId, categoryId]);

  // Export functions
  const handleExport = (format: "csv" | "excel" | "pdf") => {
    if (!reportData) {
      toast.error("No report data available to export");
      return;
    }

    if (format === "pdf") {
      window.print();
      toast.success("Opened print window for PDF saving!");
      return;
    }

    // Helper to escape CSV cell values
    const escapeCsvValue = (val: any) => {
      if (val === null || val === undefined) return "";
      const stringVal = String(val);
      if (stringVal.includes(",") || stringVal.includes('"') || stringVal.includes("\n")) {
        return `"${stringVal.replace(/"/g, '""')}"`;
      }
      return stringVal;
    };

    let csvContent = "";
    let filename = `${reportType}_report_${new Date().toISOString().split("T")[0]}`;

    if (reportType === "environmental" && reportData.environmental) {
      const headers = ["Date", "Department", "Factor Name", "Scope", "Quantity", "CO2e Value", "Source Type"];
      csvContent += headers.map(escapeCsvValue).join(",") + "\n";
      reportData.environmental.forEach((row: any) => {
        csvContent += [
          new Date(row.date).toLocaleDateString(),
          row.departmentName,
          row.factorName,
          row.scope,
          row.quantity,
          row.co2eValue,
          row.sourceType
        ].map(escapeCsvValue).join(",") + "\n";
      });
    } else if (reportType === "social" && reportData.social) {
      csvContent += "--- CSR Activity Participations ---\n";
      const csrHeaders = ["Date", "Employee Name", "Activity Title", "Points Earned", "Status"];
      csvContent += csrHeaders.map(escapeCsvValue).join(",") + "\n";
      reportData.social.csr.forEach((row: any) => {
        csvContent += [
          new Date(row.date).toLocaleDateString(),
          row.employeeName,
          row.activityTitle,
          row.pointsEarned,
          row.status
        ].map(escapeCsvValue).join(",") + "\n";
      });

      csvContent += "\n--- Training Records ---\n";
      const trainingHeaders = ["Date", "Employee Name", "Course Name", "Status"];
      csvContent += trainingHeaders.map(escapeCsvValue).join(",") + "\n";
      reportData.social.training.forEach((row: any) => {
        csvContent += [
          new Date(row.date).toLocaleDateString(),
          row.employeeName,
          row.courseName,
          row.status
        ].map(escapeCsvValue).join(",") + "\n";
      });
    } else if (reportType === "governance" && reportData.governance) {
      csvContent += "--- Policy Acknowledgements ---\n";
      const ackHeaders = ["Date", "Employee Name", "Policy Title", "Version"];
      csvContent += ackHeaders.map(escapeCsvValue).join(",") + "\n";
      reportData.governance.policyAcks.forEach((row: any) => {
        csvContent += [
          new Date(row.date).toLocaleDateString(),
          row.employeeName,
          row.policyTitle,
          row.version
        ].map(escapeCsvValue).join(",") + "\n";
      });

      csvContent += "\n--- Compliance Issues ---\n";
      const issueHeaders = ["Description", "Severity", "Status", "Due Date", "Owner Name", "Audit Title"];
      csvContent += issueHeaders.map(escapeCsvValue).join(",") + "\n";
      reportData.governance.complianceIssues.forEach((row: any) => {
        csvContent += [
          row.description,
          row.severity,
          row.status,
          new Date(row.dueDate).toLocaleDateString(),
          row.ownerName,
          row.auditTitle
        ].map(escapeCsvValue).join(",") + "\n";
      });
    } else if (reportType === "esg-summary" && reportData.esgSummary) {
      const s = reportData.esgSummary;
      csvContent += "ESG Summary Assessment Report\n";
      csvContent += `Generated: ${new Date().toLocaleDateString()}\n\n`;
      csvContent += "Metric,Value,Score\n";
      csvContent += `Overall ESG Performance,${s.overallScore}/100,N/A\n`;
      csvContent += `Environmental (Scope 1/2/3),${s.environmental.totalEmissions} tCO2e,${s.environmental.score}/100\n`;
      csvContent += `Social (CSR & Training),${s.social.csrParticipationCount} Approved Activities,${s.social.score}/100\n`;
      csvContent += `Governance (Compliance & Audits),${s.governance.openComplianceIssues} Open Issues,${s.governance.score}/100\n`;
    } else if (reportType === "custom" && reportData.custom) {
      const c = reportData.custom;
      if (c.emissions.length > 0) {
        csvContent += "--- Carbon Transactions ---\n";
        csvContent += ["Date", "Department", "Factor Name", "Quantity", "CO2e"].map(escapeCsvValue).join(",") + "\n";
        c.emissions.forEach((r: any) => {
          csvContent += [new Date(r.date).toLocaleDateString(), r.departmentName, r.factorName, r.quantity, r.co2eValue].map(escapeCsvValue).join(",") + "\n";
        });
      }
      if (c.csr.length > 0) {
        csvContent += "\n--- CSR Activities ---\n";
        csvContent += ["Date", "Employee Name", "Activity Title", "XP Earned", "Status"].map(escapeCsvValue).join(",") + "\n";
        c.csr.forEach((r: any) => {
          csvContent += [new Date(r.date).toLocaleDateString(), r.employeeName, r.activityTitle, r.pointsEarned, r.status].map(escapeCsvValue).join(",") + "\n";
        });
      }
      if (c.training.length > 0) {
        csvContent += "\n--- Trainings ---\n";
        csvContent += ["Date", "Employee Name", "Course Name", "Status"].map(escapeCsvValue).join(",") + "\n";
        c.training.forEach((r: any) => {
          csvContent += [new Date(r.date).toLocaleDateString(), r.employeeName, r.courseName, r.status].map(escapeCsvValue).join(",") + "\n";
        });
      }
      if (c.policyAcks.length > 0) {
        csvContent += "\n--- Policy Acknowledgements ---\n";
        csvContent += ["Date", "Employee Name", "Policy Title", "Version"].map(escapeCsvValue).join(",") + "\n";
        c.policyAcks.forEach((r: any) => {
          csvContent += [new Date(r.date).toLocaleDateString(), r.employeeName, r.policyTitle, r.version].map(escapeCsvValue).join(",") + "\n";
        });
      }
    }

    const mime = format === "excel" 
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      : "text/csv;charset=utf-8;";
    const fileExtension = format === "excel" ? "xlsx" : "csv";

    const blob = new Blob([csvContent], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported report as ${format.toUpperCase()} successfully!`);
  };

  const getDepartmentName = (id: string) => {
    const dept = options.departments.find(d => d.id === id);
    return dept ? dept.name : "All Departments";
  };

  const getEmployeeName = (id: string) => {
    const emp = options.employees.find(e => e.id === id);
    return emp ? emp.name : "All Employees";
  };

  return (
    <div className="space-y-6 pb-12 print:p-8 print:bg-white print:text-black">
      {/* Top Banner (Header) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
            Analytics & Disclosures
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#09090b] dark:text-white">
            ESG Compliance Reports
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            Build, filter, and export corporate ESG audits. System accesses are scoped automatically to your workspace profile ({user.role}).
          </p>
        </div>

        {/* Global Export actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExport("csv")}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] hover:bg-[#f4f4f5] dark:hover:bg-[#1c1a24] text-xs font-semibold text-[#09090b] dark:text-white rounded-lg transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
          <button
            onClick={() => handleExport("excel")}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] hover:bg-[#f4f4f5] dark:hover:bg-[#1c1a24] text-xs font-semibold text-[#09090b] dark:text-white rounded-lg transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Excel
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-xs font-semibold text-white rounded-lg shadow-[0_0_15px_rgba(155,92,246,0.3)] transition-all cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5" /> PDF / Print
          </button>
        </div>
      </div>

      {/* Print-Only Header */}
      <div className="hidden print:block mb-8">
        <h1 className="text-4xl font-bold border-b pb-4">EcoSphere ESG Audit Disclosure</h1>
        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          <div>
            <p><strong>Report Type:</strong> {reportType.toUpperCase()}</p>
            <p><strong>Generated By:</strong> {user.name} ({user.role})</p>
            <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
          </div>
          <div>
            <p><strong>Department Scope:</strong> {getDepartmentName(departmentId)}</p>
            <p><strong>Employee Scope:</strong> {getEmployeeName(employeeId)}</p>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap border-b border-[#ececee] dark:border-[#221f2c] gap-1 print:hidden">
        {[
          { id: "esg-summary", label: "ESG Summary Assessment", icon: BarChart3 },
          { id: "environmental", label: "Environmental (E) Report", icon: Leaf },
          { id: "social", label: "Social (S) Report", icon: Users },
          { id: "governance", label: "Governance (G) Report", icon: ShieldCheck },
          { id: "custom", label: "Custom Report Builder", icon: SlidersHorizontal },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = reportType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 -mb-px cursor-pointer ${
                active 
                  ? "border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-500/5" 
                  : "border-transparent text-muted-foreground hover:text-[#09090b] dark:hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-purple-500" : "text-muted-foreground"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter panel */}
      <div className="bg-[#121118] border border-[#221f2c] rounded-xl p-5 print:hidden">
        <div className="flex items-center justify-between mb-4 border-b border-[#221f2c] pb-3">
          <span className="text-xs font-extrabold uppercase text-purple-400 tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-purple-500" /> Filter Configuration
          </span>
          {isPending && <Clock className="h-4 w-4 text-purple-500 animate-spin" />}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Department Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
              Department {isDeptLocked && <Lock className="h-3 w-3 text-purple-500" />}
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              disabled={isDeptLocked}
              className="w-full text-xs bg-[#181720] border border-[#2c2a38] text-white rounded-lg p-2 focus:ring-1 focus:ring-purple-500 outline-none disabled:opacity-50"
            >
              {!isDeptLocked && <option value="">All Departments</option>}
              {options.departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Employee Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
              Employee {isEmployeeLocked && <Lock className="h-3 w-3 text-purple-500" />}
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              disabled={isEmployeeLocked}
              className="w-full text-xs bg-[#181720] border border-[#2c2a38] text-white rounded-lg p-2 focus:ring-1 focus:ring-purple-500 outline-none disabled:opacity-50"
            >
              {!isEmployeeLocked && <option value="">All Employees</option>}
              {options.employees.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          {/* Module Filter (only active on Custom) */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Module Scope</label>
            <select
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              disabled={reportType !== "custom"}
              className="w-full text-xs bg-[#181720] border border-[#2c2a38] text-white rounded-lg p-2 focus:ring-1 focus:ring-purple-500 outline-none disabled:opacity-50"
            >
              <option value="all">All Modules</option>
              <option value="environmental">Environmental</option>
              <option value="social">Social</option>
              <option value="governance">Governance</option>
            </select>
          </div>

          {/* Challenge Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Gamified Challenge</label>
            <select
              value={challengeId}
              onChange={(e) => setChallengeId(e.target.value)}
              className="w-full text-xs bg-[#181720] border border-[#2c2a38] text-white rounded-lg p-2 focus:ring-1 focus:ring-purple-500 outline-none disabled:opacity-50"
            >
              <option value="">All Challenges</option>
              {options.challenges.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">ESG Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full text-xs bg-[#181720] border border-[#2c2a38] text-white rounded-lg p-2 focus:ring-1 focus:ring-purple-500 outline-none disabled:opacity-50"
            >
              <option value="">All Categories</option>
              {options.categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Date Range Start */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-xs bg-[#181720] border border-[#2c2a38] text-white rounded-lg p-2 focus:ring-1 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Date Range End */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full text-xs bg-[#181720] border border-[#2c2a38] text-white rounded-lg p-2 focus:ring-1 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Output Content area */}
      <div className="min-h-[250px] bg-[#121118] border border-[#221f2c] rounded-xl overflow-hidden shadow-xs">
        {isPending && !reportData ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3">
            <Clock className="h-8 w-8 text-purple-500 animate-spin" />
            <p className="text-xs text-muted-foreground font-semibold">Compiling Audit Logs...</p>
          </div>
        ) : !reportData ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-2">
            <Search className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground font-semibold">Select criteria to trigger report compilation</p>
          </div>
        ) : (
          <div>
            {/* 1. ESG Summary Report Render */}
            {reportType === "esg-summary" && reportData.esgSummary && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Overall Card */}
                  <div className="bg-[#181922] rounded-2xl p-6 border border-[#2A2D38] shadow-[0_0_20px_rgba(155,92,246,0.15)] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-purple-400 tracking-wider">Overall Rating</span>
                      <h2 className="text-5xl font-extrabold text-white mt-2">{reportData.esgSummary.overallScore}</h2>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-green-400 font-semibold mt-4">
                      <Sparkles className="h-3.5 w-3.5" /> Certified Index Score
                    </div>
                  </div>

                  {/* Env Card */}
                  <div className="bg-[#181922] rounded-2xl p-6 border border-[#2A2D38] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">Environmental (E)</span>
                      <h3 className="text-3xl font-extrabold text-white mt-2">{reportData.esgSummary.environmental.score}/100</h3>
                      <p className="text-xs text-muted-foreground mt-1">Total Emissions: {reportData.esgSummary.environmental.totalEmissions} tCO₂e</p>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-4">
                      Based on {reportData.esgSummary.environmental.carbonTxCount} Carbon Records
                    </div>
                  </div>

                  {/* Social Card */}
                  <div className="bg-[#181922] rounded-2xl p-6 border border-[#2A2D38] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-blue-400 tracking-wider">Social (S)</span>
                      <h3 className="text-3xl font-extrabold text-white mt-2">{reportData.esgSummary.social.score}/100</h3>
                      <p className="text-xs text-muted-foreground mt-1">Training Rate: {reportData.esgSummary.social.trainingCompletionRate}%</p>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-4">
                      {reportData.esgSummary.social.csrParticipationCount} Approved CSR Actions
                    </div>
                  </div>

                  {/* Gov Card */}
                  <div className="bg-[#181922] rounded-2xl p-6 border border-[#2A2D38] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-yellow-500 tracking-wider">Governance (G)</span>
                      <h3 className="text-3xl font-extrabold text-white mt-2">{reportData.esgSummary.governance.score}/100</h3>
                      <p className="text-xs text-muted-foreground mt-1">Policy Ack Rate: {reportData.esgSummary.governance.policyAcknowledgementRate}%</p>
                    </div>
                    <div className="text-[10px] text-red-400 font-semibold mt-4 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> {reportData.esgSummary.governance.openComplianceIssues} open issues
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-9B5CF6/5 border border-purple-500/10 rounded-xl">
                  <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-purple-500" /> Auditor Assessment Summary
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    This automated ledger rolls up environmental accounting (Scope 1 electricity/fuel transactions), social audits (CSR volunteer credits and anti-bribery training records), and corporate governance policies. It represents an immutable audit-ready compliance transcription.
                  </p>
                </div>
              </div>
            )}

            {/* 2. Environmental Report Render */}
            {reportType === "environmental" && reportData.environmental && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1a1824] border-b border-[#2c2a38] text-[10px] uppercase font-extrabold text-purple-400 tracking-wider">
                      <th className="p-4">Date</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Source Category / Factor Name</th>
                      <th className="p-4">Scope</th>
                      <th className="p-4">Quantity Ingested</th>
                      <th className="p-4">Emissions (tCO₂e)</th>
                      <th className="p-4">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#221f2c] text-xs text-white">
                    {reportData.environmental.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-muted-foreground">No carbon transaction logs found.</td>
                      </tr>
                    ) : (
                      reportData.environmental.map((row: any) => (
                        <tr key={row.id} className="hover:bg-[#1a1824]/50">
                          <td className="p-4">{new Date(row.date).toLocaleDateString()}</td>
                          <td className="p-4 font-semibold">{row.departmentName}</td>
                          <td className="p-4">{row.factorName}</td>
                          <td className="p-4 uppercase text-[10px] font-bold text-muted-foreground">{row.scope}</td>
                          <td className="p-4">{row.quantity}</td>
                          <td className="p-4 font-bold text-emerald-400">{row.co2eValue}</td>
                          <td className="p-4 capitalize">{row.sourceType}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. Social Report Render */}
            {reportType === "social" && reportData.social && (
              <div className="space-y-6">
                <div>
                  <h4 className="p-4 text-xs font-extrabold text-purple-400 uppercase tracking-wider bg-[#1a1824] border-b border-[#2c2a38]">
                    CSR Volunteering & Activities
                  </h4>
                  <table className="w-full text-left border-collapse text-xs text-white">
                    <thead>
                      <tr className="border-b border-[#221f2c] bg-white/5 text-[10px] uppercase font-bold text-muted-foreground">
                        <th className="p-3 pl-4">Date</th>
                        <th className="p-3">Employee</th>
                        <th className="p-3">CSR Activity</th>
                        <th className="p-3">XP Awarded</th>
                        <th className="p-3 pr-4">Approval Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#221f2c]">
                      {reportData.social.csr.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-muted-foreground">No CSR participation records found.</td>
                        </tr>
                      ) : (
                        reportData.social.csr.map((row: any) => (
                          <tr key={row.id} className="hover:bg-white/5">
                            <td className="p-3 pl-4">{new Date(row.date).toLocaleDateString()}</td>
                            <td className="p-3 font-semibold">{row.employeeName}</td>
                            <td className="p-3">{row.activityTitle}</td>
                            <td className="p-3 text-purple-400 font-bold">+{row.pointsEarned} XP</td>
                            <td className="p-3 pr-4">
                              <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded uppercase ${
                                row.status === "approved" ? "bg-emerald-500/10 text-emerald-400" :
                                row.status === "pending" ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-400"
                              }`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="p-4 text-xs font-extrabold text-purple-400 uppercase tracking-wider bg-[#1a1824] border-b border-[#2c2a38]">
                    Anti-Bribery & Skill Compliance Training
                  </h4>
                  <table className="w-full text-left border-collapse text-xs text-white">
                    <thead>
                      <tr className="border-b border-[#221f2c] bg-white/5 text-[10px] uppercase font-bold text-muted-foreground">
                        <th className="p-3 pl-4">Date Completed / Created</th>
                        <th className="p-3">Employee</th>
                        <th className="p-3">Course Name</th>
                        <th className="p-3 pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#221f2c]">
                      {reportData.social.training.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-muted-foreground">No training records found.</td>
                        </tr>
                      ) : (
                        reportData.social.training.map((row: any) => (
                          <tr key={row.id} className="hover:bg-white/5">
                            <td className="p-3 pl-4">{new Date(row.date).toLocaleDateString()}</td>
                            <td className="p-3 font-semibold">{row.employeeName}</td>
                            <td className="p-3">{row.courseName}</td>
                            <td className="p-3 pr-4">
                              <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded uppercase ${
                                row.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-500"
                              }`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. Governance Report Render */}
            {reportType === "governance" && reportData.governance && (
              <div className="space-y-6">
                <div>
                  <h4 className="p-4 text-xs font-extrabold text-purple-400 uppercase tracking-wider bg-[#1a1824] border-b border-[#2c2a38]">
                    Policy Signature Checklist
                  </h4>
                  <table className="w-full text-left border-collapse text-xs text-white">
                    <thead>
                      <tr className="border-b border-[#221f2c] bg-white/5 text-[10px] uppercase font-bold text-muted-foreground">
                        <th className="p-3 pl-4">Signature Date</th>
                        <th className="p-3">Employee</th>
                        <th className="p-3">Acknowledged ESG Policy</th>
                        <th className="p-3 pr-4">Version</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#221f2c]">
                      {reportData.governance.policyAcks.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-muted-foreground">No policy signature acknowledgements.</td>
                        </tr>
                      ) : (
                        reportData.governance.policyAcks.map((row: any) => (
                          <tr key={row.id} className="hover:bg-white/5">
                            <td className="p-3 pl-4">{new Date(row.date).toLocaleDateString()}</td>
                            <td className="p-3 font-semibold">{row.employeeName}</td>
                            <td className="p-3">{row.policyTitle}</td>
                            <td className="p-3 pr-4 font-mono text-[10px]">{row.version}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="p-4 text-xs font-extrabold text-purple-400 uppercase tracking-wider bg-[#1a1824] border-b border-[#2c2a38]">
                    Compliance Audit Findings & Ticket Tracker
                  </h4>
                  <table className="w-full text-left border-collapse text-xs text-white">
                    <thead>
                      <tr className="border-b border-[#221f2c] bg-white/5 text-[10px] uppercase font-bold text-muted-foreground">
                        <th className="p-3 pl-4">Incidents Description</th>
                        <th className="p-3">Severity</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Assigned Owner</th>
                        <th className="p-3">Compliance Due Date</th>
                        <th className="p-3 pr-4">Source Audit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#221f2c]">
                      {reportData.governance.complianceIssues.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-muted-foreground">No compliance tickets logged.</td>
                        </tr>
                      ) : (
                        reportData.governance.complianceIssues.map((row: any) => (
                          <tr key={row.id} className="hover:bg-white/5">
                            <td className="p-3 pl-4 font-semibold">{row.description}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded uppercase ${
                                row.severity === "critical" || row.severity === "high" ? "bg-red-500/10 text-red-400" :
                                row.severity === "medium" ? "bg-yellow-500/10 text-yellow-500" : "bg-blue-500/10 text-blue-400"
                              }`}>
                                {row.severity}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded uppercase ${
                                row.status === "resolved" || row.status === "closed" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                              }`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="p-3">{row.ownerName}</td>
                            <td className="p-3">{new Date(row.dueDate).toLocaleDateString()}</td>
                            <td className="p-3 pr-4">{row.auditTitle}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. Custom Builder Report Render */}
            {reportType === "custom" && reportData.custom && (
              <div className="p-4 space-y-6">
                <div className="p-4 bg-purple-9B5CF6/5 border border-purple-500/10 rounded-xl">
                  <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-purple-500" /> Compiled Custom Query
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] text-muted-foreground">
                    <div>Emissions Logs: <span className="text-white font-bold">{reportData.custom.emissions.length}</span></div>
                    <div>CSR Activity: <span className="text-white font-bold">{reportData.custom.csr.length}</span></div>
                    <div>Trainings Done: <span className="text-white font-bold">{reportData.custom.training.length}</span></div>
                    <div>Policy Sigs: <span className="text-white font-bold">{reportData.custom.policyAcks.length}</span></div>
                  </div>
                </div>

                <div className="space-y-4">
                  {reportData.custom.emissions.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider text-purple-400">Carbon Ingestions</h4>
                      <div className="border border-[#221f2c] rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs text-white">
                          <tr className="bg-white/5 font-bold border-b border-[#221f2c] text-[10px] text-muted-foreground uppercase">
                            <th className="p-2.5 pl-4">Date</th>
                            <th className="p-2.5">Department</th>
                            <th className="p-2.5">Factor</th>
                            <th className="p-2.5">Qty</th>
                            <th className="p-2.5 pr-4">CO2e Value</th>
                          </tr>
                          {reportData.custom.emissions.map((r: any) => (
                            <tr key={r.id} className="border-b border-[#221f2c] last:border-0 hover:bg-white/5">
                              <td className="p-2.5 pl-4">{new Date(r.date).toLocaleDateString()}</td>
                              <td className="p-2.5">{r.departmentName}</td>
                              <td className="p-2.5">{r.factorName}</td>
                              <td className="p-2.5">{r.quantity}</td>
                              <td className="p-2.5 pr-4 text-emerald-400 font-bold">{r.co2eValue}</td>
                            </tr>
                          ))}
                        </table>
                      </div>
                    </div>
                  )}

                  {reportData.custom.csr.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider text-purple-400">CSR volunteering</h4>
                      <div className="border border-[#221f2c] rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs text-white">
                          <tr className="bg-white/5 font-bold border-b border-[#221f2c] text-[10px] text-muted-foreground uppercase">
                            <th className="p-2.5 pl-4">Date</th>
                            <th className="p-2.5">Employee</th>
                            <th className="p-2.5">Activity</th>
                            <th className="p-2.5 pr-4">Points</th>
                          </tr>
                          {reportData.custom.csr.map((r: any) => (
                            <tr key={r.id} className="border-b border-[#221f2c] last:border-0 hover:bg-white/5">
                              <td className="p-2.5 pl-4">{new Date(r.date).toLocaleDateString()}</td>
                              <td className="p-2.5">{r.employeeName}</td>
                              <td className="p-2.5">{r.activityTitle}</td>
                              <td className="p-2.5 pr-4 text-purple-400 font-bold">+{r.pointsEarned} XP</td>
                            </tr>
                          ))}
                        </table>
                      </div>
                    </div>
                  )}

                  {reportData.custom.training.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider text-purple-400">Trainings completed</h4>
                      <div className="border border-[#221f2c] rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs text-white">
                          <tr className="bg-white/5 font-bold border-b border-[#221f2c] text-[10px] text-muted-foreground uppercase">
                            <th className="p-2.5 pl-4">Date</th>
                            <th className="p-2.5">Employee</th>
                            <th className="p-2.5">Course</th>
                            <th className="p-2.5 pr-4">Status</th>
                          </tr>
                          {reportData.custom.training.map((r: any) => (
                            <tr key={r.id} className="border-b border-[#221f2c] last:border-0 hover:bg-white/5">
                              <td className="p-2.5 pl-4">{new Date(r.date).toLocaleDateString()}</td>
                              <td className="p-2.5">{r.employeeName}</td>
                              <td className="p-2.5">{r.courseName}</td>
                              <td className="p-2.5 pr-4 uppercase text-[9px] font-bold text-emerald-400">{r.status}</td>
                            </tr>
                          ))}
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
