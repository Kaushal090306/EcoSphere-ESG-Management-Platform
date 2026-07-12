"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Bell,
  BellOff,
  Check,
  CheckCheck
} from "lucide-react";

interface NotificationItem {
  id: string;
  userId: string;
  type: "compliance_issue" | "csr_approval" | "challenge_approval" | "policy_reminder" | "badge_unlock" | "overdue_issue";
  message: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationsClientProps {
  initialNotifications: NotificationItem[];
}

const typeConfigs = {
  compliance_issue: { icon: ShieldAlert, style: "text-red-500 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" },
  overdue_issue: { icon: Clock, style: "text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
  csr_approval: { icon: Heart, style: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
  challenge_approval: { icon: Trophy, style: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20" },
  badge_unlock: { icon: Award, style: "text-purple-500 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20" },
  policy_reminder: { icon: FileText, style: "text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
};

export function NotificationsClient({ initialNotifications }: NotificationsClientProps) {
  const [list, setList] = useState<NotificationItem[]>(initialNotifications);
  const [loading, setLoading] = useState(false);

  const unreadCount = list.filter(n => !n.read).length;

  async function handleMarkAsRead(id: string) {
    // Optimistic UI update
    setList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    
    const res = await markNotificationAsRead(id);
    if (res.error) {
      toast.error(res.error);
      // Revert if failed
      setList(initialNotifications);
    }
  }

  async function handleMarkAllAsRead() {
    if (unreadCount === 0) return;
    
    setLoading(true);
    // Optimistic UI update
    setList(prev => prev.map(n => ({ ...n, read: true })));
    
    const res = await markAllNotificationsAsRead();
    setLoading(false);
    
    if (res.success) {
      toast.success("All notifications marked as read");
    } else {
      toast.error(res.error || "Failed to update notifications");
      // Revert if failed
      setList(initialNotifications);
    }
  }

  function formatNotificationDate(date: Date) {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  return (
    <div className="space-y-4 max-w-3xl">
      
      {/* Header Utilities */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
          {unreadCount === 0 ? "All read" : `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`}
        </h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            onClick={handleMarkAllAsRead}
            disabled={loading}
            className="text-xs h-8 text-[#09090b] dark:text-[#fafafa] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] rounded-[8px] flex items-center gap-1.5 font-medium border border-[#ececee] dark:border-[#27272a] px-3 transition-all"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Main Notification Card */}
      <Card className="border border-[#ececee] dark:border-[#27272a] shadow-xs overflow-hidden">
        <CardContent className="p-0">
          
          {list.length === 0 ? (
            /* Empty State Container */
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] flex items-center justify-center text-muted-foreground">
                <BellOff className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-[#09090b] dark:text-[#fafafa]">All caught up!</h4>
                <p className="text-xs text-muted-foreground max-w-xs">
                  You don&apos;t have any incoming notifications at the moment. We&apos;ll alert you when something updates.
                </p>
              </div>
            </div>
          ) : (
            /* Notification List */
            <div className="divide-y divide-[#ececee] dark:divide-[#27272a]">
              {list.map((n) => {
                const conf = typeConfigs[n.type] || { icon: Bell, style: "text-neutral-500 bg-neutral-50 dark:bg-neutral-500/10 border-neutral-200" };
                const Icon = conf.icon;
                
                return (
                  <div 
                    key={n.id} 
                    className={`flex items-start gap-4 p-4 transition-all duration-200 ${
                      !n.read 
                        ? "bg-white dark:bg-[#1f1f23]/40" 
                        : "opacity-75 bg-[#fafafa]/50 dark:bg-[#18181b]/20"
                    }`}
                  >
                    {/* Visual Icon Badge */}
                    <div className={`h-9 w-9 rounded-[10px] border flex items-center justify-center shrink-0 ${conf.style}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    {/* Notification info */}
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm leading-relaxed ${!n.read ? "font-medium text-[#09090b] dark:text-[#fafafa]" : "text-muted-foreground"}`}>
                        {n.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {formatNotificationDate(n.createdAt)}
                      </p>
                    </div>

                    {/* Actions and Status indicators */}
                    <div className="flex items-center gap-2 self-center">
                      {!n.read ? (
                        <>
                          {/* Unread badge dot */}
                          <span className="h-2 w-2 rounded-full bg-[#ff5a00] shrink-0 mr-1" />
                          {/* Complete action button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkAsRead(n.id)}
                            title="Mark as read"
                            className="h-8 w-8 rounded-[8px] border border-[#ececee] dark:border-[#27272a] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] text-[#71717a] dark:text-[#a1a1aa] hover:text-[#09090b] dark:hover:text-[#fafafa] transition-all"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-semibold px-2 py-1 bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] rounded-[6px] uppercase tracking-wider">
                          Read
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </CardContent>
      </Card>
      
    </div>
  );
}
