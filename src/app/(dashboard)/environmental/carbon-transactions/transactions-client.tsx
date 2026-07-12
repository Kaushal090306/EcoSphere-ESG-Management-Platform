"use client";

import { useState, useEffect } from "react";
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
import { createCarbonTransaction, updateCarbonTransaction, deleteCarbonTransaction } from "@/actions/carbon-transactions";
import type { CarbonTransaction, Department } from "@/db/schema";

interface EmissionFactor {
  id: string;
  name: string;
  factorValue: string;
  unit: string;
}

export function TransactionsClient({
  transactions,
  departments,
  emissionFactors,
}: {
  transactions: CarbonTransaction[];
  departments: Department[];
  emissionFactors: EmissionFactor[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<CarbonTransaction | null>(null);
  const [deleting, setDeleting] = useState<CarbonTransaction | null>(null);
  const [loading, setLoading] = useState(false);

  // Search, Filter, Sort States
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  // Form states for dynamic calculation
  const [selectedFactorId, setSelectedFactorId] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [autoCalc, setAutoCalc] = useState(true);
  const [customCo2e, setCustomCo2e] = useState("0");

  // Synchronize form states on Edit
  useEffect(() => {
    if (editing) {
      setSelectedFactorId(editing.emissionFactorId);
      setQuantity(editing.quantity);
      setAutoCalc(editing.autoCalculated);
      setCustomCo2e(editing.co2eValue);
    } else {
      setSelectedFactorId(emissionFactors[0]?.id || "");
      setQuantity("0");
      setAutoCalc(true);
      setCustomCo2e("0");
    }
  }, [editing, dialogOpen, emissionFactors]);

  const activeFactor = emissionFactors.find((f) => f.id === selectedFactorId);
  const calculatedCo2e = activeFactor 
    ? (parseFloat(quantity) * parseFloat(activeFactor.factorValue)).toFixed(2)
    : "0.00";

  const currentCo2e = autoCalc ? calculatedCo2e : customCo2e;

  const deptName = (id: string) => departments.find((d) => d.id === id)?.name || "—";
  const factorName = (id: string) => emissionFactors.find((f) => f.id === id)?.name || "—";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    
    const data = {
      departmentId: fd.get("departmentId") as string,
      sourceType: fd.get("sourceType") as "purchase" | "manufacturing" | "expense" | "fleet",
      emissionFactorId: selectedFactorId,
      quantity: quantity,
      co2eValue: currentCo2e,
      date: fd.get("date") as string,
      autoCalculated: autoCalc,
    };

    const result = editing
      ? await updateCarbonTransaction(editing.id, data)
      : await createCarbonTransaction(data);

    setLoading(false);
    if ("success" in result) {
      toast.success(editing ? "Transaction updated" : "Transaction recorded");
      setDialogOpen(false);
    } else {
      toast.error("Failed to save transaction");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const result = await deleteCarbonTransaction(deleting.id);
    setLoading(false);
    if ("success" in result) {
      toast.success("Transaction deleted");
      setDeleteOpen(false);
    } else {
      toast.error("Failed to delete transaction");
    }
  }

  // Filtrations & Sorting
  const filteredTransactions = transactions
    .filter((t) => {
      const matchSearch = factorName(t.emissionFactorId).toLowerCase().includes(search.toLowerCase()) || 
                          deptName(t.departmentId).toLowerCase().includes(search.toLowerCase()) ||
                          t.sourceType.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === "all" || t.departmentId === deptFilter;
      const matchSource = sourceFilter === "all" || t.sourceType === sourceFilter;
      return matchSearch && matchDept && matchSource;
    })
    .sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      }
      if (sortBy === "date-asc") {
        return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
      }
      if (sortBy === "co2e-desc") {
        return parseFloat(b.co2eValue) - parseFloat(a.co2eValue);
      }
      if (sortBy === "co2e-asc") {
        return parseFloat(a.co2eValue) - parseFloat(b.co2eValue);
      }
      return 0;
    });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Controls Panel */}
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-3xl">
          <Input
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs bg-[#181922] border-[#2d2f39] text-white rounded-xl h-9 text-xs"
          />
          <Select value={deptFilter} onValueChange={(val) => val && setDeptFilter(val)}>
            <SelectTrigger className="w-44 bg-[#181922] border-[#2d2f39] text-white rounded-xl h-9 text-xs">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={(val) => val && setSourceFilter(val)}>
            <SelectTrigger className="w-36 bg-[#181922] border-[#2d2f39] text-white rounded-xl h-9 text-xs">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="purchase">Purchase</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="fleet">Fleet</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(val) => val && setSortBy(val)}>
            <SelectTrigger className="w-36 bg-[#181922] border-[#2d2f39] text-white rounded-xl h-9 text-xs">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Date (Newest)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest)</SelectItem>
              <SelectItem value="co2e-desc">CO₂e (Highest)</SelectItem>
              <SelectItem value="co2e-asc">CO₂e (Lowest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Transaction
        </Button>
      </div>

      <Card className="border-[#2d2f39] bg-[#181922]">
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <EmptyState title="No transactions found" description="Adjust search query or filter settings." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">Department</TableHead>
                  <TableHead className="text-white">Source Type</TableHead>
                  <TableHead className="text-white">Emission Factor</TableHead>
                  <TableHead className="text-white">Quantity</TableHead>
                  <TableHead className="text-right text-white">CO₂e Value</TableHead>
                  <TableHead className="text-right text-white">Calculation</TableHead>
                  <TableHead className="w-24 text-right pr-4 text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-muted-foreground">
                      {t.date ? new Date(t.date).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="font-medium text-white">
                      {deptName(t.departmentId)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {t.sourceType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {factorName(t.emissionFactorId)}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {t.quantity} {emissionFactors.find((f) => f.id === t.emissionFactorId)?.unit || ""}
                    </TableCell>
                    <TableCell className="text-right font-mono text-white font-semibold">
                      {parseFloat(t.co2eValue).toFixed(2)} t
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          t.autoCalculated
                            ? "bg-eco-green/10 text-eco-green border-eco-green/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {t.autoCalculated ? "Automated" : "Manual"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end pr-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditing(t);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeleting(t);
                            setDeleteOpen(true);
                          }}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg bg-[#181922] border-[#2d2f39] text-white">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Transaction" : "New Transaction"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select name="departmentId" defaultValue={editing?.departmentId || ""}>
                  <SelectTrigger className="bg-[#0f1016] border-[#2d2f39]">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Source Type</Label>
                <Select name="sourceType" defaultValue={editing?.sourceType || "purchase"}>
                  <SelectTrigger className="bg-[#0f1016] border-[#2d2f39]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="fleet">Fleet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Emission Factor</Label>
              <Select value={selectedFactorId} onValueChange={(val) => setSelectedFactorId(val || "")}>
                <SelectTrigger className="bg-[#0f1016] border-[#2d2f39]">
                  <SelectValue placeholder="Select emission factor" />
                </SelectTrigger>
                <SelectContent>
                  {emissionFactors.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name} ({f.factorValue} kgCO₂e/{f.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Quantity {activeFactor ? `(${activeFactor.unit})` : ""}</Label>
                <Input
                  type="number"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-[#0f1016] border-[#2d2f39]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  name="date"
                  type="date"
                  defaultValue={editing?.date ? new Date(editing.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
                  className="bg-[#0f1016] border-[#2d2f39]"
                  required
                />
              </div>
            </div>

            <div className="bg-[#0f1016] border border-[#2d2f39] rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Auto-calculate CO₂e</Label>
                  <p className="text-xs text-muted-foreground">
                    Use factor equation instead of manual override
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoCalc}
                    onChange={(e) => setAutoCalc(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#2d2f39] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#88888b] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#9B5CF6] peer-checked:after:bg-white"></div>
                </label>
              </div>

              <div className="space-y-2">
                <Label>Calculated CO₂e Value (tonnes)</Label>
                <Input
                  type="number"
                  step="any"
                  value={currentCo2e}
                  disabled={autoCalc}
                  onChange={(e) => setCustomCo2e(e.target.value)}
                  className="bg-[#181922] border-[#2d2f39]"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-[#181922] border-[#2d2f39] text-white">
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this carbon entry?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
