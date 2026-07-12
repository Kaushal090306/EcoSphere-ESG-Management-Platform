import { db } from "@/db";
import { users } from "@/db/schema";
import { getDepartments } from "@/actions/departments";
import { desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown } from "lucide-react";

export default async function LeaderboardPage() {
  const [leaderboardUsers, departments] = await Promise.all([
    db.select().from(users).orderBy(desc(users.xp)).limit(10),
    getDepartments(),
  ]);

  const deptName = (id: string | null) =>
    id ? departments.find((d) => d.id === id)?.name || "General" : "General";

  const renderRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-amber-400 fill-amber-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-zinc-300 fill-zinc-300" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700 fill-amber-700" />;
    return <span className="font-mono font-bold text-muted-foreground pl-1.5">{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Sustainability Leaderboard</h1>
        <p className="text-muted-foreground">
          Celebrate top contributing employees and team champions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4 text-[#f59e0b]" />
            Top 10 ESG Contributors
          </CardTitle>
          <CardDescription>
            Rankings of users based on completed challenges, events, and training programs.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {leaderboardUsers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Leaderboard is empty. Be the first to earn points!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Title/Role</TableHead>
                  <TableHead className="text-right">Accumulated XP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardUsers.map((user, idx) => (
                  <TableRow key={user.id} className={idx < 3 ? "bg-primary/5 hover:bg-primary/10" : ""}>
                    <TableCell className="align-middle">
                      {renderRankIcon(idx + 1)}
                    </TableCell>
                    <TableCell className="font-medium text-white align-middle">
                      {user.name}
                    </TableCell>
                    <TableCell className="align-middle">{deptName(user.departmentId)}</TableCell>
                    <TableCell className="align-middle">
                      <Badge variant="outline" className="capitalize text-[10px]">
                        {user.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
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
    </div>
  );
}
