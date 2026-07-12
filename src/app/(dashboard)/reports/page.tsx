import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";
import { auth } from "@/auth";
import { AccessDenied } from "@/components/shared/access-denied";

export default async function ReportsPage() {
  const session = await auth();
  const allowedRoles = ["admin", "esg_manager", "auditor"];

  const user = session?.user as any;
  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <AccessDenied />;
  }

  const reportsList = [
    { name: "2026 ESG Impact Assessment (PDF)", type: "Annual Impact", date: "2026-06-30", size: "4.8 MB", status: "Ready" },
    { name: "Scope 1 & 2 Emissions Audit (XLSX)", type: "Carbon Accounting", date: "2026-05-15", size: "1.2 MB", status: "Ready" },
    { name: "CSR Outreach Initiative - Mid-Year (PDF)", type: "Social Responsibility", date: "2026-04-10", size: "3.5 MB", status: "Ready" },
    { name: "Board Diversity & Governance Standards (PDF)", type: "Corporate Governance", date: "2026-03-01", size: "2.1 MB", status: "Ready" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#09090b]">ESG Reports</h1>
        <p className="text-muted-foreground">
          Download and view audit-ready sustainability reports and disclosures
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            Generated Disclosures
          </CardTitle>
          <CardDescription>
            Download reports matching GRI, SASB, and TCFD compliance guidelines.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportsList.map((r, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium text-[#09090b] flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {r.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{r.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="font-mono text-xs">{r.size}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#22242f]">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#22242f]">
                      <Download className="h-4 w-4 text-primary" />
                    </Button>
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
