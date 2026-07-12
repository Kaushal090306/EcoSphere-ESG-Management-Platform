"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge as BadgeUI } from "@/components/ui/badge";
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
    if ("success" in result) { 
      toast.success(editing ? "Badge updated" : "Badge created"); 
      setDialogOpen(false); 
      window.location.reload();
    }
    else { toast.error("Failed to save"); }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const result = await deleteBadge(deleting.id);
    setLoading(false);
    if ("success" in result) { 
      toast.success("Deleted"); 
      setDeleteOpen(false); 
      window.location.reload();
    } else { toast.error("Failed"); }
  }

  const unlockRule = (b: Badge) => {
    const rule = b.unlockRule as { type: string; threshold: number };
    return rule.type === "xp" ? `${rule.threshold} XP` : `${rule.threshold} challenges`;
  };

  return (
    <>
      <div className="relative space-y-4">
        {/* Align button in navigation tab row on desktop */}
        <div className="sm:absolute sm:-top-[49px] sm:right-0 z-10 flex justify-end">
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2 rounded-lg text-xs h-9">
            <Plus className="h-4 w-4" /> Add Badge
          </Button>
        </div>

        <Card className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl shadow-none py-0">
          <CardContent className="p-0">
            {badges.length === 0 ? (
              <EmptyState title="No badges yet" description="Create badges to reward employee achievements." />
            ) : (
              <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                {badges.map(b => (
                  <Card key={b.id} className="relative overflow-hidden bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] hover:border-gray-300 dark:hover:border-zinc-800 transition-all rounded-xl shadow-xs">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 text-2xl">🏆</div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => { setEditing(b); setDialogOpen(true); }}><Pencil className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => { setDeleting(b); setDeleteOpen(true); }}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                      <h3 className="mt-3 font-semibold text-sm text-foreground">{b.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-normal">{b.description}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <BadgeUI variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px]">{unlockRule(b)}</BadgeUI>
                        <BadgeUI variant={b.status === "active" ? "default" : "secondary"} className={b.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]" : "text-[10px]"}>{b.status}</BadgeUI>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground font-bold">{editing ? "Edit Badge" : "New Badge"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label className="text-xs font-semibold text-muted-foreground">Name</Label><Input name="name" defaultValue={editing?.name || ""} className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]" required /></div>
            <div className="space-y-2"><Label className="text-xs font-semibold text-muted-foreground">Description</Label><Input name="description" defaultValue={editing?.description || ""} className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]" required /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label className="text-xs font-semibold text-muted-foreground">Unlock Rule Type</Label><Select name="unlockRuleType" defaultValue={(editing?.unlockRule as { type: string })?.type || "xp"}><SelectTrigger className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]"><SelectValue /></SelectTrigger><SelectContent className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c]"><SelectItem value="xp">XP Threshold</SelectItem><SelectItem value="challenges">Challenges Completed</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label className="text-xs font-semibold text-muted-foreground">Threshold</Label><Input name="unlockRuleThreshold" type="number" min={1} defaultValue={(editing?.unlockRule as { threshold: number })?.threshold || 100} className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]" required /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label className="text-xs font-semibold text-muted-foreground">Icon</Label><Input name="icon" defaultValue={editing?.icon || "award"} className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]" /></div>
              <div className="space-y-2"><Label className="text-xs font-semibold text-muted-foreground">Status</Label><Select name="status" defaultValue={editing?.status || "active"}><SelectTrigger className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]"><SelectValue /></SelectTrigger><SelectContent className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c]"><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-lg text-xs h-9">Cancel</Button>
              <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-xs h-9">{editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl">
          <DialogHeader><DialogTitle className="text-foreground font-bold">Delete Badge</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Delete <span className="font-semibold text-foreground">"{deleting?.name}"</span>?</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-lg text-xs h-9">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading} className="rounded-lg text-xs h-9">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
