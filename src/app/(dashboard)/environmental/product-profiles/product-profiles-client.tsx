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
import { createProductProfile, updateProductProfile, deleteProductProfile } from "@/actions/product-profiles";
import type { ProductEsgProfile } from "@/db/schema";

export function ProductProfilesClient({ profiles }: { profiles: ProductEsgProfile[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<ProductEsgProfile | null>(null);
  const [deleting, setDeleting] = useState<ProductEsgProfile | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      productName: fd.get("productName") as string,
      carbonIntensity: fd.get("carbonIntensity") as string,
      recyclabilityPercentage: fd.get("recyclabilityPercentage") as string,
      certifications: fd.get("certifications") as string || "",
      status: (fd.get("status") as "active" | "inactive") || "active",
    };
    const result = editing ? await updateProductProfile(editing.id, data) : await createProductProfile(data);
    setLoading(false);
    if ("success" in result) { toast.success(editing ? "Profile updated" : "Profile created"); setDialogOpen(false); }
    else { toast.error("Failed to save"); }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const result = await deleteProductProfile(deleting.id);
    setLoading(false);
    if ("success" in result) { toast.success("Deleted"); setDeleteOpen(false); } else { toast.error("Failed"); }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add Profile</Button>
      </div>
      <Card><CardContent className="p-0">
        {profiles.length === 0 ? (
          <EmptyState title="No product profiles" description="Add ESG metadata to your products." />
        ) : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Product</TableHead><TableHead>Carbon Intensity</TableHead><TableHead>Recyclability</TableHead><TableHead>Certifications</TableHead><TableHead>Status</TableHead><TableHead className="w-24">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {profiles.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.productName}</TableCell>
                  <TableCell className="font-mono">{p.carbonIntensity} CO₂e</TableCell>
                  <TableCell>{p.recyclability || "0"}%</TableCell>
                  <TableCell className="text-muted-foreground">{p.certifications?.join(", ") || "—"}</TableCell>
                  <TableCell><Badge variant={p.status === "active" ? "default" : "secondary"} className={p.status === "active" ? "bg-eco-green/10 text-eco-green border-eco-green/20" : ""}>{p.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editing ? "Edit Profile" : "New Profile"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Product Name</Label><Input name="productName" defaultValue={editing?.productName || ""} required /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Carbon Intensity (CO₂e/unit)</Label><Input name="carbonIntensity" defaultValue={editing?.carbonIntensity || ""} required /></div>
              <div className="space-y-2"><Label>Recyclability (%)</Label><Input name="recyclabilityPercentage" defaultValue={editing?.recyclability || ""} required /></div>
            </div>
            <div className="space-y-2"><Label>Certifications</Label><Input name="certifications" defaultValue={editing?.certifications?.join(", ") || ""} placeholder="ISO 14001, FSC, etc." /></div>
            <div className="space-y-2"><Label>Status</Label><Select name="status" defaultValue={editing?.status || "active"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={loading}>{editing ? "Update" : "Create"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent><DialogHeader><DialogTitle>Delete Profile</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Delete <span className="font-medium text-foreground">{deleting?.productName}</span>?</p>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete} disabled={loading}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
