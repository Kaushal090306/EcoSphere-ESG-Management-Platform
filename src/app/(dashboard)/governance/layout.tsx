"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GovernanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: "Overview", href: "/governance" },
    { name: "ESG Policies", href: "/governance/policies" },
    { name: "Audits", href: "/governance/audits" },
    { name: "Compliance Issues", href: "/governance/compliance-issues" },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-[#2d2f39]">
        <nav className="flex gap-6 -mb-px">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`pb-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                  isActive
                    ? "border-[#9B5CF6] text-[#09090b] font-semibold"
                    : "border-transparent text-muted-foreground hover:text-[#09090b]"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div>{children}</div>
    </div>
  );
}
