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
  SidebarFooter,
} from "@/components/ui/sidebar";

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
        { title: "Dashboard", href: "/", icon: LayoutDashboard },
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
        { title: "ESG Scoring", href: "/esg-scoring", icon: ClipboardCheck },
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
      ] as NavItem[],
    },
  ];

  const rawFooterItems = [
    {
      title: "Settings",
      icon: Settings,
      href: "/settings/profile",
      items: [
        { title: "Profile", href: "/settings/profile" },
        { title: "Configuration", href: "/settings", roles: ["admin"] },
        { title: "User Management", href: "/settings/users", roles: ["admin"] },
        { title: "Departments", href: "/settings/departments", roles: ["admin"] },
        { title: "Categories", href: "/settings/categories", roles: ["admin"] },
      ],
    },
    { title: "Help & Support", href: "/settings/profile", icon: HelpCircle },
  ] as NavItem[];

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

  const footerItems = rawFooterItems.map(item => {
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

  // Automatically expand group if pathname matches a subitem
  useEffect(() => {
    const activeGroup = Object.keys(expanded).find((groupName) => {
      const navItems = navGroups.flatMap((g) => g.items);
      const items = [...navItems, ...footerItems];
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
    <Sidebar collapsible="icon" className="border-r border-[#ececee] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#18181b] transition-colors">
      <SidebarHeader className="px-6 py-6 group-data-[collapsible=icon]:p-2 bg-[#fafafa] dark:bg-[#18181b]">
        <Link href="/dashboard" className="flex flex-col group-data-[collapsible=icon]:items-center">
          <div className="flex items-center gap-3">
            {/* Custom 4-circle logo */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="2" fill="#fafafa" className="dark:fill-[#fafafa]" />
                <rect x="14" y="3" width="7" height="7" rx="2" fill="#fafafa" className="dark:fill-[#fafafa]" />
                <rect x="3" y="14" width="7" height="7" rx="2" fill="#fafafa" className="dark:fill-[#fafafa]" />
                <rect x="14" y="14" width="7" height="7" rx="2" fill="#ff5a00" />
              </svg>
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-lg font-bold text-[#09090b] dark:text-[#fafafa] tracking-tight leading-none">
                EcoSphere
              </span>
              <span className="text-[10px] text-[#71717a] dark:text-[#71717a] font-semibold mt-0.5 tracking-wider uppercase">
                ESG Platform
              </span>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-[#fafafa] dark:bg-[#18181b] px-3 space-y-1">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="px-0 py-2">
            <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-widest text-[#a1a1aa] dark:text-[#52525b] px-3 mb-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {group.items.map((item) => {
                  const hasSubItems = !!item.items;
                  const isExpanded = expanded[item.title];
                  const isActive = item.href
                    ? pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                    : false;

                  const baseBtn = [
                    "w-full flex items-center gap-3 px-3 h-11 rounded-[14px] cursor-pointer transition-all text-sm font-medium border",
                    isActive
                      ? "bg-white dark:bg-[#27272a] text-[#09090b] dark:text-[#fafafa] border-[#ececee] dark:border-[#3f3f46] shadow-sm font-semibold"
                      : "text-[#52525b] dark:text-[#a1a1aa] border-transparent hover:bg-white dark:hover:bg-[#27272a] hover:text-[#09090b] dark:hover:text-[#fafafa] hover:border-[#ececee] dark:hover:border-[#3f3f46]",
                  ].join(" ");

                  return (
                    <SidebarMenuItem key={item.title}>
                      {hasSubItems ? (
                        <>
                          {/* Single button row with icon + title + chevron inline */}
                          <button
                            onClick={() => toggleGroup(item.title)}
                            className={baseBtn}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span className="flex-1 text-left">{item.title}</span>
                            {isExpanded
                              ? <ChevronUp className="h-3.5 w-3.5 shrink-0 text-[#a1a1aa]" />
                              : <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#a1a1aa]" />
                            }
                          </button>

                          {isExpanded && (
                            <div className="pl-4 mt-0.5 mb-1 ml-5 border-l border-[#ececee] dark:border-[#27272a] flex flex-col gap-0.5">
                              {item.items!.map((subItem) => {
                                const isSubActive = pathname === subItem.href;
                                return (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    className={[
                                      "flex items-center h-9 px-3 text-xs rounded-[10px] transition-all border",
                                      isSubActive
                                        ? "bg-white dark:bg-[#27272a] text-[#09090b] dark:text-[#fafafa] border-[#ececee] dark:border-[#3f3f46] font-semibold shadow-sm"
                                        : "text-[#71717a] dark:text-[#71717a] border-transparent hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] hover:text-[#09090b] dark:hover:text-[#fafafa]",
                                    ].join(" ")}
                                  >
                                    {subItem.title}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </>
                      ) : (
                        <SidebarMenuButton
                          isActive={isActive}
                          className={baseBtn}
                          tooltip={item.title}
                          render={
                            <Link href={item.href || "#"}>
                              <item.icon className="h-4 w-4 shrink-0" />
                              <span className="flex-1">{item.title}</span>
                              {item.badge !== undefined && (
                                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#18181b] dark:bg-[#fafafa] px-1 text-[10px] font-bold text-white dark:text-[#09090b]">
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

      <SidebarFooter className="p-3 bg-[#fafafa] dark:bg-[#18181b] border-t border-[#ececee] dark:border-[#27272a]">
        <SidebarMenu className="space-y-0.5">
          {footerItems.map((item) => {
            const hasSubItems = !!item.items;
            const isExpanded = expanded[item.title];
            const isActive = item.href
              ? pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              : false;

            const baseBtn = [
              "w-full flex items-center gap-3 px-3 h-11 rounded-[14px] cursor-pointer transition-all text-sm font-medium border",
              isActive
                ? "bg-white dark:bg-[#27272a] text-[#09090b] dark:text-[#fafafa] border-[#ececee] dark:border-[#3f3f46] shadow-sm font-semibold"
                : "text-[#52525b] dark:text-[#a1a1aa] border-transparent hover:bg-white dark:hover:bg-[#27272a] hover:text-[#09090b] dark:hover:text-[#fafafa] hover:border-[#ececee] dark:hover:border-[#3f3f46]",
            ].join(" ");

            return (
              <SidebarMenuItem key={item.title}>
                {hasSubItems ? (
                  <>
                    <button
                      onClick={() => toggleGroup(item.title)}
                      className={baseBtn}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">{item.title}</span>
                      {isExpanded
                        ? <ChevronUp className="h-3.5 w-3.5 shrink-0 text-[#a1a1aa]" />
                        : <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#a1a1aa]" />
                      }
                    </button>

                    {isExpanded && (
                      <div className="pl-4 mt-0.5 mb-1 ml-5 border-l border-[#ececee] dark:border-[#27272a] flex flex-col gap-0.5">
                        {item.items!.map((subItem) => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={[
                                "flex items-center h-9 px-3 text-xs rounded-[10px] transition-all border",
                                isSubActive
                                  ? "bg-white dark:bg-[#27272a] text-[#09090b] dark:text-[#fafafa] border-[#ececee] dark:border-[#3f3f46] font-semibold shadow-sm"
                                  : "text-[#71717a] dark:text-[#71717a] border-transparent hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] hover:text-[#09090b] dark:hover:text-[#fafafa]",
                              ].join(" ")}
                            >
                              {subItem.title}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <SidebarMenuButton
                    isActive={isActive}
                    className={baseBtn}
                    tooltip={item.title}
                    render={
                      <Link href={item.href || "#"}>
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{item.title}</span>
                      </Link>
                    }
                  />
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  );
}

