import { getAudits } from "@/actions/governance-items";
import { getDepartments } from "@/actions/departments";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export default async function AuditsPage() {
  const [audits, departments] = await Promise.all([
    getAudits(),
    getDepartments(),
  ]);

  const deptName = (id: string) =>
    departments.find((d) => d.id === id)?.name || "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Compliance Audits</h1>
        <p className="text-muted-foreground">
          Schedule, review, and audit internal governance and ESG compliance
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-[#3b82f6]" />
            Audit Ledger
          </CardTitle>
          <CardDescription>
            Historical and scheduled audits on policies, safety, and ESG standards.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {audits.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No audits registered.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Audit Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Auditor ID</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audits.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium text-white">{a.title}</TableCell>
                    <TableCell>{deptName(a.departmentId)}</TableCell>
                    <TableCell className="font-mono text-xs">{a.auditorId.substring(0, 8)}...</TableCell>
                    <TableCell className="text-muted-foreground">
                      {a.scheduledDate ? new Date(a.scheduledDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          a.status === "completed"
                            ? "bg-eco-green/10 text-eco-green border-eco-green/20"
                            : a.status === "in_progress"
                            ? "bg-eco-orange/10 text-eco-orange border-eco-orange/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {a.status.replace("_", " ")}
                      </Badge>
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
