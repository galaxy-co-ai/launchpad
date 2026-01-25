"use client";

import { memo } from "react";
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
  Target,
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  className?: string;
}

export const ProjectCard = memo(function ProjectCard({
  project,
  onEdit,
  onDelete,
  className,
}: ProjectCardProps) {
  const deleteProject = useAppStore((state) => state.deleteProject);

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

  // Get phase status using Normandy colors
  const getPhaseStatus = () => {
    if (completedPhases >= 10) return {
      ledClass: "normandy-led-online",
      badgeClass: "normandy-badge-success",
      progressClass: "bg-[var(--normandy-success)]",
      label: "Complete"
    };
    if (completedPhases >= 5) return {
      ledClass: "normandy-led-warning",
      badgeClass: "normandy-badge-cyan",
      progressClass: "bg-[var(--normandy-cyan)]",
      label: "In Progress"
    };
    return {
      ledClass: "normandy-led-offline",
      badgeClass: "normandy-badge-orange",
      progressClass: "bg-[var(--normandy-orange)]",
      label: "Early Stage"
    };
  };

  const phaseStatus = getPhaseStatus();

  return (
    <Link href={`/project?slug=${project.slug}`}>
      <div
        className={cn(
          // Normandy card styling
          "normandy-card group relative overflow-hidden",
          "p-[1px]",
          // Hover effects
          "transition-all duration-300",
          "hover:-translate-y-1",
          className
        )}
      >
        {/* Card content */}
        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Mission icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--normandy-orange)]/30 bg-[var(--normandy-orange-subtle)] shadow-[0_0_12px_var(--normandy-orange-glow)]">
                <Target className="h-6 w-6 text-[var(--normandy-orange)]" />
              </div>

              <div>
                <h3 className="font-semibold text-[var(--normandy-text-primary)] group-hover:text-[var(--normandy-cyan)] transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-[var(--normandy-text-muted)] normandy-mono">
                  {SOP_NAMES[completedPhases] || "Mission Complete"}
                </p>
              </div>
            </div>

            {/* Phase indicator */}
            <div className={cn("normandy-badge", phaseStatus.badgeClass)}>
              <div className={cn("normandy-led", phaseStatus.ledClass)} />
              Phase {completedPhases + 1}
            </div>
          </div>

          {/* Progress bar - Normandy style */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="normandy-label">Mission Progress</span>
              <span className="normandy-value text-sm">{progressPercent}%</span>
            </div>
            <div className="normandy-progress">
              <div
                className={cn("normandy-progress-fill", phaseStatus.progressClass)}
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
                    ? "bg-[var(--normandy-cyan)]"
                    : index === completedPhases
                    ? "bg-[var(--normandy-cyan)]/50"
                    : "bg-[var(--normandy-surface)]"
                )}
              />
            ))}
          </div>

          {/* Metadata */}
          <div className="mt-4 flex items-center gap-4 text-xs text-[var(--normandy-text-muted)]">
            {project.local_path && (
              <div className="flex items-center gap-1.5">
                <Folder className="h-3.5 w-3.5" />
                <span className="max-w-[100px] truncate normandy-mono">
                  {project.local_path.split(/[/\\]/).pop()}
                </span>
              </div>
            )}
            {project.github_url && (
              <div className="flex items-center gap-1.5 text-[var(--normandy-cyan)]">
                <GitBranch className="h-3.5 w-3.5" />
                <span>Linked</span>
              </div>
            )}
            {project.last_analyzed && (
              <div className="flex items-center gap-1.5 text-[var(--normandy-success)]">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Scanned</span>
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
            role="group"
            aria-label={`Actions for ${project.name}`}
          >
            <button
              onClick={(e) => e.preventDefault()}
              className="normandy-btn p-2"
              title="View"
              aria-label={`View ${project.name}`}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={handleEdit}
              className="normandy-btn p-2 hover:text-[var(--normandy-warning)]"
              title="Edit"
              aria-label={`Edit ${project.name}`}
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={handleDelete}
              className="normandy-btn p-2 hover:text-[var(--normandy-danger)]"
              title="Delete"
              aria-label={`Delete ${project.name}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
});

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
        <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-[var(--normandy-cyan)]/20 bg-[var(--normandy-cyan-subtle)]">
          <Rocket className="h-8 w-8 text-[var(--normandy-cyan)]/50" />
        </div>
        <h3 className="mt-4 normandy-heading text-[var(--normandy-text-primary)]">No active missions</h3>
        <p className="mt-1 text-sm text-[var(--normandy-text-muted)]">
          Initialize a new mission to begin operations
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
