import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, ShieldCheck, Flame, Compass, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { AccessDenied } from "@/components/shared/access-denied";
import { DownloadReportButton } from "./download-report-button";

export default async function ReportsPage() {
  const session = await auth();
  const allowedRoles = ["admin", "esg_manager", "auditor", "dept_head", "employee"];

  const user = session?.user as any;
  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <AccessDenied />;
  }

  const reportsList = [
    { id: "1", name: "2026 ESG Impact Assessment (PDF)", type: "Annual Impact", date: "2026-06-30", size: "4.8 MB", framework: "GRI Standards", status: "Ready" },
    { id: "2", name: "Scope 1 & 2 Emissions Audit (XLSX)", type: "Carbon Accounting", date: "2026-05-15", size: "1.2 MB", framework: "TCFD Climate", status: "Ready" },
    { id: "3", name: "CSR Outreach Initiative - Mid-Year (PDF)", type: "Social Responsibility", date: "2026-04-10", size: "3.5 MB", framework: "SASB Index", status: "Ready" },
    { id: "4", name: "Board Diversity & Governance Standards (PDF)", type: "Corporate Governance", date: "2026-03-01", size: "2.1 MB", framework: "GRI Standards", status: "Ready" },
  ];

  const frameworks = [
    { name: "GRI Disclosures", desc: "Global Reporting Initiative standard reporting guidelines", color: "text-[#14b8a6]", bg: "bg-[#14b8a6]/10", border: "border-[#14b8a6]/20", icon: Compass },
    { name: "SASB Framework", desc: "Sustainability Accounting Standards Board industry metrics", color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10", border: "border-[#8b5cf6]/20", icon: Sparkles },
    { name: "TCFD Climate", desc: "Task Force on Climate-related Financial Disclosures metrics", color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10", border: "border-[#3b82f6]/20", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div>
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
          Compliance & Disclosures · Auditor Ready
        </p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
          ESG Reports & Disclosures
        </h1>
        <p className="text-xs text-muted-foreground mt-1 max-w-xl">
          Download and view audit-ready sustainability disclosures and compliance transcripts aligned with corporate frameworks.
        </p>
      </div>

      {/* Framework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {frameworks.map((fw) => {
          const Icon = fw.icon;
          return (
            <div key={fw.name} className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl p-5 hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-foreground">{fw.name}</span>
                <div className={`p-2 rounded-lg ${fw.bg} ${fw.color} border ${fw.border}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">{fw.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Main Reports Table */}
      <Card className="border border-[#ececee] dark:border-[#221f2c] bg-white dark:bg-[#121118] rounded-xl overflow-hidden shadow-xs">
        <CardHeader className="p-5 pb-4 border-b border-[#ececee] dark:border-[#221f2c]">
          <CardTitle className="flex items-center gap-2 text-sm text-foreground font-bold">
            <FileText className="h-4.5 w-4.5 text-purple-500" /> Generated Disclosures
          </CardTitle>
          <CardDescription className="text-muted-foreground text-[11px]">
            Audit transcripts matching global ESG index guidelines.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#ececee] dark:border-[#221f2c] bg-[#f4f4f5] dark:bg-[#121118]">
                <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider pl-6">Report Name</TableHead>
                <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Category</TableHead>
                <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Framework</TableHead>
                <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Release Date</TableHead>
                <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Size</TableHead>
                <TableHead className="text-right text-foreground font-semibold px-6 py-3 text-[11px] uppercase tracking-wider pr-6 w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportsList.map((r) => (
                <TableRow key={r.id} className="border-b border-[#ececee] dark:border-[#221f2c] last:border-0 hover:bg-[#f4f4f5] dark:hover:bg-[#16141f]/50 transition-colors">
                  <TableCell className="font-semibold text-foreground pl-6 flex items-center gap-2 py-3.5">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate max-w-xs sm:max-w-md">{r.name}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] rounded shadow-none">
                      {r.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground font-medium text-xs">
                    {r.framework}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{r.date}</TableCell>
                  <TableCell className="font-mono text-[11px] text-muted-foreground">{r.size}</TableCell>
                  <TableCell className="text-right pr-6 py-3.5">
                    <div className="flex justify-end gap-1">
                      <DownloadReportButton filename={r.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
