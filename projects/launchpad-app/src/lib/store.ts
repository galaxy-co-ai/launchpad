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
} from "./types";

// ============================================
// App Store - Main application state
// ============================================

interface AppState {
  // Settings
  settings: AppSettings;
  settingsLoading: boolean;

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

  // Actions - Settings
  fetchSettings: () => Promise<void>;
  setSetting: (key: string, value: string) => Promise<void>;

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
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  settings: {
    anthropic_api_key: null,
    theme: "system",
    auto_analyze: true,
  },
  settingsLoading: false,

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

  // ==========================================
  // Settings Actions
  // ==========================================

  fetchSettings: async () => {
    set({ settingsLoading: true });
    try {
      const settings = await invoke<AppSettings>("get_all_settings");
      set({ settings, settingsLoading: false });
    } catch (err) {
      console.error("Failed to fetch settings:", err);
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
      console.error("Failed to set setting:", err);
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
      (err) => console.error("Failed to persist sidebar state:", err)
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
      console.error("Failed to fetch projects:", err);
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
      console.error("Failed to get project:", err);
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
      console.error("Failed to create project:", err);
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
      console.error("Failed to update project:", err);
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
      console.error("Failed to delete project:", err);
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
      console.error("Failed to fetch roadmap:", err);
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
      console.error("Failed to update roadmap item:", err);
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
      console.error("Failed to fetch conversations:", err);
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
      console.error("Failed to create conversation:", err);
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
      console.error("Failed to fetch messages:", err);
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
      console.error("Failed to send message:", err);
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
      console.error("Failed to delete conversation:", err);
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
      console.error("Failed to analyze project:", err);
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
      console.error("Failed to save analysis:", err);
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
      console.error("Failed to fetch SOPs:", err);
      set({ sopsLoading: false });
    }
  },

  getSOP: async (sopNumber: number, version?: string) => {
    try {
      const sop = await invoke<SOP | null>("get_sop", { sopNumber, version: version ?? null });
      return sop;
    } catch (err) {
      console.error("Failed to get SOP:", err);
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
      console.error("Failed to create SOP version:", err);
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
      console.error("Failed to archive SOP version:", err);
      throw err;
    }
  },

  getSOPVersions: async (sopNumber: number) => {
    try {
      const versions = await invoke<SOP[]>("get_sop_versions", { sopNumber });
      return versions;
    } catch (err) {
      console.error("Failed to get SOP versions:", err);
      return [];
    }
  },

  initDefaultSOPs: async () => {
    try {
      await invoke("init_default_sops");
      // Refresh SOPs after initialization
      get().fetchSOPs();
    } catch (err) {
      console.error("Failed to initialize default SOPs:", err);
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
      console.error("Failed to fetch ideas:", err);
      set({ ideasLoading: false });
    }
  },

  getIdea: async (id: string) => {
    try {
      const idea = await invoke<Idea | null>("get_idea", { id });
      return idea;
    } catch (err) {
      console.error("Failed to get idea:", err);
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
      console.error("Failed to create idea:", err);
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
      console.error("Failed to update idea status:", err);
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
      console.error("Failed to save idea audit:", err);
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
      console.error("Failed to delete idea:", err);
      throw err;
    }
  },
}));
