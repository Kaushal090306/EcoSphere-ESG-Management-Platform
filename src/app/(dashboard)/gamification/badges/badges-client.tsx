"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { createBadge, updateBadge, deleteBadge } from "@/actions/badges";
import type { Badge } from "@/db/schema";

export function BadgesClient({ badges }: { badges: Badge[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Badge | null>(null);
  const [deleting, setDeleting] = useState<Badge | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      description: fd.get("description") as string,
      unlockRuleType: fd.get("unlockRuleType") as "xp" | "challenges",
      unlockRuleThreshold: Number(fd.get("unlockRuleThreshold")),
      icon: fd.get("icon") as string || "award",
      status: (fd.get("status") as "active" | "inactive") || "active",
    };
    const result = editing ? await updateBadge(editing.id, data) : await createBadge(data);
    setLoading(false);
    if ("success" in result) { toast.success(editing ? "Badge updated" : "Badge created"); setDialogOpen(false); }
    else { toast.error("Failed to save"); }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const result = await deleteBadge(deleting.id);
    setLoading(false);
    if ("success" in result) { toast.success("Deleted"); setDeleteOpen(false); } else { toast.error("Failed"); }
  }

  const unlockRule = (b: Badge) => {
    const rule = b.unlockRule as { type: string; threshold: number };
    return rule.type === "xp" ? `${rule.threshold} XP` : `${rule.threshold} challenges`;
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add Badge</Button>
      </div>
      <Card><CardContent className="p-0">
        {badges.length === 0 ? (
          <EmptyState title="No badges yet" description="Create badges to reward employee achievements." />
        ) : (
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map(b => (
              <Card key={b.id} className="relative overflow-hidden hover:scale-[1.02] transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-orange/10 text-2xl">🏆</div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(b); setDialogOpen(true); }}><Pencil className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeleting(b); setDeleteOpen(true); }}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                  <h3 className="mt-3 font-semibold">{b.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{b.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <BadgeUI variant="outline" className="bg-eco-purple/10 text-eco-purple border-eco-purple/20">{unlockRule(b)}</BadgeUI>
                    <BadgeUI variant={b.status === "active" ? "default" : "secondary"} className={b.status === "active" ? "bg-eco-green/10 text-eco-green border-eco-green/20" : ""}>{b.status}</BadgeUI>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent></Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editing ? "Edit Badge" : "New Badge"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input name="name" defaultValue={editing?.name || ""} required /></div>
            <div className="space-y-2"><Label>Description</Label><Input name="description" defaultValue={editing?.description || ""} required /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Unlock Rule Type</Label><Select name="unlockRuleType" defaultValue={(editing?.unlockRule as { type: string })?.type || "xp"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="xp">XP Threshold</SelectItem><SelectItem value="challenges">Challenges Completed</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Threshold</Label><Input name="unlockRuleThreshold" type="number" min={1} defaultValue={(editing?.unlockRule as { threshold: number })?.threshold || 100} required /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Icon</Label><Input name="icon" defaultValue={editing?.icon || "award"} /></div>
              <div className="space-y-2"><Label>Status</Label><Select name="status" defaultValue={editing?.status || "active"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={loading}>{editing ? "Update" : "Create"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent><DialogHeader><DialogTitle>Delete Badge</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Delete <span className="font-medium text-foreground">{deleting?.name}</span>?</p>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete} disabled={loading}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
