"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { createPolicy, updatePolicy, deletePolicy, acknowledgePolicy } from "@/actions/policies";
import type { Policy } from "@/db/schema";

const statusColors: Record<string, string> = {
  draft: "bg-eco-orange/10 text-eco-orange border-eco-orange/20",
  published: "bg-eco-green/10 text-eco-green border-eco-green/20",
  archived: "bg-muted text-muted-foreground",
};

export function PoliciesClient({
  policies,
  initialAcknowledgements,
}: {
  policies: Policy[];
  initialAcknowledgements: any[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editing, setEditing] = useState<Policy | null>(null);
  const [deleting, setDeleting] = useState<Policy | null>(null);
  const [viewing, setViewing] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(false);
  const [acknowledgements, setAcknowledgements] = useState<string[]>(
    initialAcknowledgements?.map((a) => a.policyId) || []
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      version: fd.get("version") as string || "1.0",
      category: fd.get("category") as string,
      content: fd.get("content") as string,
      effectiveDate: fd.get("effectiveDate") as string,
      status: fd.get("status") as "draft" | "published" | "archived",
    };
    const result = editing ? await updatePolicy(editing.id, data) : await createPolicy(data);
    setLoading(false);
    if ("success" in result) { toast.success(editing ? "Policy updated" : "Policy created"); setDialogOpen(false); }
    else { toast.error("Failed to save"); }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const result = await deletePolicy(deleting.id);
    setLoading(false);
    if ("success" in result) { toast.success("Deleted"); setDeleteOpen(false); } else { toast.error("Failed"); }
  }

  async function handleAcknowledge(policyId: string) {
    setLoading(true);
    const res = await acknowledgePolicy(policyId);
    setLoading(false);
    if ("error" in res) {
      toast.error(res.error || "Failed to acknowledge");
    } else {
      setAcknowledgements((prev) => [...prev, policyId]);
      toast.success("Policy acknowledged! +5 XP awarded.");
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add Policy</Button>
      </div>
      <Card><CardContent className="p-0">
        {policies.length === 0 ? (
          <EmptyState title="No policies yet" description="Create governance policies for your organization." />
        ) : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Title</TableHead><TableHead>Version</TableHead><TableHead>Category</TableHead><TableHead>Effective Date</TableHead><TableHead>Status</TableHead><TableHead className="w-32">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {policies.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">v{p.version}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell className="text-muted-foreground">{p.effectiveDate}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColors[p.status]}>{p.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setViewing(p); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setDeleting(p); setDeleteOpen(true); }} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewing?.title}{" "}
              <span className="text-muted-foreground font-normal text-sm">
                v{viewing?.version}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap mb-6">
            {viewing?.content}
          </div>
          {viewing?.status === "published" && (
            <div className="flex items-center justify-between border-t border-[#221F2C] pt-4 mt-6">
              <div>
                {viewing && acknowledgements.includes(viewing.id) ? (
                  <span className="text-eco-green flex items-center gap-1.5 text-sm font-semibold">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[#14b8a6]" /> Acknowledged
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Please read and acknowledge this policy.
                  </span>
                )}
              </div>
              {viewing && !acknowledgements.includes(viewing.id) && (
                <Button
                  onClick={() => handleAcknowledge(viewing.id)}
                  disabled={loading}
                  className="bg-[#9B5CF6] hover:bg-[#8545e0] text-white font-semibold py-1.5 px-4 rounded-md shadow-lg transition duration-200"
                >
                  {loading ? "Acknowledging..." : "Acknowledge Policy (+5 XP)"}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Policy" : "New Policy"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Title</Label><Input name="title" defaultValue={editing?.title || ""} required /></div>
              <div className="space-y-2"><Label>Version</Label><Input name="version" defaultValue={editing?.version || "1.0"} required /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Category</Label><Input name="category" defaultValue={editing?.category || ""} placeholder="Environmental, Anti-bribery..." required /></div>
              <div className="space-y-2"><Label>Effective Date</Label><Input name="effectiveDate" type="date" defaultValue={editing?.effectiveDate || ""} required /></div>
            </div>
            <div className="space-y-2"><Label>Content</Label><textarea name="content" defaultValue={editing?.content || ""} className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required /></div>
            <div className="space-y-2"><Label>Status</Label><Select name="status" defaultValue={editing?.status || "draft"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={loading}>{editing ? "Update" : "Create"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent><DialogHeader><DialogTitle>Delete Policy</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Delete <span className="font-medium text-foreground">{deleting?.title}</span>?</p>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete} disabled={loading}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
