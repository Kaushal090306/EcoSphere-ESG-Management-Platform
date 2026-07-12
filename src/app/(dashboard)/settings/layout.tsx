"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.role) {
          setRole(data.user.role);
        }
      })
      .catch(() => {});
  }, []);

  const tabs = [
    { name: "Profile", href: "/settings/profile" },
  ];

  if (role === "admin") {
    tabs.push(
      { name: "Configuration", href: "/settings" },
      { name: "User Management", href: "/settings/users" },
      { name: "Departments", href: "/settings/departments" },
      { name: "Categories", href: "/settings/categories" }
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <nav className="flex flex-wrap items-center gap-1.5 p-1 bg-[#e4e4e7]/60 dark:bg-[#121118] border border-[#ececee] dark:border-[#2d2f39] rounded-lg w-fit">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 border border-transparent ${
                  isActive
                    ? "bg-white dark:bg-[#1c1a24] text-[#09090b] dark:text-white shadow-xs border-[#ececee] dark:border-[#2d2f39]"
                    : "text-muted-foreground hover:text-[#09090b] dark:hover:text-white"
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
