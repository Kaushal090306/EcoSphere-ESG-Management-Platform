"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Bell,
  LogOut,
  User,
  ChevronRight,
  ChevronDown,
  Search,
  Building2,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { getUnreadNotificationsCount } from "@/actions/notifications";

const roleDisplayNames: Record<string, string> = {
  admin: "Administrator",
  esg_manager: "ESG Manager",
  dept_head: "Department Head",
  employee: "Employee",
  auditor: "Auditor",
};

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/environmental": "Environmental Overview",
  "/environmental/emission-factors": "Emission Factors",
  "/environmental/goals": "Environmental Goals",
  "/environmental/product-profiles": "Product ESG Profiles",
  "/environmental/carbon-transactions": "Carbon Transactions",
  "/social": "Social Overview",
  "/social/csr-activities": "CSR Activities",
  "/social/participation": "Employee Participation",
  "/governance": "Governance Overview",
  "/governance/policies": "ESG Policies",
  "/governance/audits": "Audits",
  "/governance/compliance-issues": "Compliance Issues",
  "/gamification": "Gamification Overview",
  "/gamification/challenges": "Challenges",
  "/gamification/badges": "Badges",
  "/gamification/rewards": "Rewards",
  "/gamification/leaderboard": "Leaderboard",
  "/esg-scoring": "ESG Scoring",
  "/reports": "Reports",
  "/settings": "Configuration",
  "/settings/users": "User Management",
  "/settings/departments": "Departments",
  "/settings/categories": "Categories",
};

function getBreadcrumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  if (pathname === "/dashboard") {
    return [{ label: "Dashboard", href: "/dashboard" }];
  }

  let currentPath = "";
  for (const part of parts) {
    currentPath += `/${part}`;
    const label =
      routeLabels[currentPath] ||
      part
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, href: currentPath });
  }

  return crumbs;
}


export function Header({ user }: { user?: { name?: string | null; email?: string | null; role?: string } }) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const isDashboard = pathname === "/dashboard";

  // Dynamic session fetch
  const [currentUser, setCurrentUser] = useState({ name: "Michael Smith", role: "Admin" });
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setCurrentUser({
            name: data.user.name || "Michael Smith",
            role: data.user.role === "admin"
              ? "Admin"
              : data.user.role === "esg_manager"
              ? "ESG Manager"
              : data.user.role === "dept_head"
              ? "Dept Head"
              : "Employee",
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    getUnreadNotificationsCount()
      .then((count) => setUnreadCount(count))
      .catch(() => {});
  }, [pathname]);

  // Compute initials
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="flex h-16 items-center gap-4 px-6 bg-white dark:bg-[#18181b] border-b border-[#ececee] dark:border-[#27272a] sticky top-0 z-50 transition-colors">
      <SidebarTrigger className="-ml-1 text-[#71717a] hover:text-[#09090b] transition-colors" />
      <Separator orientation="vertical" className="h-5 bg-[#ececee]" />

      {/* Organization switcher on dashboard, breadcrumbs on subpages */}
      {isDashboard ? (
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-[14px] bg-[#f4f4f5] border border-[#ececee] text-sm text-[#18181b] font-medium hover:bg-white dark:bg-[#18181b] hover:border-[#d4d4d8] transition-all cursor-pointer"
                >
                  <Building2 className="h-4 w-4 text-[#52525b]" />
                  <span>GreenTech Solutions</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#71717a]" />
                </Button>
              }
            />
            <DropdownMenuContent align="start" className="w-56 bg-white dark:bg-[#18181b] border-[#ececee] shadow-md rounded-[14px]">
              <DropdownMenuItem className="text-sm text-[#09090b] focus:bg-[#f4f4f5] rounded-lg font-medium">
                GreenTech Solutions
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-[#52525b] focus:bg-[#f4f4f5] rounded-lg">
                EcoSphere Corp
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-[#52525b] focus:bg-[#f4f4f5] rounded-lg">
                Global Industries
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <nav className="flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <div key={crumb.href} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight className="h-3 w-3 text-[#a1a1aa]" />
              )}
              <span
                className={
                  i === breadcrumbs.length - 1
                    ? "font-semibold text-[#09090b] text-sm"
                    : "text-[#71717a] text-sm"
                }
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </nav>
      )}

      {/* Header right controls */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-[12px] text-[#71717a] dark:text-[#a1a1aa] hover:text-[#09090b] dark:hover:text-[#fafafa] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] border border-transparent hover:border-[#ececee] dark:hover:border-[#3f3f46] transition-all"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Link href="/notifications" className="block">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-[12px] text-[#71717a] dark:text-[#a1a1aa] hover:text-[#09090b] dark:hover:text-[#fafafa] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] border border-transparent hover:border-[#ececee] dark:hover:border-[#3f3f46] transition-all"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff5a00] px-1 text-[8px] font-bold text-white ring-2 ring-white dark:ring-[#18181b]">
                {unreadCount}
              </span>
            )}
          </Button>
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />

        <Separator orientation="vertical" className="h-6 bg-[#ececee] dark:bg-[#27272a]" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="flex items-center gap-2.5 p-1.5 pr-3 h-10 rounded-[12px] hover:bg-[#f4f4f5] border border-transparent hover:border-[#ececee] text-left cursor-pointer transition-all"
              >
                <Avatar className="h-7 w-7 border border-[#ececee]">
                  <AvatarFallback className="bg-[#f4f4f5] text-[#52525b] text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-semibold text-[#09090b] leading-tight">
                    {user?.name || currentUser.name}
                  </span>
                  <span className="text-[11px] text-[#71717a]">
                    {user?.role ? (roleDisplayNames[user.role] || user.role) : currentUser.role}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[#a1a1aa] hidden md:block" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-[#18181b] border-[#ececee] shadow-md rounded-[14px]">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal text-[#09090b]">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">{user?.name || currentUser.name}</p>
                  <p className="text-xs leading-none text-[#71717a]">{user?.email || ""}</p>
                  <span className="inline-flex items-center rounded-[8px] bg-[#f4f4f5] border border-[#ececee] px-2 py-0.5 mt-1 text-[10px] font-semibold text-[#52525b] w-fit uppercase tracking-wider">
                    {user?.role ? (roleDisplayNames[user.role] || user.role) : currentUser.role}
                  </span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-[#ececee]" />
            <DropdownMenuItem className="text-sm text-[#18181b] focus:bg-[#f4f4f5] rounded-lg">
              <User className="mr-2 h-4 w-4 text-[#52525b]" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#ececee]" />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-600 focus:bg-red-50 focus:text-red-600 text-sm rounded-lg cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
