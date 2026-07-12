"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EnvironmentalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: "Overview", href: "/environmental" },
    { name: "Emission Factors", href: "/environmental/emission-factors" },
    { name: "Product ESG Profiles", href: "/environmental/product-profiles" },
    { name: "Carbon Transactions", href: "/environmental/carbon-transactions" },
    { name: "Environmental Goals", href: "/environmental/goals" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2d2f39] gap-3">
        <nav className="flex flex-wrap gap-6 -mb-px">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`pb-4 text-sm font-medium border-b-2 transition-all duration-200 relative ${
                  isActive
                    ? "border-[#9B5CF6] text-white font-semibold"
                    : "border-transparent text-muted-foreground hover:text-white"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>

        {/* Date picker & export action in the same tab switcher row aligned in the middle */}
        <div className="flex items-center gap-3 pb-4">
          <div className="flex items-center gap-2 bg-[#181922] border border-[#2d2f39] rounded-xl px-3 py-1.5 text-xs text-muted-foreground font-medium">
            <Calendar className="h-4 w-4 text-muted-foreground/80" />
            <span>Oct 1 – Oct 31, 2024</span>
          </div>
          <Button 
            onClick={() => window.print()}
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs px-3 py-1.5 h-8.5 rounded-xl font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div>{children}</div>
    </div>
  );
}
