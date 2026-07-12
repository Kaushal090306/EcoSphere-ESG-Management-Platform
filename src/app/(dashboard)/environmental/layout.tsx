"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
      {/* Horizontal Page Tabs */}
      <div className="border-b border-[#2d2f39]">
        <nav className="flex gap-6 -mb-px">
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
      </div>

      {/* Tab Content */}
      <div>{children}</div>
    </div>
  );
}
