"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Coins, Check, Sparkles } from "lucide-react";
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
  active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  inactive: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  out_of_stock: "bg-red-500/10 text-red-500 border-red-500/20",
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
      window.location.reload();
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
      window.location.reload();
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
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-[#f4f4f5]/60 dark:bg-[#121118]/60 border border-[#ececee] dark:border-[#221f2c] rounded-xl gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-lg">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Your Redeemable Balance</h2>
            <p className="text-muted-foreground text-xs">Earn more points by completing challenges & policies</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-foreground font-mono">{userPoints.toLocaleString()}</span>
          <span className="text-purple-500 font-bold text-sm">Points</span>
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
                <Card key={r.id} className="flex flex-col justify-between overflow-hidden bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] hover:border-gray-300 dark:hover:border-zinc-800 transition duration-300 shadow-xs">
                  <CardHeader className="relative pb-4 p-5">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className={`${statusColors[status]} text-[10px] font-bold uppercase tracking-wider`}>
                        {status === "out_of_stock" ? "Out of Stock" : `${r.stock ?? "∞"} Available`}
                      </Badge>
                      <Badge className="bg-purple-500/10 border border-purple-500/20 text-purple-500 font-mono text-[11px] px-2.5 py-1 rounded shadow-none">
                        {r.pointsRequired} Points
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-bold text-foreground mt-3 leading-tight">{r.name}</CardTitle>
                    <CardDescription className="text-[12px] mt-1.5 text-muted-foreground leading-normal">
                      {r.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2 pb-5 px-5">
                    <Button
                      onClick={() => {
                        setRedeeming(r);
                        setRedeemOpen(true);
                      }}
                      disabled={outOfStock || !canAfford}
                      className={`w-full font-semibold text-xs h-9 rounded-md transition shadow-none ${
                        outOfStock
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                          : !canAfford
                          ? "bg-[#f4f4f5] dark:bg-[#1c1a24] text-muted-foreground cursor-not-allowed hover:bg-[#f4f4f5] dark:hover:bg-[#1c1a24]"
                          : "bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                      }`}
                    >
                      {outOfStock ? (
                        "Out of Stock"
                      ) : !canAfford ? (
                        `Need ${r.pointsRequired - userPoints} More Points`
                      ) : (
                        <span className="flex items-center gap-1.5 justify-center">
                          Redeem Reward
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

  // Manage Rewards tab view
  const manageRewardsView = (
    <Card className="border border-[#ececee] dark:border-[#221f2c] bg-white dark:bg-[#121118] shadow-xs">
      <CardContent className="p-0">
        {rewards.length === 0 ? (
          <EmptyState title="No rewards found" description="Create company rewards and set point prices." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#ececee] dark:border-[#221f2c] bg-[#f4f4f5] dark:bg-[#121118]">
                <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider pl-6">Reward Title</TableHead>
                <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Points Price</TableHead>
                <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Available Stock</TableHead>
                <TableHead className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider">Status</TableHead>
                <TableHead className="w-24 text-right text-foreground font-semibold px-6 py-3 text-[11px] uppercase tracking-wider pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.map((r) => (
                <TableRow key={r.id} className="border-b border-[#ececee] dark:border-[#221f2c] hover:bg-[#f4f4f5] dark:hover:bg-[#16141f]/50 transition-colors">
                  <TableCell className="font-semibold text-foreground pl-6">
                    <div className="flex flex-col">
                      <span>{r.name}</span>
                      <span className="text-[10px] text-muted-foreground font-normal mt-0.5 line-clamp-1 max-w-sm">
                        {r.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-[#f59e0b] font-mono">{r.pointsRequired} Pts</TableCell>
                  <TableCell className="text-foreground font-medium">{r.stock ?? "∞"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${statusColors[r.status]} text-[10px] font-bold uppercase tracking-wider`}>
                      {r.status.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditing(r);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setDeleting(r);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
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
  );

  return (
    <>
      <div className="relative space-y-4">
        {/* Align button in navigation tab row on desktop */}
        {isManager && (
          <div className="sm:absolute sm:-top-[49px] sm:right-0 z-10 flex justify-end">
            <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-2 rounded-lg text-xs h-9">
              <Plus className="h-4 w-4" /> Add Reward
            </Button>
          </div>
        )}

        {isManager ? (
          <Tabs defaultValue="redeem" className="space-y-6">
            <TabsList className="flex flex-wrap items-center gap-1.5 p-1 bg-[#e4e4e7]/60 dark:bg-[#121118] border border-[#ececee] dark:border-[#2d2f39] rounded-lg w-fit h-auto shadow-none">
              <TabsTrigger value="redeem" className="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 border border-transparent data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1a24] data-[state=active]:text-[#09090b] dark:data-[state=active]:text-white data-[state=active]:shadow-xs data-[state=active]:border-[#ececee] dark:data-[state=active]:border-[#2d2f39] text-muted-foreground hover:text-[#09090b] dark:hover:text-white">
                Rewards Catalog
              </TabsTrigger>
              <TabsTrigger value="manage" className="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 border border-transparent data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1a24] data-[state=active]:text-[#09090b] dark:data-[state=active]:text-white data-[state=active]:shadow-xs data-[state=active]:border-[#ececee] dark:data-[state=active]:border-[#2d2f39] text-muted-foreground hover:text-[#09090b] dark:hover:text-white">
                Manage Rewards
              </TabsTrigger>
            </TabsList>
            <TabsContent value="redeem" className="outline-none">
              {redeemableView}
            </TabsContent>
            <TabsContent value="manage" className="outline-none">
              {manageRewardsView}
            </TabsContent>
          </Tabs>
        ) : (
          redeemableView
        )}
      </div>

      {/* Save Reward Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground font-bold">{editing ? "Edit Reward" : "New Reward"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Name</Label>
              <Input name="name" defaultValue={editing?.name || ""} className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]" required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Description</Label>
              <Input name="description" defaultValue={editing?.description || ""} className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Points Required</Label>
                <Input name="pointsRequired" type="number" min={10} defaultValue={editing?.pointsRequired || 50} className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]" required />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Available Stock</Label>
                <Input name="stock" type="number" min={0} defaultValue={editing?.stock ?? 10} className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Status</Label>
              <Select name="status" defaultValue={editing?.status || "active"}>
                <SelectTrigger className="bg-[#f4f4f5] dark:bg-[#1c1a24] border border-[#ececee] dark:border-[#2d2f39]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c]">
                  <SelectItem value="active">Active (Visible)</SelectItem>
                  <SelectItem value="inactive">Inactive (Hidden)</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-lg text-xs h-9">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-xs h-9">
                {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Reward Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground font-bold">Delete Reward</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Delete reward <span className="font-semibold text-foreground">"{deleting?.name}"</span>?
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-lg text-xs h-9">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading} className="rounded-lg text-xs h-9">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Redeem Confirmation Dialog */}
      <Dialog open={redeemOpen} onOpenChange={setRedeemOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-bold">
              <Sparkles className="h-5 w-5 text-purple-500" /> Redeem Reward
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs mt-2">
              Claim this reward for <span className="font-semibold text-foreground">{redeeming?.pointsRequired} points</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-[#f4f4f5] dark:bg-[#1c1a24] rounded-lg border border-[#ececee] dark:border-[#2d2f39] text-xs space-y-2">
            <p className="font-bold text-foreground">{redeeming?.name}</p>
            <p className="text-muted-foreground leading-normal">{redeeming?.description}</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRedeemOpen(false)} className="rounded-lg text-xs h-9">
              Cancel
            </Button>
            <Button onClick={handleRedeem} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-xs h-9">
              {loading ? "Processing..." : "Confirm Redemption"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
