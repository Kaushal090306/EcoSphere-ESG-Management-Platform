"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Swords, CheckCircle2, AlertCircle, Eye, ShieldAlert, Sparkles, Send, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  joinChallengeAction,
  submitChallengeEvidenceAction,
  approveChallengeParticipationAction,
} from "@/actions/gamification";
import type { Challenge, Category } from "@/db/schema";

interface ChallengesClientProps {
  challenges: Challenge[];
  participations: any[];
  categories: Category[];
  userRole: string;
}

const difficultyColors: Record<string, string> = {
  easy: "bg-eco-green/10 text-eco-green border-eco-green/20",
  medium: "bg-eco-orange/10 text-eco-orange border-eco-orange/20",
  hard: "bg-eco-red/10 text-eco-red border-eco-red/20 font-semibold",
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

  // Check user's participation status for a challenge
  const getParticipation = (challengeId: string) =>
    participations.find((p) => p.challengeId === challengeId || p.id === challengeId);

  // Handlers
  async function handleJoin(challengeId: string) {
    setLoading(true);
    const result = await joinChallengeAction(challengeId);
    setLoading(false);

    if (result.success) {
      toast.success("Joined challenge! Complete it to earn points. 🚀");
      // Add fake/local item to state to avoid full reload
      setParticipations((prev) => [
        ...prev,
        {
          challengeId,
          approvalStatus: "pending",
          progressPct: 0,
          proofUrl: null,
          createdAt: new Date(),
        },
      ]);
    } else {
      toast.error(result.error || "Failed to join challenge");
    }
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges
        .filter((c) => c.status === "active")
        .map((c) => {
          const part = getParticipation(c.id);
          const hasJoined = !!part;
          const isPending = part?.approvalStatus === "pending" && part?.progressPct === 100;
          const isApproved = part?.approvalStatus === "approved";

          return (
            <Card key={c.id} className="flex flex-col justify-between overflow-hidden border border-[#221F2C] hover:border-purple-500/20 transition duration-300">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={difficultyColors[c.difficulty]}>
                    {c.difficulty}
                  </Badge>
                  <span className="text-[#f59e0b] font-bold font-mono text-sm">
                    +{c.xp} XP
                  </span>
                </div>
                <CardTitle className="text-lg mt-3 text-[#09090b]">{c.title}</CardTitle>
                <Badge variant="secondary" className="w-fit mt-1 bg-slate-900 text-slate-300">
                  {getCategoryName(c.categoryId)}
                </Badge>
                <CardDescription className="text-sm mt-3 text-muted-foreground">
                  {c.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-2 pb-6 px-6">
                {isApproved ? (
                  <div className="w-full flex items-center justify-center gap-1.5 py-2 bg-eco-green/10 text-eco-green rounded-lg border border-eco-green/20 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4" /> Completed & Claimed
                  </div>
                ) : isPending ? (
                  <div className="w-full flex items-center justify-center gap-1.5 py-2 bg-eco-orange/10 text-eco-orange rounded-lg border border-eco-orange/20 text-sm font-semibold">
                    <AlertCircle className="h-4 w-4 animate-pulse" /> Awaiting Approval
                  </div>
                ) : hasJoined ? (
                  <Button
                    onClick={() => {
                      setSelectedChallenge(c);
                      setEvidenceOpen(true);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-[#09090b] font-semibold flex items-center gap-1.5 justify-center shadow-lg shadow-purple-900/20"
                  >
                    <Send className="h-4 w-4" /> Submit Completion Proof
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleJoin(c.id)}
                    disabled={loading}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-[#09090b] border border-[#221F2C] font-semibold flex items-center gap-1.5 justify-center"
                  >
                    <Play className="h-4 w-4" /> Join Challenge Quest
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
    <Card className="border border-[#221F2C]">
      <CardContent className="p-0">
        {participations.filter((p) => p.employeeName && p.approvalStatus === "pending").length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No pending challenge claims to review!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#221F2C]">
                <TableHead className="text-muted-foreground">Employee</TableHead>
                <TableHead className="text-muted-foreground">Quest Title</TableHead>
                <TableHead className="text-muted-foreground">Evidence URL / Text</TableHead>
                <TableHead className="text-muted-foreground">XP Reward</TableHead>
                <TableHead className="text-muted-foreground">Date Submitted</TableHead>
                <TableHead className="w-32 text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participations
                .filter((p) => p.employeeName && p.approvalStatus === "pending")
                .map((p) => (
                  <TableRow key={p.id} className="border-b border-[#221F2C] hover:bg-slate-900/30">
                    <TableCell className="font-medium text-[#09090b]">{p.employeeName}</TableCell>
                    <TableCell className="text-[#09090b]">{p.challengeTitle}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {p.proofUrl ? (
                        <a
                          href={p.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:underline inline-flex items-center gap-1"
                        >
                          View Evidence <Eye className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground italic">No evidence link</span>
                      )}
                    </TableCell>
                    <TableCell className="font-bold text-[#f59e0b] font-mono">+{p.challengeXp} XP</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(p.id)}
                        disabled={loading}
                        className="bg-eco-green hover:bg-emerald-600 text-[#09090b] font-semibold px-3 py-1 text-xs"
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
          <TabsList className="bg-[#181524] border border-[#221F2C]">
            <TabsTrigger value="quests" className="data-[state=active]:bg-purple-600 data-[state=active]:text-[#09090b]">
              Available Quests
            </TabsTrigger>
            <TabsTrigger value="review" className="data-[state=active]:bg-purple-600 data-[state=active]:text-[#09090b]">
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#09090b]">
              <Sparkles className="h-5 w-5 text-purple-400" /> Submit Quest Completion
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Please provide evidence for completing <span className="font-semibold text-[#09090b]">"{selectedChallenge?.title}"</span>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEvidenceSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proof" className="text-slate-300">
                Evidence Link / Notes (e.g. link to shared document or action proof)
              </Label>
              <Input
                id="proof"
                placeholder="https://example.com/my-submission or details..."
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                required
                className="bg-[#181524] border border-[#221F2C]"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEvidenceOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !proofUrl.trim()} className="bg-purple-600 hover:bg-purple-700 text-[#09090b] font-semibold">
                {loading ? "Submitting..." : "Submit Claim"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
