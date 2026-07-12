import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: "green" | "teal" | "blue" | "orange" | "purple" | "red";
}

const colorMap = {
  green: {
    bg: "bg-eco-green/10",
    text: "text-eco-green",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.1)]",
  },
  teal: {
    bg: "bg-eco-teal/10",
    text: "text-eco-teal",
    glow: "shadow-[0_0_20px_rgba(20,184,166,0.1)]",
  },
  blue: {
    bg: "bg-eco-blue/10",
    text: "text-eco-blue",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.1)]",
  },
  orange: {
    bg: "bg-eco-orange/10",
    text: "text-eco-orange",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.1)]",
  },
  purple: {
    bg: "bg-eco-purple/10",
    text: "text-eco-purple",
    glow: "shadow-[0_0_20px_rgba(155,92,246,0.1)]",
  },
  red: {
    bg: "bg-eco-red/10",
    text: "text-eco-red",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.1)]",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "green",
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <Card className={cn("relative overflow-hidden transition-all duration-300 hover:scale-[1.02]", colors.glow)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.value >= 0 ? "text-eco-green" : "text-eco-red"
                  )}
                >
                  {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", colors.bg)}>
            <Icon className={cn("h-6 w-6", colors.text)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
