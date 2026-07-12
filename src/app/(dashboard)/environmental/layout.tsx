"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Calendar as CalendarIcon, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function EnvironmentalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const period = searchParams.get("period") || "oct";

  const periodLabels: Record<string, string> = {
    oct: "Oct 1 – Oct 31, 2024",
    sep: "Sep 1 – Sep 30, 2024",
    aug: "Aug 1 – Aug 31, 2024",
    last6: "Last 6 Months",
  };

  const handlePeriodChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", val);
    router.push(`${pathname}?${params.toString()}`);
  };

  const tabs = [
    { name: "Overview", href: "/environmental" },
    { name: "Emission Factors", href: "/environmental/emission-factors" },
    { name: "Product ESG Profiles", href: "/environmental/product-profiles" },
    { name: "Carbon Transactions", href: "/environmental/carbon-transactions" },
    { name: "Environmental Goals", href: "/environmental/goals" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="flex flex-wrap items-center gap-1.5 p-1 bg-[#e4e4e7]/60 dark:bg-[#121118] border border-[#ececee] dark:border-[#2d2f39] rounded-lg">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 border border-transparent ${isActive ? "bg-white dark:bg-[#1c1a24] text-[#09090b] dark:text-white shadow-xs border-[#ececee] dark:border-[#2d2f39]" : "text-muted-foreground hover:text-[#09090b] dark:hover:text-white"}`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>

        {/* Date picker & export action in the same tab switcher row aligned in the middle */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
            <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 py-1.5 h-8.5 rounded-lg bg-white dark:bg-[#181922] border border-[#ececee] dark:border-[#2d2f39] text-xs font-semibold text-muted-foreground hover:bg-[#f4f4f5] dark:hover:bg-[#201E2A] hover:text-[#09090b] dark:hover:text-white transition-all cursor-pointer"
                >
                  <CalendarIcon className="h-4 w-4 text-[#9B5CF6]" />
                  <span>{periodLabels[period] || "Oct 1 – Oct 31, 2024"}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground/60" />
                </Button>
              }
            />
            <DropdownMenuContent className="bg-white dark:bg-[#181922] border-[#ececee] dark:border-[#2d2f39] text-[#09090b] dark:text-white rounded-lg">
              <DropdownMenuItem onClick={() => handlePeriodChange("oct")} className="text-xs text-[#09090b] dark:text-white focus:bg-[#f4f4f5] dark:focus:bg-[#2c2e3c] cursor-pointer">
                Oct 1 – Oct 31, 2024
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePeriodChange("sep")} className="text-xs text-[#09090b] dark:text-white focus:bg-[#f4f4f5] dark:focus:bg-[#2c2e3c] cursor-pointer">
                Sep 1 – Sep 30, 2024
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePeriodChange("aug")} className="text-xs text-[#09090b] dark:text-white focus:bg-[#f4f4f5] dark:focus:bg-[#2c2e3c] cursor-pointer">
                Aug 1 – Aug 31, 2024
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePeriodChange("last6")} className="text-xs text-[#09090b] dark:text-white focus:bg-[#f4f4f5] dark:focus:bg-[#2c2e3c] cursor-pointer">
                Last 6 Months
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button 
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs px-3 py-1.5 h-8.5 rounded-lg font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </Button>
              }
            />
            <DropdownMenuContent className="bg-white dark:bg-[#121118] border border-[#ececee] dark:border-[#221f2c] rounded-lg z-50">
              <DropdownMenuItem 
                onClick={() => window.print()}
                className="text-xs text-[#09090b] dark:text-white focus:bg-[#f4f4f5] dark:focus:bg-[#1c1a24] cursor-pointer"
              >
                Download PDF Report
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  const headers = "Category,Metric,Value,Unit,Period\n";
                  const rows = [
                    ["Environmental", "Carbon Emissions", "1245.6", "tCO2e", "October 2024"],
                    ["Environmental", "Energy Consumption", "2450.8", "MWh", "October 2024"],
                    ["Environmental", "Water Usage", "8320.5", "m3", "October 2024"],
                    ["Environmental", "Waste Generated", "245.6", "tons", "October 2024"],
                  ].map(row => row.join(",")).join("\n");
                  const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", "environmental_esg_report.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="text-xs text-[#09090b] dark:text-white focus:bg-[#f4f4f5] dark:focus:bg-[#1c1a24] cursor-pointer"
              >
                Download CSV Dataset
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tab Content */}
      <div>{children}</div>
    </div>
  );
}
