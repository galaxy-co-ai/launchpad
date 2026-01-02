"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { SOP_NAMES } from "@/lib/types";
import type { Project, RoadmapItem, ProjectAnalysis } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatContainer } from "@/components/chat/chat-container";
import { GlassCard, GlassAccentCard } from "@/design-system/primitives/glass";
import { open } from "@tauri-apps/plugin-shell";
import {
  ArrowLeft,
  Bot,
  RefreshCw,
  FolderOpen,
  Github,
  Loader2,
  Check,
  Circle,
  Play,
  ChevronRight,
  Sparkles,
  AlertCircle,
  MessageSquare,
  Map,
  Rocket,
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

  // Parse stored analysis
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

  // Calculate progress
  const completedItems = roadmap.filter((item) => item.status === "complete").length;
  const totalItems = roadmap.length;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  if (!slug) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">No project selected</p>
        <Button variant="outline" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Project not found</p>
        <Button variant="outline" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-black/10 dark:border-white/10 bg-background/80 px-6 py-4 backdrop-blur-xl">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] shadow-[0_4px_12px_rgba(0,0,0,0.25),0_0_20px_rgba(59,130,246,0.15)]">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{currentProject.name}</h1>
              <div className="mt-0.5 flex items-center gap-3 text-sm text-muted-foreground">
                {currentProject.local_path && (
                  <button
                    onClick={handleOpenFolder}
                    className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                  >
                    <FolderOpen className="h-4 w-4" />
                    Open Folder
                  </button>
                )}
                {currentProject.github_url && (
                  <a
                    href={currentProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={syncing}
            className="border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
          >
            <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
          </Button>
          {currentProject.local_path && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyze}
              disabled={analyzing}
              className="border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
            >
              {analyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Bot className="mr-2 h-4 w-4" />
              )}
              Analyze
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="roadmap" className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-black/10 dark:border-white/10 px-6">
          <TabsList className="h-10 bg-transparent p-0">
            <TabsTrigger
              value="roadmap"
              className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-orange-500 data-[state=active]:text-orange-500 dark:data-[state=active]:text-orange-400 data-[state=active]:shadow-none"
            >
              <Map className="mr-2 h-4 w-4" />
              Roadmap
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-orange-500 data-[state=active]:text-orange-500 dark:data-[state=active]:text-orange-400 data-[state=active]:shadow-none"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="roadmap" className="flex-1 overflow-y-auto mt-0">
          <div className="mx-auto max-w-4xl p-6">
            {/* Progress & Status */}
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              {/* Progress Card */}
              <GlassCard intensity="subtle">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Overall Progress
                </p>
                <div className="flex items-end gap-4">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
                    {progressPercent}%
                  </div>
                  <div className="pb-1 text-sm text-muted-foreground">
                    {completedItems} of {totalItems} SOPs complete
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </GlassCard>

              {/* Analysis Card */}
              <GlassAccentCard>
                <p className="text-sm font-medium text-blue-300 mb-3">
                  AI Analysis
                </p>
                {analysis ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {analysis.tech_stack.map((tech) => (
                        <Badge key={tech} className="bg-blue-500/30 text-blue-200 border-blue-500/50 text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {analysis.frameworks.map((fw) => (
                        <Badge key={fw} variant="outline" className="border-blue-500/30 text-blue-300 text-xs">
                          {fw}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-blue-200/70">
                      {analysis.file_count} files | Phase: {analysis.sop_progress.phase_name}
                    </p>
                    {currentProject.last_analyzed && (
                      <p className="text-xs text-blue-300/50">
                        Last analyzed:{" "}
                        {new Date(currentProject.last_analyzed).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-blue-200/70">
                    <Sparkles className="h-4 w-4 text-blue-400" />
                    {currentProject.local_path
                      ? "Click Analyze to scan project"
                      : "Add a local path to enable analysis"}
                  </div>
                )}
              </GlassAccentCard>
            </div>

            {/* Recommendations */}
            {analysis && analysis.recommendations.length > 0 && (
              <GlassCard intensity="subtle" className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground">Recommendations</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}

            {/* Roadmap */}
            <GlassCard intensity="subtle">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">SOP Roadmap</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Track your progress through the 13 SOPs from idea to revenue
                </p>
              </div>
              {roadmapLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-2">
                  {roadmap.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleRoadmapItemClick(item)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all",
                        item.status === "complete"
                          ? "border-green-500/30 bg-green-500/10 hover:bg-green-500/15"
                          : item.status === "in_progress"
                          ? "border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/15"
                          : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-lg",
                          item.status === "complete"
                            ? "bg-green-500 text-white shadow-green-500/25"
                            : item.status === "in_progress"
                            ? "bg-blue-500 text-white shadow-blue-500/25"
                            : "border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5"
                        )}
                      >
                        {item.status === "complete" ? (
                          <Check className="h-4 w-4" />
                        ) : item.status === "in_progress" ? (
                          <Play className="h-3 w-3" />
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {item.sop_number.toString().padStart(2, "0")}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            SOP-{item.sop_number.toString().padStart(2, "0")}
                          </span>
                          <span className="font-medium text-foreground">{item.sop_name}</span>
                        </div>
                        {item.ai_notes && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.ai_notes}
                          </p>
                        )}
                      </div>
                      <Badge
                        className={cn(
                          "capitalize",
                          item.status === "complete" && "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
                          item.status === "in_progress" && "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
                          item.status === "pending" && "bg-black/10 dark:bg-white/10 text-muted-foreground border-black/10 dark:border-white/10"
                        )}
                      >
                        {item.status === "in_progress" ? "In Progress" : item.status}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="flex-1 overflow-hidden mt-0">
          <ChatContainer
            projectId={currentProject.id}
            projectName={currentProject.name}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
