"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  color: "green" | "teal" | "blue" | "orange";
  size?: "sm" | "lg";
}

const colorStyles = {
  green: {
    ring: "stroke-eco-green",
    bg: "stroke-eco-green/15",
    text: "text-eco-green",
    label: "Environmental",
  },
  teal: {
    ring: "stroke-eco-teal",
    bg: "stroke-eco-teal/15",
    text: "text-eco-teal",
    label: "Social",
  },
  blue: {
    ring: "stroke-eco-blue",
    bg: "stroke-eco-blue/15",
    text: "text-eco-blue",
    label: "Governance",
  },
  orange: {
    ring: "stroke-eco-orange",
    bg: "stroke-eco-orange/15",
    text: "text-eco-orange",
    label: "Overall",
  },
};

export function ScoreCard({
  title,
  score,
  maxScore = 100,
  color,
  size = "sm",
}: ScoreCardProps) {
  const styles = colorStyles[color];
  const percentage = Math.min((score / maxScore) * 100, 100);
  const radius = size === "lg" ? 54 : 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="text-center">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2 pb-6">
        <div className="relative">
          <svg
            className={cn("transform -rotate-90", size === "lg" ? "h-32 w-32" : "h-24 w-24")}
            viewBox={`0 0 ${(radius + 8) * 2} ${(radius + 8) * 2}`}
          >
            <circle
              cx={radius + 8}
              cy={radius + 8}
              r={radius}
              fill="none"
              className={styles.bg}
              strokeWidth={size === "lg" ? 8 : 6}
            />
            <circle
              cx={radius + 8}
              cy={radius + 8}
              r={radius}
              fill="none"
              className={styles.ring}
              strokeWidth={size === "lg" ? 8 : 6}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 1s ease-in-out",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn("font-bold", styles.text, size === "lg" ? "text-2xl" : "text-lg")}>
              {score}
            </span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">/ {maxScore}</span>
      </CardContent>
    </Card>
  );
}
