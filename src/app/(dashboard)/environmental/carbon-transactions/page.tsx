import { getCarbonTransactions } from "@/actions/carbon-transactions";
import { getDepartments } from "@/actions/departments";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

export default async function CarbonTransactionsPage() {
  const [transactions, departments] = await Promise.all([
    getCarbonTransactions(),
    getDepartments(),
  ]);

  const deptName = (id: string) =>
    departments.find((d) => d.id === id)?.name || "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Carbon Transactions</h1>
        <p className="text-muted-foreground">
          Review auto-calculated and manual carbon emission entries
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-[#9B5CF6]" />
            Transaction Ledger
          </CardTitle>
          <CardDescription>
            Audit log of all emissions by business units and emission sources.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No transactions recorded yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Source Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">CO₂e Value</TableHead>
                  <TableHead className="text-right">Calculation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-muted-foreground">
                      {t.date ? new Date(t.date).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {deptName(t.departmentId)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {t.sourceType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{t.quantity}</TableCell>
                    <TableCell className="text-right font-mono text-white font-semibold">
                      {parseFloat(t.co2eValue).toFixed(2)} t
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          t.autoCalculated
                            ? "bg-eco-green/10 text-eco-green border-eco-green/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {t.autoCalculated ? "Automated" : "Manual"}
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
