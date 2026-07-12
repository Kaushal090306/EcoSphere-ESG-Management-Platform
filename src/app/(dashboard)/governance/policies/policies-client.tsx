"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, CheckCircle2, ChevronUp, ChevronDown } from "lucide-react";
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
  userRole,
}: {
  policies: Policy[];
  initialAcknowledgements: any[];
  userRole?: string;
}) {
  const isReadOnly = userRole === "auditor" || userRole === "employee";
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editing, setEditing] = useState<Policy | null>(null);
  const [deleting, setDeleting] = useState<Policy | null>(null);
  const [viewing, setViewing] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Search, Filter, Sort States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title-asc");

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
    if ("success" in result) {
      toast.success(editing ? "Policy updated" : "Policy created");
      setDialogOpen(false);
    } else {
      toast.error("Failed to save policy");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const result = await deletePolicy(deleting.id);
    setLoading(false);
    if ("success" in result) {
      toast.success("Deleted");
      setDeleteOpen(false);
    } else {
      toast.error("Failed to delete policy");
    }
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

  const handleSortClick = (field: string) => {
    if (sortBy === `${field}-asc`) {
      setSortBy(`${field}-desc`);
    } else {
      setSortBy(`${field}-asc`);
    }
  };

  // Compile list categories
  const categories = Array.from(new Set(policies.map((p) => p.category))).filter(Boolean);

  const filteredPolicies = policies
    .filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.content.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      if (sortBy === "version-asc") return a.version.localeCompare(b.version);
      if (sortBy === "version-desc") return b.version.localeCompare(a.version);
      if (sortBy === "category-asc") return a.category.localeCompare(b.category);
      if (sortBy === "category-desc") return b.category.localeCompare(a.category);
      if (sortBy === "date-asc") return a.effectiveDate.localeCompare(b.effectiveDate);
      if (sortBy === "date-desc") return b.effectiveDate.localeCompare(a.effectiveDate);
      return 0;
    });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-3xl">
          <Input
            placeholder="Search policies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-white rounded-lg h-9 text-xs"
          />
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "")}>
            <SelectTrigger className="w-36 bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-[#09090b] dark:text-white rounded-lg h-9 text-xs">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#121118] border-[#ececee] dark:border-[#221f2c] text-foreground">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || "")}>
            <SelectTrigger className="w-40 bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-[#09090b] dark:text-white rounded-lg h-9 text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#121118] border-[#ececee] dark:border-[#221f2c] text-foreground">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!isReadOnly && (
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2 rounded-lg text-xs h-9">
            <Plus className="h-4 w-4" /> Add Policy
          </Button>
        )}
      </div>

      <Card className="border border-[#ececee] dark:border-[#2d2f39] bg-white dark:bg-[#181922] rounded-md overflow-hidden shadow-none py-0">
        <CardContent className="p-0">
          {filteredPolicies.length === 0 ? (
            <EmptyState title="No policies found" description="Adjust search query or filter settings." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("title")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Title</span>
                      {sortBy === "title-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "title-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("version")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Version</span>
                      {sortBy === "version-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "version-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("category")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Category</span>
                      {sortBy === "category-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "category-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("date")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Effective Date</span>
                      {sortBy === "date-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "date-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="w-32 text-right pr-4 text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-[#09090b] dark:text-white">{p.title}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">v{p.version}</TableCell>
                    <TableCell className="text-muted-foreground">{p.category}</TableCell>
                    <TableCell className="text-muted-foreground">{p.effectiveDate}</TableCell>
                    <TableCell><Badge variant="outline" className={statusColors[p.status]}>{p.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end pr-2">
                        <Button variant="ghost" size="icon" onClick={() => { setViewing(p); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        {!isReadOnly && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => { setDeleting(p); setDeleteOpen(true); }} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="bg-white dark:bg-[#14151f] border border-[#ececee] dark:border-[#2d2f39] text-white rounded-xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#09090b] dark:text-white">
              {viewing?.title}{" "}
              <span className="text-[#71717a] dark:text-[#8e909a] font-normal text-sm">
                v{viewing?.version}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-invert max-w-none text-sm text-[#52525b] dark:text-gray-300 whitespace-pre-wrap my-6 leading-relaxed">
            {viewing?.content}
          </div>
          <div className="flex items-center justify-between border-t border-[#ececee] dark:border-[#2d2f39]/50 pt-4 mt-6">
            <div>
              {viewing && acknowledgements.includes(viewing.id) ? (
                <span className="text-eco-green flex items-center gap-1.5 text-xs font-semibold">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" /> Acknowledged
                </span>
              ) : viewing?.status === "published" ? (
                <span className="text-muted-foreground text-xs">
                  Please read and acknowledge this policy.
                </span>
              ) : (
                <span className="text-muted-foreground text-xs">
                  This policy is not currently published.
                </span>
              )}
            </div>
            {viewing?.status === "published" && viewing && !acknowledgements.includes(viewing.id) && (
              <Button
                onClick={() => handleAcknowledge(viewing.id)}
                disabled={loading}
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-[#09090b] dark:text-white font-semibold py-1.5 px-4 rounded-lg shadow-lg text-xs"
              >
                {loading ? "Acknowledging..." : "Acknowledge Policy (+5 XP)"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#14151f] border border-[#ececee] dark:border-[#2d2f39] text-white rounded-xl p-6 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#09090b] dark:text-white">
              {editing ? "Edit ESG Policy" : "Create ESG Policy"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Title</Label>
              <Input
                name="title"
                defaultValue={editing?.title || ""}
                className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6] focus-visible:border-[#9B5CF6]"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Version</Label>
                <Input
                  name="version"
                  defaultValue={editing?.version || "1.0"}
                  placeholder="e.g. 1.0"
                  className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Category</Label>
                <Input
                  name="category"
                  defaultValue={editing?.category || ""}
                  placeholder="e.g. Environmental"
                  className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Effective Date</Label>
                <Input
                  type="date"
                  name="effectiveDate"
                  defaultValue={editing?.effectiveDate || ""}
                  className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Policy Content</Label>
              <textarea
                name="content"
                defaultValue={editing?.content || ""}
                rows={6}
                className="w-full bg-[#f4f4f5] dark:bg-[#0f1016] border border-[#ececee] dark:border-[#2d2f39] rounded-lg p-3 text-sm text-white focus:outline-hidden focus:ring-1 focus:ring-[#9B5CF6] focus:border-[#9B5CF6] transition-all resize-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Status</Label>
              <Select name="status" defaultValue={editing?.status || "draft"}>
                <SelectTrigger className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white hover:bg-white dark:bg-[#181922] transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#121118] border-[#ececee] dark:border-[#221f2c] text-foreground">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                className="bg-[#222430] hover:bg-[#2c2e3c] text-[#09090b] dark:text-white font-semibold rounded-lg text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-[#09090b] dark:text-white font-semibold rounded-lg text-xs"
              >
                {loading ? "Saving..." : "Save Policy"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-white dark:bg-[#14151f] border border-[#ececee] dark:border-[#2d2f39] text-white rounded-xl p-6 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#09090b] dark:text-white">Delete ESG Policy</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-[#52525b] dark:text-gray-300 my-4 leading-relaxed">
            Are you sure you want to permanently delete <span className="font-semibold text-[#09090b] dark:text-white">"{deleting?.title}"</span>? This action cannot be undone.
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteOpen(false)}
              className="bg-[#222430] hover:bg-[#2c2e3c] text-[#09090b] dark:text-white font-semibold rounded-lg text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-[#09090b] dark:text-white font-semibold rounded-lg text-xs"
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
