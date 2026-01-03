"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { IdeaPipeline, IdeaDetail } from "@/components/workflow";
import type { Idea, WorkflowContext, WorkflowProgress } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Lightbulb,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  MessageSquare,
  Filter,
} from "lucide-react";
import Link from "next/link";

interface IdeaWithWorkflow extends Idea {
  workflow?: WorkflowProgress | null;
}

function IdeasPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    ideas,
    ideasLoading,
    fetchIdeas,
    deleteIdea,
    startWorkflow,
    getWorkflowState,
    fetchWorkflowContext,
    setActiveIdea,
  } = useAppStore();

  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(
    searchParams.get("id")
  );
  const [selectedIdeaContext, setSelectedIdeaContext] = useState<WorkflowContext | null>(null);
  const [ideasWithWorkflow, setIdeasWithWorkflow] = useState<IdeaWithWorkflow[]>([]);
  const [view, setView] = useState<"pipeline" | "list">("pipeline");
  const [loading, setLoading] = useState(true);

  // Fetch ideas and their workflows
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchIdeas();
      setLoading(false);
    };
    loadData();
  }, [fetchIdeas]);

  // Load workflow states for all ideas
  useEffect(() => {
    const loadWorkflows = async () => {
      const enriched: IdeaWithWorkflow[] = await Promise.all(
        ideas.map(async (idea) => {
          const workflow = await getWorkflowState(idea.id);
          return { ...idea, workflow };
        })
      );
      setIdeasWithWorkflow(enriched);
    };

    if (ideas.length > 0) {
      loadWorkflows();
    } else {
      setIdeasWithWorkflow([]);
    }
  }, [ideas, getWorkflowState]);

  // Load selected idea context
  useEffect(() => {
    const loadContext = async () => {
      if (selectedIdeaId) {
        const context = await fetchWorkflowContext(selectedIdeaId);
        setSelectedIdeaContext(context);
      } else {
        setSelectedIdeaContext(null);
      }
    };
    loadContext();
  }, [selectedIdeaId, fetchWorkflowContext]);

  const handleIdeaClick = (idea: Idea) => {
    setSelectedIdeaId(idea.id);
    router.push(`/ideas?id=${idea.id}`);
  };

  const handleBack = () => {
    setSelectedIdeaId(null);
    setSelectedIdeaContext(null);
    router.push("/ideas");
  };

  const handleContinueWorkflow = () => {
    if (selectedIdeaId) {
      setActiveIdea(selectedIdeaId);
      router.push("/");
    }
  };

  const handleStartWorkflow = async (ideaId: string) => {
    await startWorkflow(ideaId);
    // Refresh the idea's workflow
    const workflow = await getWorkflowState(ideaId);
    setIdeasWithWorkflow((prev) =>
      prev.map((idea) => (idea.id === ideaId ? { ...idea, workflow } : idea))
    );
  };

  const handleDeleteIdea = async (ideaId: string) => {
    await deleteIdea(ideaId);
    if (selectedIdeaId === ideaId) {
      handleBack();
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchIdeas();
    setLoading(false);
  };

  // Show detail view if an idea is selected
  if (selectedIdeaId) {
    const selectedIdea = ideas.find((i) => i.id === selectedIdeaId);
    if (selectedIdea) {
      return (
        <IdeaDetail
          idea={selectedIdea}
          workflowContext={selectedIdeaContext}
          onBack={handleBack}
          onContinueWorkflow={handleContinueWorkflow}
        />
      );
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Ideas Pipeline</h1>
              <p className="text-sm text-muted-foreground">
                {ideas.length} idea{ideas.length !== 1 ? "s" : ""} in pipeline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex rounded-lg border border-white/10 p-0.5">
              <button
                onClick={() => setView("pipeline")}
                className={`rounded-md p-2 transition-colors ${
                  view === "pipeline"
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Pipeline view"
                aria-label="Pipeline view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`rounded-md p-2 transition-colors ${
                  view === "list"
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="List view"
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Refresh */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              aria-label="Refresh ideas"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>

            {/* New idea */}
            <Link href="/?new-idea=true">
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
              >
                <Plus className="h-4 w-4" />
                New Idea
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-4">
        {loading || ideasLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Loading ideas...</p>
            </div>
          </div>
        ) : ideas.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
              <Lightbulb className="mx-auto h-12 w-12 text-amber-400" />
              <h3 className="mt-4 text-lg font-semibold">No ideas yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start by capturing your first idea
              </p>
              <Link href="/?new-idea=true" className="mt-4 inline-block">
                <Button className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600">
                  <Plus className="h-4 w-4" />
                  Capture Idea
                </Button>
              </Link>
            </div>
          </div>
        ) : view === "pipeline" ? (
          <IdeaPipeline
            ideas={ideasWithWorkflow}
            onIdeaClick={handleIdeaClick}
            onStartWorkflow={handleStartWorkflow}
            onDeleteIdea={handleDeleteIdea}
            className="h-full"
          />
        ) : (
          <IdeasListView
            ideas={ideasWithWorkflow}
            onIdeaClick={handleIdeaClick}
            onStartWorkflow={handleStartWorkflow}
            onDeleteIdea={handleDeleteIdea}
          />
        )}
      </div>
    </div>
  );
}

interface IdeasListViewProps {
  ideas: IdeaWithWorkflow[];
  onIdeaClick: (idea: Idea) => void;
  onStartWorkflow: (ideaId: string) => void;
  onDeleteIdea: (ideaId: string) => void;
}

function IdeasListView({
  ideas,
  onIdeaClick,
  onStartWorkflow,
  onDeleteIdea,
}: IdeasListViewProps) {
  return (
    <div className="space-y-2">
      {ideas.map((idea) => (
        <div
          key={idea.id}
          className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
        >
          <button
            onClick={() => onIdeaClick(idea)}
            className="flex-1 text-left"
            aria-label={`View ${idea.name}`}
          >
            <div className="flex items-center gap-3">
              <div className="font-medium">{idea.name}</div>
              <span
                className={`rounded-md px-2 py-0.5 text-xs capitalize ${
                  idea.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : idea.status === "audited"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-white/10 text-muted-foreground"
                }`}
              >
                {idea.status}
              </span>
              {idea.workflow && (
                <span className="rounded-md bg-orange-500/20 px-2 py-0.5 text-xs text-orange-400">
                  SOP-{idea.workflow.current_sop.toString().padStart(2, "0")}
                </span>
              )}
            </div>
            {idea.problem_statement && (
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                {idea.problem_statement}
              </p>
            )}
          </button>

          <div className="flex items-center gap-2">
            {idea.workflow ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  onIdeaClick(idea);
                }}
                className="gap-1"
              >
                <MessageSquare className="h-4 w-4" />
                Continue
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onStartWorkflow(idea.id)}
                className="gap-1"
              >
                <Lightbulb className="h-4 w-4" />
                Start
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function IdeasPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <IdeasPageContent />
    </Suspense>
  );
}

