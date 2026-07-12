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
import { createEnvironmentalGoal, updateEnvironmentalGoal, deleteEnvironmentalGoal } from "@/actions/environmental-goals";
import type { EnvironmentalGoal, Department } from "@/db/schema";

const statusColors: Record<string, string> = {
  active: "bg-eco-green/10 text-eco-green border-eco-green/20",
  achieved: "bg-eco-teal/10 text-eco-teal border-eco-teal/20",
  missed: "bg-eco-red/10 text-eco-red border-eco-red/20",
  cancelled: "bg-muted text-muted-foreground",
};

export function GoalsClient({ goals, departments }: { goals: EnvironmentalGoal[]; departments: Department[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<EnvironmentalGoal | null>(null);
  const [deleting, setDeleting] = useState<EnvironmentalGoal | null>(null);
  const [loading, setLoading] = useState(false);

  // Search, Filter, Sort States
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("deadline-asc");

  const deptName = (id: string) => departments.find(d => d.id === id)?.name || "—";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      departmentId: fd.get("departmentId") as string,
      metric: fd.get("metric") as string,
      baselineValue: fd.get("baselineValue") as string,
      targetValue: fd.get("targetValue") as string,
      currentValue: (fd.get("currentValue") as string) || "0",
      deadline: fd.get("deadline") as string,
      status: fd.get("status") as "active" | "achieved" | "missed" | "cancelled",
    };
    const result = editing ? await updateEnvironmentalGoal(editing.id, data) : await createEnvironmentalGoal(data);
    setLoading(false);
    if ("success" in result) { 
      toast.success(editing ? "Goal updated" : "Goal created"); 
      setDialogOpen(false); 
    } else { 
      toast.error("Failed to save goal"); 
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const result = await deleteEnvironmentalGoal(deleting.id);
    setLoading(false);
    if ("success" in result) { 
      toast.success("Deleted"); 
      setDeleteOpen(false); 
    } else { 
      toast.error("Failed"); 
    }
  }

  const getProgress = (g: EnvironmentalGoal) => {
    const base = Number(g.baselineValue);
    const target = Number(g.targetValue);
    const current = Number(g.currentValue);
    if (base === target) return 0;
    const progress = Math.round(((base - current) / (base - target)) * 100);
    return Math.min(Math.max(progress, 0), 100);
  };

  const handleSortClick = (field: string) => {
    if (sortBy === `${field}-asc`) {
      setSortBy(`${field}-desc`);
    } else {
      setSortBy(`${field}-asc`);
    }
  };

  // Perform filtration & sorting
  const filteredGoals = goals
    .filter((g) => {
      const matchSearch = g.title.toLowerCase().includes(search.toLowerCase()) || 
                          g.metric.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === "all" || g.departmentId === deptFilter;
      const matchStatus = statusFilter === "all" || g.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      if (sortBy === "dept-asc") return deptName(a.departmentId).localeCompare(deptName(b.departmentId));
      if (sortBy === "dept-desc") return deptName(b.departmentId).localeCompare(deptName(a.departmentId));
      if (sortBy === "metric-asc") return a.metric.localeCompare(b.metric);
      if (sortBy === "metric-desc") return b.metric.localeCompare(a.metric);
      if (sortBy === "deadline-asc") return a.deadline.localeCompare(b.deadline);
      if (sortBy === "deadline-desc") return b.deadline.localeCompare(a.deadline);
      if (sortBy === "progress-desc") return getProgress(b) - getProgress(a);
      if (sortBy === "progress-asc") return getProgress(a) - getProgress(b);
      if (sortBy === "status-asc") return a.status.localeCompare(b.status);
      if (sortBy === "status-desc") return b.status.localeCompare(a.status);
      return 0;
    });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Controls Panel */}
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-3xl">
          <Input
            placeholder="Search goals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-white rounded-lg h-9 text-xs"
          />
          <Select value={deptFilter} onValueChange={(val) => setDeptFilter(val || "")}>
            <SelectTrigger className="w-44 bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-[#09090b] dark:text-white rounded-lg h-9 text-xs">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "")}>
            <SelectTrigger className="w-36 bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-[#09090b] dark:text-white rounded-lg h-9 text-xs">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="achieved">Achieved</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2 rounded-lg text-xs h-9">
          <Plus className="h-4 w-4" /> Add Goal
        </Button>
      </div>

      <Card className="border border-[#ececee] dark:border-[#2d2f39] bg-white dark:bg-[#181922] rounded-md overflow-hidden shadow-none py-0">
        <CardContent className="p-0">
          {filteredGoals.length === 0 ? (
            <EmptyState title="No goals found" description="Adjust search query or filter settings." />
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
                    onClick={() => handleSortClick("dept")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Department</span>
                      {sortBy === "dept-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "dept-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("metric")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Metric</span>
                      {sortBy === "metric-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "metric-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("progress")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Progress</span>
                      {sortBy === "progress-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "progress-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("deadline")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Deadline</span>
                      {sortBy === "deadline-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "deadline-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("status")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Status</span>
                      {sortBy === "status-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "status-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead className="w-24 text-right pr-4 text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGoals.map(g => {
                  const progress = getProgress(g);
                  return (
                    <TableRow key={g.id}>
                      <TableCell className="font-medium text-[#09090b] dark:text-white">{g.title}</TableCell>
                      <TableCell className="text-muted-foreground">{deptName(g.departmentId)}</TableCell>
                      <TableCell className="text-muted-foreground">{g.metric}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-eco-green transition-all" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {g.deadline ? new Date(g.deadline).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell><Badge variant="outline" className={statusColors[g.status]}>{g.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 justify-end pr-2">
                          <Button variant="ghost" size="icon" onClick={() => { setEditing(g); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => { setDeleting(g); setDeleteOpen(true); }} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg bg-white dark:bg-[#14151f] border border-[#ececee] dark:border-[#2d2f39] text-white rounded-xl p-6">
          <DialogHeader><DialogTitle className="text-lg font-bold text-[#09090b] dark:text-white">{editing ? "Edit Goal" : "New Goal"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Title</Label>
              <Input name="title" defaultValue={editing?.title || ""} className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6] focus-visible:border-[#9B5CF6]" required />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Department</Label>
                <Select name="departmentId" defaultValue={editing?.departmentId || ""}>
                  <SelectTrigger className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus:ring-1 focus:ring-[#9B5CF6] hover:bg-white dark:bg-[#181922] transition-all"><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-white">{departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Metric</Label>
                <Input name="metric" defaultValue={editing?.metric || ""} placeholder="CO₂e tonnes" className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6] focus-visible:border-[#9B5CF6]" required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Baseline</Label>
                <Input name="baselineValue" defaultValue={editing?.baselineValue || ""} className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6] focus-visible:border-[#9B5CF6]" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Target</Label>
                <Input name="targetValue" defaultValue={editing?.targetValue || ""} className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6] focus-visible:border-[#9B5CF6]" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Current</Label>
                <Input name="currentValue" defaultValue={editing?.currentValue || "0"} className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6] focus-visible:border-[#9B5CF6]" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Deadline</Label>
                <Input 
                  name="deadline" 
                  type="date" 
                  defaultValue={editing?.deadline ? new Date(editing.deadline).toISOString().split("T")[0] : ""} 
                  className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6]" 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Status</Label>
                <Select name="status" defaultValue={editing?.status || "active"}>
                  <SelectTrigger className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus:ring-1 focus:ring-[#9B5CF6] hover:bg-white dark:bg-[#181922] transition-all"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-white">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="achieved">Achieved</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
          <DialogHeader><DialogTitle className="text-lg font-bold text-[#09090b] dark:text-white">Delete Goal</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground py-2">Delete <span className="font-medium text-[#09090b] dark:text-white">{deleting?.title}</span>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-lg bg-[#222430] hover:bg-[#2c2e3c] border-transparent text-white text-xs h-9 px-4 font-semibold">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading} className="rounded-lg text-xs h-9 px-4 font-semibold">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
