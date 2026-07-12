"use client";

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
  Sun,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const roleDisplayNames: Record<string, string> = {
  admin: "Administrator",
  esg_manager: "ESG Manager",
  dept_head: "Department Head",
  employee: "Employee",
  auditor: "Auditor",
};

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/environmental/emission-factors": "Emission Factors",
  "/environmental/goals": "Environmental Goals",
  "/environmental/product-profiles": "Product ESG Profiles",
  "/environmental/carbon-transactions": "Carbon Transactions",
  "/social/csr-activities": "CSR Activities",
  "/social/participation": "Employee Participation",
  "/governance/policies": "ESG Policies",
  "/governance/audits": "Audits",
  "/governance/compliance-issues": "Compliance Issues",
  "/gamification/challenges": "Challenges",
  "/gamification/badges": "Badges",
  "/gamification/rewards": "Rewards",
  "/gamification/leaderboard": "Leaderboard",
  "/reports": "Reports",
  "/settings": "Configuration",
  "/settings/users": "User Management",
  "/settings/departments": "Departments",
  "/settings/categories": "Categories",
};

function getBreadcrumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  if (pathname === "/") {
    return [{ label: "Dashboard", href: "/" }];
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
  const isDashboard = pathname === "/";

  // Dynamic session fetch
  const [currentUser, setCurrentUser] = useState({ name: "Michael Smith", role: "Admin" });

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
    <header className="flex h-20 items-center gap-4 px-8 bg-[#08070B] border-b border-[#1A1822]/80 sticky top-0 z-50">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-white" />
      <Separator orientation="vertical" className="h-6 bg-[#1A1822]" />

      {/* Organization switcher on dashboard, breadcrumbs on subpages */}
      {isDashboard ? (
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 px-3 py-1.5 h-10 rounded-xl bg-[#121016] border border-[#221F2C] text-sm text-gray-300 font-medium hover:bg-[#1A1722] hover:text-white transition-all cursor-pointer"
                >
                  <Building2 className="h-4 w-4 text-[#9B5CF6]" />
                  <span>GreenTech Solutions</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              }
            />
            <DropdownMenuContent align="start" className="w-56 bg-[#121016] border-[#221F2C]">
              <DropdownMenuItem className="text-sm text-white focus:bg-[#221F2C]">
                GreenTech Solutions
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-muted-foreground focus:bg-[#221F2C]">
                EcoSphere Corp
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-muted-foreground focus:bg-[#221F2C]">
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
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )}
              <span
                className={
                  i === breadcrumbs.length - 1
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </nav>
      )}

      {/* Header controls matching mockup */}
      <div className="ml-auto flex items-center gap-4">
        {/* Search */}
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400 hover:text-white hover:bg-[#121016]">
          <Search className="h-4.5 w-4.5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl text-gray-400 hover:text-white hover:bg-[#121016]">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-[#7C3AED] ring-2 ring-[#08070B]" />
        </Button>

        {/* Light / Dark Mode Toggle (Mock) */}
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400 hover:text-white hover:bg-[#121016]">
          <Sun className="h-4.5 w-4.5" />
        </Button>

        {/* Log Out Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sign Out"
          className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4.5 w-4.5" />
        </Button>

        <Separator orientation="vertical" className="h-8 bg-[#1A1822]" />
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="flex items-center gap-3 p-1 pr-3 h-12 rounded-xl hover:bg-[#121016] text-left cursor-pointer">
                <Avatar className="h-9 w-9 border border-[#9B5CF6]/30">
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt={user?.name || currentUser.name} />
                  <AvatarFallback className="bg-[#9B5CF6]/20 text-[#9B5CF6] text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-semibold text-white leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56 bg-[#121016] border-[#221F2C]">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal text-white">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
                  <span className="inline-flex items-center rounded-md bg-[#9B5CF6]/15 px-2 py-0.5 mt-1 text-[10px] font-medium text-[#9B5CF6] w-fit uppercase">
                    {user?.role ? (roleDisplayNames[user.role] || user.role) : currentUser.role}
                  </span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-[#221F2C]" />
            <DropdownMenuItem className="text-sm text-white focus:bg-[#221F2C]">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#221F2C]" />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive text-sm"
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
