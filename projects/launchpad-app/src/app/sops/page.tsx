"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { SOP_PHASES, SOP_NAMES } from "@/lib/types";
import type { SOP, SOPPhase } from "@/lib/types";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Tag,
  Clock,
  Archive,
  Plus,
  Lightbulb,
  Palette,
  Wrench,
  Code,
  Rocket,
  TrendingUp,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Phase icons mapping
const PHASE_ICONS: Record<SOPPhase, React.ElementType> = {
  ideation: Lightbulb,
  design: Palette,
  setup: Wrench,
  build: Code,
  launch: Rocket,
  post_launch: TrendingUp,
};

// Phase colors using Normandy palette
const PHASE_COLORS: Record<SOPPhase, { text: string; glow: string; border: string }> = {
  ideation: {
    text: "text-[var(--normandy-warning)]",
    glow: "shadow-[0_0_12px_var(--normandy-warning-glow)]",
    border: "border-[var(--normandy-warning)]/30",
  },
  design: {
    text: "text-[var(--normandy-cyan)]",
    glow: "shadow-[0_0_12px_var(--normandy-cyan-glow)]",
    border: "border-[var(--normandy-cyan)]/30",
  },
  setup: {
    text: "text-[var(--normandy-blue)]",
    glow: "shadow-[0_0_12px_var(--normandy-blue-glow)]",
    border: "border-[var(--normandy-blue)]/30",
  },
  build: {
    text: "text-[var(--normandy-success)]",
    glow: "shadow-[0_0_12px_var(--normandy-success-glow)]",
    border: "border-[var(--normandy-success)]/30",
  },
  launch: {
    text: "text-[var(--normandy-orange)]",
    glow: "shadow-[0_0_12px_var(--normandy-orange-glow)]",
    border: "border-[var(--normandy-orange)]/30",
  },
  post_launch: {
    text: "text-[var(--normandy-cyan)]",
    glow: "shadow-[0_0_12px_var(--normandy-cyan-glow)]",
    border: "border-[var(--normandy-cyan)]/30",
  },
};

export default function SOPsPage() {
  const { sops, sopsLoading, fetchSOPs, initDefaultSOPs } = useAppStore();
  const [expandedPhases, setExpandedPhases] = useState<Set<SOPPhase>>(new Set(["ideation"]));
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initDefaultSOPs();
      await fetchSOPs();
      setInitialized(true);
    };
    init();
  }, [fetchSOPs, initDefaultSOPs]);

  const togglePhase = (phase: SOPPhase) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) {
        next.delete(phase);
      } else {
        next.add(phase);
      }
      return next;
    });
  };

  // Group SOPs by phase
  const sopsByNumber = sops.reduce((acc, sop) => {
    if (!acc[sop.sop_number]) {
      acc[sop.sop_number] = [];
    }
    acc[sop.sop_number].push(sop);
    return acc;
  }, {} as Record<number, SOP[]>);

  const getActiveSOPForNumber = (sopNumber: number): SOP | undefined => {
    const versions = sopsByNumber[sopNumber] || [];
    return versions.find((s) => s.is_active) || versions[0];
  };

  const getVersionCount = (sopNumber: number): number => {
    return (sopsByNumber[sopNumber] || []).length;
  };

  if (!initialized || sopsLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--normandy-void)]">
        <div className="flex flex-col items-center gap-4">
          <div className="normandy-led normandy-led-warning" style={{ width: 16, height: 16 }} />
          <p className="normandy-mono text-sm text-[var(--normandy-text-muted)]">
            Loading protocols...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto normandy-scroll bg-[var(--normandy-void)]">
      <div className="mx-auto max-w-4xl p-8">
        {/* Header */}
        <div className="mb-8 normandy-panel p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--normandy-orange)]/30 bg-[var(--normandy-orange-subtle)]">
              <Shield className="h-6 w-6 text-[var(--normandy-orange)]" />
            </div>
            <div>
              <h1 className="normandy-heading text-xl text-[var(--normandy-text-primary)]">
                STANDARD OPERATING PROCEDURES
              </h1>
              <p className="text-[var(--normandy-text-secondary)] mt-1">
                13 protocols to transform an idea into a shipped, revenue-ready product
              </p>
            </div>
          </div>
        </div>

        {/* Phase Cards */}
        <div className="space-y-4">
          {SOP_PHASES.map((phaseInfo) => {
            const PhaseIcon = PHASE_ICONS[phaseInfo.phase];
            const isExpanded = expandedPhases.has(phaseInfo.phase);
            const colors = PHASE_COLORS[phaseInfo.phase];
            const phaseSOPs = phaseInfo.sops.map((num) => ({
              number: num,
              name: SOP_NAMES[num],
              activeSOP: getActiveSOPForNumber(num),
              versionCount: getVersionCount(num),
            }));

            return (
              <div key={phaseInfo.phase} className="normandy-panel overflow-hidden">
                {/* Phase Header */}
                <button
                  onClick={() => togglePhase(phaseInfo.phase)}
                  className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-[var(--normandy-cyan-subtle)]"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                      colors.border,
                      colors.glow
                    )}
                    style={{ background: "var(--normandy-panel)" }}
                  >
                    <PhaseIcon className={cn("h-5 w-5", colors.text)} />
                  </div>
                  <div className="flex-1">
                    <h2 className="normandy-heading text-[var(--normandy-text-primary)]">
                      {phaseInfo.label}
                    </h2>
                    <p className="text-sm text-[var(--normandy-text-muted)]">
                      {phaseInfo.sops.length} protocol{phaseInfo.sops.length !== 1 ? "s" : ""} in this phase
                    </p>
                  </div>
                  <div className="text-[var(--normandy-text-muted)]">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </div>
                </button>

                {/* Phase Content */}
                {isExpanded && (
                  <div className="border-t border-[var(--normandy-border)] p-4">
                    <div className="space-y-3">
                      {phaseSOPs.map((sop) => (
                        <div
                          key={sop.number}
                          className="normandy-card group flex items-center gap-4 p-4 transition-all"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--normandy-cyan)]/30 bg-[var(--normandy-hull)] normandy-mono text-sm font-bold text-[var(--normandy-cyan)]">
                            {sop.number.toString().padStart(2, "0")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-[var(--normandy-text-primary)] truncate">
                                {sop.name}
                              </h3>
                              {sop.activeSOP?.tags && (
                                <div className="flex gap-1">
                                  {JSON.parse(sop.activeSOP.tags).map((tag: string) => (
                                    <span
                                      key={tag}
                                      className="normandy-badge normandy-badge-cyan"
                                    >
                                      <Tag className="h-3 w-3" />
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-[var(--normandy-text-muted)] normandy-mono">
                              {sop.activeSOP ? (
                                <>
                                  <span className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    v{sop.activeSOP.version}
                                  </span>
                                  {sop.versionCount > 1 && (
                                    <span className="flex items-center gap-1">
                                      <Archive className="h-3 w-3" />
                                      {sop.versionCount} versions
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(sop.activeSOP.created_at).toLocaleDateString()}
                                  </span>
                                </>
                              ) : (
                                <span className="text-[var(--normandy-warning)]">Awaiting input</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="normandy-btn px-3 py-1.5 text-xs">
                              <FileText className="h-3.5 w-3.5 mr-1.5" />
                              View
                            </button>
                            <button className="normandy-btn normandy-btn-primary px-3 py-1.5 text-xs">
                              <Plus className="h-3.5 w-3.5 mr-1.5" />
                              New Version
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="normandy-card p-4 text-center">
            <div className="normandy-value text-3xl font-bold">
              {sops.filter((s) => s.is_active).length}
            </div>
            <div className="normandy-label mt-1">Active Protocols</div>
          </div>
          <div className="normandy-card p-4 text-center">
            <div className="normandy-value text-3xl font-bold">{sops.length}</div>
            <div className="normandy-label mt-1">Total Versions</div>
          </div>
          <div className="normandy-card p-4 text-center">
            <div className="normandy-value text-3xl font-bold">
              {SOP_PHASES.length}
            </div>
            <div className="normandy-label mt-1">Mission Phases</div>
          </div>
        </div>
      </div>
    </div>
  );
}
