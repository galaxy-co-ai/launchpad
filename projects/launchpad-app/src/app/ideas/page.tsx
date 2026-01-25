"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  VALIDATED_IDEAS,
  CATEGORY_INFO,
  CATEGORY_NAMES,
  type ValidatedIdea,
} from "@/data/validated-ideas";
import { cn } from "@/lib/utils";
import {
  Lightbulb,
  Target,
  Clock,
  Zap,
  Search,
  ArrowUpDown,
  Rocket,
  Code,
  Brain,
  Briefcase,
  Palette,
  ChevronRight,
  Star,
  DollarSign,
  Wrench,
} from "lucide-react";

type SortOption = "score" | "hours" | "price" | "name";
type CategoryFilter = ValidatedIdea["category"] | "all";

const CATEGORY_ICONS: Record<ValidatedIdea["category"], React.ReactNode> = {
  "dev-tools": <Code className="h-4 w-4" />,
  "productivity": <Zap className="h-4 w-4" />,
  "ai-utilities": <Brain className="h-4 w-4" />,
  "content": <Palette className="h-4 w-4" />,
  "business": <Briefcase className="h-4 w-4" />,
};

export default function IdeasPage() {
  const router = useRouter();
  const { createProject } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("score");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<ValidatedIdea | null>(null);
  const [creating, setCreating] = useState(false);

  // Filter and sort ideas
  const filteredIdeas = useMemo(() => {
    let ideas = [...VALIDATED_IDEAS];

    // Filter by category
    if (categoryFilter !== "all") {
      ideas = ideas.filter((idea) => idea.category === categoryFilter);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      ideas = ideas.filter(
        (idea) =>
          idea.name.toLowerCase().includes(query) ||
          idea.oneLiner.toLowerCase().includes(query) ||
          idea.targetCustomer.toLowerCase().includes(query)
      );
    }

    // Sort
    ideas.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "score":
          comparison = b.totalScore - a.totalScore;
          break;
        case "hours":
          comparison = a.estimatedHours - b.estimatedHours;
          break;
        case "price":
          const priceA = parseFloat(a.suggestedPrice.replace(/[^0-9.]/g, ""));
          const priceB = parseFloat(b.suggestedPrice.replace(/[^0-9.]/g, ""));
          comparison = priceB - priceA;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return sortAsc ? -comparison : comparison;
    });

    return ideas;
  }, [categoryFilter, searchQuery, sortBy, sortAsc]);

  const handleStartProject = async (idea: ValidatedIdea) => {
    setCreating(true);
    try {
      const project = await createProject({ name: idea.name });
      router.push(`/project?slug=${project.slug}`);
    } catch (err) {
      console.error("Failed to create project:", err);
    } finally {
      setCreating(false);
    }
  };

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(option);
      setSortAsc(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto normandy-scroll bg-[var(--normandy-void)]">
      <div className="mx-auto max-w-7xl p-8">
        {/* Header */}
        <div className="mb-8 normandy-panel p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--normandy-cyan)]/30 bg-[var(--normandy-cyan-subtle)] shadow-[0_0_12px_var(--normandy-cyan-glow)]">
                <Lightbulb className="h-6 w-6 text-[var(--normandy-cyan)]" />
              </div>
              <div>
                <h1 className="normandy-heading text-xl text-[var(--normandy-text-primary)]">
                  IDEAS VAULT
                </h1>
                <p className="text-[var(--normandy-text-secondary)] mt-1">
                  50 pre-validated micro-SaaS ideas ready to build
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="normandy-badge normandy-badge-cyan">
                {VALIDATED_IDEAS.length} Ideas
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--normandy-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ideas..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--normandy-border)] bg-[var(--normandy-panel)] text-[var(--normandy-text-primary)] placeholder:text-[var(--normandy-text-muted)] focus:outline-none focus:border-[var(--normandy-cyan)]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategoryFilter("all")}
              className={cn(
                "px-3 py-2 rounded-lg border text-sm transition-all",
                categoryFilter === "all"
                  ? "border-[var(--normandy-cyan)] bg-[var(--normandy-cyan-subtle)] text-[var(--normandy-cyan)]"
                  : "border-[var(--normandy-border)] text-[var(--normandy-text-secondary)] hover:border-[var(--normandy-cyan)]/50"
              )}
            >
              All
            </button>
            {Object.entries(CATEGORY_INFO).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setCategoryFilter(key as CategoryFilter)}
                className={cn(
                  "px-3 py-2 rounded-lg border text-sm transition-all flex items-center gap-2",
                  categoryFilter === key
                    ? "border-[var(--normandy-cyan)] bg-[var(--normandy-cyan-subtle)] text-[var(--normandy-cyan)]"
                    : "border-[var(--normandy-border)] text-[var(--normandy-text-secondary)] hover:border-[var(--normandy-cyan)]/50"
                )}
              >
                {CATEGORY_ICONS[key as ValidatedIdea["category"]]}
                {info.name}
                <span className="text-xs opacity-60">({info.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="text-[var(--normandy-text-muted)] flex items-center gap-1">
            <ArrowUpDown className="h-3 w-3" /> Sort by:
          </span>
          {[
            { key: "score" as SortOption, label: "Score", icon: Star },
            { key: "hours" as SortOption, label: "Build Time", icon: Clock },
            { key: "price" as SortOption, label: "Price", icon: DollarSign },
            { key: "name" as SortOption, label: "Name", icon: null },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className={cn(
                "px-2 py-1 rounded border text-xs flex items-center gap-1 transition-all",
                sortBy === key
                  ? "border-[var(--normandy-orange)] text-[var(--normandy-orange)]"
                  : "border-[var(--normandy-border)] text-[var(--normandy-text-muted)] hover:border-[var(--normandy-orange)]/50"
              )}
            >
              {Icon && <Icon className="h-3 w-3" />}
              {label}
              {sortBy === key && (
                <span className="ml-1">{sortAsc ? "↑" : "↓"}</span>
              )}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-[var(--normandy-text-muted)]">
          Showing {filteredIdeas.length} of {VALIDATED_IDEAS.length} ideas
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className={cn(
                "normandy-card p-5 cursor-pointer transition-all",
                selectedIdea?.id === idea.id
                  ? "ring-2 ring-[var(--normandy-cyan)] shadow-[0_0_20px_var(--normandy-cyan-glow)]"
                  : "hover:shadow-[0_0_12px_var(--normandy-cyan-glow)]"
              )}
              onClick={() => setSelectedIdea(selectedIdea?.id === idea.id ? null : idea)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--normandy-cyan)]/20 bg-[var(--normandy-cyan-subtle)]">
                    {CATEGORY_ICONS[idea.category]}
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--normandy-text-primary)]">
                      {idea.name}
                    </h3>
                    <span className="text-xs text-[var(--normandy-text-muted)]">
                      {CATEGORY_NAMES[idea.category]}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={cn(
                      "text-2xl font-bold normandy-mono",
                      idea.totalScore >= 80
                        ? "text-[var(--normandy-success)]"
                        : idea.totalScore >= 70
                        ? "text-[var(--normandy-cyan)]"
                        : "text-[var(--normandy-orange)]"
                    )}
                    style={{
                      textShadow:
                        idea.totalScore >= 80
                          ? "0 0 8px var(--normandy-success-glow)"
                          : idea.totalScore >= 70
                          ? "0 0 8px var(--normandy-cyan-glow)"
                          : "0 0 8px var(--normandy-orange-glow)",
                    }}
                  >
                    {idea.totalScore}
                  </div>
                  <div className="text-[10px] text-[var(--normandy-text-muted)]">score</div>
                </div>
              </div>

              <p className="text-sm text-[var(--normandy-text-secondary)] mb-3">
                {idea.oneLiner}
              </p>

              <div className="flex items-center gap-4 text-xs text-[var(--normandy-text-muted)]">
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {idea.suggestedPrice}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  ~{idea.estimatedHours}h
                </span>
                <span className="flex items-center gap-1">
                  <Wrench className="h-3 w-3" />
                  {idea.techStack.slice(0, 2).join(", ")}
                </span>
              </div>

              {/* Expanded details */}
              {selectedIdea?.id === idea.id && (
                <div className="mt-4 pt-4 border-t border-[var(--normandy-border)] animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Score breakdown */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center p-2 rounded bg-[var(--normandy-panel)]">
                      <div className="text-xs text-[var(--normandy-text-muted)] mb-1">Pain</div>
                      <div className="font-bold text-[var(--normandy-cyan)]">{idea.painScore}</div>
                    </div>
                    <div className="text-center p-2 rounded bg-[var(--normandy-panel)]">
                      <div className="text-xs text-[var(--normandy-text-muted)] mb-1">Market</div>
                      <div className="font-bold text-[var(--normandy-cyan)]">{idea.marketScore}</div>
                    </div>
                    <div className="text-center p-2 rounded bg-[var(--normandy-panel)]">
                      <div className="text-xs text-[var(--normandy-text-muted)] mb-1">Build</div>
                      <div className="font-bold text-[var(--normandy-cyan)]">{idea.buildScore}</div>
                    </div>
                    <div className="text-center p-2 rounded bg-[var(--normandy-panel)]">
                      <div className="text-xs text-[var(--normandy-text-muted)] mb-1">$$$</div>
                      <div className="font-bold text-[var(--normandy-cyan)]">{idea.monetizeScore}</div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-[var(--normandy-text-muted)]">Target:</span>{" "}
                      <span className="text-[var(--normandy-text-secondary)]">{idea.targetCustomer}</span>
                    </div>
                    <div>
                      <span className="text-[var(--normandy-text-muted)]">Differentiator:</span>{" "}
                      <span className="text-[var(--normandy-text-secondary)]">{idea.differentiator}</span>
                    </div>
                    <div>
                      <span className="text-[var(--normandy-text-muted)]">MVP Features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {idea.mvpFeatures.map((feature, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 rounded bg-[var(--normandy-cyan)]/10 text-[var(--normandy-cyan)]"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[var(--normandy-text-muted)]">Launch on:</span>{" "}
                      <span className="text-[var(--normandy-text-secondary)]">
                        {idea.launchPlatforms.join(", ")}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartProject(idea);
                    }}
                    disabled={creating}
                    className="mt-4 w-full normandy-btn normandy-btn-primary py-3 group"
                  >
                    {creating ? (
                      <>
                        <div className="normandy-led normandy-led-warning mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Rocket className="mr-2 h-4 w-4" />
                        Start Building This
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredIdeas.length === 0 && (
          <div className="text-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-[var(--normandy-cyan)]/20 bg-[var(--normandy-cyan-subtle)] mx-auto mb-4">
              <Search className="h-10 w-10 text-[var(--normandy-cyan)]/40" />
            </div>
            <h3 className="normandy-heading text-lg text-[var(--normandy-text-primary)] mb-2">
              No Ideas Found
            </h3>
            <p className="text-[var(--normandy-text-muted)]">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
