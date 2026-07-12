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

  const handleSortClick = (field: string) => {
    if (sortBy === `${field}-asc`) {
      setSortBy(`${field}-desc`);
    } else {
      setSortBy(`${field}-asc`);
    }
  };

  // Filtrations & Sorting
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
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "source-asc") return a.sourceType.localeCompare(b.sourceType);
      if (sortBy === "source-desc") return b.sourceType.localeCompare(a.sourceType);
      if (sortBy === "unit-asc") return a.unit.localeCompare(b.unit);
      if (sortBy === "unit-desc") return b.unit.localeCompare(a.unit);
      if (sortBy === "factor-desc") return Number(b.factorValue) - Number(a.factorValue);
      if (sortBy === "factor-asc") return Number(a.factorValue) - Number(b.factorValue);
      if (sortBy === "scope-asc") return a.scope.localeCompare(b.scope);
      if (sortBy === "scope-desc") return b.scope.localeCompare(a.scope);
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
            className="max-w-xs bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-white rounded-lg h-9 text-xs"
          />
          <Select value={sourceFilter} onValueChange={(val) => setSourceFilter(val || "")}>
            <SelectTrigger className="w-40 bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-[#09090b] dark:text-white rounded-lg h-9 text-xs">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sourceTypes.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={scopeFilter} onValueChange={(val) => setScopeFilter(val || "")}>
            <SelectTrigger className="w-36 bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-[#09090b] dark:text-white rounded-lg h-9 text-xs">
              <SelectValue placeholder="All Scopes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scopes</SelectItem>
              {scopes.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!isReadOnly && (
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2 rounded-lg text-xs h-9">
            <Plus className="h-4 w-4" /> Add Factor
          </Button>
        )}
      </div>

      <Card className="border border-[#ececee] dark:border-[#2d2f39] bg-white dark:bg-[#181922] rounded-md overflow-hidden shadow-none py-0">
        <CardContent className="p-0">
          {filteredFactors.length === 0 ? (
            <EmptyState title="No emission factors found" description="Adjust search query or filter settings." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("name")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Name</span>
                      {sortBy === "name-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "name-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("source")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Source</span>
                      {sortBy === "source-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "source-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("unit")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Unit</span>
                      {sortBy === "unit-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "unit-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("factor")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Factor (CO₂e)</span>
                      {sortBy === "factor-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "factor-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("scope")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Scope</span>
                      {sortBy === "scope-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "scope-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  {!isReadOnly && <TableHead className="w-24 text-right pr-4 text-foreground">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFactors.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium text-[#09090b] dark:text-white">{f.name}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">{f.sourceType}</TableCell>
                    <TableCell className="text-muted-foreground">{f.unit}</TableCell>
                    <TableCell className="font-mono text-white">{f.factorValue}</TableCell>
                    <TableCell><Badge variant="outline" className={scopeColors[f.scope]}>{f.scope.replace("_", " ")}</Badge></TableCell>
                    <TableCell><Badge variant={f.status === "active" ? "default" : "secondary"} className={f.status === "active" ? "bg-eco-green/10 text-eco-green border-eco-green/20" : ""}>{f.status}</Badge></TableCell>
                    {!isReadOnly && (
                      <TableCell>
                        <div className="flex items-center gap-1 justify-end pr-2">
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
        <DialogContent className="bg-white dark:bg-[#14151f] border border-[#ececee] dark:border-[#2d2f39] text-white rounded-xl p-6 max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold text-[#09090b] dark:text-white">{editing ? "Edit Emission Factor" : "New Emission Factor"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Name</Label>
              <Input name="name" defaultValue={editing?.name || ""} className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6] focus-visible:border-[#9B5CF6]" required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Source Type</Label>
                <Select name="sourceType" defaultValue={editing?.sourceType || "fuel"}>
                  <SelectTrigger className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus:ring-1 focus:ring-[#9B5CF6] hover:bg-white dark:bg-[#181922] transition-all"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-white">{sourceTypes.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Scope</Label>
                <Select name="scope" defaultValue={editing?.scope || "scope_1"}>
                  <SelectTrigger className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus:ring-1 focus:ring-[#9B5CF6] hover:bg-white dark:bg-[#181922] transition-all"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-white">{scopes.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Unit</Label>
                <Input name="unit" defaultValue={editing?.unit || ""} placeholder="kWh, liters, kg" className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6] focus-visible:border-[#9B5CF6]" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Factor Value (CO₂e)</Label>
                <Input name="factorValue" defaultValue={editing?.factorValue || ""} placeholder="0.000233" className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus-visible:ring-1 focus-visible:ring-[#9B5CF6] focus-visible:border-[#9B5CF6]" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] text-[#71717a] dark:text-[#8e909a] font-bold tracking-wider uppercase">Status</Label>
              <Select name="status" defaultValue={editing?.status || "active"}>
                <SelectTrigger className="bg-[#f4f4f5] dark:bg-[#0f1016] border-[#ececee] dark:border-[#2d2f39] rounded-lg h-10 text-sm text-[#09090b] dark:text-white focus:ring-1 focus:ring-[#9B5CF6] hover:bg-white dark:bg-[#181922] transition-all"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-white"><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
              </Select>
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
          <DialogHeader><DialogTitle className="text-lg font-bold text-[#09090b] dark:text-white">Delete Emission Factor</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground py-2">Delete <span className="font-medium text-[#09090b] dark:text-white">{deleting?.name}</span>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-lg bg-[#222430] hover:bg-[#2c2e3c] border-transparent text-white text-xs h-9 px-4 font-semibold">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading} className="rounded-lg text-xs h-9 px-4 font-semibold">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
