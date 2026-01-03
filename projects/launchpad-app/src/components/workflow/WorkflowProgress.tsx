"use client";

import { cn } from "@/lib/utils";
import { Check, Circle, Loader2 } from "lucide-react";

interface WorkflowProgressProps {
  currentSop: number;
  className?: string;
}

const SOP_INFO = [
  { number: 0, name: "Idea Intake", emoji: "💡", phase: "ideation" },
  { number: 1, name: "Validation", emoji: "🔍", phase: "ideation" },
  { number: 2, name: "Scope Lock", emoji: "📝", phase: "ideation" },
  { number: 3, name: "Revenue Lock", emoji: "💰", phase: "ideation" },
  { number: 4, name: "Design Brief", emoji: "🎨", phase: "design" },
  { number: 5, name: "Project Setup", emoji: "🏗️", phase: "setup" },
  { number: 6, name: "Infrastructure", emoji: "☁️", phase: "setup" },
  { number: 7, name: "Development", emoji: "⚡", phase: "build" },
  { number: 8, name: "Testing & QA", emoji: "🧪", phase: "qa" },
  { number: 9, name: "Pre-Ship", emoji: "✅", phase: "ship" },
  { number: 10, name: "Launch", emoji: "🚀", phase: "ship" },
  { number: 11, name: "Monitoring", emoji: "📊", phase: "iterate" },
  { number: 12, name: "Marketing", emoji: "📣", phase: "iterate" },
];

const PHASE_COLORS: Record<string, string> = {
  ideation: "from-amber-500 to-orange-500",
  design: "from-purple-500 to-pink-500",
  setup: "from-blue-500 to-cyan-500",
  build: "from-green-500 to-emerald-500",
  qa: "from-yellow-500 to-amber-500",
  ship: "from-red-500 to-orange-500",
  iterate: "from-indigo-500 to-purple-500",
};

export function WorkflowProgress({ currentSop, className }: WorkflowProgressProps) {
  const progress = ((currentSop + 1) / 13) * 100;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress bar */}
      <div className="relative">
        <div className="h-2 w-full rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>SOP-{currentSop.toString().padStart(2, "0")}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between gap-1">
        {SOP_INFO.map((sop) => {
          const isComplete = sop.number < currentSop;
          const isCurrent = sop.number === currentSop;
          const phaseColor = PHASE_COLORS[sop.phase];

          return (
            <div
              key={sop.number}
              className="group relative flex flex-col items-center"
              title={`SOP-${sop.number.toString().padStart(2, "0")}: ${sop.name}`}
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs transition-all",
                  isComplete && "bg-green-500/20 text-green-400",
                  isCurrent && `bg-gradient-to-br ${phaseColor} text-white shadow-lg`,
                  !isComplete && !isCurrent && "bg-white/5 text-muted-foreground"
                )}
              >
                {isComplete ? (
                  <Check className="h-3 w-3" />
                ) : isCurrent ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Circle className="h-2 w-2" />
                )}
              </div>

              {/* Tooltip on hover */}
              <div className="pointer-events-none absolute -top-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                <span className="mr-1">{sop.emoji}</span>
                {sop.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface WorkflowProgressCompactProps {
  currentSop: number;
  sopName: string;
  stepsCompleted: number;
  phase: string;
  className?: string;
}

export function WorkflowProgressCompact({
  currentSop,
  sopName,
  stepsCompleted,
  phase,
  className,
}: WorkflowProgressCompactProps) {
  const phaseColor = PHASE_COLORS[phase] || PHASE_COLORS.ideation;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3",
        className
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-lg",
          phaseColor
        )}
      >
        {SOP_INFO[currentSop]?.emoji || "📋"}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            SOP-{currentSop.toString().padStart(2, "0")}
          </span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider">
            {phase}
          </span>
        </div>
        <div className="font-medium">{sopName}</div>
        <div className="text-xs text-muted-foreground">
          {stepsCompleted} step{stepsCompleted !== 1 ? "s" : ""} completed
        </div>
      </div>
    </div>
  );
}

