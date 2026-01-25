"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { open } from "@tauri-apps/plugin-dialog";
import { ArrowLeft, FolderOpen, Loader2, Rocket, Github, Target, Monitor, Globe, Server, Chrome, Check, Layers } from "lucide-react";
import Link from "next/link";
import { PROJECT_TEMPLATES, type ProjectTemplate } from "@/data/project-templates";
import { cn } from "@/lib/utils";

const TEMPLATE_ICONS = {
  desktop: Monitor,
  web: Globe,
  api: Server,
  chrome: Chrome,
};

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject } = useAppStore();
  const [name, setName] = useState("");
  const [localPath, setLocalPath] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);

  const handleBrowse = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Select Project Directory",
      });
      if (selected && typeof selected === "string") {
        setLocalPath(selected);
        if (!name) {
          const folderName = selected.split(/[/\\]/).pop() || "";
          setName(folderName);
        }
      }
    } catch (err) {
      console.error("Failed to open directory picker:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Mission name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const project = await createProject({
        name: name.trim(),
        local_path: localPath || null,
        github_url: githubUrl || null,
      });
      router.push(`/project?slug=${project.slug}`);
    } catch (err) {
      setError(String(err));
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[var(--normandy-void)] normandy-scroll">
      <div className="mx-auto max-w-2xl p-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--normandy-text-muted)] hover:text-[var(--normandy-cyan)] transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Command
        </Link>

        <div className="mb-8">
          <h1 className="normandy-heading text-2xl tracking-wide">INITIALIZE NEW MISSION</h1>
          <p className="normandy-label mt-2">
            Begin tracking a new Micro-SaaS deployment through the SOP pipeline
          </p>
        </div>

        {/* Template Selection */}
        {showTemplates && (
          <div className="normandy-panel p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Layers className="h-5 w-5 text-[var(--normandy-cyan)]" />
                <div>
                  <h2 className="normandy-heading text-lg">Choose a Template</h2>
                  <p className="text-xs text-[var(--normandy-text-muted)]">
                    Start with a pre-configured project structure
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTemplates(false)}
                className="text-xs text-[var(--normandy-text-muted)] hover:text-[var(--normandy-cyan)]"
              >
                Skip (Link existing project)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PROJECT_TEMPLATES.map((template) => {
                const Icon = TEMPLATE_ICONS[template.icon];
                const isSelected = selectedTemplate?.id === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(isSelected ? null : template)}
                    className={cn(
                      "p-4 rounded-lg border text-left transition-all",
                      isSelected
                        ? "border-[var(--normandy-cyan)] bg-[var(--normandy-cyan-subtle)] shadow-[0_0_12px_var(--normandy-cyan-glow)]"
                        : "border-[var(--normandy-border)] hover:border-[var(--normandy-cyan)]/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        isSelected
                          ? "bg-[var(--normandy-cyan)]/20 border border-[var(--normandy-cyan)]/50"
                          : "bg-[var(--normandy-panel)] border border-[var(--normandy-border)]"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5",
                          isSelected ? "text-[var(--normandy-cyan)]" : "text-[var(--normandy-text-muted)]"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[var(--normandy-text-primary)]">
                            {template.name}
                          </span>
                          {isSelected && (
                            <Check className="h-4 w-4 text-[var(--normandy-cyan)]" />
                          )}
                        </div>
                        <p className="text-xs text-[var(--normandy-text-muted)] mt-0.5">
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.techStack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--normandy-panel)] border border-[var(--normandy-border)] text-[var(--normandy-text-muted)]"
                            >
                              {tech}
                            </span>
                          ))}
                          {template.techStack.length > 3 && (
                            <span className="text-[10px] text-[var(--normandy-text-muted)]">
                              +{template.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Template Details */}
            {selectedTemplate && (
              <div className="mt-4 p-4 rounded-lg bg-[var(--normandy-cyan-subtle)] border border-[var(--normandy-cyan)]/20 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="h-4 w-4 text-[var(--normandy-cyan)]" />
                  <span className="text-sm font-medium text-[var(--normandy-text-primary)]">
                    {selectedTemplate.name} Selected
                  </span>
                  <span className="text-xs text-[var(--normandy-text-muted)]">
                    Setup time: {selectedTemplate.setupTime}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--normandy-text-muted)]">Features</span>
                    <ul className="mt-1 space-y-0.5">
                      {selectedTemplate.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="text-xs text-[var(--normandy-text-secondary)] flex items-center gap-1">
                          <span className="text-[var(--normandy-cyan)]">+</span> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--normandy-text-muted)]">Creates</span>
                    <ul className="mt-1 space-y-0.5">
                      {selectedTemplate.structure.files.slice(0, 4).map((file, i) => (
                        <li key={i} className="text-xs text-[var(--normandy-text-muted)] normandy-mono">
                          {file.path}
                        </li>
                      ))}
                      {selectedTemplate.structure.files.length > 4 && (
                        <li className="text-xs text-[var(--normandy-text-muted)]">
                          +{selectedTemplate.structure.files.length - 4} more files
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="normandy-panel p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-[var(--normandy-orange)] opacity-15" />
              <div className="absolute inset-0 rounded-lg border-2 border-[var(--normandy-orange)] opacity-50" />
              <Rocket className="relative h-7 w-7 text-[var(--normandy-orange)]" />
            </div>
            <div>
              <h2 className="normandy-heading text-lg">Mission Parameters</h2>
              <p className="text-sm text-[var(--normandy-text-secondary)] mt-1">
                {showTemplates
                  ? "Name your project and choose where to create it"
                  : "Define mission details. Link to existing codebase for AI analysis."}
              </p>
            </div>
          </div>

          <div className="normandy-divider mb-6" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded border border-[var(--normandy-danger)] border-opacity-50 bg-[rgba(255,68,68,0.1)] px-4 py-3 text-sm text-[var(--normandy-danger)]">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="normandy-label flex items-center gap-2">
                <Target className="h-3.5 w-3.5 text-[var(--normandy-orange)]" />
                Mission Name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My SaaS Project"
                required
                className="normandy-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="normandy-label flex items-center gap-2">
                <FolderOpen className="h-3.5 w-3.5 text-[var(--normandy-cyan)]" />
                Local Directory (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  value={localPath}
                  onChange={(e) => setLocalPath(e.target.value)}
                  placeholder="C:\Projects\my-saas"
                  className="normandy-input flex-1 normandy-mono text-sm"
                />
                <button
                  type="button"
                  onClick={handleBrowse}
                  className="normandy-btn px-3"
                >
                  <FolderOpen className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-[var(--normandy-text-muted)] uppercase tracking-wider">
                Link to existing project for AI scanning
              </p>
            </div>

            <div className="space-y-2">
              <label className="normandy-label flex items-center gap-2">
                <Github className="h-3.5 w-3.5 text-[var(--normandy-text-muted)]" />
                GitHub URL (Optional)
              </label>
              <input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="normandy-input w-full"
              />
              <p className="text-[10px] text-[var(--normandy-text-muted)] uppercase tracking-wider">
                Link to repository if available
              </p>
            </div>

            <div className="normandy-divider" />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="normandy-btn px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="normandy-btn normandy-btn-primary px-6 py-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  "Launch Mission"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
