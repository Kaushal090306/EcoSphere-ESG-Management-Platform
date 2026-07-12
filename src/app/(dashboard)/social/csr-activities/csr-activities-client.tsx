"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCsrActivity, updateCsrActivity, deleteCsrActivity, joinActivity } from "@/actions/csr-activities";
import { toast } from "sonner";

export function CsrActivitiesClient({ activities, departments, categories, userRole }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManage = userRole === "admin" || userRole === "esg_manager" || userRole === "dept_head";
  const csrCategories = categories.filter((c: any) => c.type === "csr_activity");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const depVal = fd.get("departmentId") as string;
    const data = {
      title: fd.get("title") as string,
      categoryId: fd.get("categoryId") as string,
      description: fd.get("description") as string,
      departmentId: depVal === "all" ? undefined : depVal,
      date: (fd.get("date") as string) || undefined,
      location: fd.get("location") as string,
      maxParticipants: fd.get("maxParticipants") ? Number(fd.get("maxParticipants")) : undefined,
      status: fd.get("status") as "draft" | "open" | "closed",
    };

    try {
      if (editing) {
        await updateCsrActivity(editing.id, data);
        toast.success("Activity updated successfully");
      } else {
        await createCsrActivity(data);
        toast.success("Activity created successfully");
      }
      setIsOpen(false);
      setEditing(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save activity");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this activity?")) return;
    try {
      await deleteCsrActivity(id);
      toast.success("Activity deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete activity");
    }
  }

  async function handleJoin(id: string) {
    if (!confirm("Join this activity?")) return;
    try {
      await joinActivity(id);
      toast.success("Successfully joined activity");
    } catch (err: any) {
      toast.error(err.message || "Failed to join activity");
    }
  }

  return (
    <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl shadow-none py-0">
      <CardHeader className="flex flex-row items-center justify-between p-5 pb-4 border-b border-[#ececee] dark:border-[#2d2f39]">
        <div>
          <CardTitle>CSR Activities</CardTitle>
          <CardDescription>Overview of community outreach and sustainability drives.</CardDescription>
        </div>
        {canManage && (
          <Button onClick={() => { setEditing(null); setIsOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Activity
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Max Volunteers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                  No CSR activities found.
                </TableCell>
              </TableRow>
            )}
            {activities.map((a: any) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.title}</TableCell>
                <TableCell>{departments.find((d: any) => d.id === a.departmentId)?.name || "All Departments"}</TableCell>
                <TableCell>{a.date ? new Date(a.date).toISOString().split('T')[0] : "—"}</TableCell>
                <TableCell>{a.maxParticipants || "Unlimited"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={a.status === "open" ? "bg-eco-green/10 text-eco-green border-eco-green/20" : a.status === "closed" ? "bg-eco-red/10 text-eco-red border-eco-red/20" : "bg-muted text-muted-foreground"}>
                    {a.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {a.status === "open" && (
                      <Button variant="ghost" size="sm" onClick={() => handleJoin(a.id)}>
                        <UserPlus className="h-4 w-4 mr-1" /> Join
                      </Button>
                    )}
                    {canManage && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(a); setIsOpen(true); }}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(a.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Activity" : "Create Activity"}</DialogTitle>
            </DialogHeader>
            <form key={editing ? editing.id : "new"} onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input name="title" defaultValue={editing?.title} required /></div>
              <div className="space-y-2"><Label>Category</Label>
                <Select name="categoryId" defaultValue={editing?.categoryId || undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category">
                      {(val: string) => val ? (csrCategories.find((c: any) => c.id === val)?.name || val) : "Select Category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {csrCategories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Department (Optional)</Label>
                <Select name="departmentId" defaultValue={editing?.departmentId || "all"}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments">
                      {(val: string) => val === "all" ? "All Departments" : val ? (departments.find((d: any) => d.id === val)?.name || val) : "All Departments"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((d: any) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date</Label><Input name="date" type="date" defaultValue={editing?.date ? new Date(editing.date).toISOString().split('T')[0] : ""} /></div>
                <div className="space-y-2"><Label>Location</Label><Input name="location" defaultValue={editing?.location || ""} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Max Participants</Label><Input name="maxParticipants" type="number" min={1} defaultValue={editing?.maxParticipants || ""} placeholder="Leave blank for unlimited" /></div>
                <div className="space-y-2"><Label>Status</Label>
                  <Select name="status" defaultValue={editing?.status || "draft"}>
                    <SelectTrigger>
                      <SelectValue>
                        {(val: string) => val === "draft" ? "Draft" : val === "open" ? "Open" : val === "closed" ? "Closed" : val}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Description</Label>
                <textarea name="description" defaultValue={editing?.description || ""} className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
