import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import type {
  Project,
  CreateProjectInput,
  RoadmapItem,
  Conversation,
  Message,
  AppSettings,
  ProjectAnalysis,
  SOP,
  CreateSOPInput,
  Idea,
  CreateIdeaInput,
  IdeaStatus,
  AppError,
  ErrorSeverity,
  ShotClockSession,
} from "./types";

// ============================================
// App Store - Main application state
// ============================================

interface AppState {
  // Settings
  settings: AppSettings;
  settingsLoading: boolean;

  // Onboarding
  hasCompletedOnboarding: boolean;
  onboardingLoading: boolean;

  // UI State
  sidebarCollapsed: boolean;

  // Projects
  projects: Project[];
  currentProject: Project | null;
  projectsLoading: boolean;

  // Roadmap
  roadmap: RoadmapItem[];
  roadmapLoading: boolean;

  // Chat
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  chatLoading: boolean;
  sendingMessage: boolean;

  // Analysis
  currentAnalysis: ProjectAnalysis | null;
  analyzing: boolean;

  // SOPs
  sops: SOP[];
  sopsLoading: boolean;

  // Ideas
  ideas: Idea[];
  ideasLoading: boolean;

  // Errors
  errors: AppError[];

  // Actions - Errors
  setError: (message: string, severity?: ErrorSeverity, context?: string) => void;
  clearError: (id: string) => void;
  clearAllErrors: () => void;

  // Actions - Settings
  fetchSettings: () => Promise<void>;
  setSetting: (key: string, value: string) => Promise<void>;

  // Actions - Onboarding
  checkOnboardingStatus: () => Promise<void>;
  completeOnboarding: () => Promise<void>;

  // Actions - UI
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Actions - Projects
  fetchProjects: () => Promise<void>;
  getProject: (slug: string) => Promise<Project | null>;
  createProject: (input: CreateProjectInput) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;

  // Actions - Roadmap
  fetchRoadmap: (projectId: string) => Promise<void>;
  updateRoadmapItem: (id: string, status: string, aiNotes?: string) => Promise<void>;

  // Actions - Chat
  fetchConversations: (projectId?: string) => Promise<void>;
  createConversation: (projectId?: string, title?: string) => Promise<Conversation>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;

  // Actions - Analyzer
  analyzeProject: (path: string) => Promise<ProjectAnalysis>;
  saveAnalysis: (projectId: string, analysis: ProjectAnalysis) => Promise<void>;

  // Actions - SOPs
  fetchSOPs: (activeOnly?: boolean) => Promise<void>;
  getSOP: (sopNumber: number, version?: string) => Promise<SOP | null>;
  createSOPVersion: (input: CreateSOPInput) => Promise<SOP>;
  archiveSOPVersion: (id: string) => Promise<void>;
  getSOPVersions: (sopNumber: number) => Promise<SOP[]>;
  initDefaultSOPs: () => Promise<void>;

// Actions - Ideas
  fetchIdeas: (status?: IdeaStatus) => Promise<void>;
  getIdea: (id: string) => Promise<Idea | null>;
  createIdea: (input: CreateIdeaInput) => Promise<Idea>;
  updateIdeaStatus: (id: string, status: IdeaStatus) => Promise<void>;
  saveIdeaAudit: (id: string, auditResult: string) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;

  // Actions - Shot Clock
  getShotClock: (projectId: string, phaseNumber: number) => Promise<ShotClockSession | null>;
  listShotClocks: (projectId: string) => Promise<ShotClockSession[]>;
  startShotClock: (
    projectId: string,
    phaseNumber: number,
    allocatedTimeSeconds: number
  ) => Promise<ShotClockSession>;
  addBonusTime: (sessionId: string, minutes: number) => Promise<void>;
  completeShotClock: (sessionId: string) => Promise<void>;
  lockShotClock: (sessionId: string, duration: number) => Promise<ShotClockSession>;
  deleteShotClock: (sessionId: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  settings: {
    anthropic_api_key: null,
    theme: "system",
    auto_analyze: true,
  },
  settingsLoading: false,

  hasCompletedOnboarding: false,
  onboardingLoading: true,

  sidebarCollapsed: false,

  projects: [],
  currentProject: null,
  projectsLoading: false,

  roadmap: [],
  roadmapLoading: false,

  conversations: [],
  currentConversation: null,
  messages: [],
  chatLoading: false,
  sendingMessage: false,

  currentAnalysis: null,
  analyzing: false,

  sops: [],
  sopsLoading: false,

  ideas: [],
  ideasLoading: false,

  errors: [],

  // ==========================================
  // Error Actions
  // ==========================================

  setError: (message: string, severity: ErrorSeverity = "error", context?: string) => {
    const error: AppError = {
      id: crypto.randomUUID(),
      message,
      severity,
      context,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      errors: [...state.errors, error],
    }));
    // Auto-dismiss non-critical errors after 8 seconds
    if (severity !== "critical") {
      setTimeout(() => {
        get().clearError(error.id);
      }, 8000);
    }
  },

  clearError: (id: string) => {
    set((state) => ({
      errors: state.errors.filter((e) => e.id !== id),
    }));
  },

  clearAllErrors: () => {
    set({ errors: [] });
  },

  // ==========================================
  // Settings Actions
  // ==========================================

  fetchSettings: async () => {
    set({ settingsLoading: true });
    try {
      const settings = await invoke<AppSettings>("get_all_settings");
      set({ settings, settingsLoading: false });
    } catch (err) {
      get().setError(`Failed to fetch settings: ${err}`, "error", "settings");
      set({ settingsLoading: false });
    }
  },

  setSetting: async (key: string, value: string) => {
    try {
      await invoke("set_setting", { key, value });
      // Update local state
      set((state) => ({
        settings: {
          ...state.settings,
          [key]: key === "auto_analyze" ? value === "true" : value,
        },
      }));
    } catch (err) {
      get().setError(`Failed to save setting: ${err}`, "error", "settings");
      throw err;
    }
  },

  // ==========================================
  // Onboarding Actions
  // ==========================================

  checkOnboardingStatus: async () => {
    set({ onboardingLoading: true });
    try {
      const result = await invoke<string | null>("get_setting", { key: "has_completed_onboarding" });
      set({
        hasCompletedOnboarding: result === "true",
        onboardingLoading: false,
      });
    } catch {
      // If setting doesn't exist, user hasn't completed onboarding
      set({
        hasCompletedOnboarding: false,
        onboardingLoading: false,
      });
    }
  },

  completeOnboarding: async () => {
    try {
      await invoke("set_setting", { key: "has_completed_onboarding", value: "true" });
      set({ hasCompletedOnboarding: true });
    } catch (err) {
      get().setError(`Failed to save onboarding status: ${err}`, "error", "onboarding");
      throw err;
    }
  },

  // ==========================================
  // UI Actions
  // ==========================================

  setSidebarCollapsed: (collapsed: boolean) => {
    set({ sidebarCollapsed: collapsed });
    // Persist to settings
    invoke("set_setting", { key: "sidebar_collapsed", value: String(collapsed) }).catch(
      (err) => get().setError(`Failed to persist sidebar state: ${err}`, "warning", "ui")
    );
  },

  // ==========================================
  // Project Actions
  // ==========================================

  fetchProjects: async () => {
    set({ projectsLoading: true });
    try {
      const projects = await invoke<Project[]>("list_projects");
      set({ projects, projectsLoading: false });
    } catch (err) {
      get().setError(`Failed to fetch projects: ${err}`, "error", "projects");
      set({ projectsLoading: false });
    }
  },

  getProject: async (slug: string) => {
    try {
      const project = await invoke<Project | null>("get_project", { slug });
      if (project) {
        set({ currentProject: project });
      }
      return project;
    } catch (err) {
      get().setError(`Failed to get project: ${err}`, "error", "projects");
      return null;
    }
  },

  createProject: async (input: CreateProjectInput) => {
    try {
      const project = await invoke<Project>("create_project", { input });
      set((state) => ({
        projects: [project, ...state.projects],
      }));
      return project;
    } catch (err) {
      get().setError(`Failed to create project: ${err}`, "error", "projects");
      throw err;
    }
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    try {
      await invoke("update_project", {
        id,
        name: updates.name,
        localPath: updates.local_path,
        githubUrl: updates.github_url,
      });
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
        currentProject:
          state.currentProject?.id === id
            ? { ...state.currentProject, ...updates }
            : state.currentProject,
      }));
    } catch (err) {
      get().setError(`Failed to update project: ${err}`, "error", "projects");
      throw err;
    }
  },

  deleteProject: async (id: string) => {
    try {
      await invoke("delete_project", { id });
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject:
          state.currentProject?.id === id ? null : state.currentProject,
      }));
    } catch (err) {
      get().setError(`Failed to delete project: ${err}`, "error", "projects");
      throw err;
    }
  },

  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  },

  // ==========================================
  // Roadmap Actions
  // ==========================================

  fetchRoadmap: async (projectId: string) => {
    set({ roadmapLoading: true });
    try {
      const roadmap = await invoke<RoadmapItem[]>("get_roadmap", { projectId });
      set({ roadmap, roadmapLoading: false });
    } catch (err) {
      get().setError(`Failed to fetch roadmap: ${err}`, "error", "roadmap");
      set({ roadmapLoading: false });
    }
  },

  updateRoadmapItem: async (id: string, status: string, aiNotes?: string) => {
    try {
      await invoke("update_roadmap_item", { id, status, aiNotes });
      set((state) => ({
        roadmap: state.roadmap.map((item) =>
          item.id === id
            ? {
                ...item,
                status: status as RoadmapItem["status"],
                ai_notes: aiNotes ?? item.ai_notes,
              }
            : item
        ),
      }));
    } catch (err) {
      get().setError(`Failed to update roadmap item: ${err}`, "error", "roadmap");
      throw err;
    }
  },

  // ==========================================
  // Chat Actions
  // ==========================================

  fetchConversations: async (projectId?: string) => {
    set({ chatLoading: true });
    try {
      const conversations = await invoke<Conversation[]>("list_conversations", {
        projectId: projectId ?? null,
      });
      set({ conversations, chatLoading: false });
    } catch (err) {
      get().setError(`Failed to fetch conversations: ${err}`, "error", "chat");
      set({ chatLoading: false });
    }
  },

  createConversation: async (projectId?: string, title?: string) => {
    try {
      const conversation = await invoke<Conversation>("create_conversation", {
        projectId: projectId ?? null,
        title: title ?? null,
      });
      set((state) => ({
        conversations: [conversation, ...state.conversations],
        currentConversation: conversation,
        messages: [],
      }));
      return conversation;
    } catch (err) {
      get().setError(`Failed to create conversation: ${err}`, "error", "chat");
      throw err;
    }
  },

  setCurrentConversation: (conversation: Conversation | null) => {
    set({ currentConversation: conversation, messages: [] });
    if (conversation) {
      get().fetchMessages(conversation.id);
    }
  },

  fetchMessages: async (conversationId: string) => {
    try {
      const messages = await invoke<Message[]>("get_conversation_messages", {
        conversationId,
      });
      set({ messages });
    } catch (err) {
      get().setError(`Failed to fetch messages: ${err}`, "error", "chat");
    }
  },

  sendMessage: async (content: string) => {
    const state = get();
    const apiKey = state.settings.anthropic_api_key;

    if (!apiKey) {
      throw new Error("Anthropic API key not configured");
    }

    let conversation = state.currentConversation;

    // Create a new conversation if none exists
    if (!conversation) {
      conversation = await state.createConversation(
        state.currentProject?.id ?? undefined
      );
    }

    set({ sendingMessage: true });

    try {
      // Save user message
      const userMessage = await invoke<Message>("save_message", {
        conversationId: conversation.id,
        role: "user",
        content,
      });

      set((state) => ({
        messages: [...state.messages, userMessage],
      }));

      // Get all messages for context
      const allMessages = [...get().messages];

      // Build context-aware system prompt if we have a current project
      let systemPrompt: string | null = null;
      const project = state.currentProject;

      if (project) {
        const analysis: ProjectAnalysis | null = project.status_report
          ? JSON.parse(project.status_report)
          : state.currentAnalysis;

        const roadmapStatus = state.roadmap.length > 0
          ? state.roadmap.map(item =>
              `- SOP-${item.sop_number.toString().padStart(2, '0')} ${item.sop_name}: ${item.status}${item.ai_notes ? ` (${item.ai_notes})` : ''}`
            ).join('\n')
          : 'No roadmap data available';

        const completedCount = state.roadmap.filter(r => r.status === 'complete').length;
        const inProgressCount = state.roadmap.filter(r => r.status === 'in_progress').length;

        // Build analysis section
        let analysisSection = '## Analysis\nNo analysis data available. Suggest running the project analyzer.';
        if (analysis) {
          const techStack = analysis.tech_stack.join(', ') || 'None detected';
          const frameworks = analysis.frameworks.join(', ') || 'None detected';
          const services = analysis.detected_services.join(', ') || 'None detected';
          const recommendations = analysis.recommendations.length > 0
            ? analysis.recommendations.map(r => `- ${r}`).join('\n')
            : 'None';

          analysisSection = `## Tech Stack Analysis
- **Technologies**: ${techStack}
- **Frameworks**: ${frameworks}
- **Services**: ${services}
- **Has Git**: ${analysis.has_git ? 'Yes' : 'No'}
- **Has Tests**: ${analysis.has_tests ? 'Yes' : 'No'}
- **Has CI/CD**: ${analysis.has_ci ? 'Yes' : 'No'}
- **File Count**: ${analysis.file_count}
- **Estimated Phase**: ${analysis.sop_progress.phase_name}

## AI Recommendations
${recommendations}`;
        }

        systemPrompt = `You are an AI assistant integrated into Launchpad, a Micro-SaaS shipping framework.
You are currently helping with the project "${project.name}".

## Project Context
- **Name**: ${project.name}
- **Local Path**: ${project.local_path || 'Not set'}
- **GitHub**: ${project.github_url || 'Not set'}
- **Progress**: ${completedCount}/${state.roadmap.length} SOPs complete, ${inProgressCount} in progress

${analysisSection}

## Current Roadmap Status
${roadmapStatus}

## Your Role
- Help the developer make progress on this specific project
- Reference the tech stack and current phase when giving advice
- Suggest next steps based on the roadmap status
- Be specific about what files to modify or create based on the project structure
- When recommending actions, tie them to specific SOP items where relevant`;
      }

      // Send to Claude API (with project path for file tools)
      const response = await invoke<string>("send_chat_message", {
        apiKey,
        messages: allMessages,
        systemPrompt,
        projectPath: project?.local_path ?? null,
      });

      // Save assistant response
      const assistantMessage = await invoke<Message>("save_message", {
        conversationId: conversation.id,
        role: "assistant",
        content: response,
      });

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        sendingMessage: false,
      }));
    } catch (err) {
      get().setError(`Failed to send message: ${err}`, "error", "chat");
      set({ sendingMessage: false });
      throw err;
    }
  },

  deleteConversation: async (id: string) => {
    try {
      await invoke("delete_conversation", { id });
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== id),
        currentConversation:
          state.currentConversation?.id === id ? null : state.currentConversation,
        messages: state.currentConversation?.id === id ? [] : state.messages,
      }));
    } catch (err) {
      get().setError(`Failed to delete conversation: ${err}`, "error", "chat");
      throw err;
    }
  },

  // ==========================================
  // Analyzer Actions
  // ==========================================

  analyzeProject: async (path: string) => {
    set({ analyzing: true });
    try {
      const analysis = await invoke<ProjectAnalysis>("analyze_project", { path });
      set({ currentAnalysis: analysis, analyzing: false });
      return analysis;
    } catch (err) {
      get().setError(`Failed to analyze project: ${err}`, "error", "analyzer");
      set({ analyzing: false });
      throw err;
    }
  },

  saveAnalysis: async (projectId: string, analysis: ProjectAnalysis) => {
    try {
      await invoke("save_project_analysis", { projectId, analysis });
      // Update project in state
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                status_report: JSON.stringify(analysis),
                last_analyzed: new Date().toISOString(),
                current_phase: analysis.sop_progress.estimated_phase,
              }
            : p
        ),
      }));
    } catch (err) {
      get().setError(`Failed to save analysis: ${err}`, "error", "analyzer");
      throw err;
    }
  },

  // ==========================================
  // SOPs Actions
  // ==========================================

  fetchSOPs: async (activeOnly?: boolean) => {
    set({ sopsLoading: true });
    try {
      const sops = await invoke<SOP[]>("list_sops", { activeOnly: activeOnly ?? false });
      set({ sops, sopsLoading: false });
    } catch (err) {
      get().setError(`Failed to fetch SOPs: ${err}`, "error", "sops");
      set({ sopsLoading: false });
    }
  },

  getSOP: async (sopNumber: number, version?: string) => {
    try {
      const sop = await invoke<SOP | null>("get_sop", { sopNumber, version: version ?? null });
      return sop;
    } catch (err) {
      get().setError(`Failed to get SOP: ${err}`, "error", "sops");
      return null;
    }
  },

  createSOPVersion: async (input: CreateSOPInput) => {
    try {
      const sop = await invoke<SOP>("create_sop_version", { input });
      set((state) => ({
        sops: [sop, ...state.sops],
      }));
      return sop;
    } catch (err) {
      get().setError(`Failed to create SOP version: ${err}`, "error", "sops");
      throw err;
    }
  },

  archiveSOPVersion: async (id: string) => {
    try {
      await invoke("archive_sop_version", { id });
      set((state) => ({
        sops: state.sops.map((s) =>
          s.id === id ? { ...s, is_active: false, archived_at: new Date().toISOString() } : s
        ),
      }));
    } catch (err) {
      get().setError(`Failed to archive SOP version: ${err}`, "error", "sops");
      throw err;
    }
  },

  getSOPVersions: async (sopNumber: number) => {
    try {
      const versions = await invoke<SOP[]>("get_sop_versions", { sopNumber });
      return versions;
    } catch (err) {
      get().setError(`Failed to get SOP versions: ${err}`, "error", "sops");
      return [];
    }
  },

  initDefaultSOPs: async () => {
    try {
      await invoke("init_default_sops");
      // Refresh SOPs after initialization
      get().fetchSOPs();
    } catch (err) {
      get().setError(`Failed to initialize default SOPs: ${err}`, "error", "sops");
    }
  },

  // ==========================================
  // Ideas Actions
  // ==========================================

  fetchIdeas: async (status?: IdeaStatus) => {
    set({ ideasLoading: true });
    try {
      const ideas = await invoke<Idea[]>("list_ideas", { status: status ?? null });
      set({ ideas, ideasLoading: false });
    } catch (err) {
      get().setError(`Failed to fetch ideas: ${err}`, "error", "ideas");
      set({ ideasLoading: false });
    }
  },

  getIdea: async (id: string) => {
    try {
      const idea = await invoke<Idea | null>("get_idea", { id });
      return idea;
    } catch (err) {
      get().setError(`Failed to get idea: ${err}`, "error", "ideas");
      return null;
    }
  },

  createIdea: async (input: CreateIdeaInput) => {
    try {
      const idea = await invoke<Idea>("create_idea", { input });
      set((state) => ({
        ideas: [idea, ...state.ideas],
      }));
      return idea;
    } catch (err) {
      get().setError(`Failed to create idea: ${err}`, "error", "ideas");
      throw err;
    }
  },

  updateIdeaStatus: async (id: string, status: IdeaStatus) => {
    try {
      await invoke("update_idea_status", { id, status });
      set((state) => ({
        ideas: state.ideas.map((i) =>
          i.id === id ? { ...i, status } : i
        ),
      }));
    } catch (err) {
      get().setError(`Failed to update idea status: ${err}`, "error", "ideas");
      throw err;
    }
  },

  saveIdeaAudit: async (id: string, auditResult: string) => {
    try {
      await invoke("save_idea_audit", { id, auditResult });
      set((state) => ({
        ideas: state.ideas.map((i) =>
          i.id === id
            ? { ...i, status: "audited" as IdeaStatus, audit_result: auditResult, audited_at: new Date().toISOString() }
            : i
        ),
      }));
    } catch (err) {
      get().setError(`Failed to save idea audit: ${err}`, "error", "ideas");
      throw err;
    }
  },

deleteIdea: async (id: string) => {
    try {
      await invoke("delete_idea", { id });
      set((state) => ({
        ideas: state.ideas.filter((i) => i.id !== id),
      }));
    } catch (err) {
      get().setError(`Failed to delete idea: ${err}`, "error", "ideas");
      throw err;
    }
  },

  // ==========================================
  // Shot Clock
  // ==========================================

  getShotClock: async (projectId: string, phaseNumber: number) => {
    try {
      const clock = await invoke<ShotClockSession>("get_shot_clock", { projectId, phaseNumber });
      return clock;
    } catch (err) {
      get().setError(`Failed to get shot clock: ${err}`, "error", "shot_clock");
      return null;
    }
  },

  listShotClocks: async (projectId: string) => {
    try {
      const clocks = await invoke<ShotClockSession[]>("list_shot_clocks", { projectId });
      return clocks;
    } catch (err) {
      get().setError(`Failed to list shot clocks: ${err}`, "error", "shot_clock");
      return [];
    }
  },

  startShotClock: async (
    projectId: string,
    phaseNumber: number,
    allocatedTimeSeconds: number
  ) => {
    try {
      const clock = await invoke<ShotClockSession>("start_shot_clock", {
        projectId,
        phaseNumber,
        allocatedTimeSeconds,
        bonusTimeSeconds: 0,
      });
      return clock;
    } catch (err) {
      get().setError(`Failed to start shot clock: ${err}`, "error", "shot_clock");
      throw err;
    }
  },

  addBonusTime: async (sessionId: string, minutes: number) => {
    try {
      await invoke("add_bonus_time", { id: sessionId, minutes });
    } catch (err) {
      get().setError(`Failed to add bonus time: ${err}`, "error", "shot_clock");
      throw err;
    }
  },

  completeShotClock: async (sessionId: string) => {
    try {
      await invoke("complete_shot_clock", { id: sessionId });
    } catch (err) {
      get().setError(`Failed to complete shot clock: ${err}`, "error", "shot_clock");
      throw err;
    }
  },

  lockShotClock: async (sessionId: string, duration: number) => {
    try {
      const clock = await invoke<ShotClockSession>("lock_shot_clock", { id: sessionId, duration });
      return clock;
    } catch (err) {
      get().setError(`Failed to lock shot clock: ${err}`, "error", "shot_clock");
      throw err;
    }
  },

  deleteShotClock: async (sessionId: string) => {
    try {
      await invoke("delete_shot_clock", { id: sessionId });
    } catch (err) {
      get().setError(`Failed to delete shot clock: ${err}`, "error", "shot_clock");
      throw err;
    }
  },
}));
