"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { approveParticipation, rejectParticipation } from "@/actions/csr-activities";
import { toast } from "sonner";
import { Users } from "lucide-react";

export function ParticipationClient({ participations, activities, userRole, userId, isEvidenceRequired }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Users can manage if they are admin/manager. Dept heads can manage their own department employees (enforced in backend).
  const canManage = userRole === "admin" || userRole === "esg_manager" || userRole === "dept_head";

  const activityName = (id: string) => activities.find((a: any) => a.id === id)?.title || "Unknown Event";

  async function handleApprove(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const points = Number(fd.get("points"));
    
    try {
      await approveParticipation(selected.id, points);
      toast.success("Participation approved and points awarded");
      setIsOpen(false);
      setSelected(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to approve participation");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReject(id: string) {
    if (!confirm("Are you sure you want to reject this participation?")) return;
    try {
      await rejectParticipation(id);
      toast.success("Participation rejected");
    } catch (err: any) {
      toast.error(err.message || "Failed to reject participation");
    }
  }

  return (
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
                <TableHead>Proof</TableHead>
                <TableHead>Approval Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participations.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="text-muted-foreground">
                    {p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : "—"}
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {activityName(p.activityId)}
                  </TableCell>
                  <TableCell className="font-mono text-white font-semibold">
                    +{p.pointsEarned || 0} XP
                  </TableCell>
                  <TableCell>
                    {p.proofUrl ? (
                      <a href={p.proofUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 text-xs">
                        <FileText className="h-3 w-3" /> View Proof
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
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
                  <TableCell className="text-right">
                    {p.approvalStatus === "pending" && canManage && (
                      <div className="flex justify-end gap-2">
                        {(!p.proofUrl && isEvidenceRequired) ? (
                          <div className="text-xs text-eco-red flex items-center h-9 mr-2">Evidence required</div>
                        ) : (
                          <Button variant="ghost" size="icon" className="text-eco-green hover:bg-eco-green/10 hover:text-eco-green" onClick={() => { setSelected(p); setIsOpen(true); }}>
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="text-eco-red hover:bg-eco-red/10 hover:text-eco-red" onClick={() => handleReject(p.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Participation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleApprove} className="space-y-4">
              <div className="space-y-2">
                <Label>Points to Award (XP)</Label>
                <Input name="points" type="number" min={0} defaultValue={50} required />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Approving..." : "Approve"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
