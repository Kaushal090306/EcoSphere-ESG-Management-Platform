"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { createReward, updateReward, deleteReward } from "@/actions/rewards";
import type { Reward } from "@/db/schema";

const statusColors: Record<string, string> = {
  active: "bg-eco-green/10 text-eco-green border-eco-green/20",
  inactive: "",
  out_of_stock: "bg-eco-red/10 text-eco-red border-eco-red/20",
};

export function RewardsClient({ rewards }: { rewards: Reward[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Reward | null>(null);
  const [deleting, setDeleting] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      description: fd.get("description") as string,
      pointsRequired: Number(fd.get("pointsRequired")),
      stock: Number(fd.get("stock") || 0),
      status: fd.get("status") as "active" | "inactive" | "out_of_stock",
    };
    const result = editing ? await updateReward(editing.id, data) : await createReward(data);
    setLoading(false);
    if ("success" in result) { toast.success(editing ? "Reward updated" : "Reward created"); setDialogOpen(false); }
    else { toast.error("Failed to save"); }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const result = await deleteReward(deleting.id);
    setLoading(false);
    if ("success" in result) { toast.success("Deleted"); setDeleteOpen(false); } else { toast.error("Failed"); }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add Reward</Button>
      </div>
      <Card><CardContent className="p-0">
        {rewards.length === 0 ? (
          <EmptyState title="No rewards yet" description="Create rewards that employees can redeem with their points." />
        ) : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>Points Required</TableHead><TableHead>Stock</TableHead><TableHead>Status</TableHead><TableHead className="w-24">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rewards.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">{r.description}</TableCell>
                  <TableCell className="font-mono">{r.pointsRequired} pts</TableCell>
                  <TableCell>{r.stock}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColors[r.status]}>{r.status.replace("_", " ")}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setDeleting(r); setDeleteOpen(true); }} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editing ? "Edit Reward" : "New Reward"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input name="name" defaultValue={editing?.name || ""} required /></div>
            <div className="space-y-2"><Label>Description</Label><Input name="description" defaultValue={editing?.description || ""} required /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Points Required</Label><Input name="pointsRequired" type="number" min={1} defaultValue={editing?.pointsRequired || 100} required /></div>
              <div className="space-y-2"><Label>Stock</Label><Input name="stock" type="number" min={0} defaultValue={editing?.stock || 0} /></div>
            </div>
            <div className="space-y-2"><Label>Status</Label><Select name="status" defaultValue={editing?.status || "active"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="out_of_stock">Out of Stock</SelectItem></SelectContent></Select></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={loading}>{editing ? "Update" : "Create"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent><DialogHeader><DialogTitle>Delete Reward</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Delete <span className="font-medium text-foreground">{deleting?.name}</span>?</p>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete} disabled={loading}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
