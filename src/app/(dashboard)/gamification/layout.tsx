"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getOwnGamificationProfile } from "@/actions/gamification";

export default function GamificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<{ level: number; progressInLevel: number } | null>(null);

  useEffect(() => {
    getOwnGamificationProfile().then(setProfile).catch(() => {});
  }, [pathname]);

  const tabs = [
    { name: "Overview", href: "/gamification" },
    { name: "Challenges", href: "/gamification/challenges" },
    { name: "Badges", href: "/gamification/badges" },
    { name: "Rewards", href: "/gamification/rewards" },
    { name: "Leaderboard", href: "/gamification/leaderboard" },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <nav className="flex flex-wrap items-center gap-1.5 p-1 bg-[#e4e4e7]/60 dark:bg-[#121118] border border-[#ececee] dark:border-[#2d2f39] rounded-lg w-fit">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 border border-transparent ${isActive ? "bg-white dark:bg-[#1c1a24] text-[#09090b] dark:text-white shadow-xs border-[#ececee] dark:border-[#2d2f39]" : "text-muted-foreground hover:text-[#09090b] dark:hover:text-white"}`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>

        {/* Level and XP inline badge in layout header row */}
        {profile && (
          <div className="flex items-center gap-3 px-4 py-1.5 bg-[#e4e4e7]/60 dark:bg-[#121118] border border-[#ececee] dark:border-[#2d2f39] rounded-lg text-xs w-fit">
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Level</span>
              <span className="font-extrabold text-purple-500 text-xs font-mono">{profile.level}</span>
            </div>
            <div className="w-px h-3 bg-[#ececee] dark:bg-[#2d2f39]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">Progress:</span>
              <div className="w-16 h-1 rounded-full bg-gray-200 dark:bg-[#1c1a24] overflow-hidden shrink-0">
                <div 
                  className="h-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${profile.progressInLevel}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-foreground font-mono">{profile.progressInLevel}/100 XP</span>
            </div>
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
