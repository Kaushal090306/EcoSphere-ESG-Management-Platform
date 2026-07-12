"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Filter, ShieldAlert, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { createUser, updateUser, deleteUser } from "@/actions/users";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "esg_manager" | "dept_head" | "employee" | "auditor";
  departmentId: string | null;
  status: "active" | "inactive";
  points: number;
  xp: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

const roleColors: Record<string, string> = {
  admin: "bg-eco-red/10 text-eco-red border-eco-red/20",
  esg_manager: "bg-eco-teal/10 text-eco-teal border-eco-teal/20",
  dept_head: "bg-eco-blue/10 text-eco-blue border-eco-blue/20",
  employee: "bg-muted text-muted-foreground border-border",
  auditor: "bg-eco-purple/10 text-eco-purple border-eco-purple/20",
};

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  esg_manager: "ESG Manager",
  dept_head: "Department Head",
  employee: "Employee",
  auditor: "Auditor",
};

export function UsersClient({
  initialUsers,
  departments,
}: {
  initialUsers: User[];
  departments: Department[];
}) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleOpenCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditing(user);
    setDialogOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setDeleting(user);
    setDeleteOpen(true);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      password: (fd.get("password") as string) || undefined,
      role: fd.get("role") as User["role"],
      departmentId: (fd.get("departmentId") as string) || null,
      status: (fd.get("status") as User["status"]) || "active",
    };

    const result = editing
      ? await updateUser(editing.id, data)
      : await createUser(data);

    setLoading(false);
    if ("success" in result) {
      toast.success(editing ? "User updated successfully" : "User created successfully");
      setDialogOpen(false);
      
      // Update local state or trigger server refresh
      startTransition(() => {
        window.location.reload();
      });
    } else {
      toast.error(result.error || "An error occurred.");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const result = await deleteUser(deleting.id);
    setLoading(false);
    if ("success" in result) {
      toast.success("User deleted successfully");
      setDeleteOpen(false);
      startTransition(() => {
        window.location.reload();
      });
    } else {
      toast.error(result.error || "Failed to delete user.");
    }
  }

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filters */}
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white border-[#ececee]"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val || "all")}>
              <SelectTrigger className="bg-white border-[#ececee]">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="esg_manager">ESG Manager</SelectItem>
                <SelectItem value="dept_head">Department Head</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="auditor">Auditor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleOpenCreate} className="gap-2 bg-[#09090b] hover:bg-[#18181b] text-white">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <Card className="glass border-[#ececee]">
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <EmptyState
              title="No users found"
              description="No users matched your query or filters."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Details</TableHead>
                  <TableHead>System Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Gamification</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => {
                  const dept = departments.find((d) => d.id === u.departmentId);
                  return (
                    <TableRow key={u.id} className="hover:bg-muted/10">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{u.name}</span>
                          <span className="text-xs text-muted-foreground">{u.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${roleColors[u.role]} py-0.5`}>
                          {roleLabels[u.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{dept ? `${dept.name} (${dept.code})` : "—"}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={u.status === "active" ? "default" : "secondary"}
                          className={
                            u.status === "active"
                              ? "bg-eco-green/10 text-eco-green border-eco-green/20"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-eco-orange">
                          <Award className="h-3.5 w-3.5" />
                          <span>{u.points} pts / {u.xp} XP</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(u)}
                            className="h-8 w-8 hover:bg-[#22242f] text-muted-foreground hover:text-white"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDelete(u)}
                            className="h-8 w-8 hover:bg-[#22242f] text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border-[#ececee] text-white">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit User Account" : "Register New User"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update access details, roles, or organization department mappings."
                : "Create an EcoSphere access account. The default password is 'password123'."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editing?.name || ""}
                required
                placeholder="John Doe"
                className="bg-[#15161D] border-[#ececee] text-white"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={editing?.email || ""}
                required
                placeholder="john.doe@company.com"
                className="bg-[#15161D] border-[#ececee] text-white"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-muted-foreground">
                Password {editing && "(Leave blank to keep existing)"}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={editing ? "••••••••" : "password123"}
                className="bg-[#15161D] border-[#ececee] text-white"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="role" className="text-muted-foreground">System Access Role</Label>
                <Select name="role" defaultValue={editing?.role || "employee"}>
                  <SelectTrigger id="role" className="bg-[#15161D] border-[#ececee]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#ececee] text-white">
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="esg_manager">ESG Manager</SelectItem>
                    <SelectItem value="dept_head">Department Head</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="auditor">Auditor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="status" className="text-muted-foreground">Status</Label>
                <Select name="status" defaultValue={editing?.status || "active"}>
                  <SelectTrigger id="status" className="bg-[#15161D] border-[#ececee]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#ececee] text-white">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="departmentId" className="text-muted-foreground">Department Assignment</Label>
              <Select name="departmentId" defaultValue={editing?.departmentId || "none"}>
                <SelectTrigger id="departmentId" className="bg-[#15161D] border-[#ececee]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#ececee] text-white">
                  <SelectItem value="none">No Department Assignment</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="bg-transparent border-[#ececee] hover:bg-muted/10 text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#09090b] hover:bg-[#18181b] text-white"
              >
                {editing ? "Save Changes" : "Register"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-white border-[#ececee] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" /> Delete Access Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to permanently delete the account for{" "}
              <span className="font-semibold text-white">{deleting?.name}</span> (
              {deleting?.email})?
            </p>
            <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-2">
              Warning: This action is destructive and cannot be undone. Any points/XP or historic activity associations will remain archived in the ledger but the access credentials will be revoked.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="bg-transparent border-[#ececee] hover:bg-muted/10 text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
