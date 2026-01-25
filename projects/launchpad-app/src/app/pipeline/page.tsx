"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { SOP_NAMES } from "@/lib/types";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Columns,
  Rocket,
  ChevronRight,
  Target,
  TrendingUp,
  Calendar,
  Activity,
  Flame,
  Trophy,
} from "lucide-react";

// Group phases into pipeline stages
const PIPELINE_STAGES = [
  {
    id: "ideation",
    name: "Ideation",
    phases: [0, 1, 2, 3],
    color: "var(--normandy-cyan)",
    description: "Validating & scoping",
  },
  {
    id: "design",
    name: "Design",
    phases: [4],
    color: "var(--normandy-orange)",
    description: "UI planning",
  },
  {
    id: "build",
    name: "Build",
    phases: [5, 6, 7, 8],
    color: "var(--normandy-warning)",
    description: "Development & testing",
  },
  {
    id: "launch",
    name: "Launch",
    phases: [9, 10],
    color: "var(--normandy-success)",
    description: "Ship it!",
  },
  {
    id: "growth",
    name: "Growth",
    phases: [11, 12],
    color: "#a855f7", // Purple for growth
    description: "Marketing & monitoring",
  },
  {
    id: "shipped",
    name: "Shipped",
    phases: [13], // Phase 13+ means completed
    color: "var(--normandy-success)",
    description: "Live & generating revenue",
  },
];

function getStageForPhase(phase: number): string {
  if (phase >= 13) return "shipped";
  for (const stage of PIPELINE_STAGES) {
    if (stage.phases.includes(phase)) return stage.id;
  }
  return "ideation";
}

export default function PipelinePage() {
  const { projects, fetchProjects, projectsLoading } = useAppStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Group projects by stage
  const projectsByStage = useMemo(() => {
    const grouped: Record<string, Project[]> = {};
    PIPELINE_STAGES.forEach((stage) => {
      grouped[stage.id] = [];
    });

    projects.forEach((project) => {
      const stageId = getStageForPhase(project.current_phase);
      if (grouped[stageId]) {
        grouped[stageId].push(project);
      }
    });

    return grouped;
  }, [projects]);

  // Calculate velocity metrics
  const metrics = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Projects created in last 30 days
    const recentProjects = projects.filter(
      (p) => new Date(p.created_at) >= thirtyDaysAgo
    );

    // Projects shipped (phase >= 10)
    const shippedProjects = projects.filter((p) => p.current_phase >= 10);

    // Active projects (in progress, not shipped)
    const activeProjects = projects.filter(
      (p) => p.current_phase > 0 && p.current_phase < 10
    );

    // Average phase across all projects
    const avgPhase =
      projects.length > 0
        ? projects.reduce((sum, p) => sum + p.current_phase, 0) / projects.length
        : 0;

    return {
      totalProjects: projects.length,
      shippedCount: shippedProjects.length,
      activeCount: activeProjects.length,
      recentCount: recentProjects.length,
      avgPhase: avgPhase.toFixed(1),
      velocity: recentProjects.length / 30 * 30, // Projects per month rate
    };
  }, [projects]);

  if (projectsLoading && projects.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--normandy-void)]">
        <div className="flex flex-col items-center gap-4">
          <div className="normandy-led normandy-led-warning" style={{ width: 16, height: 16 }} />
          <p className="normandy-mono text-sm text-[var(--normandy-text-muted)]">
            Loading pipeline...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden bg-[var(--normandy-void)] flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-[var(--normandy-border)] bg-[var(--normandy-hull)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--normandy-orange)]/30 bg-[var(--normandy-orange-subtle)] shadow-[0_0_12px_var(--normandy-orange-glow)]">
              <Columns className="h-6 w-6 text-[var(--normandy-orange)]" />
            </div>
            <div>
              <h1 className="normandy-heading text-xl text-[var(--normandy-text-primary)]">
                SHIPPING PIPELINE
              </h1>
              <p className="text-[var(--normandy-text-secondary)] mt-1">
                Visual overview of all missions across phases
              </p>
            </div>
          </div>
          <Link href="/new-project" className="normandy-btn normandy-btn-primary px-4 py-2">
            <Rocket className="h-4 w-4 mr-2" />
            NEW MISSION
          </Link>
        </div>
      </div>

      {/* Velocity Stats */}
      <div className="shrink-0 px-6 py-4 border-b border-[var(--normandy-border)]">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="normandy-card p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-3.5 w-3.5 text-[var(--normandy-cyan)]" />
              <span className="text-[10px] uppercase tracking-wider text-[var(--normandy-text-muted)]">Total</span>
            </div>
            <div className="normandy-value text-2xl">{metrics.totalProjects}</div>
          </div>
          <div className="normandy-card p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-3.5 w-3.5 text-[var(--normandy-warning)]" />
              <span className="text-[10px] uppercase tracking-wider text-[var(--normandy-text-muted)]">Active</span>
            </div>
            <div className="normandy-value text-2xl">{metrics.activeCount}</div>
          </div>
          <div className="normandy-card p-3">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-3.5 w-3.5 text-[var(--normandy-success)]" />
              <span className="text-[10px] uppercase tracking-wider text-[var(--normandy-text-muted)]">Shipped</span>
            </div>
            <div className="text-2xl font-bold text-[var(--normandy-success)]" style={{ textShadow: '0 0 8px var(--normandy-success-glow)' }}>
              {metrics.shippedCount}
            </div>
          </div>
          <div className="normandy-card p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-3.5 w-3.5 text-[var(--normandy-cyan)]" />
              <span className="text-[10px] uppercase tracking-wider text-[var(--normandy-text-muted)]">This Month</span>
            </div>
            <div className="normandy-value text-2xl">{metrics.recentCount}</div>
          </div>
          <div className="normandy-card p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-[var(--normandy-orange)]" />
              <span className="text-[10px] uppercase tracking-wider text-[var(--normandy-text-muted)]">Avg Phase</span>
            </div>
            <div className="normandy-value text-2xl">{metrics.avgPhase}</div>
          </div>
          <div className="normandy-card p-3">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-3.5 w-3.5 text-[#ff6b6b]" />
              <span className="text-[10px] uppercase tracking-wider text-[var(--normandy-text-muted)]">Velocity</span>
            </div>
            <div className="text-2xl font-bold text-[#ff6b6b]">
              {metrics.velocity.toFixed(1)}<span className="text-xs">/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto normandy-scroll p-6">
        <div className="flex gap-4 h-full min-w-max">
          {PIPELINE_STAGES.map((stage) => {
            const stageProjects = projectsByStage[stage.id] || [];
            return (
              <div
                key={stage.id}
                className="flex flex-col w-72 shrink-0"
              >
                {/* Column Header */}
                <div
                  className="normandy-panel p-3 mb-3"
                  style={{
                    borderColor: `${stage.color}30`,
                    boxShadow: `0 0 12px ${stage.color}20`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="normandy-label" style={{ color: stage.color }}>
                        {stage.name.toUpperCase()}
                      </span>
                    </div>
                    <span className="normandy-badge text-[10px]" style={{
                      backgroundColor: `${stage.color}15`,
                      borderColor: `${stage.color}30`,
                      color: stage.color,
                    }}>
                      {stageProjects.length}
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--normandy-text-muted)] mt-1">
                    {stage.description}
                  </div>
                </div>

                {/* Column Content */}
                <div className="flex-1 space-y-2 overflow-y-auto normandy-scroll">
                  {stageProjects.length === 0 ? (
                    <div className="normandy-card p-4 text-center border-dashed">
                      <p className="text-xs text-[var(--normandy-text-muted)]">
                        No missions in this stage
                      </p>
                    </div>
                  ) : (
                    stageProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/project?slug=${project.slug}`}
                        className="block normandy-card p-4 hover:shadow-[0_0_12px_var(--normandy-cyan-glow)] transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "normandy-led",
                                project.current_phase >= 10
                                  ? "normandy-led-online"
                                  : project.current_phase >= 5
                                  ? "normandy-led-warning"
                                  : "normandy-led-offline"
                              )}
                            />
                            <span className="font-medium text-sm text-[var(--normandy-text-primary)] truncate max-w-[180px]">
                              {project.name}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-[var(--normandy-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-[var(--normandy-text-muted)]">
                          <span className="normandy-badge text-[10px]">
                            SOP-{String(project.current_phase).padStart(2, '0')}
                          </span>
                          <span>{SOP_NAMES[project.current_phase] ?? 'Unknown'}</span>
                        </div>
                        {/* Phase Progress Bar */}
                        <div className="mt-3">
                          <div className="normandy-progress h-1">
                            <div
                              className="normandy-progress-fill"
                              style={{ width: `${(project.current_phase / 12) * 100}%` }}
                            />
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-[var(--normandy-cyan)]/20 bg-[var(--normandy-cyan-subtle)] mb-4">
            <Columns className="h-10 w-10 text-[var(--normandy-cyan)]/40" />
          </div>
          <h3 className="normandy-heading text-lg text-[var(--normandy-text-primary)] mb-2">
            Your Pipeline is Empty
          </h3>
          <p className="text-[var(--normandy-text-muted)] mb-6 max-w-md text-center">
            Start a new mission to see it flow through the shipping pipeline.
          </p>
          <Link href="/new-project" className="normandy-btn normandy-btn-primary px-6 py-3">
            <Rocket className="h-4 w-4 mr-2" />
            START YOUR FIRST MISSION
          </Link>
        </div>
      )}
    </div>
  );
}
