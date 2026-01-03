"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import type { Idea, WorkflowContext, VaultArtifact } from "@/lib/types";
import { WorkflowProgress, WorkflowProgressCompact } from "./WorkflowProgress";
import { SOPChecklist } from "./SOPChecklist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MessageSquare,
  FileText,
  ExternalLink,
  Play,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  User,
  Target,
  DollarSign,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

interface IdeaDetailProps {
  idea: Idea;
  workflowContext: WorkflowContext | null;
  onBack?: () => void;
  onContinueWorkflow?: () => void;
  className?: string;
}

export function IdeaDetail({
  idea,
  workflowContext,
  onBack,
  onContinueWorkflow,
  className,
}: IdeaDetailProps) {
  const { startWorkflow, setActiveIdea } = useAppStore();
  const [starting, setStarting] = useState(false);

  const handleStartWorkflow = async () => {
    setStarting(true);
    try {
      await startWorkflow(idea.id);
      setActiveIdea(idea.id);
      onContinueWorkflow?.();
    } catch (error) {
      console.error("Failed to start workflow:", error);
    } finally {
      setStarting(false);
    }
  };

  const workflow = workflowContext?.workflow;
  const artifacts = workflowContext?.artifacts ?? [];
  const stepData = workflowContext?.step_data_parsed ?? {};

  // Parse audit result if available
  let auditData: { score?: number; recommendation?: string; pros?: string[]; cons?: string[] } | null = null;
  if (idea.audit_result) {
    try {
      auditData = JSON.parse(idea.audit_result);
    } catch {
      // Invalid JSON, ignore
    }
  }

  const getDecisionBadge = () => {
    const decision = workflow?.decision;
    if (!decision) return null;

    const config = {
      green: { icon: CheckCircle, color: "bg-green-500/20 text-green-400", label: "Validated" },
      yellow: { icon: AlertCircle, color: "bg-yellow-500/20 text-yellow-400", label: "Needs Work" },
      red: { icon: XCircle, color: "bg-red-500/20 text-red-400", label: "Not Viable" },
    }[decision];

    if (!config) return null;
    const Icon = config.icon;

    return (
      <Badge className={cn("gap-1", config.color)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-start gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="mt-1 rounded-md p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{idea.name}</h1>
              <Badge
                className={cn(
                  idea.status === "active" && "bg-green-500/20 text-green-400",
                  idea.status === "audited" && "bg-blue-500/20 text-blue-400",
                  idea.status === "pending" && "bg-yellow-500/20 text-yellow-400",
                  idea.status === "archived" && "bg-gray-500/20 text-gray-400"
                )}
              >
                {idea.status}
              </Badge>
              {getDecisionBadge()}
            </div>

            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(idea.created_at).toLocaleDateString()}
              </span>
              {idea.source && (
                <span className="flex items-center gap-1">
                  <Lightbulb className="h-3.5 w-3.5" />
                  {idea.source}
                </span>
              )}
              {workflow && (
                <span className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  SOP-{workflow.current_sop.toString().padStart(2, "0")}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {workflow ? (
              <Button
                onClick={onContinueWorkflow}
                className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
              >
                <MessageSquare className="h-4 w-4" />
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleStartWorkflow}
                disabled={starting}
                className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
              >
                <Play className="h-4 w-4" />
                {starting ? "Starting..." : "Start Workflow"}
              </Button>
            )}
          </div>
        </div>

        {/* Workflow progress bar */}
        {workflow && (
          <div className="mt-4">
            <WorkflowProgress currentSop={workflow.current_sop} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Problem Statement */}
            {idea.problem_statement && (
              <section>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Problem Statement
                </h2>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-sm leading-relaxed">{idea.problem_statement}</p>
                </div>
              </section>
            )}

            {/* Proposed Solution */}
            {idea.proposed_solution && (
              <section>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <Lightbulb className="h-4 w-4" />
                  Proposed Solution
                </h2>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-sm leading-relaxed">{idea.proposed_solution}</p>
                </div>
              </section>
            )}

            {/* Validation Score */}
            {workflow?.validation_score !== null && workflow?.validation_score !== undefined && (
              <section>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <Target className="h-4 w-4" />
                  Validation Score
                </h2>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold",
                        workflow.decision === "green" && "bg-green-500/20 text-green-400",
                        workflow.decision === "yellow" && "bg-yellow-500/20 text-yellow-400",
                        workflow.decision === "red" && "bg-red-500/20 text-red-400"
                      )}
                    >
                      {workflow.validation_score}
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">out of 125 points</div>
                      <div className="mt-1 text-sm">
                        {workflow.decision === "green" && "🟢 GREEN LIGHT - Proceed to scope"}
                        {workflow.decision === "yellow" && "🟡 YELLOW - Needs more research"}
                        {workflow.decision === "red" && "🔴 RED - Not viable"}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Collected Data */}
            {Object.keys(stepData).length > 0 && (
              <section>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Collected Data
                </h2>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <pre className="overflow-x-auto text-xs text-muted-foreground">
                    {JSON.stringify(stepData, null, 2)}
                  </pre>
                </div>
              </section>
            )}

            {/* Audit Result */}
            {auditData && (
              <section>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  AI Audit
                </h2>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
                  {auditData.score && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <span className="font-bold">{auditData.score}/10</span>
                    </div>
                  )}
                  {auditData.pros && auditData.pros.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-green-400 mb-1">Pros:</div>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {auditData.pros.map((pro: string, i: number) => (
                          <li key={i}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {auditData.cons && auditData.cons.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-red-400 mb-1">Cons:</div>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {auditData.cons.map((con: string, i: number) => (
                          <li key={i}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Progress */}
            {workflowContext && (
              <WorkflowProgressCompact
                currentSop={workflowContext.progress_summary.current_sop_number}
                sopName={workflowContext.progress_summary.current_sop_name}
                stepsCompleted={workflowContext.progress_summary.steps_completed}
                phase={workflowContext.progress_summary.phase}
              />
            )}

            {/* Next Action */}
            {workflowContext?.next_action && (
              <section>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Next Action
                </h2>
                <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                  <p className="text-sm text-orange-300">{workflowContext.next_action}</p>
                </div>
              </section>
            )}

            {/* Generated Artifacts */}
            {artifacts.length > 0 && (
              <section>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Artifacts
                </h2>
                <div className="space-y-2">
                  {artifacts.map((artifact) => (
                    <div
                      key={artifact.id}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium capitalize">
                          {artifact.artifact_type}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {artifact.file_path.split("/").pop()}
                        </div>
                      </div>
                      <button
                        className="rounded p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                        title="Open file"
                        aria-label="Open file"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Quick Stats */}
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Info
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                </div>
                {idea.audited_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Audited</span>
                    <span>{new Date(idea.audited_at).toLocaleDateString()}</span>
                  </div>
                )}
                {idea.activated_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Activated</span>
                    <span>{new Date(idea.activated_at).toLocaleDateString()}</span>
                  </div>
                )}
                {workflowContext && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>{new Date(workflowContext.workflow.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

