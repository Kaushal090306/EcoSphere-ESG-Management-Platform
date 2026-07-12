"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
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

  // Search, Filter, Sort States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");

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
    if ("success" in result) { 
      toast.success(editing ? "Profile updated" : "Profile created"); 
      setDialogOpen(false); 
    } else { 
      toast.error("Failed to save"); 
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const result = await deleteProductProfile(deleting.id);
    setLoading(false);
    if ("success" in result) { 
      toast.success("Deleted"); 
      setDeleteOpen(false); 
    } else { 
      toast.error("Failed"); 
    }
  }

  const handleSortClick = (field: string) => {
    if (sortBy === `${field}-asc`) {
      setSortBy(`${field}-desc`);
    } else {
      setSortBy(`${field}-asc`);
    }
  };

  // Filtrations & Sorting
  const filteredProfiles = profiles
    .filter((p) => {
      const matchSearch = p.productName.toLowerCase().includes(search.toLowerCase()) || 
                          (p.certifications && p.certifications.some(c => c.toLowerCase().includes(search.toLowerCase())));
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name-asc") return a.productName.localeCompare(b.productName);
      if (sortBy === "name-desc") return b.productName.localeCompare(a.productName);
      if (sortBy === "carbon-desc") return Number(b.carbonIntensity) - Number(a.carbonIntensity);
      if (sortBy === "carbon-asc") return Number(a.carbonIntensity) - Number(b.carbonIntensity);
      if (sortBy === "recyclability-desc") return Number(b.recyclability || 0) - Number(a.recyclability || 0);
      if (sortBy === "recyclability-asc") return Number(a.recyclability || 0) - Number(b.recyclability || 0);
      return 0;
    });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-2xl">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-white rounded-lg h-9 text-xs"
          />
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "")}>
            <SelectTrigger className="w-36 bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-white rounded-lg h-9 text-xs">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2 rounded-lg text-xs h-9">
          <Plus className="h-4 w-4" /> Add Profile
        </Button>
      </div>

      <Card className="border border-[#ececee] dark:border-[#2d2f39] bg-white dark:bg-[#181922] rounded-md overflow-hidden shadow-none py-0">
        <CardContent className="p-0">
          {filteredProfiles.length === 0 ? (
            <EmptyState title="No product profiles found" description="Adjust search query or filter settings." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("name")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Product</span>
                      {sortBy === "name-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "name-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("carbon")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Carbon Intensity</span>
                      {sortBy === "carbon-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "carbon-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("recyclability")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Recyclability</span>
                      {sortBy === "recyclability-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "recyclability-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-foreground">Certifications</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="w-24 text-right pr-4 text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-[#09090b] dark:text-white">{p.productName}</TableCell>
                    <TableCell className="font-mono text-white">{p.carbonIntensity} CO₂e/unit</TableCell>
                    <TableCell className="text-muted-foreground">{p.recyclability || "0"}%</TableCell>
                    <TableCell className="text-muted-foreground">{p.certifications?.join(", ") || "—"}</TableCell>
                    <TableCell><Badge variant={p.status === "active" ? "default" : "secondary"} className={p.status === "active" ? "bg-eco-green/10 text-eco-green border-eco-green/20" : ""}>{p.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end pr-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { setDeleting(p); setDeleteOpen(true); }} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#14151f] border border-[#ececee] dark:border-[#2d2f39] text-white rounded-xl p-6 max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold text-[#09090b] dark:text-white">{editing ? "Edit Profile" : "New Profile"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Product Name</Label>
              <Input name="productName" defaultValue={editing?.productName || ""} className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6] focus-visible:border-[#9B5CF6]" required />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Carbon Intensity (CO₂e/unit)</Label>
                <Input name="carbonIntensity" defaultValue={editing?.carbonIntensity || ""} className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6] focus-visible:border-[#9B5CF6]" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Recyclability (%)</Label>
                <Input name="recyclabilityPercentage" defaultValue={editing?.recyclability || ""} className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6] focus-visible:border-[#9B5CF6]" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Certifications</Label>
              <Input name="certifications" defaultValue={editing?.certifications?.join(", ") || ""} placeholder="ISO 14001, FSC, etc." className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6] focus-visible:border-[#9B5CF6]" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Status</Label>
              <Select name="status" defaultValue={editing?.status || "active"}>
                <SelectTrigger className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-white focus:ring-1 focus:ring-[#9B5CF6] hover:bg-white dark:bg-[#181922] transition-all"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-white"><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-lg bg-[#222430] hover:bg-[#2c2e3c] border-transparent text-white text-xs h-9 px-4 font-semibold">Cancel</Button>
              <Button type="submit" disabled={loading} className="rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs h-9 px-4 font-semibold shadow-[0_0_10px_rgba(124,58,237,0.2)]">{editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-white dark:bg-[#14151f] border border-[#ececee] dark:border-[#2d2f39] text-white rounded-xl p-6">
          <DialogHeader><DialogTitle className="text-lg font-bold text-[#09090b] dark:text-white">Delete Profile</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground py-2">Delete <span className="font-medium text-[#09090b] dark:text-white">{deleting?.productName}</span>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-lg bg-[#222430] hover:bg-[#2c2e3c] border-transparent text-white text-xs h-9 px-4 font-semibold">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading} className="rounded-lg text-xs h-9 px-4 font-semibold">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
