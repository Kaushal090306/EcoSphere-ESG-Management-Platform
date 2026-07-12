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

const badgeIconMapping: Record<string, { emoji: string; color: string; bg: string; border: string }> = {
  award: { emoji: "🏆", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  trophy: { emoji: "🏆", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  star: { emoji: "⭐", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  shield: { emoji: "🛡️", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  leaf: { emoji: "🌱", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  zap: { emoji: "⚡", color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  flame: { emoji: "🔥", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  sparkles: { emoji: "✨", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
};

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
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2 bg-[#09090b] dark:bg-[#fafafa] hover:bg-[#18181b] dark:hover:bg-[#e4e4e7] text-white dark:text-[#09090b] rounded-[8px] h-9 text-xs px-4 transition-all font-semibold border border-transparent shadow-xs">
            <Plus className="h-4 w-4" /> Add Badge
          </Button>
        </div>

        {badges.length === 0 ? (
          <Card className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl shadow-xs p-8 text-center">
            <EmptyState title="No badges yet" description="Create badges to reward employee achievements." />
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {badges.map(b => {
              const iconStyle = badgeIconMapping[b.icon] || badgeIconMapping.award;
              return (
                <Card 
                  key={b.id} 
                  className="relative overflow-hidden bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl shadow-xs transition-all duration-300 hover:shadow-md hover:border-purple-500/30 dark:hover:border-purple-500/20 group"
                >
                  {/* Corner gradient ambient effect matching unlock criteria */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-bl-full opacity-60 pointer-events-none transition-all duration-300 group-hover:scale-110" />

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xl transition-transform duration-300 group-hover:scale-105 ${iconStyle.bg} ${iconStyle.color} ${iconStyle.border}`}>
                        {iconStyle.emoji}
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-[#f4f4f5] dark:hover:bg-[#1c1a24] rounded-lg" 
                          onClick={() => { setEditing(b); setDialogOpen(true); }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg" 
                          onClick={() => { setDeleting(b); setDeleteOpen(true); }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    <h3 className="mt-3 font-bold text-sm text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {b.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed h-8">
                      {b.description}
                    </p>
                    
                    <div className="mt-3 pt-2.5 border-t border-dashed border-[#ececee] dark:border-[#221f2c] flex items-center justify-between">
                      <BadgeUI variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-[9px] font-bold px-2 py-0.5 rounded-md">
                        Requires {unlockRule(b)}
                      </BadgeUI>
                      <BadgeUI 
                        variant={b.status === "active" ? "default" : "secondary"} 
                        className={b.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded-md" : "text-[9px] font-bold px-2 py-0.5 rounded-md"}
                      >
                        {b.status}
                      </BadgeUI>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground font-bold">{editing ? "Edit Badge" : "New Badge"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Name</Label>
              <Input name="name" defaultValue={editing?.name || ""} className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]" required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Description</Label>
              <Input name="description" defaultValue={editing?.description || ""} className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Unlock Rule Type</Label>
                <Select name="unlockRuleType" defaultValue={(editing?.unlockRule as { type: string })?.type || "xp"}>
                  <SelectTrigger className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c]">
                    <SelectItem value="xp">XP Threshold</SelectItem>
                    <SelectItem value="challenges">Challenges Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Threshold</Label>
                <Input name="unlockRuleThreshold" type="number" min={1} defaultValue={(editing?.unlockRule as { threshold: number })?.threshold || 100} className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]" required />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Badge Icon</Label>
                <Select name="icon" defaultValue={editing?.icon || "award"}>
                  <SelectTrigger className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c]">
                    <SelectItem value="award">🏆 Trophy / Award</SelectItem>
                    <SelectItem value="star">⭐ Star</SelectItem>
                    <SelectItem value="shield">🛡️ Shield</SelectItem>
                    <SelectItem value="leaf">🌱 Leaf</SelectItem>
                    <SelectItem value="zap">⚡ Lightning</SelectItem>
                    <SelectItem value="flame">🔥 Flame</SelectItem>
                    <SelectItem value="sparkles">✨ Sparkles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Status</Label>
                <Select name="status" defaultValue={editing?.status || "active"}>
                  <SelectTrigger className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c]">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
