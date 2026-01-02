"use client";

import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useAppStore } from "@/lib/store";
import type { IdeaAuditResult, CreateIdeaInput } from "@/lib/types";
import {
  GlassDialog,
  GlassDialogTrigger,
  GlassDialogContent,
  GlassDialogHeader,
  GlassDialogTitle,
  GlassDialogDescription,
  GlassDialogFooter,
} from "@/design-system/primitives/glass";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Lightbulb,
  Sparkles,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IdeaSubmissionProps {
  trigger?: React.ReactNode;
  onSubmit?: (ideaId: string) => void;
}

export function IdeaSubmission({ trigger, onSubmit }: IdeaSubmissionProps) {
  const { createIdea, saveIdeaAudit, settings } = useAppStore();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"input" | "auditing" | "result">("input");

  // Form state
  const [name, setName] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [source, setSource] = useState("");

  // Audit state
  const [auditResult, setAuditResult] = useState<IdeaAuditResult | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [createdIdeaId, setCreatedIdeaId] = useState<string | null>(null);

  const resetForm = () => {
    setStep("input");
    setName("");
    setProblemStatement("");
    setProposedSolution("");
    setSource("");
    setAuditResult(null);
    setAuditError(null);
    setCreatedIdeaId(null);
  };

  const handleAudit = async () => {
    if (!settings.anthropic_api_key) {
      setAuditError("Please configure your Anthropic API key in Settings.");
      return;
    }

    if (!name.trim()) {
      setAuditError("Please enter an idea name.");
      return;
    }

    setStep("auditing");
    setAuditError(null);

    try {
      // First create the idea in pending status
      const input: CreateIdeaInput = {
        name: name.trim(),
        problem_statement: problemStatement.trim() || undefined,
        proposed_solution: proposedSolution.trim() || undefined,
        source: source.trim() || undefined,
      };

      const idea = await createIdea(input);
      setCreatedIdeaId(idea.id);

      // Now perform AI audit
      const auditPrompt = `You are a startup idea analyst. Evaluate this Micro-SaaS idea objectively.

IDEA: ${name}
${problemStatement ? `PROBLEM: ${problemStatement}` : ""}
${proposedSolution ? `SOLUTION: ${proposedSolution}` : ""}
${source ? `SOURCE/INSPIRATION: ${source}` : ""}

Analyze this idea and respond with ONLY a valid JSON object (no markdown, no explanation outside JSON):

{
  "pros": ["strength 1", "strength 2", "strength 3"],
  "cons": ["weakness 1", "weakness 2", "weakness 3"],
  "score": <number 1-10>,
  "recommendation": "<one of: proceed | revise | reject>",
  "reasoning": "<2-3 sentences explaining the score and recommendation>"
}

Scoring guide:
- 8-10: Strong idea with clear market need and feasible execution
- 5-7: Decent idea but needs refinement or has notable risks
- 1-4: Weak idea with fundamental issues or saturated market`;

      const response = await invoke<string>("send_chat_message", {
        apiKey: settings.anthropic_api_key,
        messages: [{ role: "user", content: auditPrompt }],
        systemPrompt: "You are a JSON-only API. Return only valid JSON objects, no markdown formatting.",
        projectPath: null,
      });

      // Parse the response - handle potential markdown code blocks
      let jsonStr = response.trim();
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/```json?\s*/, "").replace(/```\s*$/, "");
      }

      const result: IdeaAuditResult = JSON.parse(jsonStr);

      // Validate the result structure
      if (!result.pros || !result.cons || typeof result.score !== "number" || !result.recommendation) {
        throw new Error("Invalid audit response format");
      }

      setAuditResult(result);

      // Save the audit result to the idea
      await saveIdeaAudit(idea.id, JSON.stringify(result));

      setStep("result");
    } catch (err) {
      console.error("Audit failed:", err);
      setAuditError(err instanceof Error ? err.message : "Failed to audit idea. Please try again.");
      setStep("input");
    }
  };

  const handleSave = () => {
    if (createdIdeaId && onSubmit) {
      onSubmit(createdIdeaId);
    }
    setOpen(false);
    resetForm();
  };

  const handleDiscard = async () => {
    // If we created an idea but user wants to discard, we could delete it
    // For now, just close and reset
    setOpen(false);
    resetForm();
  };

  const getRecommendationStyles = (rec: string) => {
    switch (rec) {
      case "proceed":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          text: "text-green-400",
          icon: CheckCircle,
          label: "Proceed",
        };
      case "revise":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          text: "text-amber-400",
          icon: AlertCircle,
          label: "Revise",
        };
      case "reject":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          text: "text-red-400",
          icon: XCircle,
          label: "Reject",
        };
      default:
        return {
          bg: "bg-zinc-500/10",
          border: "border-zinc-500/30",
          text: "text-zinc-400",
          icon: AlertCircle,
          label: rec,
        };
    }
  };

  return (
    <GlassDialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
      <GlassDialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_12px_rgba(249,115,22,0.25)]">
            <Lightbulb className="h-4 w-4" />
            Submit Idea
          </Button>
        )}
      </GlassDialogTrigger>
      <GlassDialogContent intensity="heavy" className="max-w-xl">
        <GlassDialogHeader>
          <GlassDialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] shadow-[0_0_12px_rgba(249,115,22,0.25)]">
              <Lightbulb className="h-4 w-4 text-orange-400" />
            </div>
            {step === "input" && "Submit New Idea"}
            {step === "auditing" && "Auditing Idea..."}
            {step === "result" && "Audit Results"}
          </GlassDialogTitle>
          <GlassDialogDescription>
            {step === "input" && "Describe your idea and let AI evaluate its potential."}
            {step === "auditing" && "Claude is analyzing your idea against market factors..."}
            {step === "result" && "Review the AI assessment and decide how to proceed."}
          </GlassDialogDescription>
        </GlassDialogHeader>

        {/* Input Step */}
        {step === "input" && (
          <div className="mt-4 space-y-4">
            {auditError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {auditError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="idea-name">Idea Name *</Label>
              <Input
                id="idea-name"
                placeholder="e.g., Invoice Reminder SaaS"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-900/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problem">Problem Statement</Label>
              <Textarea
                id="problem"
                placeholder="What problem does this solve? Who has this pain?"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="min-h-[80px] bg-zinc-900/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution">Proposed Solution</Label>
              <Textarea
                id="solution"
                placeholder="How will you solve this? What's the core feature?"
                value={proposedSolution}
                onChange={(e) => setProposedSolution(e.target.value)}
                className="min-h-[80px] bg-zinc-900/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source / Inspiration</Label>
              <Input
                id="source"
                placeholder="e.g., Reddit thread, personal experience, competitor gap"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="bg-zinc-900/50"
              />
            </div>

            <GlassDialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAudit}
                className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
                disabled={!name.trim()}
              >
                <Sparkles className="h-4 w-4" />
                Audit with AI
              </Button>
            </GlassDialogFooter>
          </div>
        )}

        {/* Auditing Step */}
        {step === "auditing" && (
          <div className="mt-8 flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-orange-500/20" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Analyzing market potential, competition, and feasibility...
            </p>
          </div>
        )}

        {/* Result Step */}
        {step === "result" && auditResult && (
          <div className="mt-4 space-y-4">
            {/* Score and Recommendation */}
            <div className="flex items-center justify-between">
              {/* Score */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-bold",
                    auditResult.score >= 8
                      ? "bg-green-500/20 text-green-400"
                      : auditResult.score >= 5
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-red-500/20 text-red-400"
                  )}
                >
                  {auditResult.score}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Score</p>
                  <p className="font-medium">out of 10</p>
                </div>
              </div>

              {/* Recommendation Badge */}
              {(() => {
                const styles = getRecommendationStyles(auditResult.recommendation);
                const Icon = styles.icon;
                return (
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-4 py-2",
                      styles.bg,
                      styles.border
                    )}
                  >
                    <Icon className={cn("h-5 w-5", styles.text)} />
                    <span className={cn("font-semibold", styles.text)}>
                      {styles.label}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Reasoning */}
            <div className="rounded-lg border border-white/10 bg-zinc-900/50 p-4">
              <p className="text-sm leading-relaxed text-foreground/80">
                {auditResult.reasoning}
              </p>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-2 gap-4">
              {/* Pros */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-400">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Strengths</span>
                </div>
                <ul className="space-y-1.5">
                  {auditResult.pros.map((pro, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground/70"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-400">
                  <ThumbsDown className="h-4 w-4" />
                  <span className="text-sm font-medium">Weaknesses</span>
                </div>
                <ul className="space-y-1.5">
                  {auditResult.cons.map((con, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground/70"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <GlassDialogFooter className="gap-2">
              <Button
                variant="ghost"
                onClick={() => setStep("input")}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Edit & Re-audit
              </Button>
              <Button variant="outline" onClick={handleDiscard}>
                Discard
              </Button>
              <Button
                onClick={handleSave}
                className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Save className="h-4 w-4" />
                Save Idea
              </Button>
            </GlassDialogFooter>
          </div>
        )}
      </GlassDialogContent>
    </GlassDialog>
  );
}
