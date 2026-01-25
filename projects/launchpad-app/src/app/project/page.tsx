"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import type { RoadmapItem, ProjectAnalysis } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatContainer } from "@/components/chat/chat-container";
import { AIGuidance } from "@/components/ai-guidance";
import ErrorBoundary from "@/components/error-boundary";
import { open } from "@tauri-apps/plugin-shell";
import {
  ArrowLeft,
  RefreshCw,
  FolderOpen,
  Github,
  Loader2,
  Check,
  Play,
  ChevronRight,
  Sparkles,
  AlertCircle,
  MessageSquare,
  Rocket,
  Target,
  Shield,
  Cpu,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("slug") || "";

  const {
    getProject,
    currentProject,
    fetchRoadmap,
    roadmap,
    roadmapLoading,
    updateRoadmapItem,
    analyzeProject,
    saveAnalysis,
    currentAnalysis,
    analyzing,
  } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState("roadmap");

  useEffect(() => {
    const loadProject = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const project = await getProject(slug);
      if (project) {
        await fetchRoadmap(project.id);
      }
      setLoading(false);
    };
    loadProject();
  }, [slug, getProject, fetchRoadmap]);

  const analysis: ProjectAnalysis | null = currentProject?.status_report
    ? JSON.parse(currentProject.status_report)
    : currentAnalysis;

  const handleSync = async () => {
    if (!currentProject) return;
    setSyncing(true);
    await fetchRoadmap(currentProject.id);
    setSyncing(false);
  };

  const handleOpenFolder = async () => {
    if (currentProject?.local_path) {
      try {
        await open(currentProject.local_path);
      } catch (err) {
        console.error("Failed to open folder:", err);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!currentProject?.local_path) return;
    try {
      const result = await analyzeProject(currentProject.local_path);
      await saveAnalysis(currentProject.id, result);
    } catch (err) {
      console.error("Failed to analyze project:", err);
    }
  };

  const handleRoadmapItemClick = async (item: RoadmapItem) => {
    const nextStatus =
      item.status === "pending"
        ? "in_progress"
        : item.status === "in_progress"
        ? "complete"
        : "pending";
    await updateRoadmapItem(item.id, nextStatus);
  };

  const completedItems = roadmap.filter((item) => item.status === "complete").length;
  const totalItems = roadmap.length;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  if (!slug) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-[var(--normandy-void)]">
        <AlertCircle className="h-12 w-12 text-[var(--normandy-warning)]" />
        <p className="text-[var(--normandy-text-muted)]">No mission selected</p>
        <button onClick={() => router.push("/")} className="normandy-btn">
          Return to Command
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--normandy-void)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--normandy-cyan)]" />
          <span className="text-xs uppercase tracking-wider text-[var(--normandy-text-muted)]">
            Loading Mission Data
          </span>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-[var(--normandy-void)]">
        <AlertCircle className="h-12 w-12 text-[var(--normandy-danger)]" />
        <p className="text-[var(--normandy-text-muted)]">Mission not found</p>
        <button onClick={() => router.push("/")} className="normandy-btn">
          Return to Command
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[var(--normandy-void)]">
      {/* Header - Mission Briefing Bar */}
      <div className="flex items-start justify-between border-b border-[var(--normandy-border)] bg-[var(--normandy-hull)] px-6 py-4">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-2 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[var(--normandy-text-muted)] hover:text-[var(--normandy-cyan)] transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </button>
          <div className="flex items-center gap-4">
            {/* Mission Icon */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-[var(--normandy-orange)] opacity-15" />
              <div className="absolute inset-0 rounded-lg border-2 border-[var(--normandy-orange)] opacity-50" />
              <Rocket className="relative h-6 w-6 text-[var(--normandy-orange)]" />
            </div>
            <div>
              <h1 className="normandy-heading text-xl tracking-wide">{currentProject.name.toUpperCase()}</h1>
              <div className="mt-1 flex items-center gap-4 text-xs text-[var(--normandy-text-muted)]">
                {currentProject.local_path && (
                  <button
                    onClick={handleOpenFolder}
                    className="flex items-center gap-1 hover:text-[var(--normandy-cyan)] transition-colors"
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    <span className="uppercase tracking-wider">Open</span>
                  </button>
                )}
                {currentProject.github_url && (
                  <a
                    href={currentProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-[var(--normandy-cyan)] transition-colors"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span className="uppercase tracking-wider">GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="normandy-btn flex items-center gap-2 px-3 py-2 text-xs"
          >
            <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
            <span className="hidden sm:inline">Sync</span>
          </button>
          {currentProject.local_path && (
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="normandy-btn normandy-btn-primary flex items-center gap-2 px-3 py-2 text-xs"
            >
              {analyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Cpu className="h-4 w-4" />
              )}
              <span>Analyze</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-[var(--normandy-border)] bg-[var(--normandy-hull)] px-6">
          <TabsList className="h-10 bg-transparent p-0 gap-1">
            <TabsTrigger
              value="roadmap"
              className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 text-xs font-medium uppercase tracking-wider text-[var(--normandy-text-muted)] transition-all data-[state=active]:border-b-[var(--normandy-orange)] data-[state=active]:text-[var(--normandy-orange)]"
            >
              <Target className="mr-2 h-4 w-4" />
              Objectives
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 text-xs font-medium uppercase tracking-wider text-[var(--normandy-text-muted)] transition-all data-[state=active]:border-b-[var(--normandy-orange)] data-[state=active]:text-[var(--normandy-orange)]"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Comms
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="roadmap" className="flex-1 overflow-y-auto mt-0 normandy-scroll">
          <div className="mx-auto max-w-4xl p-6">
            {/* Mission Status Cards */}
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              {/* Progress Card */}
              <div className="normandy-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="h-4 w-4 text-[var(--normandy-cyan)]" />
                  <span className="normandy-label">Mission Progress</span>
                </div>
                <div className="flex items-end gap-4">
                  <div className="normandy-value text-4xl">
                    {progressPercent}%
                  </div>
                  <div className="pb-1 text-sm text-[var(--normandy-text-secondary)]">
                    {completedItems} of {totalItems} objectives
                  </div>
                </div>
                <div className="normandy-progress mt-4">
                  <div
                    className="normandy-progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Intel Card */}
              <div className="normandy-card-action p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="h-4 w-4 text-[var(--normandy-orange)]" />
                  <span className="normandy-label text-[var(--normandy-orange)]">Intel Report</span>
                </div>
                {analysis ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.tech_stack.map((tech) => (
                        <span key={tech} className="normandy-badge normandy-badge-orange text-[10px]">
                          {tech}
                        </span>
                      ))}
                      {analysis.frameworks.map((fw) => (
                        <span key={fw} className="normandy-badge normandy-badge-cyan text-[10px]">
                          {fw}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-[var(--normandy-text-secondary)]">
                      <span className="normandy-mono text-[var(--normandy-cyan)]">{analysis.file_count}</span> files | Phase: {analysis.sop_progress.phase_name}
                    </p>
                    {currentProject.last_analyzed && (
                      <p className="text-[10px] text-[var(--normandy-text-muted)]">
                        Last scan: {new Date(currentProject.last_analyzed).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-[var(--normandy-text-muted)]">
                    <Shield className="h-4 w-4" />
                    {currentProject.local_path
                      ? "Run analysis to gather intel"
                      : "Add local path to enable scanning"}
                  </div>
                )}
              </div>
            </div>

            {/* AI Guidance */}
            <AIGuidance
              currentPhase={currentProject.current_phase}
              projectName={currentProject.name}
              onStartChat={() => setActiveTab("chat")}
            />

            {/* Recommendations */}
            {analysis && analysis.recommendations.length > 0 && (
              <div className="normandy-panel p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-[var(--normandy-warning)]" />
                  <span className="normandy-label text-[var(--normandy-warning)]">Tactical Recommendations</span>
                </div>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--normandy-text-primary)]">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--normandy-orange)]" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* SOP Roadmap */}
            <div className="normandy-panel p-5">
              <div className="mb-4">
                <h3 className="normandy-heading text-lg">Mission Objectives</h3>
                <p className="text-xs text-[var(--normandy-text-muted)] mt-1 uppercase tracking-wider">
                  13 SOPs from ideation to revenue
                </p>
              </div>
              <div className="normandy-divider mb-4" />
              {roadmapLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[var(--normandy-cyan)]" />
                </div>
              ) : (
                <div className="space-y-2">
                  {roadmap.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleRoadmapItemClick(item)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded p-3 text-left transition-all border",
                        item.status === "complete"
                          ? "border-[var(--normandy-success)] border-opacity-30 bg-[rgba(0,255,136,0.08)] hover:bg-[rgba(0,255,136,0.12)]"
                          : item.status === "in_progress"
                          ? "border-[var(--normandy-cyan)] border-opacity-30 bg-[var(--normandy-cyan-subtle)] hover:bg-[rgba(0,212,255,0.15)]"
                          : "border-[var(--normandy-border)] hover:border-[var(--normandy-cyan)] hover:border-opacity-30 hover:bg-[var(--normandy-cyan-subtle)]"
                      )}
                    >
                      {/* Status Icon */}
                      <div
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded",
                          item.status === "complete"
                            ? "bg-[var(--normandy-success)] bg-opacity-20 border border-[var(--normandy-success)] border-opacity-50"
                            : item.status === "in_progress"
                            ? "bg-[var(--normandy-cyan)] bg-opacity-20 border border-[var(--normandy-cyan)] border-opacity-50"
                            : "border border-[var(--normandy-border)] bg-[var(--normandy-surface)]"
                        )}
                      >
                        {item.status === "complete" ? (
                          <Check className="h-4 w-4 text-[var(--normandy-success)]" />
                        ) : item.status === "in_progress" ? (
                          <Play className="h-3 w-3 text-[var(--normandy-cyan)]" />
                        ) : (
                          <span className="text-[10px] normandy-mono text-[var(--normandy-text-muted)]">
                            {item.sop_number.toString().padStart(2, "0")}
                          </span>
                        )}
                      </div>
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] normandy-mono text-[var(--normandy-text-muted)]">
                            SOP-{item.sop_number.toString().padStart(2, "0")}
                          </span>
                          <span className="text-sm font-medium text-[var(--normandy-text-primary)]">
                            {item.sop_name}
                          </span>
                        </div>
                        {item.ai_notes && (
                          <p className="mt-1 text-xs text-[var(--normandy-text-muted)]">
                            {item.ai_notes}
                          </p>
                        )}
                      </div>
                      {/* Status Badge */}
                      <span
                        className={cn(
                          "normandy-badge text-[10px]",
                          item.status === "complete" && "normandy-badge-success",
                          item.status === "in_progress" && "normandy-badge-cyan",
                          item.status === "pending" && "bg-[var(--normandy-surface)] border-[var(--normandy-border)] text-[var(--normandy-text-muted)]"
                        )}
                      >
                        {item.status === "in_progress" ? "Active" : item.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="flex-1 overflow-hidden mt-0">
          <ErrorBoundary boundaryName="Project Chat">
            <ChatContainer
              projectId={currentProject.id}
              projectName={currentProject.name}
            />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
}
