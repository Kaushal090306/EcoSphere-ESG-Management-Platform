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
import { createEmissionFactor, updateEmissionFactor, deleteEmissionFactor } from "@/actions/emission-factors";
import type { EmissionFactor } from "@/db/schema";

const sourceTypes = [
  { value: "fuel", label: "Fuel" },
  { value: "electricity", label: "Electricity" },
  { value: "materials", label: "Materials" },
  { value: "fleet", label: "Fleet" },
  { value: "waste", label: "Waste" },
  { value: "other", label: "Other" },
];

const scopes = [
  { value: "scope_1", label: "Scope 1" },
  { value: "scope_2", label: "Scope 2" },
  { value: "scope_3", label: "Scope 3" },
];

const scopeColors: Record<string, string> = {
  scope_1: "bg-eco-green/10 text-eco-green border-eco-green/20",
  scope_2: "bg-eco-teal/10 text-eco-teal border-eco-teal/20",
  scope_3: "bg-eco-blue/10 text-eco-blue border-eco-blue/20",
};

export function EmissionFactorsClient({ factors, userRole }: { factors: EmissionFactor[]; userRole?: string }) {
  const isReadOnly = userRole === "auditor" || userRole === "employee";
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<EmissionFactor | null>(null);
  const [deleting, setDeleting] = useState<EmissionFactor | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      sourceType: fd.get("sourceType") as "fuel" | "electricity" | "materials" | "fleet" | "waste" | "other",
      unit: fd.get("unit") as string,
      factorValue: fd.get("factorValue") as string,
      scope: fd.get("scope") as "scope_1" | "scope_2" | "scope_3",
      status: (fd.get("status") as "active" | "inactive") || "active",
    };
    const result = editing ? await updateEmissionFactor(editing.id, data) : await createEmissionFactor(data);
    setLoading(false);
    if ("success" in result) {
      toast.success(editing ? "Emission factor updated" : "Emission factor created");
      setDialogOpen(false);
    } else {
      toast.error("Failed to save emission factor");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const result = await deleteEmissionFactor(deleting.id);
    setLoading(false);
    if ("success" in result) { toast.success("Deleted"); setDeleteOpen(false); } else { toast.error("Failed"); }
  }

  return (
    <>
      {!isReadOnly && (
        <div className="flex justify-end">
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Add Emission Factor
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {factors.length === 0 ? (
            <EmptyState title="No emission factors" description="Configure emission factors to start carbon accounting." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Factor (CO₂e)</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Status</TableHead>
                  {!isReadOnly && <TableHead className="w-24">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {factors.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.name}</TableCell>
                    <TableCell className="capitalize">{f.sourceType}</TableCell>
                    <TableCell>{f.unit}</TableCell>
                    <TableCell className="font-mono">{f.factorValue}</TableCell>
                    <TableCell><Badge variant="outline" className={scopeColors[f.scope]}>{f.scope.replace("_", " ")}</Badge></TableCell>
                    <TableCell><Badge variant={f.status === "active" ? "default" : "secondary"} className={f.status === "active" ? "bg-eco-green/10 text-eco-green border-eco-green/20" : ""}>{f.status}</Badge></TableCell>
                    {!isReadOnly && (
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setEditing(f); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => { setDeleting(f); setDeleteOpen(true); }} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Emission Factor" : "New Emission Factor"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input name="name" defaultValue={editing?.name || ""} required /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Source Type</Label><Select name="sourceType" defaultValue={editing?.sourceType || "fuel"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{sourceTypes.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Scope</Label><Select name="scope" defaultValue={editing?.scope || "scope_1"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{scopes.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Unit</Label><Input name="unit" defaultValue={editing?.unit || ""} placeholder="kWh, liters, kg" required /></div>
              <div className="space-y-2"><Label>Factor Value (CO₂e)</Label><Input name="factorValue" defaultValue={editing?.factorValue || ""} placeholder="0.000233" required /></div>
            </div>
            <div className="space-y-2"><Label>Status</Label><Select name="status" defaultValue={editing?.status || "active"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Emission Factor</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Delete <span className="font-medium text-foreground">{deleting?.name}</span>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
