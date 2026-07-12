"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Leaf,
  Users,
  ShieldCheck,
  Trophy,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronUp,
  Crown,
  Bell,
  ClipboardCheck,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface SubItem {
  title: string;
  href: string;
  roles?: string[];
}

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: SubItem[];
  badge?: number;
  roles?: string[];
}

export function AppSidebar({ user }: { user?: { role?: string } }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  // Track collapsible submenu states
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Environment: false,
    Social: false,
    Governance: false,
    Gamification: false,
    Settings: false,
  });

  const rawNavGroups = [
    {
      label: "MAIN MENU",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        {
          title: "Environment",
          icon: Leaf,
          href: "/environmental",
          items: [
            { title: "Overview", href: "/environmental" },
            { title: "Emission Factors", href: "/environmental/emission-factors", roles: ["admin", "esg_manager", "auditor"] },
            { title: "Product ESG Profiles", href: "/environmental/product-profiles" },
            { title: "Carbon Transactions", href: "/environmental/carbon-transactions" },
            { title: "Environmental Goals", href: "/environmental/goals" },
          ],
        },
        {
          title: "Social",
          icon: Users,
          href: "/social",
          items: [
            { title: "Overview", href: "/social" },
            { title: "CSR Activities", href: "/social/csr-activities" },
            { title: "Participation", href: "/social/participation" },
          ],
        },
        {
          title: "Governance",
          icon: ShieldCheck,
          href: "/governance",
          items: [
            { title: "Overview", href: "/governance" },
            { title: "ESG Policies", href: "/governance/policies" },
            { title: "Audits", href: "/governance/audits", roles: ["admin", "esg_manager", "auditor"] },
            { title: "Compliance Issues", href: "/governance/compliance-issues" },
          ],
        },
        { title: "ESG Scoring", href: "/environmental/goals", icon: ClipboardCheck },
        {
          title: "Gamification",
          icon: Trophy,
          href: "/gamification",
          items: [
            { title: "Overview", href: "/gamification" },
            { title: "Challenges", href: "/gamification/challenges" },
            { title: "Badges", href: "/gamification/badges" },
            { title: "Rewards", href: "/gamification/rewards" },
            { title: "Leaderboard", href: "/gamification/leaderboard" },
          ],
        },
        { title: "Reports", href: "/reports", icon: BarChart3, roles: ["admin", "esg_manager", "auditor"] },
        { title: "Integrations", href: "/settings", icon: Sparkles, roles: ["admin"] },
      ] as NavItem[],
    },
    {
      label: "OTHER",
      items: [
        { title: "Tasks", href: "/environmental/goals", icon: ClipboardCheck, badge: 8 },
        { title: "Notifications", href: "/settings", icon: Bell, badge: 5 },
        {
          title: "Settings",
          icon: Settings,
          roles: ["admin"],
          href: "/settings",
          items: [
            { title: "Configuration", href: "/settings", roles: ["admin"] },
            { title: "User Management", href: "/settings/users", roles: ["admin"] },
            { title: "Departments", href: "/settings/departments", roles: ["admin"] },
            { title: "Categories", href: "/settings/categories", roles: ["admin"] },
          ],
        },
        { title: "Help & Support", href: "/settings", icon: HelpCircle },
      ] as NavItem[],
    },
  ];

  // Filter groups and items based on role
  const navGroups = rawNavGroups.map(group => {
    const filteredItems = group.items.map(item => {
      if (item.items) {
        const filteredSubs = item.items.filter(sub => !sub.roles || sub.roles.includes(user?.role || ""));
        if (filteredSubs.length === 0) return null;
        return { ...item, items: filteredSubs };
      }
      if (item.roles && !item.roles.includes(user?.role || "")) {
        return null;
      }
      return item;
    }).filter(Boolean) as NavItem[];

    return { ...group, items: filteredItems };
  }).filter(group => group.items.length > 0);

  // Automatically expand group if pathname matches a subitem
  useEffect(() => {
    const activeGroup = Object.keys(expanded).find((groupName) => {
      const items = navGroups.find((g) => g.label === "MAIN MENU" || g.label === "OTHER")?.items || [];
      const parent = items.find((item) => item.title === groupName);
      return parent?.items?.some((sub) => pathname.startsWith(sub.href)) || false;
    });

    if (activeGroup && !expanded[activeGroup]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpanded((prev) => ({ ...prev, [activeGroup]: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleGroup = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  return (
    <Sidebar collapsible="icon" className="border-r border-[#ececee] dark:border-[#1a1822] bg-[#fafafa] dark:bg-[#0C0A0E]">
      <SidebarHeader className="px-6 py-6 group-data-[collapsible=icon]:p-2 bg-[#fafafa] dark:bg-[#0C0A0E]">
        <Link href="/dashboard" className="flex flex-col group-data-[collapsible=icon]:items-center">
          <div className="flex items-center gap-3">
            {/* Custom 4-circle logo arrange in clover style */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-[#121016] border border-[#ececee] dark:border-[#221F2C]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="2" fill="#9B5CF6" />
                <rect x="14" y="3" width="7" height="7" rx="2" fill="#9B5CF6" />
                <rect x="3" y="14" width="7" height="7" rx="2" fill="#9B5CF6" />
                <rect x="14" y="14" width="7" height="7" rx="2" fill="#7C3AED" />
              </svg>
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-lg font-extrabold text-[#09090b] dark:text-white tracking-tight leading-none">
                EcoSphere
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold mt-0.5 tracking-wider uppercase">
                ESG Platform
              </span>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-[#fafafa] dark:bg-[#0C0A0E] px-3 space-y-1">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="px-0 py-2">
            <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/40 px-3 mb-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {group.items.map((item) => {
                  const hasSubItems = !!item.items;
                  const isExpanded = expanded[item.title];
                  const isActive = item.href
                    ? item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href)
                    : false;

                  return (
                    <SidebarMenuItem key={item.title} className="relative">
                      {hasSubItems ? (
                        <>
                          <SidebarMenuButton
                            isActive={isActive}
                            className="w-full text-sidebar-foreground hover:bg-white dark:bg-[#121016] px-3 py-2.5 h-11 rounded-lg cursor-pointer"
                            tooltip={item.title}
                            render={
                              <Link href={item.href || "#"}>
                                <div className="flex items-center gap-3">
                                  <item.icon className="h-4.5 w-4.5" />
                                  <span className="text-sm font-medium">{item.title}</span>
                                </div>
                              </Link>
                            }
                          />
                          {!isCollapsed && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleGroup(item.title);
                              }}
                              className="absolute right-3 top-[22px] -translate-y-1/2 flex items-center justify-center h-6 w-6 text-muted-foreground/70 hover:text-[#09090b] dark:hover:text-white rounded-md transition-all cursor-pointer z-10"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          )}

                          {!isCollapsed && isExpanded && (
                            <div className="pl-6 mt-1 mb-2 space-y-1 border-l border-[#ececee] dark:border-[#221F2C] ml-5 flex flex-col">
                              {item.items!.map((subItem) => {
                                const isSubActive = pathname === subItem.href;
                                return (
                                  <SidebarMenuButton
                                    key={subItem.href}
                                    isActive={isSubActive}
                                    className="h-9 text-xs justify-start rounded-lg hover:bg-white dark:bg-[#121016] w-full px-3 cursor-pointer"
                                    render={
                                      <Link href={subItem.href}>
                                        <span className={isSubActive ? "text-[#09090b] dark:text-white font-semibold" : "text-muted-foreground"}>
                                          {subItem.title}
                                        </span>
                                      </Link>
                                    }
                                  />
                                );
                              })}
                            </div>
                          )}
                        </>
                      ) : (
                        <SidebarMenuButton
                          isActive={isActive}
                          className="w-full flex items-center justify-between px-3 py-2.5 h-11 rounded-lg cursor-pointer hover:bg-white dark:bg-[#121016]"
                          tooltip={item.title}
                          render={
                            <Link href={item.href || "#"}>
                              <div className="flex items-center gap-3">
                                <item.icon className="h-4.5 w-4.5" />
                                <span className="text-sm font-medium">{item.title}</span>
                              </div>
                              {item.badge !== undefined && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7C3AED] px-1 text-[10px] font-bold text-[#09090b] dark:text-white shadow-[0_0_10px_rgba(124,58,237,0.4)]">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          }
                        />
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 bg-[#fafafa] dark:bg-[#0C0A0E] border-t border-[#ececee] dark:border-[#1a1822] hidden md:block">
        {/* Removed plan information card */}
      </SidebarFooter>
    </Sidebar>
  );
}
