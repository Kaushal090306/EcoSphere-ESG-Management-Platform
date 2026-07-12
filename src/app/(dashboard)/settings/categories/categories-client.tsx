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
import { createCategory, updateCategory, deleteCategory } from "@/actions/categories";
import type { Category } from "@/db/schema";

export function CategoriesClient({ categories }: { categories: Category[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      type: fd.get("type") as "csr_activity" | "challenge",
      status: (fd.get("status") as "active" | "inactive") || "active",
    };
    const result = editing ? await updateCategory(editing.id, data) : await createCategory(data);
    setLoading(false);
    if ("success" in result) {
      toast.success(editing ? "Category updated" : "Category created");
      setDialogOpen(false);
    } else {
      toast.error("Failed to save category");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const result = await deleteCategory(deleting.id);
    setLoading(false);
    if ("success" in result) {
      toast.success("Category deleted");
      setDeleteOpen(false);
    } else {
      toast.error("Failed to delete");
    }
  }

  const typeLabel = (t: string) => t === "csr_activity" ? "CSR Activity" : "Challenge";

  return (
    <>
      <div className="flex justify-end mb-2.5">
        <Button 
          onClick={() => { setEditing(null); setDialogOpen(true); }} 
          className="gap-2 bg-[#09090b] dark:bg-[#fafafa] hover:bg-[#18181b] dark:hover:bg-[#e4e4e7] text-white dark:text-[#09090b] rounded-[8px] h-9 text-xs px-4 transition-all font-semibold border border-transparent shadow-xs"
        >
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <Card className="border border-[#ececee] dark:border-[#221f2c] bg-white dark:bg-[#121118] rounded-xl shadow-xs overflow-hidden py-0">
        <CardContent className="p-0">
          {categories.length === 0 ? (
            <EmptyState title="No categories yet" description="Create categories for CSR activities and challenges." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#ececee] dark:border-[#221f2c] bg-[#f4f4f5] dark:bg-[#121118]">
                  <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Name</TableHead>
                  <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Type</TableHead>
                  <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-right text-foreground font-semibold px-6 py-3 text-[11px] uppercase tracking-wider pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id} className="border-b border-[#ececee] dark:border-[#221f2c] hover:bg-[#f4f4f5]/50 dark:hover:bg-[#16141f]/50 transition-colors">
                    <TableCell className="font-semibold text-foreground px-6 py-4">{cat.name}</TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="outline" className={cat.type === "csr_activity" ? "bg-eco-teal/10 text-eco-teal border-eco-teal/20" : "bg-eco-orange/10 text-eco-orange border-eco-orange/20"}>
                        {typeLabel(cat.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant={cat.status === "active" ? "default" : "secondary"} className={cat.status === "active" ? "bg-eco-green/10 text-eco-green border-eco-green/20" : ""}>
                        {cat.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => { setEditing(cat); setDialogOpen(true); }}
                          className="h-8 w-8 hover:bg-[#f4f4f5] dark:hover:bg-[#1c1a24] text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => { setDeleting(cat); setDeleteOpen(true); }} 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
        <DialogContent className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl shadow-lg max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">{editing ? "Edit Category" : "New Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-foreground">Name</Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={editing?.name || ""} 
                placeholder="Community Service" 
                required 
                className="bg-[#f4f4f5] dark:bg-[#0c0a0e] border-[#ececee] dark:border-[#221f2c] text-[#09090b] dark:text-white rounded-lg h-9 text-sm focus-visible:ring-1 focus-visible:ring-purple-500"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="type" className="text-xs font-semibold text-foreground">Type</Label>
                <Select name="type" defaultValue={editing?.type || "csr_activity"}>
                  <SelectTrigger className="bg-[#f4f4f5] dark:bg-[#0c0a0e] border-[#ececee] dark:border-[#221f2c] text-[#09090b] dark:text-white rounded-lg h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] text-foreground">
                    <SelectItem value="csr_activity">CSR Activity</SelectItem>
                    <SelectItem value="challenge">Challenge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs font-semibold text-foreground">Status</Label>
                <Select name="status" defaultValue={editing?.status || "active"}>
                  <SelectTrigger className="bg-[#f4f4f5] dark:bg-[#0c0a0e] border-[#ececee] dark:border-[#221f2c] text-[#09090b] dark:text-white rounded-lg h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] text-foreground">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                className="border border-[#ececee] dark:border-[#221f2c] text-foreground hover:bg-[#f4f4f5] dark:hover:bg-[#1c1a24] rounded-[8px] h-9 text-xs"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-[8px] h-9 text-xs font-semibold"
              >
                {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl shadow-lg max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">Delete Category</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground pt-2">
            Are you sure you want to delete <span className="font-semibold text-foreground">{deleting?.name}</span>? This action cannot be undone.
          </p>
          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setDeleteOpen(false)}
              className="border border-[#ececee] dark:border-[#221f2c] text-foreground hover:bg-[#f4f4f5] dark:hover:bg-[#1c1a24] rounded-[8px] h-9 text-xs"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90 text-white rounded-[8px] h-9 text-xs font-semibold"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
