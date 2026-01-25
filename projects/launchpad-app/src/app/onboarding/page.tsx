"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { getTopIdeas, CATEGORY_NAMES, type ValidatedIdea } from "@/data/validated-ideas";
import { SHOT_CLOCK_DEFAULTS } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Rocket,
  ChevronRight,
  Sparkles,
  Lightbulb,
  FolderPlus,
  Zap,
  Clock,
  Target,
  Check,
  ArrowRight,
} from "lucide-react";

type OnboardingStep = "welcome" | "pick-project" | "project-created";

interface ProjectChoice {
  type: "idea" | "own";
  idea?: ValidatedIdea;
  customName?: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const createProject = useAppStore((state) => state.createProject);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const startShotClock = useAppStore((state) => state.startShotClock);
  const setCurrentProject = useAppStore((state) => state.setCurrentProject);
  const createConversation = useAppStore((state) => state.createConversation);
  const setCurrentConversation = useAppStore((state) => state.setCurrentConversation);

  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [projectChoice, setProjectChoice] = useState<ProjectChoice | null>(null);
  const [customProjectName, setCustomProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createdProject, setCreatedProject] = useState<{ name: string; slug: string; id: string } | null>(null);

  const topIdeas = getTopIdeas(5);

  const handleSelectIdea = (idea: ValidatedIdea) => {
    setProjectChoice({ type: "idea", idea });
  };

  const handleOwnIdea = () => {
    setProjectChoice({ type: "own" });
  };

  const handleCreateProject = async () => {
    if (!projectChoice) return;

    setCreating(true);
    try {
      const projectName =
        projectChoice.type === "idea"
          ? projectChoice.idea!.name
          : customProjectName.trim() || "My First Project";

      // Create project
      const project = await createProject({ name: projectName });
      await completeOnboarding();

      // Start Phase 0 shot clock for first-time users
      const phase0Time = SHOT_CLOCK_DEFAULTS[0]?.minutes * 60 || 900; // 15 minutes default
      await startShotClock(project.id, 0, phase0Time);

      // Create conversation for this project
      const conv = await createConversation(project.id, `${projectName} - Validation`);
      setCurrentConversation(conv);

      // Set as current project
      setCurrentProject(project);

      setCreatedProject({ name: project.name, slug: project.slug, id: project.id });
      setStep("project-created");
    } catch (err) {
      console.error("Failed to create project:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleGoToProject = () => {
    if (createdProject) {
      // Project already set as current in handleCreateProject
      router.push(`/project?slug=${createdProject.slug}`);
    }
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex h-full items-center justify-center bg-[var(--normandy-void)] overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(var(--normandy-cyan) 1px, transparent 1px),
              linear-gradient(90deg, var(--normandy-cyan) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl px-8">
        {/* Welcome Step */}
        {step === "welcome" && (
          <div className="text-center animate-in fade-in duration-500">
            {/* Logo/Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-[var(--normandy-orange)]/30 bg-[var(--normandy-orange-subtle)] shadow-[0_0_40px_var(--normandy-orange-glow)]">
                  <Rocket className="h-12 w-12 text-[var(--normandy-orange)]" />
                </div>
                <div className="absolute -right-2 -top-2">
                  <Sparkles className="h-6 w-6 text-[var(--normandy-cyan)] animate-pulse" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="normandy-heading text-4xl text-[var(--normandy-text-primary)] mb-4">
              Welcome to Launchpad
            </h1>
            <p className="text-xl text-[var(--normandy-text-secondary)] mb-3">
              You&apos;re about to join the 1% who actually ship.
            </p>
            <p className="text-[var(--normandy-text-muted)] mb-12 max-w-lg mx-auto">
              Every successful product started with one decision: to begin.
              Let&apos;s create your first project in under 3 minutes.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="normandy-value text-2xl font-bold text-[var(--normandy-cyan)]">13</div>
                <div className="text-xs text-[var(--normandy-text-muted)]">SOP Phases</div>
              </div>
              <div className="text-center">
                <div className="normandy-value text-2xl font-bold text-[var(--normandy-orange)]">50+</div>
                <div className="text-xs text-[var(--normandy-text-muted)]">Validated Ideas</div>
              </div>
              <div className="text-center">
                <div className="normandy-value text-2xl font-bold text-[var(--normandy-success)]">AI</div>
                <div className="text-xs text-[var(--normandy-text-muted)]">Guided Process</div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => setStep("pick-project")}
              className="normandy-btn normandy-btn-primary px-8 py-4 text-lg group"
            >
              Start Your First Mission
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}

        {/* Pick Project Step */}
        {step === "pick-project" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="normandy-heading text-2xl text-[var(--normandy-text-primary)] mb-2">
                Pick Your First Project
              </h2>
              <p className="text-[var(--normandy-text-secondary)]">
                Choose a validated idea or bring your own
              </p>
            </div>

            {/* Ideas Grid */}
            <div className="space-y-3 mb-6">
              {topIdeas.map((idea, index) => (
                <button
                  key={idea.id}
                  onClick={() => handleSelectIdea(idea)}
                  className={cn(
                    "w-full p-4 rounded-lg border text-left transition-all",
                    projectChoice?.type === "idea" && projectChoice.idea?.id === idea.id
                      ? "border-[var(--normandy-cyan)] bg-[var(--normandy-cyan-subtle)] shadow-[0_0_20px_var(--normandy-cyan-glow)]"
                      : "border-[var(--normandy-border)] bg-[var(--normandy-panel)] hover:border-[var(--normandy-cyan)]/50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="normandy-mono text-xs text-[var(--normandy-text-muted)]">
                          #{index + 1}
                        </span>
                        <span className="font-medium text-[var(--normandy-text-primary)]">
                          {idea.name}
                        </span>
                        <span className="normandy-badge normandy-badge-cyan text-xs">
                          {CATEGORY_NAMES[idea.category]}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--normandy-text-secondary)] mb-2">
                        {idea.oneLiner}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[var(--normandy-text-muted)]">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {idea.suggestedPrice}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          ~{idea.estimatedHours}h to MVP
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div
                        className={cn(
                          "text-2xl font-bold normandy-mono",
                          idea.totalScore >= 85
                            ? "text-[var(--normandy-success)]"
                            : idea.totalScore >= 80
                            ? "text-[var(--normandy-cyan)]"
                            : "text-[var(--normandy-orange)]"
                        )}
                        style={{
                          textShadow:
                            idea.totalScore >= 85
                              ? "0 0 8px var(--normandy-success-glow)"
                              : idea.totalScore >= 80
                              ? "0 0 8px var(--normandy-cyan-glow)"
                              : "0 0 8px var(--normandy-orange-glow)",
                        }}
                      >
                        {idea.totalScore}
                      </div>
                      <div className="text-[10px] text-[var(--normandy-text-muted)]">score</div>
                    </div>
                  </div>
                  {projectChoice?.type === "idea" && projectChoice.idea?.id === idea.id && (
                    <div className="mt-3 pt-3 border-t border-[var(--normandy-cyan)]/20">
                      <div className="flex flex-wrap gap-2">
                        {idea.mvpFeatures.map((feature, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded bg-[var(--normandy-cyan)]/10 text-[var(--normandy-cyan)]"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Own Idea Option */}
            <button
              onClick={handleOwnIdea}
              className={cn(
                "w-full p-4 rounded-lg border text-left transition-all",
                projectChoice?.type === "own"
                  ? "border-[var(--normandy-orange)] bg-[var(--normandy-orange-subtle)] shadow-[0_0_20px_var(--normandy-orange-glow)]"
                  : "border-[var(--normandy-border)] bg-[var(--normandy-panel)] hover:border-[var(--normandy-orange)]/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--normandy-orange)]/30 bg-[var(--normandy-orange-subtle)]">
                  <Lightbulb className="h-5 w-5 text-[var(--normandy-orange)]" />
                </div>
                <div>
                  <div className="font-medium text-[var(--normandy-text-primary)]">
                    I Have My Own Idea
                  </div>
                  <div className="text-sm text-[var(--normandy-text-secondary)]">
                    Start with a custom project name
                  </div>
                </div>
              </div>
            </button>

            {/* Custom Name Input */}
            {projectChoice?.type === "own" && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm text-[var(--normandy-text-secondary)] mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={customProjectName}
                  onChange={(e) => setCustomProjectName(e.target.value)}
                  placeholder="My Awesome Product"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--normandy-border)] bg-[var(--normandy-panel)] text-[var(--normandy-text-primary)] placeholder:text-[var(--normandy-text-muted)] focus:outline-none focus:border-[var(--normandy-orange)] focus:ring-1 focus:ring-[var(--normandy-orange)]"
                  autoFocus
                />
              </div>
            )}

            {/* Create Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleCreateProject}
                disabled={!projectChoice || creating || (projectChoice.type === "own" && !customProjectName.trim())}
                className={cn(
                  "normandy-btn normandy-btn-primary px-8 py-3 group",
                  (!projectChoice || creating || (projectChoice.type === "own" && !customProjectName.trim())) &&
                    "opacity-50 cursor-not-allowed"
                )}
              >
                {creating ? (
                  <>
                    <div className="normandy-led normandy-led-warning mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Create Project
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Project Created Step */}
        {step === "project-created" && createdProject && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-500">
            {/* Success Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[var(--normandy-success)] bg-[var(--normandy-success)]/10 shadow-[0_0_40px_var(--normandy-success-glow)]">
                  <Check className="h-12 w-12 text-[var(--normandy-success)]" />
                </div>
                <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--normandy-success)] text-black">
                  <Zap className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="normandy-heading text-3xl text-[var(--normandy-text-primary)] mb-3">
              Mission Initialized!
            </h2>
            <p className="text-lg text-[var(--normandy-text-secondary)] mb-2">
              <span className="text-[var(--normandy-cyan)] font-medium">{createdProject.name}</span> is ready for Phase 1
            </p>
            <p className="text-[var(--normandy-text-muted)] mb-12 max-w-md mx-auto">
              Your project is set up and waiting. The 13-phase SOP process will guide you
              from idea to shipped product.
            </p>

            {/* Next Steps */}
            <div className="normandy-panel p-6 mb-8 text-left max-w-lg mx-auto">
              <h3 className="normandy-label text-[var(--normandy-text-primary)] mb-4">
                <Sparkles className="inline h-4 w-4 mr-2 text-[var(--normandy-cyan)]" />
                What&apos;s Next
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--normandy-cyan)]/10 text-[var(--normandy-cyan)] text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="text-[var(--normandy-text-primary)] font-medium">Complete Idea Intake</div>
                    <div className="text-sm text-[var(--normandy-text-muted)]">
                      Define the problem and solution (SOP-00)
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--normandy-cyan)]/10 text-[var(--normandy-cyan)] text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="text-[var(--normandy-text-primary)] font-medium">Validate in 25 Minutes</div>
                    <div className="text-sm text-[var(--normandy-text-muted)]">
                      Quick validation with scoring (SOP-01)
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--normandy-cyan)]/10 text-[var(--normandy-cyan)] text-xs font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="text-[var(--normandy-text-primary)] font-medium">Lock MVP Scope</div>
                    <div className="text-sm text-[var(--normandy-text-muted)]">
                      Define core features only (SOP-02)
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGoToProject}
                className="normandy-btn normandy-btn-primary px-8 py-4 group"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Go to Project
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={handleGoToDashboard}
                className="normandy-btn px-6 py-4"
              >
                View Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
