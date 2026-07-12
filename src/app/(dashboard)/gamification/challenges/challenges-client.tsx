"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, Eye, Sparkles, Send, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  joinChallengeAction,
  submitChallengeEvidenceAction,
  approveChallengeParticipationAction,
} from "@/actions/gamification";
import type { Challenge, Category } from "@/db/schema";
import { formatDate } from "@/lib/utils";

interface ChallengesClientProps {
  challenges: Challenge[];
  participations: any[];
  categories: Category[];
  userRole: string;
}

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  hard: "bg-red-500/10 text-red-500 border-red-500/20 font-semibold",
};

const difficultyBorders: Record<string, string> = {
  easy: "border-t-emerald-500/80",
  medium: "border-t-amber-500/80",
  hard: "border-t-red-500/80",
};

export function ChallengesClient({
  challenges,
  participations: initialParticipations,
  categories,
  userRole,
}: ChallengesClientProps) {
  // State
  const [participations, setParticipations] = useState(initialParticipations);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const isManager = ["admin", "esg_manager", "dept_head"].includes(userRole);

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "General";

  const getParticipation = (challengeId: string) =>
    participations.find((p) => p.challengeId === challengeId || p.id === challengeId);

  // Handlers
  async function handleJoin(challengeId: string) {
    setLoading(true);
    const result = await joinChallengeAction(challengeId);
    setLoading(true);

    // Fetch session or reload state to update correctly
    window.location.reload();
  }

  async function handleEvidenceSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedChallenge) return;

    setLoading(true);
    const result = await submitChallengeEvidenceAction(selectedChallenge.id, proofUrl);
    setLoading(false);

    if (result.success) {
      toast.success("Evidence submitted successfully! Awaiting review. 📨");
      setParticipations((prev) =>
        prev.map((p) =>
          p.challengeId === selectedChallenge.id
            ? { ...p, progressPct: 100, proofUrl, approvalStatus: "pending" }
            : p
        )
      );
      setEvidenceOpen(false);
      setProofUrl("");
    } else {
      toast.error(result.error || "Failed to submit evidence");
    }
  }

  async function handleApprove(participationId: string) {
    setLoading(true);
    const result = await approveChallengeParticipationAction(participationId);
    setLoading(false);

    if (result.success) {
      toast.success("Claim approved and XP awarded! 🏆");
      setParticipations((prev) =>
        prev.map((p) =>
          p.id === participationId ? { ...p, approvalStatus: "approved" } : p
        )
      );
    } else {
      toast.error(result.error || "Failed to approve claim");
    }
  }

  // Quests tab view
  const questsView = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {challenges
        .filter((c) => c.status === "active")
        .map((c) => {
          const part = getParticipation(c.id);
          const hasJoined = !!part;
          const isPending = part?.approvalStatus === "pending" && part?.progressPct === 100;
          const isApproved = part?.approvalStatus === "approved";

          return (
            <Card key={c.id} className={`flex flex-col justify-between overflow-hidden bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] border-t-[3px] ${difficultyBorders[c.difficulty] || "border-t-purple-500"} hover:border-purple-500/30 dark:hover:border-purple-500/20 hover:shadow-md transition-all duration-300 rounded-xl group relative`}>
              <CardHeader className="pb-2 p-4">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className={`${difficultyColors[c.difficulty]} rounded text-[9px] font-bold uppercase tracking-wider px-2 py-0.5`}>
                    {c.difficulty}
                  </Badge>
                  <span className="text-[#f59e0b] font-bold font-mono text-xs flex items-center gap-1">
                    🏆 +{c.xp} XP
                  </span>
                </div>
                <CardTitle className="text-sm font-bold text-foreground mt-2 leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{c.title}</CardTitle>
                <Badge variant="secondary" className="w-fit mt-1 bg-[#f4f4f5] dark:bg-[#1c1a24] text-muted-foreground border-none text-[9px] font-semibold px-2 py-0.5 rounded-md">
                  {getCategoryName(c.categoryId)}
                </Badge>
                <CardDescription className="text-[11px] mt-2 text-muted-foreground leading-relaxed line-clamp-3">
                  {c.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-1.5 pb-4 px-4">
                {isApproved ? (
                  <div className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-500/10 text-emerald-500 rounded-md border border-emerald-500/20 text-xs font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Completed & Claimed
                  </div>
                ) : isPending ? (
                  <div className="w-full flex items-center justify-center gap-1.5 py-2 bg-amber-500/10 text-amber-500 rounded-md border border-amber-500/20 text-xs font-semibold">
                    <AlertCircle className="h-3.5 w-3.5 animate-pulse" /> Awaiting Approval
                  </div>
                ) : hasJoined ? (
                  <Button
                    onClick={() => {
                      setSelectedChallenge(c);
                      setEvidenceOpen(true);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-9 rounded-md flex items-center gap-1.5 justify-center shadow-xs"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit Completion Proof
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleJoin(c.id)}
                    disabled={loading}
                    className="w-full bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39] text-foreground hover:bg-white dark:hover:bg-zinc-800 font-semibold text-xs h-9 rounded-md flex items-center gap-1.5 justify-center shadow-xs"
                  >
                    <Play className="h-3.5 w-3.5" /> Join Challenge Quest
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
    </div>
  );

  // Review Claims tab view
  const reviewClaimsView = (
    <Card className="border border-[#ececee] dark:border-[#221f2c] bg-white dark:bg-[#121118] shadow-xs">
      <CardContent className="p-0">
        {participations.filter((p) => p.employeeName && p.approvalStatus === "pending").length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No pending challenge claims to review!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#ececee] dark:border-[#221f2c] bg-[#f4f4f5] dark:bg-[#121118]">
                <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Employee</TableHead>
                <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Quest Title</TableHead>
                <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Evidence URL / Text</TableHead>
                <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">XP Reward</TableHead>
                <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Date Submitted</TableHead>
                <TableHead className="w-32 text-right text-foreground font-semibold px-6 py-3 text-[11px] uppercase tracking-wider pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participations
                .filter((p) => p.employeeName && p.approvalStatus === "pending")
                .map((p) => (
                  <TableRow key={p.id} className="border-b border-[#ececee] dark:border-[#221f2c] hover:bg-[#f4f4f5] dark:hover:bg-[#16141f]/50 transition-colors">
                    <TableCell className="font-semibold text-foreground pl-6">{p.employeeName}</TableCell>
                    <TableCell className="text-foreground font-medium">{p.challengeTitle}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {p.proofUrl ? (
                        <a
                          href={p.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-500 dark:text-purple-400 hover:underline inline-flex items-center gap-1 font-semibold text-xs"
                        >
                          View Evidence <Eye className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">No evidence link</span>
                      )}
                    </TableCell>
                    <TableCell className="font-bold text-[#f59e0b] font-mono">+{p.challengeXp} XP</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {formatDate(p.createdAt)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(p.id)}
                        disabled={loading}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-3 h-7 rounded text-xs shadow-xs"
                      >
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      {isManager ? (
        <Tabs defaultValue="quests" className="space-y-6">
          <TabsList className="flex flex-wrap items-center gap-1.5 p-1 bg-[#e4e4e7]/60 dark:bg-[#121118] border border-[#ececee] dark:border-[#2d2f39] rounded-lg w-fit h-auto shadow-none">
            <TabsTrigger value="quests" className="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 border border-transparent data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1a24] data-[state=active]:text-[#09090b] dark:data-[state=active]:text-white data-[state=active]:shadow-xs data-[state=active]:border-[#ececee] dark:data-[state=active]:border-[#2d2f39] text-muted-foreground hover:text-[#09090b] dark:hover:text-white">
              Available Quests
            </TabsTrigger>
            <TabsTrigger value="review" className="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 border border-transparent data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1a24] data-[state=active]:text-[#09090b] dark:data-[state=active]:text-white data-[state=active]:shadow-xs data-[state=active]:border-[#ececee] dark:data-[state=active]:border-[#2d2f39] text-muted-foreground hover:text-[#09090b] dark:hover:text-white">
              Review Claims
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quests" className="outline-none">
            {questsView}
          </TabsContent>
          <TabsContent value="review" className="outline-none">
            {reviewClaimsView}
          </TabsContent>
        </Tabs>
      ) : (
        questsView
      )}

      {/* Submission Evidence Dialog */}
      <Dialog open={evidenceOpen} onOpenChange={setEvidenceOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-bold">
              <Sparkles className="h-5 w-5 text-purple-500" /> Submit Quest Completion
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs mt-2">
              Please provide evidence for completing <span className="font-semibold text-foreground">"{selectedChallenge?.title}"</span>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEvidenceSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proof" className="text-muted-foreground text-xs font-medium">
                Evidence Link / Notes (e.g. link to shared document or action proof)
              </Label>
              <Input
                id="proof"
                placeholder="https://example.com/my-submission or details..."
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                required
                className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39] text-foreground text-sm rounded-lg"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setEvidenceOpen(false)} className="rounded-lg h-9 text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !proofUrl.trim()} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg h-9 text-xs">
                {loading ? "Submitting..." : "Submit Claim"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
