
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateEsgSettings } from "@/actions/esg-settings";
import type { EsgSettings } from "@/db/schema";

export function SettingsClient({ settings }: { settings: EsgSettings }) {
  const [envWeight, setEnvWeight] = useState(Math.round(Number(settings.environmentalWeight) * 100));
  const [socWeight, setSocWeight] = useState(Math.round(Number(settings.socialWeight) * 100));
  const [govWeight, setGovWeight] = useState(Math.round(Number(settings.governanceWeight) * 100));
  const [autoEmission, setAutoEmission] = useState(settings.autoEmissionCalc);
  const [evidenceReq, setEvidenceReq] = useState(settings.evidenceRequired);
  const [badgeAuto, setBadgeAuto] = useState(settings.badgeAutoAward);
  const [loading, setLoading] = useState(false);

  const total = envWeight + socWeight + govWeight;

  async function handleSave() {
    if (total !== 100) {
      toast.error("Weights must sum to 100%");
      return;
    }
    setLoading(true);
    const result = await updateEsgSettings({
      environmentalWeight: envWeight,
      socialWeight: socWeight,
      governanceWeight: govWeight,
      autoEmissionCalculation: autoEmission,
      evidenceRequired: evidenceReq,
      badgeAutoAward: badgeAuto,
    });
    setLoading(false);
    if ("success" in result) {
      toast.success("Settings saved");
    } else {
      toast.error(result.error || "Failed to save");
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Scoring Weights */}
        <Card className="border border-[#ececee] dark:border-[#221f2c] bg-white dark:bg-[#121118] rounded-xl shadow-xs p-6 flex flex-col justify-between">
          <div>
            <CardHeader className="p-0 pb-4 border-b border-[#ececee] dark:border-[#221f2c]">
              <CardTitle className="text-base font-bold text-foreground">ESG Scoring Weights</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Configure how Environmental, Social, and Governance scores are weighted in the overall ESG score. Must sum to 100%.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-eco-green">Environmental</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={envWeight}
                      onChange={(e) => setEnvWeight(Number(e.target.value))}
                      className="bg-[#f4f4f5] dark:bg-[#0c0a0e] border-[#ececee] dark:border-[#221f2c] text-[#09090b] dark:text-white rounded-lg h-9 text-sm focus-visible:ring-1 focus-visible:ring-purple-500"
                    />
                    <span className="text-sm text-muted-foreground font-mono font-semibold">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-eco-teal">Social</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={socWeight}
                      onChange={(e) => setSocWeight(Number(e.target.value))}
                      className="bg-[#f4f4f5] dark:bg-[#0c0a0e] border-[#ececee] dark:border-[#221f2c] text-[#09090b] dark:text-white rounded-lg h-9 text-sm focus-visible:ring-1 focus-visible:ring-purple-500"
                    />
                    <span className="text-sm text-muted-foreground font-mono font-semibold">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-eco-blue">Governance</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={govWeight}
                      onChange={(e) => setGovWeight(Number(e.target.value))}
                      className="bg-[#f4f4f5] dark:bg-[#0c0a0e] border-[#ececee] dark:border-[#221f2c] text-[#09090b] dark:text-white rounded-lg h-9 text-sm focus-visible:ring-1 focus-visible:ring-purple-500"
                    />
                    <span className="text-sm text-muted-foreground font-mono font-semibold">%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>

          <div className="pt-4 border-t border-[#ececee] dark:border-[#221f2c] mt-4 flex items-center justify-between">
            <div className={`text-xs font-bold font-mono tracking-wide uppercase ${total === 100 ? "text-eco-green" : "text-destructive"}`}>
              Total: {total}% {total !== 100 && "(must be 100%)"}
            </div>
          </div>
        </Card>

        {/* System Toggles */}
        <Card className="border border-[#ececee] dark:border-[#221f2c] bg-white dark:bg-[#121118] rounded-xl shadow-xs p-6 flex flex-col justify-between">
          <div>
            <CardHeader className="p-0 pb-4 border-b border-[#ececee] dark:border-[#221f2c]">
              <CardTitle className="text-base font-bold text-foreground">System Toggles</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">Enable or disable platform behaviors</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-4">
              <ToggleRow
                label="Auto Emission Calculation"
                description="Automatically calculate Carbon Transactions from linked Purchase/Manufacturing/Expense/Fleet records"
                checked={autoEmission}
                onChange={setAutoEmission}
              />
              <Separator className="bg-[#ececee] dark:bg-[#221f2c]" />
              <ToggleRow
                label="Evidence Requirement"
                description="CSR Activity participation cannot be approved without an attached proof file"
                checked={evidenceReq}
                onChange={setEvidenceReq}
              />
              <Separator className="bg-[#ececee] dark:bg-[#221f2c]" />
              <ToggleRow
                label="Badge Auto-Award"
                description="Automatically assign badges when an employee meets the unlock criteria"
                checked={badgeAuto}
                onChange={setBadgeAuto}
              />
            </CardContent>
          </div>
        </Card>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          disabled={loading || total !== 100}
          className="bg-[#09090b] dark:bg-[#fafafa] hover:bg-[#18181b] dark:hover:bg-[#e4e4e7] text-white dark:text-[#09090b] rounded-[8px] h-9 text-xs px-5 transition-all font-semibold border border-transparent shadow-xs"
        >
          {loading ? "Saving Settings..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${checked ? "bg-purple-600" : "bg-gray-200 dark:bg-[#221f2c]"
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-[#121118] transition-transform ${checked ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </button>
    </div>
  );
}
