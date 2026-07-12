import { getLeaderboards } from "@/actions/gamification";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Crown, Building2, Users } from "lucide-react";

export default async function LeaderboardPage() {
  const { employees, departments } = await getLeaderboards();

  const renderRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-amber-400 fill-amber-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-zinc-300 fill-zinc-300" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700 fill-amber-700" />;
    return <span className="font-mono font-bold text-muted-foreground pl-1.5">{rank}</span>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Employee Leaderboard */}
      <Card className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs overflow-hidden">
        <CardHeader className="p-5 pb-4 border-b border-[#ececee] dark:border-[#221f2c]">
          <CardTitle className="flex items-center gap-2 text-sm text-foreground font-bold">
            <Trophy className="h-4.5 w-4.5 text-[#f59e0b]" /> Top Individual Contributors
          </CardTitle>
          <CardDescription className="text-muted-foreground text-[11px]">
            Rankings of employees based on their overall sustainability contributions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {employees.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No XP has been earned yet. Start contributing to claim the top spot!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#ececee] dark:border-[#221f2c] bg-[#f4f4f5] dark:bg-[#121118]">
                  <TableHead className="w-16 text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Rank</TableHead>
                  <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Name</TableHead>
                  <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Department</TableHead>
                  <TableHead className="text-right text-foreground font-semibold px-6 py-3 text-[11px] uppercase tracking-wider pr-6">Total XP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((user, idx) => (
                  <TableRow key={user.id} className={`border-b border-[#ececee] dark:border-[#221f2c] last:border-0 hover:bg-[#f4f4f5] dark:hover:bg-[#16141f]/50 transition-colors ${idx < 3 ? "bg-amber-500/5 dark:bg-amber-500/10" : ""}`}>
                    <TableCell className="align-middle pl-6">{renderRankIcon(idx + 1)}</TableCell>
                    <TableCell className="font-semibold text-foreground align-middle">{user.name}</TableCell>
                    <TableCell className="align-middle text-muted-foreground">{user.departmentName || "General"}</TableCell>
                    <TableCell className="text-right pr-6 font-bold font-mono text-[#f59e0b] align-middle">
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
      <Card className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs overflow-hidden">
        <CardHeader className="p-5 pb-4 border-b border-[#ececee] dark:border-[#221f2c]">
          <CardTitle className="flex items-center gap-2 text-sm text-foreground font-bold">
            <Building2 className="h-4.5 w-4.5 text-teal-500" /> Department Standings
          </CardTitle>
          <CardDescription className="text-muted-foreground text-[11px]">
            Rankings of corporate departments based on the aggregate XP of their members.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {departments.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No department standings recorded.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#ececee] dark:border-[#221f2c] bg-[#f4f4f5] dark:bg-[#121118]">
                  <TableHead className="w-16 text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Rank</TableHead>
                  <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Department Name</TableHead>
                  <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Employees</TableHead>
                  <TableHead className="text-right text-foreground font-semibold px-6 py-3 text-[11px] uppercase tracking-wider pr-6">Total XP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept, idx) => (
                  <TableRow key={dept.id} className={`border-b border-[#ececee] dark:border-[#221f2c] last:border-0 hover:bg-[#f4f4f5] dark:hover:bg-[#16141f]/50 transition-colors ${idx < 3 ? "bg-teal-500/5 dark:bg-teal-500/10" : ""}`}>
                    <TableCell className="align-middle pl-6">{renderRankIcon(idx + 1)}</TableCell>
                    <TableCell className="font-semibold text-foreground align-middle">{dept.name}</TableCell>
                    <TableCell className="align-middle text-muted-foreground">
                      <span className="flex items-center gap-1 text-xs">
                        <Users className="h-3.5 w-3.5" /> {dept.employeeCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6 font-bold font-mono text-teal-500 align-middle">
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
  );
}
