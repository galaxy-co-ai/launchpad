"use client";

import { cn } from "@/lib/utils";
import { Check, Circle, ChevronRight, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SOPStep {
  id: string;
  name: string;
  type: string;
  required: boolean;
  isComplete: boolean;
  hasData: boolean;
}

interface SOPChecklistProps {
  sopNumber: number;
  sopName: string;
  steps: SOPStep[];
  currentStepId: string | null;
  onStepClick?: (stepId: string) => void;
  onContinue?: () => void;
  className?: string;
}

const STEP_TYPE_ICONS: Record<string, string> = {
  input: "✏️",
  research: "🔍",
  decision: "🎯",
  generation: "⚡",
  validation: "✓",
  checklist: "☑️",
};

export function SOPChecklist({
  sopNumber,
  sopName,
  steps,
  currentStepId,
  onStepClick,
  onContinue,
  className,
}: SOPChecklistProps) {
  const completedCount = steps.filter((s) => s.isComplete).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent",
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              SOP-{sopNumber.toString().padStart(2, "0")}
            </div>
            <h3 className="text-lg font-semibold">{sopName}</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-400">
              {completedCount}/{steps.length}
            </div>
            <div className="text-xs text-muted-foreground">steps complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps list */}
      <div className="divide-y divide-white/5">
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStepId;
          const icon = STEP_TYPE_ICONS[step.type] || "📋";

          return (
            <button
              key={step.id}
              onClick={() => onStepClick?.(step.id)}
              disabled={!onStepClick}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                isCurrent && "bg-orange-500/10",
                !isCurrent && "hover:bg-white/5",
                onStepClick && "cursor-pointer"
              )}
            >
              {/* Status indicator */}
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm",
                  step.isComplete && "bg-green-500/20 text-green-400",
                  isCurrent && !step.isComplete && "bg-orange-500/20 text-orange-400",
                  !step.isComplete && !isCurrent && "bg-white/5 text-muted-foreground"
                )}
              >
                {step.isComplete ? (
                  <Check className="h-3.5 w-3.5" />
                ) : isCurrent ? (
                  <ChevronRight className="h-3.5 w-3.5" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{icon}</span>
                  <span
                    className={cn(
                      "text-sm font-medium truncate",
                      step.isComplete && "text-muted-foreground line-through",
                      isCurrent && "text-orange-400"
                    )}
                  >
                    {step.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground capitalize">
                    {step.type}
                  </span>
                  {step.required && (
                    <span className="text-[10px] text-orange-400">Required</span>
                  )}
                  {step.hasData && !step.isComplete && (
                    <span className="text-[10px] text-blue-400">Has data</span>
                  )}
                </div>
              </div>

              {/* Data indicator */}
              {step.hasData && (
                <FileText className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer actions */}
      {onContinue && (
        <div className="border-t border-white/10 p-4">
          <Button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
          >
            Continue Workflow
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

interface SOPChecklistMiniProps {
  sopNumber: number;
  completedSteps: number;
  totalSteps: number;
  className?: string;
}

export function SOPChecklistMini({
  sopNumber,
  completedSteps,
  totalSteps,
  className,
}: SOPChecklistMiniProps) {
  const progress = (completedSteps / totalSteps) * 100;
  const isComplete = completedSteps === totalSteps;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1",
        isComplete ? "bg-green-500/10" : "bg-white/5",
        className
      )}
    >
      {isComplete ? (
        <Check className="h-3.5 w-3.5 text-green-400" />
      ) : (
        <Circle className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <span className="text-xs font-medium">
        SOP-{sopNumber.toString().padStart(2, "0")}
      </span>
      <div className="h-1 w-12 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isComplete ? "bg-green-400" : "bg-orange-400"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">
        {completedSteps}/{totalSteps}
      </span>
    </div>
  );
}

