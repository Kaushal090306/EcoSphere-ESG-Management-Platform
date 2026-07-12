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

export function EmissionFactorsClient({ factors }: { factors: EmissionFactor[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<EmissionFactor | null>(null);
  const [deleting, setDeleting] = useState<EmissionFactor | null>(null);
  const [loading, setLoading] = useState(false);

  // Search, Filter, Sort States
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");

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
    if ("success" in result) { 
      toast.success("Deleted"); 
      setDeleteOpen(false); 
    } else { 
      toast.error("Failed"); 
    }
  }

  // Filtrations & Sorting Math
  const filteredFactors = factors
    .filter((f) => {
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                          f.unit.toLowerCase().includes(search.toLowerCase());
      const matchSource = sourceFilter === "all" || f.sourceType === sourceFilter;
      const matchScope = scopeFilter === "all" || f.scope === scopeFilter;
      return matchSearch && matchSource && matchScope;
    })
    .sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "factor-desc") return Number(b.factorValue) - Number(a.factorValue);
      if (sortBy === "factor-asc") return Number(a.factorValue) - Number(b.factorValue);
      return 0;
    });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-3xl">
          <Input
            placeholder="Search factors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs bg-[#181922] border-[#2d2f39] text-white rounded-xl h-9 text-xs"
          />
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-40 bg-[#181922] border-[#2d2f39] text-white rounded-xl h-9 text-xs">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sourceTypes.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={scopeFilter} onValueChange={setScopeFilter}>
            <SelectTrigger className="w-36 bg-[#181922] border-[#2d2f39] text-white rounded-xl h-9 text-xs">
              <SelectValue placeholder="All Scopes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scopes</SelectItem>
              {scopes.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-[#181922] border-[#2d2f39] text-white rounded-xl h-9 text-xs">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="factor-desc">Factor (Highest)</SelectItem>
              <SelectItem value="factor-asc">Factor (Lowest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Emission Factor
        </Button>
      </div>

      <Card className="border-[#2d2f39] bg-[#181922]">
        <CardContent className="p-0">
          {filteredFactors.length === 0 ? (
            <EmptyState title="No emission factors found" description="Adjust search query or filter settings." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Source</TableHead>
                  <TableHead className="text-white">Unit</TableHead>
                  <TableHead className="text-white">Factor (CO₂e)</TableHead>
                  <TableHead className="text-white">Scope</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="w-24 text-right pr-4 text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFactors.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium text-white">{f.name}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">{f.sourceType}</TableCell>
                    <TableCell className="text-muted-foreground">{f.unit}</TableCell>
                    <TableCell className="font-mono text-white">{f.factorValue}</TableCell>
                    <TableCell><Badge variant="outline" className={scopeColors[f.scope]}>{f.scope.replace("_", " ")}</Badge></TableCell>
                    <TableCell><Badge variant={f.status === "active" ? "default" : "secondary"} className={f.status === "active" ? "bg-eco-green/10 text-eco-green border-eco-green/20" : ""}>{f.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end pr-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(f); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { setDeleting(f); setDeleteOpen(true); }} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
        <DialogContent className="bg-[#181922] border-[#2d2f39] text-white">
          <DialogHeader><DialogTitle>{editing ? "Edit Emission Factor" : "New Emission Factor"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input name="name" defaultValue={editing?.name || ""} className="bg-[#0f1016] border-[#2d2f39]" required /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Source Type</Label>
                <Select name="sourceType" defaultValue={editing?.sourceType || "fuel"}>
                  <SelectTrigger className="bg-[#0f1016] border-[#2d2f39]"><SelectValue /></SelectTrigger>
                  <SelectContent>{sourceTypes.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Scope</Label>
                <Select name="scope" defaultValue={editing?.scope || "scope_1"}>
                  <SelectTrigger className="bg-[#0f1016] border-[#2d2f39]"><SelectValue /></SelectTrigger>
                  <SelectContent>{scopes.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Unit</Label><Input name="unit" defaultValue={editing?.unit || ""} placeholder="kWh, liters, kg" className="bg-[#0f1016] border-[#2d2f39]" required /></div>
              <div className="space-y-2"><Label>Factor Value (CO₂e)</Label><Input name="factorValue" defaultValue={editing?.factorValue || ""} placeholder="0.000233" className="bg-[#0f1016] border-[#2d2f39]" required /></div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={editing?.status || "active"}>
                <SelectTrigger className="bg-[#0f1016] border-[#2d2f39]"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-[#181922] border-[#2d2f39] text-white">
          <DialogHeader><DialogTitle>Delete Emission Factor</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Delete <span className="font-medium text-white">{deleting?.name}</span>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
