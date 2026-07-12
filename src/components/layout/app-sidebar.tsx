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
  SlidersHorizontal,
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface SubItem {
  title: string;
  href: string;
}

interface NavItem {
  title: string;
  href?: string;
  icon: any;
  items?: SubItem[];
  badge?: number;
}

export function AppSidebar() {
  const pathname = usePathname();
  
  // Track collapsible submenu states
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Environment: false,
    Social: false,
    Governance: false,
    Gamification: false,
    Settings: false,
  });

  // Automatically expand group if pathname matches a subitem
  useEffect(() => {
    const activeGroup = Object.keys(expanded).find((groupName) => {
      const items = navGroups.find((g) => g.label === "MAIN MENU" || g.label === "OTHER")?.items || [];
      const parent = items.find((item) => item.title === groupName);
      return parent?.items?.some((sub) => pathname.startsWith(sub.href)) || false;
    });

    if (activeGroup) {
      setExpanded((prev) => ({ ...prev, [activeGroup]: true }));
    }
  }, [pathname]);

  const toggleGroup = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const navGroups = [
    {
      label: "MAIN MENU",
      items: [
        { title: "Dashboard", href: "/", icon: LayoutDashboard },
        {
          title: "Environment",
          icon: Leaf,
          items: [
            { title: "Overview", href: "/environmental" },
            { title: "Emission Factors", href: "/environmental/emission-factors" },
            { title: "Product ESG Profiles", href: "/environmental/product-profiles" },
            { title: "Carbon Transactions", href: "/environmental/carbon-transactions" },
            { title: "Environmental Goals", href: "/environmental/goals" },
          ],
        },
        {
          title: "Social",
          icon: Users,
          items: [
            { title: "Overview", href: "/social" },
            { title: "CSR Activities", href: "/social/csr-activities" },
            { title: "Participation", href: "/social/participation" },
          ],
        },
        {
          title: "Governance",
          icon: ShieldCheck,
          items: [
            { title: "Overview", href: "/governance" },
            { title: "ESG Policies", href: "/governance/policies" },
            { title: "Audits", href: "/governance/audits" },
            { title: "Compliance Issues", href: "/governance/compliance-issues" },
          ],
        },
        { title: "ESG Scoring", href: "/environmental/goals", icon: ClipboardCheck }, // fallback placeholder
        {
          title: "Gamification",
          icon: Trophy,
          items: [
            { title: "Overview", href: "/gamification" },
            { title: "Challenges", href: "/gamification/challenges" },
            { title: "Badges", href: "/gamification/badges" },
            { title: "Rewards", href: "/gamification/rewards" },
            { title: "Leaderboard", href: "/gamification/leaderboard" },
          ],
        },
        { title: "Reports", href: "/reports", icon: BarChart3 },
        { title: "Integrations", href: "/settings", icon: Sparkles }, // fallback placeholder
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
          items: [
            { title: "Configuration", href: "/settings" },
            { title: "Departments", href: "/settings/departments" },
            { title: "Categories", href: "/settings/categories" },
          ],
        },
        { title: "Help & Support", href: "/settings", icon: HelpCircle },
      ] as NavItem[],
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-[#15161D]">
      <SidebarHeader className="px-6 py-6 group-data-[collapsible=icon]:p-2 bg-[#15161D]">
        <Link href="/" className="flex flex-col group-data-[collapsible=icon]:items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="text-2xl font-bold text-white group-data-[collapsible=icon]:hidden">
              EcoSphere
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-1.5 pl-10 group-data-[collapsible=icon]:hidden">
            ESG Platform
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-[#15161D]">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="px-3">
            <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 px-3">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const hasSubItems = !!item.items;
                  const isExpanded = expanded[item.title];
                  const isActive = item.href
                    ? item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href)
                    : false;

                  return (
                    <SidebarMenuItem key={item.title}>
                      {hasSubItems ? (
                        <>
                          <SidebarMenuButton
                            onClick={() => toggleGroup(item.title)}
                            className="w-full flex items-center justify-between text-sidebar-foreground hover:bg-[#22242f] px-3 py-2 h-10 rounded-xl cursor-pointer"
                            tooltip={item.title}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="h-4 w-4 text-muted-foreground" />
                              <span>{item.title}</span>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/70" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/70" />
                            )}
                          </SidebarMenuButton>

                          {isExpanded && (
                            <div className="pl-6 mt-1 mb-2 space-y-1 border-l border-sidebar-border/30 ml-5">
                              {item.items!.map((subItem) => {
                                const isSubActive = pathname === subItem.href;
                                return (
                                  <SidebarMenuItem key={subItem.href}>
                                    <SidebarMenuButton
                                      isActive={isSubActive}
                                      className="h-8 text-xs justify-start rounded-lg hover:bg-[#22242f] w-full px-3 cursor-pointer"
                                      render={
                                        <Link href={subItem.href}>
                                          <span className={isSubActive ? "text-white font-semibold" : "text-muted-foreground"}>
                                            {subItem.title}
                                          </span>
                                        </Link>
                                      }
                                    />
                                  </SidebarMenuItem>
                                );
                              })}
                            </div>
                          )}
                        </>
                      ) : (
                        <SidebarMenuButton
                          isActive={isActive}
                          className="w-full flex items-center justify-between px-3 py-2 h-10 rounded-xl cursor-pointer"
                          tooltip={item.title}
                          render={
                            <Link href={item.href || "#"}>
                              <div className="flex items-center gap-3">
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                              </div>
                              {item.badge !== undefined && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7C3AED] px-1 text-[10px] font-bold text-white">
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

      <SidebarFooter className="p-4 bg-[#15161D] border-t border-sidebar-border/20">
        {/* Current Plan Banner */}
        <div className="bg-[#181922] border border-[#2d2f39] rounded-2xl p-4 space-y-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
              Current Plan
            </span>
            <Crown className="h-4 w-4 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              Enterprise
            </h4>
          </div>
          <Button 
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs py-1.5 h-8 rounded-xl font-medium shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all cursor-pointer"
            render={
              <Link href="/settings" />
            }
          >
            Manage Plan
          </Button>
        </div>
        
        {/* Footer info when collapsed */}
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center py-2 text-muted-foreground">
          <Crown className="h-4 w-4 text-amber-500" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
