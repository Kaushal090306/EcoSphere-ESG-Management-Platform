"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: "Overview", href: "/social" },
    { name: "CSR Activities", href: "/social/csr-activities" },
    { name: "Employee Participation", href: "/social/participation" },
    { name: "Diversity Metrics", href: "/social/diversity" },
    { name: "Training Records", href: "/social/training" },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="">
        <nav className="flex flex-wrap items-center gap-1.5 p-1 bg-[#e4e4e7]/60 dark:bg-[#121118] border border-[#ececee] dark:border-[#2d2f39] rounded-lg w-fit">
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
      </div>
      <div>{children}</div>
    </div>
  );
}
