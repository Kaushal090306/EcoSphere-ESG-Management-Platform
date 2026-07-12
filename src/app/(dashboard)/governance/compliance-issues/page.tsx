import { getComplianceIssues, getAudits } from "@/actions/governance-items";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export default async function ComplianceIssuesPage() {
  const [issues, audits] = await Promise.all([
    getComplianceIssues(),
    getAudits(),
  ]);

  const auditName = (id: string) =>
    audits.find((a) => a.id === id)?.title || "General Compliance";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Compliance Issues</h1>
        <p className="text-muted-foreground">
          Track and resolve environmental regulations and corporate policy violations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-eco-red" />
            Compliance Issues
          </CardTitle>
          <CardDescription>
            List of active warnings, non-compliance alerts, and corrective action tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {issues.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No compliance issues recorded. Good job!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Linked Audit / Source</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium text-white">
                      {auditName(i.auditId)}
                    </TableCell>
                    <TableCell className="max-w-md truncate">{i.description}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {i.dueDate ? new Date(i.dueDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          i.severity === "critical" || i.severity === "high"
                            ? "bg-eco-red/10 text-eco-red border-eco-red/20 font-semibold"
                            : i.severity === "medium"
                            ? "bg-eco-orange/10 text-eco-orange border-eco-orange/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {i.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          i.status === "resolved" || i.status === "closed"
                            ? "bg-eco-green/10 text-eco-green border-eco-green/20"
                            : i.status === "in_progress"
                            ? "bg-eco-orange/10 text-eco-orange border-eco-orange/20"
                            : "bg-eco-red/10 text-eco-red border-eco-red/20 animate-pulse"
                        }
                      >
                        {i.status.replace("_", " ")}
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
