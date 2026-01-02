"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import {
  Home,
  FolderKanban,
  Settings,
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  Rocket,
  Sparkles,
  MoreHorizontal,
  Trash2,
  Pencil,
  ClipboardList,
  Lightbulb,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  GlassPopover,
  GlassPopoverTrigger,
  GlassPopoverContent,
} from "@/design-system/primitives/glass";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const mainNavItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/sops", label: "SOPs", icon: ClipboardList },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { projects, fetchProjects, projectsLoading, deleteProject, sidebarCollapsed, setSidebarCollapsed } = useAppStore();
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject(projectId);
    }
  };

  return (
    <aside className={cn(
      "flex h-screen flex-col border-r border-black/10 dark:border-white/10 bg-sidebar/95 backdrop-blur-xl transition-all duration-200",
      sidebarCollapsed ? "w-16" : "w-16 lg:w-64"
    )}>
      {/* Logo */}
      <div className="flex h-14 items-center justify-between gap-2.5 border-b border-black/10 dark:border-white/10 px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] shadow-[0_4px_12px_rgba(0,0,0,0.25),0_0_20px_rgba(59,130,246,0.15)]">
            <Rocket className="h-4 w-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="hidden font-bold text-foreground lg:block">
              Launchpad
            </span>
          )}
        </div>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden rounded-md p-1 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground lg:block"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronsLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {/* Home - AI Chat */}
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-orange-500/10 text-orange-500 dark:text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.25)]"
                  : "text-sidebar-foreground/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span className="hidden lg:block">{item.label}</span>}
            </Link>
          );
        })}

        {/* Projects Section */}
        <div className="pt-4">
          <button
            onClick={() => setProjectsExpanded(!projectsExpanded)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <FolderKanban className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && (
              <>
                <span className="hidden flex-1 text-left lg:block">Projects</span>
                <span className="hidden lg:block">
                  {projectsExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </span>
              </>
            )}
          </button>

          {/* Project List */}
          {projectsExpanded && !sidebarCollapsed && (
            <div className="mt-1 space-y-1 pl-4 lg:pl-8">
              {projectsLoading ? (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  Loading...
                </div>
              ) : projects.length === 0 ? null : (
                projects.map((project) => {
                  const isActive = pathname === "/project" && searchParams.get("slug") === project.slug;
                  return (
                    <div
                      key={project.id}
                      className="group relative"
                    >
                      <Link
                        href={`/project?slug=${project.slug}`}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all",
                          isActive
                            ? "bg-orange-500/10 text-orange-500 dark:text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.25)]"
                            : "text-sidebar-foreground/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-sidebar-foreground"
                        )}
                      >
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full shadow-sm",
                            project.current_phase >= 10
                              ? "bg-green-400 shadow-green-400/50"
                              : project.current_phase >= 5
                              ? "bg-blue-400 shadow-blue-400/50"
                              : "bg-amber-400 shadow-amber-400/50"
                          )}
                        />
                        <span className="hidden flex-1 truncate lg:block">
                          {project.name}
                        </span>
                      </Link>
                      {/* Project Actions */}
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden lg:group-hover:block">
                        <GlassPopover>
                          <GlassPopoverTrigger asChild>
                            <button
                              className="rounded p-1 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground"
                              onClick={(e) => e.preventDefault()}
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                          </GlassPopoverTrigger>
                          <GlassPopoverContent
                            intensity="heavy"
                            className="w-36 p-1"
                            align="start"
                          >
                            <Link
                              href={`/project?slug=${project.slug}&edit=true`}
                              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-black/10 dark:hover:bg-white/10"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                            <button
                              onClick={(e) => handleDeleteProject(e, project.id)}
                              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </GlassPopoverContent>
                        </GlassPopover>
                      </div>
                    </div>
                  );
                })
              )}

              {/* New Project Button */}
              <Link
                href="/new-project"
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-orange-500 dark:text-orange-400 transition-all hover:bg-orange-500/10 hover:shadow-[0_0_12px_rgba(249,115,22,0.20)]"
              >
                <Plus className="h-3 w-3" />
                <span className="hidden lg:block">New Project</span>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-black/10 dark:border-white/10 p-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            pathname === "/settings"
              ? "bg-orange-500/10 text-orange-500 dark:text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.25)]"
              : "text-sidebar-foreground/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-sidebar-foreground"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!sidebarCollapsed && <span className="hidden lg:block">Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
