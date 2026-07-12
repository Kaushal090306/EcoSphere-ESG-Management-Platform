"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/actions/departments";
import type { Department } from "@/db/schema";

interface DepartmentsClientProps {
  departments: Department[];
}

export function DepartmentsClient({ departments }: DepartmentsClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [deleting, setDeleting] = useState<Department | null>(null);
  const [loading, setLoading] = useState(false);

  function handleNew() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(dept: Department) {
    setEditing(dept);
    setDialogOpen(true);
  }

  function handleDeleteClick(dept: Department) {
    setDeleting(dept);
    setDeleteDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      employeeCount: Number(formData.get("employeeCount") || 0),
      status: (formData.get("status") as "active" | "inactive") || "active",
      parentDepartmentId: (formData.get("parentDepartmentId") as string) || null,
    };

    const result = editing
      ? await updateDepartment(editing.id, data)
      : await createDepartment(data);

    setLoading(false);

    if ("success" in result) {
      toast.success(editing ? "Department updated" : "Department created");
      setDialogOpen(false);
    } else {
      const errors = result.error;
      const message =
        typeof errors === "object" && errors !== null
          ? Object.values(errors).flat().join(", ")
          : "Something went wrong";
      toast.error(message);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const result = await deleteDepartment(deleting.id);
    setLoading(false);

    if ("success" in result) {
      toast.success("Department deleted");
      setDeleteDialogOpen(false);
    } else {
      toast.error(result.error || "Failed to delete");
    }
  }

  return (
    <>
      <div className="flex justify-end mb-2.5">
        <Button 
          onClick={handleNew} 
          className="gap-2 bg-[#09090b] dark:bg-[#fafafa] hover:bg-[#18181b] dark:hover:bg-[#e4e4e7] text-white dark:text-[#09090b] rounded-[8px] h-9 text-xs px-4 transition-all font-semibold border border-transparent shadow-xs"
        >
          <Plus className="h-4 w-4" /> Add Department
        </Button>
      </div>

      <Card className="border border-[#ececee] dark:border-[#221f2c] bg-white dark:bg-[#121118] rounded-xl shadow-xs overflow-hidden py-0">
        <CardContent className="p-0">
          {departments.length === 0 ? (
            <EmptyState
              title="No departments yet"
              description="Create your first department to start organizing ESG ownership."
            >
              <Button 
                onClick={handleNew} 
                variant="outline" 
                className="gap-2 border border-[#ececee] dark:border-[#221f2c] text-foreground hover:bg-[#f4f4f5] dark:hover:bg-[#1c1a24] rounded-[8px] h-9 text-xs"
              >
                <Plus className="h-4 w-4" /> Add Department
              </Button>
            </EmptyState>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#ececee] dark:border-[#221f2c] bg-[#f4f4f5] dark:bg-[#121118]">
                  <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Name</TableHead>
                  <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Code</TableHead>
                  <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Employees</TableHead>
                  <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-right text-foreground font-semibold px-6 py-3 text-[11px] uppercase tracking-wider pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id} className="border-b border-[#ececee] dark:border-[#221f2c] hover:bg-[#f4f4f5]/50 dark:hover:bg-[#16141f]/50 transition-colors">
                    <TableCell className="font-semibold text-foreground px-6 py-4">{dept.name}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs px-6 py-4">
                      {dept.code}
                    </TableCell>
                    <TableCell className="text-foreground font-medium px-6 py-4">{dept.employeeCount}</TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        variant={dept.status === "active" ? "default" : "secondary"}
                        className={
                          dept.status === "active"
                            ? "bg-eco-green/10 text-eco-green border-eco-green/20"
                            : ""
                        }
                      >
                        {dept.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(dept)}
                          className="h-8 w-8 hover:bg-[#f4f4f5] dark:hover:bg-[#1c1a24] text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(dept)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl shadow-lg max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              {editing ? "Edit Department" : "New Department"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-foreground">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editing?.name || ""}
                  placeholder="Engineering"
                  required
                  className="bg-[#f4f4f5] dark:bg-[#0c0a0e] border-[#ececee] dark:border-[#221f2c] text-[#09090b] dark:text-white rounded-lg h-9 text-sm focus-visible:ring-1 focus-visible:ring-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="code" className="text-xs font-semibold text-foreground">Code</Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={editing?.code || ""}
                  placeholder="ENG"
                  required
                  className="bg-[#f4f4f5] dark:bg-[#0c0a0e] border-[#ececee] dark:border-[#221f2c] text-[#09090b] dark:text-white rounded-lg h-9 text-sm focus-visible:ring-1 focus-visible:ring-purple-500"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="employeeCount" className="text-xs font-semibold text-foreground">Employee Count</Label>
                <Input
                  id="employeeCount"
                  name="employeeCount"
                  type="number"
                  defaultValue={editing?.employeeCount || 0}
                  min={0}
                  className="bg-[#f4f4f5] dark:bg-[#0c0a0e] border-[#ececee] dark:border-[#221f2c] text-[#09090b] dark:text-white rounded-lg h-9 text-sm focus-visible:ring-1 focus-visible:ring-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs font-semibold text-foreground">Status</Label>
                <Select
                  name="status"
                  defaultValue={editing?.status || "active"}
                >
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
            {departments.length > 0 && (
              <div className="space-y-1.5">
                <Label htmlFor="parentDepartmentId" className="text-xs font-semibold text-foreground">
                  Parent Department (optional)
                </Label>
                <Select
                  name="parentDepartmentId"
                  defaultValue={editing?.parentDepartmentId || "none"}
                >
                  <SelectTrigger className="bg-[#f4f4f5] dark:bg-[#0c0a0e] border-[#ececee] dark:border-[#221f2c] text-[#09090b] dark:text-white rounded-lg h-9 text-xs">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] text-foreground">
                    <SelectItem value="none">None</SelectItem>
                    {departments
                      .filter((d) => d.id !== editing?.id)
                      .map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl shadow-lg max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">Delete Department</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground pt-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {deleting?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
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
