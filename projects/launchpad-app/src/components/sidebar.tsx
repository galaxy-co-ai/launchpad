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
  Plus,
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  Rocket,
  MoreHorizontal,
  Trash2,
  Pencil,
  ClipboardList,
  BarChart3,
  Lightbulb,
  Columns,
} from "lucide-react";
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
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/pipeline", label: "Pipeline", icon: Columns },
  { href: "/ideas", label: "Ideas Vault", icon: Lightbulb },
  { href: "/", label: "Command", icon: Home },
  { href: "/sops", label: "SOPs", icon: ClipboardList },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Use individual selectors to prevent unnecessary re-renders
  const projects = useAppStore((state) => state.projects);
  const fetchProjects = useAppStore((state) => state.fetchProjects);
  const projectsLoading = useAppStore((state) => state.projectsLoading);
  const deleteProject = useAppStore((state) => state.deleteProject);
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);
  const setSidebarCollapsed = useAppStore((state) => state.setSidebarCollapsed);
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
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-[var(--normandy-border)] bg-[var(--normandy-hull)] transition-all duration-200",
        sidebarCollapsed ? "w-16" : "w-16 lg:w-64"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo Section */}
      <div className="flex h-14 items-center justify-between gap-2.5 border-b border-[var(--normandy-border)] px-4">
        <div className="flex items-center gap-2.5">
          {/* Normandy Logo Icon */}
          <div className="relative flex h-9 w-9 items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--normandy-orange)] to-[var(--normandy-orange-dim)] opacity-20" />
            <div className="absolute inset-0 rounded-lg border border-[var(--normandy-orange)] opacity-40" />
            <Rocket className="relative h-4 w-4 text-[var(--normandy-orange)]" />
          </div>
          {!sidebarCollapsed && (
            <div className="hidden lg:block">
              <span className="font-semibold text-[var(--normandy-text-primary)] tracking-wide">
                LAUNCHPAD
              </span>
              <div className="text-[10px] text-[var(--normandy-text-muted)] uppercase tracking-widest">
                Command v1.7
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden rounded p-1.5 text-[var(--normandy-text-muted)] transition-colors hover:bg-[var(--normandy-cyan-subtle)] hover:text-[var(--normandy-cyan)] lg:block"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!sidebarCollapsed}
        >
          <ChevronsLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
        </button>
      </div>

      {/* System Status */}
      {!sidebarCollapsed && (
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 border-b border-[var(--normandy-border)]">
          <div className="normandy-led normandy-led-online" />
          <span className="text-[10px] uppercase tracking-wider text-[var(--normandy-text-muted)]">
            Systems Online
          </span>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "normandy-nav-item",
                isActive && "normandy-nav-item-active"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span className="hidden lg:block">{item.label}</span>}
            </Link>
          );
        })}

        {/* Missions (Projects) Section */}
        <div className="pt-4">
          {!sidebarCollapsed && (
            <div className="normandy-divider mb-3 hidden lg:block" />
          )}
          <button
            onClick={() => setProjectsExpanded(!projectsExpanded)}
            className="normandy-nav-item w-full"
          >
            <FolderKanban className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && (
              <>
                <span className="hidden flex-1 text-left lg:block">Missions</span>
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
            <div className="mt-1 space-y-0.5 pl-4 lg:pl-8">
              {projectsLoading ? (
                <div className="px-3 py-2 text-xs text-[var(--normandy-text-muted)]">
                  Scanning...
                </div>
              ) : projects.length === 0 ? (
                <div className="px-3 py-2 text-xs text-[var(--normandy-text-muted)]">
                  No active missions
                </div>
              ) : (
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
                          "flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-all",
                          isActive
                            ? "bg-[var(--normandy-orange-subtle)] text-[var(--normandy-orange)] border-l-2 border-[var(--normandy-orange)]"
                            : "text-[var(--normandy-text-secondary)] hover:bg-[var(--normandy-cyan-subtle)] hover:text-[var(--normandy-cyan)]"
                        )}
                      >
                        {/* Status LED */}
                        <div
                          className={cn(
                            "normandy-led",
                            project.current_phase >= 10
                              ? "normandy-led-online"
                              : project.current_phase >= 5
                              ? "normandy-led-warning"
                              : "normandy-led-offline"
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
                              className="rounded p-1 text-[var(--normandy-text-muted)] hover:bg-[var(--normandy-surface)] hover:text-[var(--normandy-text-primary)]"
                              onClick={(e) => e.preventDefault()}
                              aria-label={`Actions for ${project.name}`}
                              aria-haspopup="menu"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                          </GlassPopoverTrigger>
                          <GlassPopoverContent
                            intensity="heavy"
                            className="w-36 p-1 normandy-panel"
                            align="start"
                            role="menu"
                            aria-label={`${project.name} actions`}
                          >
                            <Link
                              href={`/project?slug=${project.slug}&edit=true`}
                              className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-[var(--normandy-text-secondary)] hover:bg-[var(--normandy-cyan-subtle)] hover:text-[var(--normandy-cyan)]"
                              role="menuitem"
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                              Edit
                            </Link>
                            <button
                              onClick={(e) => handleDeleteProject(e, project.id)}
                              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-[var(--normandy-danger)] hover:bg-[rgba(255,68,68,0.1)]"
                              role="menuitem"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              Delete
                            </button>
                          </GlassPopoverContent>
                        </GlassPopover>
                      </div>
                    </div>
                  );
                })
              )}

              {/* New Mission Button */}
              <Link
                href="/new-project"
                className="flex items-center gap-2 rounded px-3 py-1.5 text-sm text-[var(--normandy-cyan)] transition-all hover:bg-[var(--normandy-cyan-subtle)]"
              >
                <Plus className="h-3 w-3" />
                <span className="hidden lg:block">New Mission</span>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-[var(--normandy-border)] p-2">
        <Link
          href="/settings"
          className={cn(
            "normandy-nav-item",
            pathname === "/settings" && "normandy-nav-item-active"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!sidebarCollapsed && <span className="hidden lg:block">Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
