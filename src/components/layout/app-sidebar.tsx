"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Leaf,
  Gauge,
  Target,
  PackageSearch,
  Users,
  HandHeart,
  UserCheck,
  ShieldCheck,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  Trophy,
  Swords,
  Award,
  Gift,
  Medal,
  BarChart3,
  Settings,
  Building2,
  Tags,
  SlidersHorizontal,
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
  SidebarSeparator,
} from "@/components/ui/sidebar";

const navGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "Environmental",
    items: [
      { title: "Emission Factors", href: "/environmental/emission-factors", icon: Gauge },
      { title: "Goals", href: "/environmental/goals", icon: Target },
      { title: "Product Profiles", href: "/environmental/product-profiles", icon: PackageSearch },
    ],
  },
  {
    label: "Social",
    items: [
      { title: "CSR Activities", href: "/social/csr-activities", icon: HandHeart },
      { title: "Participation", href: "/social/participation", icon: UserCheck },
    ],
  },
  {
    label: "Governance",
    items: [
      { title: "Policies", href: "/governance/policies", icon: FileText },
      { title: "Audits", href: "/governance/audits", icon: ClipboardCheck },
      { title: "Compliance Issues", href: "/governance/compliance-issues", icon: AlertTriangle },
    ],
  },
  {
    label: "Gamification",
    items: [
      { title: "Challenges", href: "/gamification/challenges", icon: Swords },
      { title: "Badges", href: "/gamification/badges", icon: Award },
      { title: "Rewards", href: "/gamification/rewards", icon: Gift },
      { title: "Leaderboard", href: "/gamification/leaderboard", icon: Medal },
    ],
  },
  {
    label: "Analytics",
    items: [
      { title: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Settings",
    items: [
      { title: "Departments", href: "/settings/departments", icon: Building2 },
      { title: "Categories", href: "/settings/categories", icon: Tags },
      { title: "Configuration", href: "/settings", icon: SlidersHorizontal },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold gradient-text group-data-[collapsible=icon]:hidden">
            EcoSphere
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/60">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground group-data-[collapsible=icon]:justify-center">
          <Leaf className="h-3 w-3 text-primary" />
          <span className="group-data-[collapsible=icon]:hidden">
            EcoSphere v1.0
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
