import { getCsrActivities } from "@/actions/csr-activities";
import { getDepartments } from "@/actions/departments";
import { getCategories } from "@/actions/categories";
import { CsrActivitiesClient } from "./csr-activities-client";
import { auth } from "@/auth";

export default async function CsrActivitiesPage() {
  const [activities, departments, categories, session] = await Promise.all([
    getCsrActivities(),
    getDepartments(),
    getCategories(),
    auth(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#09090b]">CSR Activities</h1>
        <p className="text-muted-foreground">
          Corporate Social Responsibility events and volunteer opportunities
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HandHeart className="h-4 w-4 text-[#14b8a6]" />
            CSR Activities List
          </CardTitle>
          <CardDescription>
            Overview of community outreach and sustainability drives.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {activities.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No CSR activities found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Max Volunteers</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium text-[#09090b]">{a.title}</TableCell>
                    <TableCell>{deptName(a.departmentId)}</TableCell>
                    <TableCell>{a.location || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {a.date ? new Date(a.date).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="font-mono">{a.maxParticipants || "Unlimited"}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          a.status === "open"
                            ? "bg-eco-green/10 text-eco-green border-eco-green/20"
                            : a.status === "closed"
                            ? "bg-eco-red/10 text-eco-red border-eco-red/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {a.status}
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
