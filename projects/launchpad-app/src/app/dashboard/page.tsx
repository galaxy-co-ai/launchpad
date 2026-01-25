"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { ProjectCardGrid } from "@/components/project-card";
import { SOP_NAMES } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Rocket,
  Target,
  CheckCircle,
  Plus,
  RefreshCw,
  Activity,
  Zap,
  FolderOpen,
  BarChart3,
} from "lucide-react";

export default function DashboardPage() {
  const { projects, fetchProjects, projectsLoading } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  };

  // Calculate metrics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.current_phase >= 10).length;
  const inProgressProjects = projects.filter(p => p.current_phase > 0 && p.current_phase < 10).length;

  // Calculate overall progress
  const totalPossiblePhases = totalProjects * SOP_NAMES.length;
  const completedPhases = projects.reduce((sum, p) => sum + p.current_phase, 0);
  const overallProgress = totalPossiblePhases > 0
    ? Math.round((completedPhases / totalPossiblePhases) * 100)
    : 0;

  // Get phase distribution
  const phaseDistribution = SOP_NAMES.map((name, index) => ({
    name,
    count: projects.filter(p => p.current_phase === index).length,
  }));

  if (projectsLoading && projects.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--normandy-void)]">
        <div className="flex flex-col items-center gap-4">
          <div className="normandy-led normandy-led-warning" style={{ width: 16, height: 16 }} />
          <p className="normandy-mono text-sm text-[var(--normandy-text-muted)]">
            Loading mission data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto normandy-scroll bg-[var(--normandy-void)]">
      <div className="mx-auto max-w-7xl p-8">
        {/* Header */}
        <div className="mb-8 normandy-panel p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--normandy-orange)]/30 bg-[var(--normandy-orange-subtle)] shadow-[0_0_12px_var(--normandy-orange-glow)]">
                <BarChart3 className="h-6 w-6 text-[var(--normandy-orange)]" />
              </div>
              <div>
                <h1 className="normandy-heading text-xl text-[var(--normandy-text-primary)]">
                  MISSION CONTROL
                </h1>
                <p className="text-[var(--normandy-text-secondary)] mt-1">
                  Fleet overview and project status tracking
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className={cn(
                  "normandy-btn p-2",
                  refreshing && "animate-spin"
                )}
                disabled={refreshing}
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <Link href="/new-project" className="normandy-btn normandy-btn-primary px-4 py-2">
                <Plus className="h-4 w-4 mr-2" />
                NEW MISSION
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Missions */}
          <div className="normandy-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="normandy-led normandy-led-online" />
              <span className="normandy-label">Total Missions</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="normandy-value text-3xl font-bold">{totalProjects}</span>
              <span className="text-[var(--normandy-text-muted)] text-sm">active</span>
            </div>
          </div>

          {/* In Progress */}
          <div className="normandy-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="normandy-led normandy-led-warning" />
              <span className="normandy-label">In Progress</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="normandy-value text-3xl font-bold">{inProgressProjects}</span>
              <span className="text-[var(--normandy-text-muted)] text-sm">missions</span>
            </div>
          </div>

          {/* Completed */}
          <div className="normandy-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-4 w-4 text-[var(--normandy-success)]" />
              <span className="normandy-label">Completed</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[var(--normandy-success)] text-3xl font-bold" style={{ textShadow: '0 0 8px var(--normandy-success-glow)' }}>
                {completedProjects}
              </span>
              <span className="text-[var(--normandy-text-muted)] text-sm">shipped</span>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="normandy-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="h-4 w-4 text-[var(--normandy-cyan)]" />
              <span className="normandy-label">Fleet Progress</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="normandy-value text-3xl font-bold">{overallProgress}%</span>
              <div className="flex-1">
                <div className="normandy-progress">
                  <div
                    className="normandy-progress-fill"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Distribution */}
        <div className="normandy-panel p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-[var(--normandy-cyan)]" />
            <h2 className="normandy-label text-[var(--normandy-text-primary)]">PHASE DISTRIBUTION</h2>
          </div>
          <div className="grid grid-cols-13 gap-1">
            {phaseDistribution.map((phase, index) => (
              <div
                key={index}
                className="group relative"
                title={`${phase.name}: ${phase.count} project${phase.count !== 1 ? 's' : ''}`}
              >
                <div
                  className={cn(
                    "h-8 rounded border transition-all",
                    phase.count > 0
                      ? "bg-[var(--normandy-cyan-subtle)] border-[var(--normandy-cyan)]/30 hover:shadow-[0_0_8px_var(--normandy-cyan-glow)]"
                      : "bg-[var(--normandy-panel)] border-[var(--normandy-border)]"
                  )}
                />
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 normandy-mono text-[10px] text-[var(--normandy-text-muted)]">
                  {String(index).padStart(2, '0')}
                </div>
                {phase.count > 0 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 normandy-mono text-xs font-bold text-[var(--normandy-cyan)]">
                    {phase.count}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between text-xs text-[var(--normandy-text-muted)]">
            <span>Ideation</span>
            <span>Design</span>
            <span>Setup</span>
            <span>Build</span>
            <span>Launch</span>
            <span>Post-Launch</span>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="normandy-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-[var(--normandy-orange)]" />
              <h2 className="normandy-label text-[var(--normandy-text-primary)]">ACTIVE MISSIONS</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="normandy-badge normandy-badge-cyan">
                {totalProjects} Total
              </span>
            </div>
          </div>

          {totalProjects === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-[var(--normandy-cyan)]/20 bg-[var(--normandy-cyan-subtle)] mb-4">
                <Rocket className="h-10 w-10 text-[var(--normandy-cyan)]/40" />
              </div>
              <h3 className="normandy-heading text-lg text-[var(--normandy-text-primary)] mb-2">
                No Active Missions
              </h3>
              <p className="text-[var(--normandy-text-muted)] mb-6 max-w-md">
                Initialize a new mission to begin building your next Micro-SaaS product.
                Each mission follows the 13-SOP protocol for guaranteed shipping.
              </p>
              <Link href="/new-project" className="normandy-btn normandy-btn-primary px-6 py-3">
                <Plus className="h-4 w-4 mr-2" />
                INITIALIZE FIRST MISSION
              </Link>
            </div>
          ) : (
            <ProjectCardGrid projects={projects} />
          )}
        </div>

        {/* Quick Actions */}
        {totalProjects > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/sops" className="normandy-card-action p-4 flex items-center gap-3 hover:shadow-[0_0_20px_var(--normandy-orange-glow)] transition-all">
              <Target className="h-5 w-5 text-[var(--normandy-orange)]" />
              <div>
                <div className="font-medium text-[var(--normandy-text-primary)]">View SOPs</div>
                <div className="text-xs text-[var(--normandy-text-muted)]">Standard Operating Procedures</div>
              </div>
            </Link>
            <Link href="/" className="normandy-card p-4 flex items-center gap-3 hover:shadow-[0_0_20px_var(--normandy-cyan-glow)] transition-all">
              <Activity className="h-5 w-5 text-[var(--normandy-cyan)]" />
              <div>
                <div className="font-medium text-[var(--normandy-text-primary)]">Command Terminal</div>
                <div className="text-xs text-[var(--normandy-text-muted)]">AI-powered assistance</div>
              </div>
            </Link>
            <Link href="/settings" className="normandy-card p-4 flex items-center gap-3 hover:shadow-[0_0_20px_var(--normandy-cyan-glow)] transition-all">
              <Zap className="h-5 w-5 text-[var(--normandy-cyan)]" />
              <div>
                <div className="font-medium text-[var(--normandy-text-primary)]">Settings</div>
                <div className="text-xs text-[var(--normandy-text-muted)]">Configure API keys</div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
