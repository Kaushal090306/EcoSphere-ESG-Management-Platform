"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "@/actions/notifications";
import { 
  ShieldAlert, 
  Clock, 
  Heart, 
  Trophy, 
  Award, 
  FileText, 
  BellOff,
  CheckCheck,
  X,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
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
import { getUnreadNotificationsCount } from "@/actions/notifications";
import {
  LogOut,
  User,
  ChevronRight,
  ChevronDown,
  Search,
  Building2,
} from "lucide-react";

const typeConfigs: Record<string, { icon: any; style: string }> = {
  compliance_issue: { icon: ShieldAlert, style: "text-red-500 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" },
  overdue_issue: { icon: Clock, style: "text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
  csr_approval: { icon: Heart, style: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
  challenge_approval: { icon: Trophy, style: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20" },
  badge_unlock: { icon: Award, style: "text-purple-500 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20" },
  policy_reminder: { icon: FileText, style: "text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
};

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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch notifications dynamically on drawer opening
  useEffect(() => {
    if (drawerOpen) {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setNotifications(data);
          }
        })
        .catch(() => {});
    }
  }, [drawerOpen]);

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
  }, [pathname, drawerOpen]);

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
    <header className="flex h-16 items-center gap-4 px-6 bg-white dark:bg-[#0c0a0e] border-b border-[#ececee] dark:border-[#1a1822] sticky top-0 z-50 transition-colors">
      <SidebarTrigger className="-ml-1 text-[#71717a] hover:text-[#09090b] dark:hover:text-white transition-colors" />
      <Separator orientation="vertical" className="h-5 bg-[#ececee] dark:bg-[#1a1822]" />

      {/* Organization switcher on dashboard, breadcrumbs on subpages */}
      {isDashboard ? (
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-lg bg-[#f4f4f5] dark:bg-[#121016] border border-[#ececee] dark:border-[#1a1822] text-sm text-[#18181b] dark:text-white font-medium hover:bg-white dark:hover:bg-[#121016] transition-all cursor-pointer"
                >
                  <Building2 className="h-4 w-4 text-[#52525b] dark:text-gray-400" />
                  <span>GreenTech Solutions</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#71717a] dark:text-gray-400" />
                </Button>
              }
            />
            <DropdownMenuContent align="start" className="w-56 bg-white dark:bg-[#121016] border-[#ececee] dark:border-[#1a1822] shadow-md rounded-lg">
              <DropdownMenuItem className="text-sm text-[#09090b] dark:text-white focus:bg-[#f4f4f5] dark:focus:bg-[#1a1822] rounded-md font-medium">
                GreenTech Solutions
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-[#52525b] dark:text-[#a1a1aa] focus:bg-[#f4f4f5] dark:focus:bg-[#1a1822] rounded-md">
                EcoSphere Corp
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-[#52525b] dark:text-[#a1a1aa] focus:bg-[#f4f4f5] dark:focus:bg-[#1a1822] rounded-md">
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
                    ? "font-semibold text-[#09090b] dark:text-white text-sm"
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
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-lg text-[#71717a] dark:text-[#a1a1aa] hover:text-[#09090b] dark:hover:text-white hover:bg-[#f4f4f5] dark:hover:bg-[#121016] border border-transparent hover:border-[#ececee] dark:hover:border-[#1a1822] transition-all"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff5a00] px-1 text-[8px] font-bold text-white ring-2 ring-white dark:ring-[#0c0a0e]">
                    {unreadCount}
                  </span>
                )}
              </Button>
            }
          />
          <SheetContent side="right" showCloseButton={false} className="bg-white dark:bg-[#0c0a0e] border-l border-[#ececee] dark:border-[#1a1822] w-full sm:max-w-md p-0 flex flex-col h-full focus:outline-none">
            <SheetHeader className="p-5 border-b border-[#ececee] dark:border-[#1a1822] flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <SheetTitle className="text-sm font-bold text-foreground">Notifications</SheetTitle>
                <p className="text-[11px] text-muted-foreground">Stay updated on compliance and CSR milestones</p>
              </div>
              <SheetClose
                render={
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg">
                    <X className="h-4 w-4" />
                  </Button>
                }
              />
            </SheetHeader>
            
            <div className="px-5 py-3 border-b border-[#ececee] dark:border-[#1a1822] flex items-center justify-between bg-[#f4f4f5]/30 dark:bg-[#121016]/30">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                {unreadCount === 0 ? "All caught up" : `${unreadCount} Unread`}
              </span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={async () => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    await markAllNotificationsAsRead();
                    setUnreadCount(0);
                  }}
                  className="text-[10px] font-bold text-purple-500 hover:text-purple-600 hover:bg-transparent h-auto p-0 flex items-center gap-1"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#ececee] dark:divide-[#1a1822]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-3">
                  <div className="h-10 w-10 rounded-full bg-[#f4f4f5] dark:bg-[#121016] border border-[#ececee] dark:border-[#1a1822] flex items-center justify-center text-muted-foreground">
                    <BellOff className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground">No notifications</p>
                    <p className="text-[10px] text-muted-foreground max-w-xs">
                      We'll notify you when actions are completed or need your review.
                    </p>
                  </div>
                </div>
              ) : (
                notifications.map((n) => {
                  const conf = typeConfigs[n.type] || { icon: BellOff, style: "text-neutral-500 bg-neutral-50 dark:bg-neutral-500/10 border-neutral-200" };
                  const Icon = conf.icon;
                  return (
                    <div
                      key={n.id}
                      onClick={async () => {
                        if (!n.read) {
                          setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                          await markNotificationAsRead(n.id);
                          setUnreadCount(prev => Math.max(0, prev - 1));
                        }
                      }}
                      className={`flex items-start gap-3.5 p-4 transition-all duration-200 cursor-pointer ${
                        !n.read 
                          ? "bg-white dark:bg-[#0c0a0e]/40" 
                          : "opacity-75 bg-[#fafafa]/50 dark:bg-[#0c0a0e]/10"
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 ${conf.style}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-xs text-foreground leading-normal font-medium">{n.message}</p>
                        <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-mono">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                          {!n.read && (
                            <>
                              <span>·</span>
                              <span className="text-purple-500 font-bold uppercase">New</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </SheetContent>
        </Sheet>

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
                  <span className="text-sm font-semibold text-[#09090b] dark:text-white leading-tight">
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
              <DropdownMenuLabel className="font-normal text-[#09090b] dark:text-white">
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
            <DropdownMenuItem className="text-sm text-[#18181b] dark:text-[#e4e4e7] focus:bg-[#f4f4f5] dark:focus:bg-[#27272a] rounded-lg">
              <User className="mr-2 h-4 w-4 text-[#52525b] dark:text-[#a1a1aa]" />
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
