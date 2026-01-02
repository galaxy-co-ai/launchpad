"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/design-system/primitives/glass";
import { open } from "@tauri-apps/plugin-dialog";
import { ArrowLeft, FolderOpen, Loader2, Rocket, Github, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject } = useAppStore();
  const [name, setName] = useState("");
  const [localPath, setLocalPath] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBrowse = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Select Project Directory",
      });
      if (selected && typeof selected === "string") {
        setLocalPath(selected);
        // Auto-fill name from folder name if empty
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
      setError("Project name is required");
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
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl p-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Create New Project
          </h1>
          <p className="text-muted-foreground mt-1">
            Start tracking a new Micro-SaaS project through the SOP pipeline
          </p>
        </div>

        <GlassCard intensity="subtle">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] shadow-[0_4px_12px_rgba(0,0,0,0.25),0_0_20px_rgba(59,130,246,0.15)]">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Project Details</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Add basic information about your project. You can link it to an
                existing codebase or start fresh.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-400" />
                Project Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My SaaS Project"
                required
                className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 focus:border-blue-500/50 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="local-path" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-blue-400" />
                Local Directory (Optional)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="local-path"
                  value={localPath}
                  onChange={(e) => setLocalPath(e.target.value)}
                  placeholder="C:\Projects\my-saas"
                  className="flex-1 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 focus:border-violet-500/50 text-foreground"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBrowse}
                  className="border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Link to an existing project folder for AI analysis
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="github-url" className="flex items-center gap-2">
                <Github className="h-4 w-4 text-gray-400" />
                GitHub URL (Optional)
              </Label>
              <Input
                id="github-url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 focus:border-blue-500/50 text-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Link to the GitHub repository if available
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] text-white shadow-[0_4px_12px_rgba(0,0,0,0.25),0_0_12px_rgba(249,115,22,0.30)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.30),0_0_20px_rgba(249,115,22,0.40)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
