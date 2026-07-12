"use client";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Bell,
  LogOut,
  User,
  ChevronRight,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/environmental/emission-factors": "Emission Factors",
  "/environmental/goals": "Environmental Goals",
  "/environmental/product-profiles": "Product ESG Profiles",
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

export function Header() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />

      {/* Breadcrumbs */}
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

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications (placeholder) */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-destructive focus:text-destructive"
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
