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
                    ? "border-[#9B5CF6] text-[#09090b] dark:text-[#fafafa] font-semibold"
                    : "border-transparent text-muted-foreground hover:text-[#09090b] dark:hover:text-[#fafafa]"
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
