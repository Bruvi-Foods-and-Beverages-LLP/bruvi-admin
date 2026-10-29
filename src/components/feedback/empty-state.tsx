import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Figma AS02: Empty Table / List State
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-subtle text-text-muted mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h4 className="text-base font-semibold text-text mb-1">{title}</h4>
      <p className="max-w-sm text-xs text-text-muted mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

