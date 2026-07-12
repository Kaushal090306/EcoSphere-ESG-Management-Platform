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
import { createDiversityMetric, updateDiversityMetric, deleteDiversityMetric } from "@/actions/diversity";
import { toast } from "sonner";
import { Users } from "lucide-react";

export function DiversityClient({ metrics, departments, userRole }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManage = userRole === "admin" || userRole === "esg_manager";

  // State for JSONB breakdown fields
  const [genderMale, setGenderMale] = useState(0);
  const [genderFemale, setGenderFemale] = useState(0);
  const [genderOther, setGenderOther] = useState(0);

  const [age18_25, setAge18_25] = useState(0);
  const [age26_40, setAge26_40] = useState(0);
  const [age41_55, setAge41_55] = useState(0);
  const [age55plus, setAge55plus] = useState(0);

  function resetForm(item?: any) {
    if (item) {
      setGenderMale(item.genderBreakdown?.male || 0);
      setGenderFemale(item.genderBreakdown?.female || 0);
      setGenderOther(item.genderBreakdown?.other || 0);
      setAge18_25(item.ageBandBreakdown?.['18-25'] || 0);
      setAge26_40(item.ageBandBreakdown?.['26-40'] || 0);
      setAge41_55(item.ageBandBreakdown?.['41-55'] || 0);
      setAge55plus(item.ageBandBreakdown?.['55+'] || 0);
    } else {
      setGenderMale(0); setGenderFemale(0); setGenderOther(0);
      setAge18_25(0); setAge26_40(0); setAge41_55(0); setAge55plus(0);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      departmentId: fd.get("departmentId") as string,
      period: fd.get("period") as string,
      genderBreakdown: { male: genderMale, female: genderFemale, other: genderOther },
      ageBandBreakdown: { "18-25": age18_25, "26-40": age26_40, "41-55": age41_55, "55+": age55plus },
      ethnicityBreakdown: {}, // Simplification for UI space
      disabilityCount: Number(fd.get("disabilityCount")),
    };

    try {
      if (editing) {
        await updateDiversityMetric(editing.id, data);
        toast.success("Metric updated successfully");
      } else {
        await createDiversityMetric(data);
        toast.success("Metric created successfully");
      }
      setIsOpen(false);
      setEditing(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save metric");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this metric record?")) return;
    try {
      await deleteDiversityMetric(id);
      toast.success("Metric deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete metric");
    }
  }

  const deptName = (id: string) => departments.find((d: any) => d.id === id)?.name || "Unknown";

  return (
    <div className="relative space-y-4">
      {canManage && (
        <div className="sm:absolute sm:-top-[49px] sm:right-0 flex justify-end">
          <Button onClick={() => { setEditing(null); resetForm(); setIsOpen(true); }} className="gap-2 rounded-lg text-xs h-9">
            <Plus className="h-4 w-4" /> Add Record
          </Button>
        </div>
      )}
      <Card className="bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] rounded-xl shadow-none py-0">
        <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Gender Diversity</TableHead>
              <TableHead>Disability Count</TableHead>
              {canManage && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                  No metrics recorded yet.
                </TableCell>
              </TableRow>
            )}
            {metrics.map((m: any) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium text-[#09090b] dark:text-white">{deptName(m.departmentId)}</TableCell>
                <TableCell>{m.period}</TableCell>
                <TableCell className="text-xs">
                  M: {m.genderBreakdown?.male || 0}, F: {m.genderBreakdown?.female || 0}, O: {m.genderBreakdown?.other || 0}
                </TableCell>
                <TableCell className="font-mono">{m.disabilityCount}</TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(m); resetForm(m); setIsOpen(true); }}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(m.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Metric" : "Add Metric"}</DialogTitle>
            </DialogHeader>
            <form key={editing ? editing.id : "new"} onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select name="departmentId" defaultValue={editing?.departmentId || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department">
                        {(val: string) => val ? (departments.find((d: any) => d.id === val)?.name || val) : "Select Department"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d: any) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Period (e.g. Q1 2024)</Label>
                  <Input name="period" defaultValue={editing?.period} required />
                </div>
              </div>
              
              <div className="border rounded-md p-4 space-y-4">
                <Label className="text-eco-green">Gender Breakdown</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2"><Label className="text-xs text-muted-foreground">Male</Label><Input type="number" min={0} value={genderMale} onChange={(e) => setGenderMale(Number(e.target.value))} required /></div>
                  <div className="space-y-2"><Label className="text-xs text-muted-foreground">Female</Label><Input type="number" min={0} value={genderFemale} onChange={(e) => setGenderFemale(Number(e.target.value))} required /></div>
                  <div className="space-y-2"><Label className="text-xs text-muted-foreground">Other</Label><Input type="number" min={0} value={genderOther} onChange={(e) => setGenderOther(Number(e.target.value))} required /></div>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-4">
                <Label className="text-eco-blue">Age Band Breakdown</Label>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2"><Label className="text-xs text-muted-foreground">18-25</Label><Input type="number" min={0} value={age18_25} onChange={(e) => setAge18_25(Number(e.target.value))} required /></div>
                  <div className="space-y-2"><Label className="text-xs text-muted-foreground">26-40</Label><Input type="number" min={0} value={age26_40} onChange={(e) => setAge26_40(Number(e.target.value))} required /></div>
                  <div className="space-y-2"><Label className="text-xs text-muted-foreground">41-55</Label><Input type="number" min={0} value={age41_55} onChange={(e) => setAge41_55(Number(e.target.value))} required /></div>
                  <div className="space-y-2"><Label className="text-xs text-muted-foreground">55+</Label><Input type="number" min={0} value={age55plus} onChange={(e) => setAge55plus(Number(e.target.value))} required /></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Disability Count</Label>
                <Input name="disabilityCount" type="number" min={0} defaultValue={editing?.disabilityCount || 0} required />
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
