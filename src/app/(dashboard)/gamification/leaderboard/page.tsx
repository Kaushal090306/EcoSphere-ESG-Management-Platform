import { getLeaderboards } from "@/actions/gamification";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown, Building2, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export default async function LeaderboardPage() {
  const { employees, departments } = await getLeaderboards();

  const renderRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-amber-400 fill-amber-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-zinc-300 fill-zinc-300" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700 fill-amber-700" />;
    return <span className="font-mono font-bold text-muted-foreground pl-1.5">{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leaderboard & Standings"
        description="Celebrate top individual contributors and watch departments compete for sustainability supremacy"
        icon={Trophy}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Employee Leaderboard */}
        <Card className="border border-[#221F2C]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-[#09090b]">
              <Trophy className="h-4 w-4 text-[#f59e0b]" /> Top Individual Contributors
            </CardTitle>
            <CardDescription>
              Rankings of employees based on their overall sustainability contributions.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {employees.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No XP has been earned yet. Start contributing to claim the top spot!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#221F2C]">
                    <TableHead className="w-16 text-muted-foreground">Rank</TableHead>
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Department</TableHead>
                    <TableHead className="text-right text-muted-foreground">Total XP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((user, idx) => (
                    <TableRow key={user.id} className={`border-b border-[#221F2C] hover:bg-slate-900/30 ${idx < 3 ? "bg-purple-950/10 hover:bg-purple-950/20" : ""}`}>
                      <TableCell className="align-middle">{renderRankIcon(idx + 1)}</TableCell>
                      <TableCell className="font-medium text-[#09090b] align-middle">{user.name}</TableCell>
                      <TableCell className="align-middle text-muted-foreground">{user.departmentName || "General"}</TableCell>
                      <TableCell className="text-right font-bold font-mono text-[#f59e0b] align-middle">
                        {user.xp.toLocaleString()} XP
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Department Leaderboard */}
        <Card className="border border-[#221F2C]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-[#09090b]">
              <Building2 className="h-4 w-4 text-teal-400" /> Department Standings
            </CardTitle>
            <CardDescription>
              Rankings of corporate departments based on the aggregate XP of their members.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {departments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No department standings recorded.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#221F2C]">
                    <TableHead className="w-16 text-muted-foreground">Rank</TableHead>
                    <TableHead className="text-muted-foreground">Department Name</TableHead>
                    <TableHead className="text-muted-foreground">Employees</TableHead>
                    <TableHead className="text-right text-muted-foreground">Total XP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept, idx) => (
                    <TableRow key={dept.id} className={`border-b border-[#221F2C] hover:bg-slate-900/30 ${idx < 3 ? "bg-teal-950/10 hover:bg-teal-950/20" : ""}`}>
                      <TableCell className="align-middle">{renderRankIcon(idx + 1)}</TableCell>
                      <TableCell className="font-medium text-[#09090b] align-middle">{dept.name}</TableCell>
                      <TableCell className="align-middle text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> {dept.employeeCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-bold font-mono text-teal-400 align-middle">
                        {dept.totalXp.toLocaleString()} XP
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
