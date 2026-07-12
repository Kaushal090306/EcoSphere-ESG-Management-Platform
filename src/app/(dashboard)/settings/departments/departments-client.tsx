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
      <div className="flex justify-end">
        <Button onClick={handleNew} className="gap-2">
          <Plus className="h-4 w-4" /> Add Department
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {departments.length === 0 ? (
            <EmptyState
              title="No departments yet"
              description="Create your first department to start organizing ESG ownership."
            >
              <Button onClick={handleNew} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" /> Add Department
              </Button>
            </EmptyState>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {dept.code}
                    </TableCell>
                    <TableCell>{dept.employeeCount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          dept.status === "active" ? "default" : "secondary"
                        }
                        className={
                          dept.status === "active"
                            ? "bg-eco-green/10 text-eco-green border-eco-green/20"
                            : ""
                        }
                      >
                        {dept.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(dept)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(dept)}
                          className="text-destructive hover:text-destructive"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Department" : "New Department"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editing?.name || ""}
                  placeholder="Engineering"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={editing?.code || ""}
                  placeholder="ENG"
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employeeCount">Employee Count</Label>
                <Input
                  id="employeeCount"
                  name="employeeCount"
                  type="number"
                  defaultValue={editing?.employeeCount || 0}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  defaultValue={editing?.status || "active"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {departments.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="parentDepartmentId">
                  Parent Department (optional)
                </Label>
                <Select
                  name="parentDepartmentId"
                  defaultValue={editing?.parentDepartmentId || "none"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
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
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {deleting?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
