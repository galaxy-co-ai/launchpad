"use client";

import { useState, useEffect } from "react";
import { getPhasePrompt } from "@/lib/ai/phase-prompts";
import { SOP_NAMES } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Bot,
  ChevronRight,
  X,
  Lightbulb,
  HelpCircle,
  Clock,
  Target,
  Sparkles,
  MessageSquare,
} from "lucide-react";

interface AIGuidanceProps {
  currentPhase: number;
  projectName: string;
  onStartChat?: () => void;
}

export function AIGuidance({ currentPhase, projectName, onStartChat }: AIGuidanceProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const phasePrompt = getPhasePrompt(currentPhase);
  const phaseName = SOP_NAMES[currentPhase] ?? `Phase ${currentPhase}`;

  // Auto-expand on phase change
  useEffect(() => {
    setIsExpanded(true);
    setIsDismissed(false);
  }, [currentPhase]);

  if (!phasePrompt || isDismissed) {
    return null;
  }

  return (
    <div className="normandy-panel border-[var(--normandy-cyan)]/30 shadow-[0_0_20px_var(--normandy-cyan-glow)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--normandy-border)]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--normandy-cyan-subtle)] border border-[var(--normandy-cyan)]/30">
            <Bot className="h-5 w-5 text-[var(--normandy-cyan)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="normandy-label text-[var(--normandy-cyan)]">AI CO-PILOT</span>
              <span className="normandy-badge normandy-badge-cyan text-[10px]">
                SOP-{String(currentPhase).padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs text-[var(--normandy-text-muted)]">
              {phaseName} Guidance for {projectName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded hover:bg-[var(--normandy-cyan-subtle)] text-[var(--normandy-text-muted)] hover:text-[var(--normandy-cyan)] transition-colors"
          >
            <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded hover:bg-[var(--normandy-cyan-subtle)] text-[var(--normandy-text-muted)] hover:text-[var(--normandy-danger)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Welcome Message */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--normandy-text-primary)]">
              <Sparkles className="h-4 w-4 text-[var(--normandy-cyan)]" />
              Current Focus
            </div>
            <p className="text-sm text-[var(--normandy-text-secondary)] leading-relaxed whitespace-pre-line">
              {phasePrompt.welcome}
            </p>
          </div>

          {/* Time Estimate */}
          <div className="flex items-center gap-2 text-xs text-[var(--normandy-text-muted)]">
            <Clock className="h-3.5 w-3.5" />
            Estimated time: {phasePrompt.timeEstimate}
          </div>

          {/* Key Questions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--normandy-text-primary)]">
              <Target className="h-4 w-4 text-[var(--normandy-orange)]" />
              Questions to Answer
            </div>
            <ul className="space-y-1.5">
              {phasePrompt.questions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--normandy-text-secondary)]">
                  <span className="text-[var(--normandy-cyan)] mt-0.5">•</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--normandy-text-primary)]">
              <Lightbulb className="h-4 w-4 text-[var(--normandy-warning)]" />
              Tips
            </div>
            <ul className="space-y-1.5">
              {phasePrompt.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[var(--normandy-text-muted)]">
                  <span className="text-[var(--normandy-warning)] mt-0.5">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          {onStartChat && (
            <button
              onClick={onStartChat}
              className="w-full normandy-btn normandy-btn-primary py-2.5 group"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat with AI about this phase
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      )}

      {/* Collapsed Preview */}
      {!isExpanded && (
        <div className="p-3 flex items-center gap-3">
          <div className="flex-1 text-sm text-[var(--normandy-text-secondary)] truncate">
            {phasePrompt.questions[0]}
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-xs text-[var(--normandy-cyan)] hover:underline"
          >
            Show guidance
          </button>
        </div>
      )}
    </div>
  );
}

// Compact version for sidebar or quick reference
export function AIGuidanceCompact({ currentPhase }: { currentPhase: number }) {
  const phasePrompt = getPhasePrompt(currentPhase);
  const phaseName = SOP_NAMES[currentPhase] ?? `Phase ${currentPhase}`;

  if (!phasePrompt) return null;

  return (
    <div className="p-3 rounded-lg bg-[var(--normandy-cyan-subtle)] border border-[var(--normandy-cyan)]/20">
      <div className="flex items-center gap-2 mb-2">
        <Bot className="h-4 w-4 text-[var(--normandy-cyan)]" />
        <span className="text-xs font-medium text-[var(--normandy-text-primary)]">
          {phaseName}
        </span>
      </div>
      <p className="text-xs text-[var(--normandy-text-muted)] line-clamp-2">
        {phasePrompt.questions[0]}
      </p>
    </div>
  );
}

// Stuck prompt component
export function StuckPrompt({ currentPhase, onDismiss }: { currentPhase: number; onDismiss: () => void }) {
  const phasePrompt = getPhasePrompt(currentPhase);

  if (!phasePrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm normandy-panel border-[var(--normandy-warning)]/30 shadow-[0_0_20px_var(--normandy-warning-glow)] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--normandy-warning)]/10 border border-[var(--normandy-warning)]/30">
            <HelpCircle className="h-4 w-4 text-[var(--normandy-warning)]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-[var(--normandy-text-primary)]">
                Need help?
              </span>
              <button
                onClick={onDismiss}
                className="p-1 rounded hover:bg-[var(--normandy-warning)]/10 text-[var(--normandy-text-muted)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-xs text-[var(--normandy-text-secondary)] whitespace-pre-line">
              {phasePrompt.stuck}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
