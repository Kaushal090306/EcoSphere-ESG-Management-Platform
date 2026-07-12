"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTrainingRecord, updateTrainingRecord, deleteTrainingRecord } from "@/actions/training";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TrainingClient({ records, users, userRole }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManage = userRole === "admin" || userRole === "esg_manager" || userRole === "dept_head";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      employeeId: fd.get("employeeId") as string,
      courseName: fd.get("courseName") as string,
      status: fd.get("status") as "not_started" | "in_progress" | "completed",
    };

    try {
      if (editing) {
        await updateTrainingRecord(editing.id, data);
        toast.success("Record updated successfully");
      } else {
        await createTrainingRecord(data);
        toast.success("Record created successfully");
      }
      setIsOpen(false);
      setEditing(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save record");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this training record?")) return;
    try {
      await deleteTrainingRecord(id);
      toast.success("Record deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete record");
    }
  }

  const userName = (id: string) => users.find((u: any) => u.id === id)?.name || "Unknown";

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-end">
          <Button onClick={() => { setEditing(null); setIsOpen(true); }} className="gap-2 rounded-lg text-xs h-9">
            <Plus className="h-4 w-4" /> Log Training
          </Button>
        </div>
      )}
      <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl shadow-none py-0">
        <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Completed Date</TableHead>
              {canManage && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                  No training records found.
                </TableCell>
              </TableRow>
            )}
            {records.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium text-white">{userName(r.employeeId)}</TableCell>
                <TableCell>{r.courseName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    r.status === "completed" ? "bg-eco-green/10 text-eco-green border-eco-green/20" :
                    r.status === "in_progress" ? "bg-eco-blue/10 text-eco-blue border-eco-blue/20" :
                    "bg-muted text-muted-foreground"
                  }>
                    {r.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {r.completedAt ? new Date(r.completedAt).toISOString().split('T')[0] : "—"}
                </TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setIsOpen(true); }}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(r.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Record" : "Log Training"}</DialogTitle>
            </DialogHeader>
            <form key={editing ? editing.id : "new"} onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Employee</Label>
                <Select name="employeeId" defaultValue={editing?.employeeId || undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employee">
                      {(val: string) => val ? (users.find((u: any) => u.id === val)?.name || val) : "Select Employee"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u: any) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Course Name</Label>
                <Input name="courseName" defaultValue={editing?.courseName} required />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select name="status" defaultValue={editing?.status || "not_started"}>
                  <SelectTrigger>
                    <SelectValue>
                      {(val: string) => val === "not_started" ? "Not Started" : val === "in_progress" ? "In Progress" : val === "completed" ? "Completed" : val}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
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
    </div>
  );
}
