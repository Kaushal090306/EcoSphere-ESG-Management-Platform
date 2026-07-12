import { getEmployeeParticipations, getCsrActivities } from "@/actions/csr-activities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default async function EmployeeParticipationPage() {
  const [participations, activities] = await Promise.all([
    getEmployeeParticipations(),
    getCsrActivities(),
  ]);

  const activityName = (id: string) =>
    activities.find((a) => a.id === id)?.title || "Unknown Event";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#09090b]">Employee Participation</h1>
        <p className="text-muted-foreground">
          Track employee volunteer sign-ups, submissions, and reward points
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-[#14b8a6]" />
            Volunteer Record
          </CardTitle>
          <CardDescription>
            Audit log of employee sign-ups, participation status, and earned carbon credits.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {participations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No employee participations recorded yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sign-up Date</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Points Awarded</TableHead>
                  <TableHead>Approval Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participations.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-muted-foreground">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="font-medium text-[#09090b]">
                      {activityName(p.activityId)}
                    </TableCell>
                    <TableCell className="font-mono text-[#09090b] font-semibold">
                      +{p.pointsEarned} XP
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          p.approvalStatus === "approved"
                            ? "bg-eco-green/10 text-eco-green border-eco-green/20"
                            : p.approvalStatus === "rejected"
                            ? "bg-eco-red/10 text-eco-red border-eco-red/20"
                            : "bg-eco-orange/10 text-eco-orange border-eco-orange/20"
                        }
                      >
                        {p.approvalStatus}
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
