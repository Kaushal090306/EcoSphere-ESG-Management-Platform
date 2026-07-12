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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    <header className="flex h-16 items-center gap-4 border-b border-[#2d2f39] px-8 bg-[#0f1016]/50 backdrop-blur-md sticky top-0 z-50">
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

        {/* Log Out Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sign Out"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 mt-1 text-[10px] font-medium text-primary w-fit uppercase">
                    {roleDisplayNames[user?.role || ""] || user?.role || "User"}
                  </span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
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
