"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import type { Idea, WorkflowProgress } from "@/lib/types";
import {
  Lightbulb,
  Target,
  Palette,
  Hammer,
  Rocket,
  Plus,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  Play,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PipelineColumn {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  sopRange: [number, number]; // [start, end] inclusive
}

const PIPELINE_COLUMNS: PipelineColumn[] = [
  {
    id: "ideation",
    name: "Ideation",
    icon: Lightbulb,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    sopRange: [0, 3],
  },
  {
    id: "design",
    name: "Design",
    icon: Palette,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    sopRange: [4, 4],
  },
  {
    id: "build",
    name: "Build",
    icon: Hammer,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    sopRange: [5, 8],
  },
  {
    id: "launch",
    name: "Launch",
    icon: Rocket,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    sopRange: [9, 12],
  },
];

interface IdeaWithWorkflow extends Idea {
  workflow?: WorkflowProgress | null;
}

interface IdeaPipelineProps {
  ideas: IdeaWithWorkflow[];
  onIdeaClick?: (idea: Idea) => void;
  onStartWorkflow?: (ideaId: string) => void;
  onDeleteIdea?: (ideaId: string) => void;
  className?: string;
}

export function IdeaPipeline({
  ideas,
  onIdeaClick,
  onStartWorkflow,
  onDeleteIdea,
  className,
}: IdeaPipelineProps) {
  // Group ideas by pipeline stage based on their workflow progress
  const groupedIdeas = PIPELINE_COLUMNS.map((column) => {
    const columnIdeas = ideas.filter((idea) => {
      if (!idea.workflow) {
        // Ideas without workflow go to ideation if pending/audited
        return column.id === "ideation" && (idea.status === "pending" || idea.status === "audited");
      }
      const sop = idea.workflow.current_sop;
      return sop >= column.sopRange[0] && sop <= column.sopRange[1];
    });
    return { ...column, ideas: columnIdeas };
  });

  return (
    <div className={cn("flex gap-4 overflow-x-auto pb-4", className)}>
      {groupedIdeas.map((column) => (
        <div
          key={column.id}
          className="flex w-72 shrink-0 flex-col rounded-xl border border-white/10 bg-white/[0.02]"
        >
          {/* Column header */}
          <div
            className={cn(
              "flex items-center gap-2 border-b border-white/10 p-3",
              column.bgColor
            )}
          >
            <column.icon className={cn("h-4 w-4", column.color)} />
            <span className="font-medium">{column.name}</span>
            <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-xs">
              {column.ideas.length}
            </span>
          </div>

          {/* Column content */}
          <div className="flex-1 space-y-2 p-2">
            {column.ideas.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-white/10 text-sm text-muted-foreground">
                No ideas
              </div>
            ) : (
              column.ideas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  columnColor={column.color}
                  onClick={() => onIdeaClick?.(idea)}
                  onStart={() => onStartWorkflow?.(idea.id)}
                  onDelete={() => onDeleteIdea?.(idea.id)}
                />
              ))
            )}
          </div>

          {/* Add idea button (only for ideation) */}
          {column.id === "ideation" && (
            <div className="border-t border-white/10 p-2">
              <Link href="/?new-idea=true">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                  Add Idea
                </Button>
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface IdeaCardProps {
  idea: IdeaWithWorkflow;
  columnColor: string;
  onClick?: () => void;
  onStart?: () => void;
  onDelete?: () => void;
}

function IdeaCard({ idea, columnColor, onClick, onStart, onDelete }: IdeaCardProps) {
  const [showActions, setShowActions] = useState(false);
  const hasWorkflow = !!idea.workflow;
  const currentSop = idea.workflow?.current_sop ?? 0;
  const validationScore = idea.workflow?.validation_score;
  const decision = idea.workflow?.decision;

  return (
    <div
      className="group relative rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-white/20 hover:bg-white/10"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Card content */}
      <button
        onClick={onClick}
        className="w-full text-left"
        aria-label={`View ${idea.name}`}
      >
        <h4 className="font-medium leading-tight">{idea.name}</h4>

        {idea.problem_statement && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {idea.problem_statement}
          </p>
        )}

        {/* Status indicators */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {/* SOP indicator */}
          {hasWorkflow && (
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                columnColor,
                "bg-white/10"
              )}
            >
              SOP-{currentSop.toString().padStart(2, "0")}
            </span>
          )}

          {/* Validation score */}
          {validationScore !== null && validationScore !== undefined && (
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                decision === "green" && "bg-green-500/20 text-green-400",
                decision === "yellow" && "bg-yellow-500/20 text-yellow-400",
                decision === "red" && "bg-red-500/20 text-red-400"
              )}
            >
              {validationScore}/125
            </span>
          )}

          {/* Status badge */}
          {!hasWorkflow && (
            <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] capitalize text-muted-foreground">
              {idea.status}
            </span>
          )}
        </div>
      </button>

      {/* Hover actions */}
      {showActions && (
        <div className="absolute right-2 top-2 flex items-center gap-1">
          {!hasWorkflow && onStart && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
              className="rounded-md bg-orange-500/20 p-1.5 text-orange-400 transition-colors hover:bg-orange-500/30"
              title="Start workflow"
              aria-label="Start workflow"
            >
              <Play className="h-3 w-3" />
            </button>
          )}
          {onClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="rounded-md bg-white/10 p-1.5 text-muted-foreground transition-colors hover:bg-white/20 hover:text-foreground"
              title="View details"
              aria-label="View details"
            >
              <Eye className="h-3 w-3" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Delete this idea?")) {
                  onDelete();
                }
              }}
              className="rounded-md bg-red-500/10 p-1.5 text-red-400 transition-colors hover:bg-red-500/20"
              title="Delete"
              aria-label="Delete idea"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface IdeaPipelineCompactProps {
  ideas: IdeaWithWorkflow[];
  className?: string;
}

export function IdeaPipelineCompact({ ideas, className }: IdeaPipelineCompactProps) {
  const counts = PIPELINE_COLUMNS.map((column) => {
    const count = ideas.filter((idea) => {
      if (!idea.workflow) {
        return column.id === "ideation";
      }
      const sop = idea.workflow.current_sop;
      return sop >= column.sopRange[0] && sop <= column.sopRange[1];
    }).length;
    return { ...column, count };
  });

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {counts.map((column, index) => (
        <div key={column.id} className="flex items-center">
          <div
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1",
              column.bgColor
            )}
          >
            <column.icon className={cn("h-3.5 w-3.5", column.color)} />
            <span className="text-xs font-medium">{column.count}</span>
          </div>
          {index < counts.length - 1 && (
            <ChevronRight className="h-3 w-3 text-muted-foreground mx-1" />
          )}
        </div>
      ))}
    </div>
  );
}

