"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Gift, Coins, Package, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createReward, updateReward, deleteReward } from "@/actions/rewards";
import { redeemRewardAction } from "@/actions/gamification";
import type { Reward } from "@/db/schema";

const statusColors: Record<string, string> = {
  active: "bg-eco-green/10 text-eco-green border-eco-green/20",
  inactive: "bg-muted text-muted-foreground",
  out_of_stock: "bg-eco-red/10 text-eco-red border-eco-red/20",
};

interface RewardsClientProps {
  rewards: Reward[];
  userPoints: number;
  userRole: string;
}

export function RewardsClient({ rewards, userPoints: initialPoints, userRole }: RewardsClientProps) {
  // State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [editing, setEditing] = useState<Reward | null>(null);
  const [deleting, setDeleting] = useState<Reward | null>(null);
  const [redeeming, setRedeeming] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(false);
  const [userPoints, setUserPoints] = useState(initialPoints);

  const isManager = ["admin", "esg_manager", "dept_head"].includes(userRole);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      description: fd.get("description") as string,
      pointsRequired: Number(fd.get("pointsRequired")),
      stock: Number(fd.get("stock") || 0),
      status: fd.get("status") as "active" | "inactive" | "out_of_stock",
    };
    const result = editing ? await updateReward(editing.id, data) : await createReward(data);
    setLoading(false);
    if ("success" in result) {
      toast.success(editing ? "Reward updated" : "Reward created");
      setDialogOpen(false);
    } else {
      toast.error("Failed to save");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const result = await deleteReward(deleting.id);
    setLoading(false);
    if ("success" in result) {
      toast.success("Deleted");
      setDeleteOpen(false);
    } else {
      toast.error("Failed");
    }
  }

  async function handleRedeem() {
    if (!redeeming) return;
    setLoading(true);
    const result = await redeemRewardAction(redeeming.id);
    setLoading(false);
    if (result.success) {
      setUserPoints((prev) => prev - redeeming.pointsRequired);
      toast.success(`Successfully redeemed ${redeeming.name}! 🎁`);
      setRedeemOpen(false);
    } else {
      toast.error(result.error || "Failed to redeem reward");
    }
  }

  const redeemableView = (
    <div className="space-y-6">
      {/* Points Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gradient-to-r from-purple-900/40 to-indigo-950/40 rounded-xl border border-purple-500/20 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600/20 text-purple-400 rounded-lg">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Your Redeemable Balance</h2>
            <p className="text-muted-foreground text-sm">Earn more points by completing challenges & policies</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-white font-mono">{userPoints.toLocaleString()}</span>
          <span className="text-purple-400 font-semibold text-lg">Points</span>
        </div>
      </div>

      {/* Rewards Grid */}
      {rewards.filter(r => r.status !== "inactive").length === 0 ? (
        <EmptyState title="No rewards available" description="Check back later for exciting company rewards!" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards
            .filter((r) => r.status !== "inactive")
            .map((r) => {
              const outOfStock = r.stock !== null && r.stock <= 0;
              const status = outOfStock ? "out_of_stock" : r.status;
              const canAfford = userPoints >= r.pointsRequired;

              return (
                <Card key={r.id} className="flex flex-col justify-between overflow-hidden border border-[#221F2C] hover:border-purple-500/30 transition duration-300">
                  <CardHeader className="relative pb-4">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className={`${statusColors[status]} font-medium`}>
                        {status === "out_of_stock" ? "Out of Stock" : `${r.stock ?? "∞"} Available`}
                      </Badge>
                      <Badge className="bg-purple-900/50 border-purple-500/30 text-purple-300 font-mono text-sm px-2.5 py-1">
                        {r.pointsRequired} Points
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-3 text-white">{r.name}</CardTitle>
                    <CardDescription className="text-sm mt-1.5 text-muted-foreground">
                      {r.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2 pb-6 px-6">
                    <Button
                      onClick={() => {
                        setRedeeming(r);
                        setRedeemOpen(true);
                      }}
                      disabled={outOfStock || !canAfford}
                      className={`w-full font-semibold transition ${
                        outOfStock
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : !canAfford
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed hover:bg-slate-800"
                          : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/20"
                      }`}
                    >
                      {outOfStock ? (
                        "Out of Stock"
                      ) : !canAfford ? (
                        `Need ${r.pointsRequired - userPoints} More Points`
                      ) : (
                        <span className="flex items-center gap-1.5 justify-center">
                          <Gift className="h-4 w-4" /> Redeem Reward
                        </span>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );

  const managementView = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold">
          <Plus className="h-4 w-4" /> Add Reward Item
        </Button>
      </div>
      <Card className="border border-[#221F2C]">
        <CardContent className="p-0">
          {rewards.length === 0 ? (
            <EmptyState title="No rewards yet" description="Create rewards that employees can redeem with their points." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#221F2C]">
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Description</TableHead>
                  <TableHead className="text-muted-foreground">Points Required</TableHead>
                  <TableHead className="text-muted-foreground">Stock</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="w-24 text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((r) => (
                  <TableRow key={r.id} className="border-b border-[#221F2C] hover:bg-slate-900/30">
                    <TableCell className="font-medium text-white">{r.name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">{r.description}</TableCell>
                    <TableCell className="font-mono text-[#f59e0b] font-bold">{r.pointsRequired} pts</TableCell>
                    <TableCell className="text-white">{r.stock ?? "∞"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[r.status]}>
                        {r.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="hover:bg-slate-800 text-slate-300" onClick={() => { setEditing(r); setDialogOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-red-950/30 text-destructive" onClick={() => { setDeleting(r); setDeleteOpen(true); }}>
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
    </div>
  );

  return (
    <>
      {isManager ? (
        <Tabs defaultValue="redeem" className="space-y-6">
          <TabsList className="bg-[#181524] border border-[#221F2C]">
            <TabsTrigger value="redeem" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Redeem Incentives
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Catalog Management
            </TabsTrigger>
          </TabsList>
          <TabsContent value="redeem" className="outline-none">
            {redeemableView}
          </TabsContent>
          <TabsContent value="manage" className="outline-none">
            {managementView}
          </TabsContent>
        </Tabs>
      ) : (
        redeemableView
      )}

      {/* Redeem Dialog */}
      <Dialog open={redeemOpen} onOpenChange={setRedeemOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 text-purple-400" /> Confirm Redemption
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Are you sure you want to redeem <span className="font-semibold text-white">"{redeeming?.name}"</span> for{" "}
              <span className="font-bold text-[#f59e0b] font-mono">{redeeming?.pointsRequired} points</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950/50 rounded-lg border border-purple-500/10 my-4">
            <span className="text-muted-foreground text-xs uppercase tracking-wider mb-1">New Balance</span>
            <div className="flex items-baseline gap-1 text-2xl font-bold font-mono text-white">
              {redeeming ? (userPoints - redeeming.pointsRequired).toLocaleString() : userPoints}
              <span className="text-xs text-purple-400 uppercase font-sans">pts</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRedeemOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRedeem} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
              {loading ? "Processing..." : "Confirm & Redeem"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Catalog Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Catalog Item" : "Create New Catalog Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input name="name" defaultValue={editing?.name || ""} required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input name="description" defaultValue={editing?.description || ""} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Points Required</Label>
                <Input name="pointsRequired" type="number" min={1} defaultValue={editing?.pointsRequired || 100} required />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input name="stock" type="number" min={0} defaultValue={editing?.stock || 0} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={editing?.status || "active"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
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

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reward</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-medium text-foreground">{deleting?.name}</span>?
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
