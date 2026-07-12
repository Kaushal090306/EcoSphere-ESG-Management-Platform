import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {children}
        {actionLabel && onAction && (
          <Button onClick={onAction} className="gap-2">
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
