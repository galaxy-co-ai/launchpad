"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { X, AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react";
import type { ErrorSeverity } from "@/lib/types";

const severityConfig: Record<
  ErrorSeverity,
  { icon: typeof AlertCircle; bgClass: string; borderClass: string; textClass: string }
> = {
  info: {
    icon: Info,
    bgClass: "bg-[var(--normandy-cyan-subtle)]",
    borderClass: "border-[var(--normandy-cyan)]",
    textClass: "text-[var(--normandy-cyan)]",
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-[var(--normandy-orange-subtle)]",
    borderClass: "border-[var(--normandy-warning)]",
    textClass: "text-[var(--normandy-warning)]",
  },
  error: {
    icon: AlertCircle,
    bgClass: "bg-[rgba(255,68,68,0.1)]",
    borderClass: "border-[var(--normandy-danger)]",
    textClass: "text-[var(--normandy-danger)]",
  },
  critical: {
    icon: XCircle,
    bgClass: "bg-[rgba(255,68,68,0.2)]",
    borderClass: "border-[var(--normandy-danger)]",
    textClass: "text-[var(--normandy-danger)]",
  },
};

export function ErrorToast() {
  const errors = useAppStore((state) => state.errors);
  const clearError = useAppStore((state) => state.clearError);

  if (errors.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md"
      role="alert"
      aria-live="polite"
    >
      {errors.slice(-5).map((error) => {
        const config = severityConfig[error.severity];
        const Icon = config.icon;

        return (
          <div
            key={error.id}
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg border shadow-lg",
              "animate-in slide-in-from-right-5 fade-in duration-200",
              config.bgClass,
              config.borderClass
            )}
          >
            <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", config.textClass)} />
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium", config.textClass)}>
                {error.severity === "critical" ? "Critical Error" : error.severity === "error" ? "Error" : error.severity === "warning" ? "Warning" : "Info"}
              </p>
              <p className="text-sm text-[var(--normandy-text-secondary)] mt-1 break-words">
                {error.message}
              </p>
              {error.context && (
                <p className="text-xs text-[var(--normandy-text-muted)] mt-1 normandy-mono">
                  Context: {error.context}
                </p>
              )}
            </div>
            <button
              onClick={() => clearError(error.id)}
              className={cn(
                "shrink-0 p-1 rounded hover:bg-[var(--normandy-surface)] transition-colors",
                config.textClass
              )}
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
