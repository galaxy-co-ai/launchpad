"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { GlassCard } from "@/design-system/primitives/glass";
import { Button } from "@/components/ui/button";
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
  Loader2,
  Lightbulb,
  Palette,
  Wrench,
  Code,
  Rocket,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

// Phase icons mapping
const PHASE_ICONS: Record<SOPPhase, React.ElementType> = {
  ideation: Lightbulb,
  design: Palette,
  setup: Wrench,
  build: Code,
  launch: Rocket,
  post_launch: TrendingUp,
};

// Phase colors for accents
const PHASE_COLORS: Record<SOPPhase, string> = {
  ideation: "text-amber-400",
  design: "text-pink-400",
  setup: "text-cyan-400",
  build: "text-green-400",
  launch: "text-orange-400",
  post_launch: "text-blue-400",
};

const PHASE_BG: Record<SOPPhase, string> = {
  ideation: "from-amber-500/20 to-amber-600/10",
  design: "from-pink-500/20 to-pink-600/10",
  setup: "from-cyan-500/20 to-cyan-600/10",
  build: "from-green-500/20 to-green-600/10",
  launch: "from-orange-500/20 to-orange-600/10",
  post_launch: "from-blue-500/20 to-blue-600/10",
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
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Standard Operating Procedures
          </h1>
          <p className="text-muted-foreground mt-1">
            13 SOPs that transform an idea into a shipped, revenue-ready product
          </p>
        </div>

        <div className="space-y-4">
          {SOP_PHASES.map((phaseInfo) => {
            const PhaseIcon = PHASE_ICONS[phaseInfo.phase];
            const isExpanded = expandedPhases.has(phaseInfo.phase);
            const phaseSOPs = phaseInfo.sops.map((num) => ({
              number: num,
              name: SOP_NAMES[num],
              activeSOP: getActiveSOPForNumber(num),
              versionCount: getVersionCount(num),
            }));

            return (
              <GlassCard key={phaseInfo.phase} intensity="subtle" className="overflow-hidden">
                {/* Phase Header */}
                <button
                  onClick={() => togglePhase(phaseInfo.phase)}
                  className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-white/5"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${PHASE_BG[phaseInfo.phase]}`}
                  >
                    <PhaseIcon className={`h-5 w-5 ${PHASE_COLORS[phaseInfo.phase]}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-foreground">
                      {phaseInfo.label}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {phaseInfo.sops.length} SOP{phaseInfo.sops.length !== 1 ? "s" : ""} in this phase
                    </p>
                  </div>
                  <div className="text-muted-foreground">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </div>
                </button>

                {/* Phase Content */}
                {isExpanded && (
                  <div className="border-t border-white/10 p-4 pt-2">
                    <div className="space-y-3">
                      {phaseSOPs.map((sop) => (
                        <div
                          key={sop.number}
                          className="group flex items-center gap-4 rounded-xl bg-black/20 p-4 transition-colors hover:bg-black/30"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] text-sm font-bold text-white">
                            {sop.number.toString().padStart(2, "0")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-foreground truncate">
                                {sop.name}
                              </h3>
                              {sop.activeSOP?.tags && (
                                <div className="flex gap-1">
                                  {JSON.parse(sop.activeSOP.tags).map((tag: string) => (
                                    <span
                                      key={tag}
                                      className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300"
                                    >
                                      <Tag className="h-3 w-3" />
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
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
                                <span className="text-amber-400">No content yet</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-white/10 bg-white/5 hover:bg-white/10"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-white/10 bg-white/5 hover:bg-white/10"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              New Version
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <GlassCard intensity="subtle" className="p-4 text-center">
            <div className="text-3xl font-bold text-foreground">
              {sops.filter((s) => s.is_active).length}
            </div>
            <div className="text-sm text-muted-foreground">Active SOPs</div>
          </GlassCard>
          <GlassCard intensity="subtle" className="p-4 text-center">
            <div className="text-3xl font-bold text-foreground">{sops.length}</div>
            <div className="text-sm text-muted-foreground">Total Versions</div>
          </GlassCard>
          <GlassCard intensity="subtle" className="p-4 text-center">
            <div className="text-3xl font-bold text-foreground">
              {SOP_PHASES.length}
            </div>
            <div className="text-sm text-muted-foreground">Phases</div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
