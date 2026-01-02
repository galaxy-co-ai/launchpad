"use client";

import Link from "next/link";
import type { Project } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { SOP_NAMES } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Eye,
  Pencil,
  Trash2,
  Rocket,
  GitBranch,
  Folder,
  CheckCircle,
  Circle,
  Clock,
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  className?: string;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  className,
}: ProjectCardProps) {
  const { deleteProject } = useAppStore();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      if (onDelete) {
        onDelete(project);
      } else {
        await deleteProject(project.id);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(project);
    }
  };

  // Calculate progress
  const totalPhases = SOP_NAMES.length;
  const completedPhases = project.current_phase;
  const progressPercent = Math.round((completedPhases / totalPhases) * 100);

  // Get phase status color
  const getPhaseColor = () => {
    if (completedPhases >= 10) return "from-green-500 to-emerald-600";
    if (completedPhases >= 5) return "from-blue-500 to-indigo-600";
    return "from-amber-500 to-orange-600";
  };

  // Get glow color based on phase
  const getGlowColor = () => {
    if (completedPhases >= 10) return "rgba(34, 197, 94, 0.2)";
    if (completedPhases >= 5) return "rgba(59, 130, 246, 0.2)";
    return "rgba(249, 115, 22, 0.2)";
  };

  return (
    <Link href={`/project?slug=${project.slug}`}>
      <div
        className={cn(
          // Base card styling
          "group relative overflow-hidden rounded-2xl",
          "border border-blue-500/20",
          "bg-gradient-to-br from-zinc-900/95 to-zinc-950/95",
          "p-[1px]",
          // Ambient glow
          "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
          // Hover effects
          "transition-all duration-300",
          "hover:shadow-[0_0_40px_rgba(59,130,246,0.25)]",
          "hover:border-blue-500/40",
          "hover:-translate-y-1",
          className
        )}
      >
        {/* Inner gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Card content */}
        <div className="relative rounded-[14px] bg-zinc-900/90 p-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Project icon */}
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  "bg-gradient-to-br",
                  getPhaseColor(),
                  "shadow-lg"
                )}
                style={{ boxShadow: `0 4px 20px ${getGlowColor()}` }}
              >
                <Rocket className="h-6 w-6 text-white" />
              </div>

              <div>
                <h3 className="font-semibold text-foreground group-hover:text-blue-400 transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {SOP_NAMES[completedPhases] || "Completed"}
                </p>
              </div>
            </div>

            {/* Phase indicator */}
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1",
                "text-xs font-medium",
                completedPhases >= 10
                  ? "bg-green-500/10 text-green-400"
                  : completedPhases >= 5
                  ? "bg-blue-500/10 text-blue-400"
                  : "bg-amber-500/10 text-amber-400"
              )}
            >
              {completedPhases >= 10 ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <Clock className="h-3 w-3" />
              )}
              Phase {completedPhases + 1}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className={cn(
                  "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                  getPhaseColor()
                )}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Phase dots */}
          <div className="mt-3 flex items-center gap-1">
            {SOP_NAMES.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  index < completedPhases
                    ? "bg-blue-500"
                    : index === completedPhases
                    ? "bg-blue-500/50"
                    : "bg-zinc-700"
                )}
              />
            ))}
          </div>

          {/* Metadata */}
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            {project.local_path && (
              <div className="flex items-center gap-1.5">
                <Folder className="h-3.5 w-3.5" />
                <span className="max-w-[100px] truncate">
                  {project.local_path.split(/[/\\]/).pop()}
                </span>
              </div>
            )}
            {project.github_url && (
              <div className="flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5" />
                <span>Connected</span>
              </div>
            )}
            {project.last_analyzed && (
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                <span>Analyzed</span>
              </div>
            )}
          </div>

          {/* Hover action buttons */}
          <div
            className={cn(
              "absolute bottom-4 right-4 flex items-center gap-2",
              "opacity-0 transition-opacity duration-200",
              "group-hover:opacity-100"
            )}
          >
            <button
              onClick={(e) => e.preventDefault()}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                "bg-zinc-800/80 backdrop-blur-sm",
                "border border-white/10",
                "text-muted-foreground hover:text-blue-400",
                "transition-colors"
              )}
              title="View"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={handleEdit}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                "bg-zinc-800/80 backdrop-blur-sm",
                "border border-white/10",
                "text-muted-foreground hover:text-amber-400",
                "transition-colors"
              )}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                "bg-zinc-800/80 backdrop-blur-sm",
                "border border-white/10",
                "text-muted-foreground hover:text-red-400",
                "transition-colors"
              )}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Grid component for multiple cards
interface ProjectCardGridProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  className?: string;
}

export function ProjectCardGrid({
  projects,
  onEdit,
  onDelete,
  className,
}: ProjectCardGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/50">
          <Rocket className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 font-semibold text-foreground">No projects yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first project to get started
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
