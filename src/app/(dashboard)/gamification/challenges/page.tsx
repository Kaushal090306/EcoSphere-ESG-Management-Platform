import { getChallenges } from "@/actions/challenges";
import { getCategories } from "@/actions/categories";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Swords } from "lucide-react";

export default async function ChallengesPage() {
  const [challenges, categories] = await Promise.all([
    getChallenges(),
    getCategories(),
  ]);

  const catName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "General";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Sustainability Challenges</h1>
        <p className="text-muted-foreground">
          Participate in active team quests and earn ESG points
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Swords className="h-4 w-4 text-[#f59e0b]" />
            Active Sustainability Challenges
          </CardTitle>
          <CardDescription>
            Unlock tasks, complete sustainability achievements, and earn rewards.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {challenges.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No active challenges right now. Check back later!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Challenge Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Rewards (XP)</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {challenges.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-white">{c.title}</TableCell>
                    <TableCell>{catName(c.categoryId)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          c.difficulty === "hard"
                            ? "bg-eco-red/10 text-eco-red border-eco-red/20 font-semibold"
                            : c.difficulty === "medium"
                            ? "bg-eco-orange/10 text-eco-orange border-eco-orange/20"
                            : "bg-eco-green/10 text-eco-green border-eco-green/20"
                        }
                      >
                        {c.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.deadline ? new Date(c.deadline).toLocaleDateString() : "No deadline"}
                    </TableCell>
                    <TableCell className="text-right text-[#f59e0b] font-bold font-mono">
                      +{c.xp} XP
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          c.status === "active"
                            ? "bg-eco-green/10 text-eco-green border-eco-green/20 animate-pulse"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {c.status}
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
