import { create } from "zustand";
import { invoke as tauriInvoke } from "@tauri-apps/api/core";
import type {
  Project,
  CreateProjectInput,
  RoadmapItem,
  Conversation,
  ConversationWithContext,
  Message,
  AppSettings,
  ProjectAnalysis,
  SOP,
  CreateSOPInput,
  Idea,
  CreateIdeaInput,
  IdeaStatus,
  WorkflowProgress,
  WorkflowContext,
  CompleteStepInput,
} from "./types";

// Safe invoke wrapper - works in both Tauri and browser modes
const invoke = async <T>(command: string, args?: Record<string, unknown>): Promise<T> => {
  // Check if we're in Tauri environment
  if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
    return tauriInvoke<T>(command, args);
  }
  
  // Browser fallback - return mock data or throw helpful error
  console.warn(`Tauri invoke("${command}") called in browser mode - returning mock data`);
  
  // Return appropriate mock data based on command
  const mockData: Record<string, unknown> = {
    get_all_settings: { theme: 'dark', sidebarCollapsed: false },
    list_projects: [],
    get_project: null,
    list_conversations: [],
    list_messages: [],
    list_sops: [],
    get_sop: null,
    list_ideas: [],
    list_roadmap_items: [],
    init_default_sops: { success: true },
  };
  
  return (mockData[command] ?? {}) as T;
};

// ============================================
// SOP Detection and Guided Prompt Injection
// ============================================

interface SOPContext {
  sopNumber: number;
  sopName: string;
  guidedPrompt: string;
}

/**
 * Detects which SOP the user is asking about based on message content
 * Returns the appropriate guided context for the AI
 */
/**
 * Detects if the user is asking to resume a previous session
 */
function detectResumeIntent(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  const resumePatterns = [
    'where were we',
    'where did we leave off',
    'continue from',
    'pick up where',
    'what were we doing',
    'resume',
    'continue our',
    'last session',
    'what was i working on',
    "what's next",
    'remind me',
    'what step',
    'where was i',
  ];
  return resumePatterns.some((pattern) => lowerMessage.includes(pattern));
}

function detectSOPContext(message: string): SOPContext | null {
  const lowerMessage = message.toLowerCase();
  
  // SOP-00: Idea Intake
  if (
    lowerMessage.includes('i have an idea') ||
    lowerMessage.includes('new idea') ||
    lowerMessage.includes('i want to build') ||
    lowerMessage.includes('what if we made') ||
    lowerMessage.includes('there should be a tool') ||
    lowerMessage.includes('i noticed a problem') ||
    lowerMessage.includes('capture this idea')
  ) {
    return {
      sopNumber: 0,
      sopName: 'Idea Intake',
      guidedPrompt: `## GUIDED MODE: Idea Intake (SOP-00)

You are now guiding the user through capturing a new idea. Follow this structured flow:

### Step 1: Problem Statement (Required)
Ask: "Let's capture this idea properly. First, tell me about the **problem** you're solving: **Who** has this problem, and **what pain** does it cause them?"

Validate their response includes:
- A specific person/role (not "people" or "everyone")
- A concrete pain point (time, money, frustration)

### Step 2: Proposed Solution (Required)
Ask: "Now, what would you build to solve this? Describe it in **one sentence**."

### Step 3: Source (Required)
Ask: "Where did this idea come from? (Personal pain / Someone told you / Saw online / Competitor gap / Random thought)"

### Step 4: Initial Signals
Quick-fire questions:
1. "Have you searched for existing solutions?"
2. "Would YOU pay for this if someone else built it? How much?"
3. "Do you personally know anyone with this problem?"

### Step 5: Confirm & Save
Summarize what you captured and ask if they want to save it.

**Be conversational but structured. Ask one section at a time. Track what's been answered.**`
    };
  }
  
  // SOP-01: Validation
  if (
    lowerMessage.includes('validate') ||
    lowerMessage.includes('is this worth building') ||
    lowerMessage.includes('score this idea') ||
    lowerMessage.includes('should i build this') ||
    lowerMessage.includes('check if this is viable')
  ) {
    return {
      sopNumber: 1,
      sopName: 'Quick Validation',
      guidedPrompt: `## GUIDED MODE: Quick Validation (SOP-01)

You are now guiding the user through validating their idea with a structured scoring system.

### Scoring Framework (Total: 125 points)

**Section 1: Problem Validation (Max 45 pts)**
Guide them to search Reddit/Twitter for evidence of pain:
- 3+ real complaints/requests: +15
- Problem causes money/time loss: +10
- People actively searching: +10
- Recurring problem: +5
- Personal pain: +5

**Section 2: Market Validation (Max 35 pts)**
Help them identify their target audience:
- Clear, specific audience: +10
- 2+ communities found: +10
- Audience pays for software: +10
- Direct access to audience: +5

**Section 3: Monetization Validation (Max 45 pts)**
Guide competitor research:
- Competitors exist & charge: +15
- Visible customers: +10
- Exploitable gap: +10
- Clear revenue path: +10

### Decision Thresholds
- 90-125: 🟢 GREEN LIGHT → Proceed to scope
- 60-89: 🟡 YELLOW → Needs pivot or more research
- <60: 🔴 RED → Kill the idea

**Walk through each section methodically. Calculate scores as you go. Be honest about weak areas.**`
    };
  }
  
  // SOP-02: MVP Scope
  if (
    lowerMessage.includes('scope') ||
    lowerMessage.includes('define the mvp') ||
    lowerMessage.includes('what features') ||
    lowerMessage.includes('lock the scope') ||
    lowerMessage.includes('prevent scope creep') ||
    lowerMessage.includes('mvp contract')
  ) {
    return {
      sopNumber: 2,
      sopName: 'MVP Scope Contract',
      guidedPrompt: `## GUIDED MODE: MVP Scope Contract (SOP-02)

You are now helping the user lock their MVP scope to prevent feature creep.

### Step 1: Core Value Proposition
Ask them to complete: "Users can __________ so that __________." (10 words max)

### Step 2: Feature Brainstorm & Filter
1. Have them list ALL potential features
2. For each, ask: "Would someone pay for JUST this feature?"
3. Categorize: P0 (must have), P1 (week 1 demand), P2 (nice to have), P3 (never)
4. Lock ONLY P0 features - MAXIMUM 5

### Step 3: Explicit Non-Goals
Force them to list 5+ things they will NOT build:
- No mobile app?
- No team features?
- No integrations?
- No free tier?
- No admin dashboard?

### Step 4: Success Metrics
Define specific, measurable targets:
- First paying customer: Launch day
- Revenue target: $X in 30 days
- User target: X active users in 30 days

### Step 5: Lock the Contract
Compile everything into a formal contract they commit to.

**Be ruthless about cutting features. The goal is LESS, not more. Flag any scope creep immediately.**`
    };
  }
  
  // SOP-03: Revenue Model
  if (
    lowerMessage.includes('pricing') ||
    lowerMessage.includes('revenue model') ||
    lowerMessage.includes('how much should i charge') ||
    lowerMessage.includes('monetization') ||
    lowerMessage.includes('payment') ||
    lowerMessage.includes('lock pricing')
  ) {
    return {
      sopNumber: 3,
      sopName: 'Revenue Model Lock',
      guidedPrompt: `## GUIDED MODE: Revenue Model Lock (SOP-03)

You are now helping the user lock their revenue model before building.

### Step 1: Choose Model Type
Options:
- Subscription ($X/month) - Best for ongoing value
- One-time ($X lifetime) - Best for tools/utilities
- Usage-based ($X/request) - Best for APIs
- Freemium - AVOID in v1 (attracts freeloaders)

### Step 2: Set Specific Price
Use competitor research as anchors:
- Hobby/indie: $9-29/month or $49-149 lifetime
- Professional: $29-99/month
- Business: $99-299/month

Ask: "What are competitors charging? Price at or above them."

### Step 3: Define Payment Flow
Map the exact journey:
1. How user discovers paywall
2. What triggers payment
3. Stripe Checkout vs embedded form
4. What happens after payment

### Step 4: Trial Decision
- No trial: Filters to serious buyers
- 7-day: Creates urgency
- 14-day: Industry standard
- Freemium: AVOID in v1

### Step 5: Revenue Targets
Calculate: Price × Customers Needed = Target Revenue
Example: $29/mo × 18 customers = $500/month

**Lock a specific number. No "around $20" - pick $19 or $29 and commit.**`
    };
  }
  
  // SOP-04: Design Brief
  if (
    lowerMessage.includes('design') ||
    lowerMessage.includes('user flow') ||
    lowerMessage.includes('screens') ||
    lowerMessage.includes('landing page') ||
    lowerMessage.includes('ui plan')
  ) {
    return {
      sopNumber: 4,
      sopName: 'Design Brief',
      guidedPrompt: `## GUIDED MODE: Design Brief (SOP-04)

You are now helping the user plan their UI before coding.

### Step 1: Core User Flow
Map the journey: ENTRY → HOOK → VALUE → CONVERT → SUCCESS
Maximum 5 steps from landing to payment.

### Step 2: Screen Inventory
List every screen needed (max 7 for MVP):
1. Landing Page - Convert visitors
2. Auth - Sign in/up (Clerk handles this)
3. Dashboard - Main workspace
4. [Core Feature] - The ONE thing
5. Settings - Account management
6. Pricing/Upgrade - Convert free users

### Step 3: Landing Page Structure
- Hero: Headline (10 words), subheadline, CTA, visual
- Social Proof: Logos, testimonials, or stats
- Features: 3 max, with icons
- Pricing: Clear display + CTA
- Footer: Links, legal

### Step 4: Component Checklist
From shadcn/ui:
- Button (primary, secondary, ghost)
- Card, Input, Form
- Toast, Dialog
- Any specific components needed

### Step 5: Key Interactions
Document every click → response:
- Form submit → Loading → Success toast
- Error → Inline message
- Async action → Progress indicator

**Design mobile-first. Use shadcn/ui defaults before customizing.**`
    };
  }
  
  return null;
}

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

  // Workflow
  currentWorkflow: WorkflowProgress | null;
  currentWorkflowContext: WorkflowContext | null;
  workflowLoading: boolean;
  activeIdeaId: string | null;

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
  fetchIdeaConversations: (ideaId: string) => Promise<Conversation[]>;
  createConversation: (projectId?: string, title?: string) => Promise<Conversation>;
  createConversationForIdea: (ideaId: string, title?: string) => Promise<Conversation>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  linkConversationToIdea: (conversationId: string, ideaId: string) => Promise<void>;
  saveSessionSummary: (conversationId: string, summary: string) => Promise<void>;
  getConversationWithContext: (conversationId: string) => Promise<ConversationWithContext | null>;

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

  // Actions - Workflow
  setActiveIdea: (ideaId: string | null) => void;
  startWorkflow: (ideaId: string) => Promise<WorkflowProgress>;
  getWorkflowState: (ideaId: string) => Promise<WorkflowProgress | null>;
  completeStep: (input: CompleteStepInput) => Promise<WorkflowProgress>;
  advanceSop: (ideaId: string) => Promise<WorkflowProgress>;
  updateValidation: (ideaId: string, score: number, decision: string) => Promise<WorkflowProgress>;
  fetchWorkflowContext: (ideaId: string) => Promise<WorkflowContext | null>;
  generateAIContext: (ideaId: string) => Promise<string | null>;
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

  currentWorkflow: null,
  currentWorkflowContext: null,
  workflowLoading: false,
  activeIdeaId: null,

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

  fetchIdeaConversations: async (ideaId: string) => {
    try {
      const conversations = await invoke<Conversation[]>("list_idea_conversations", { ideaId });
      return conversations;
    } catch (err) {
      console.error("Failed to fetch idea conversations:", err);
      return [];
    }
  },

  createConversationForIdea: async (ideaId: string, title?: string) => {
    try {
      const conversation = await invoke<Conversation>("create_conversation_with_idea", {
        projectId: null,
        ideaId,
        title: title ?? null,
      });
      set((state) => ({
        conversations: [conversation, ...state.conversations],
        currentConversation: conversation,
        messages: [],
        activeIdeaId: ideaId,
      }));
      return conversation;
    } catch (err) {
      console.error("Failed to create conversation for idea:", err);
      throw err;
    }
  },

  setCurrentConversation: (conversation: Conversation | null) => {
    set({ currentConversation: conversation, messages: [] });
    if (conversation) {
      get().fetchMessages(conversation.id);
      // Auto-load workflow context if conversation is linked to an idea
      if (conversation.idea_id) {
        set({ activeIdeaId: conversation.idea_id });
        get().fetchWorkflowContext(conversation.idea_id);
      }
    } else {
      set({ activeIdeaId: null, currentWorkflow: null, currentWorkflowContext: null });
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

      // Detect if user is asking about a specific SOP workflow
      const sopContext = detectSOPContext(content);
      const isResumeIntent = detectResumeIntent(content);

      // Build context-aware system prompt
      let systemPrompt: string | null = null;
      const project = state.currentProject;
      const activeIdeaId = state.activeIdeaId;
      
      // If this conversation is linked to an idea, use that as active idea
      const effectiveIdeaId = activeIdeaId ?? conversation.idea_id;
      
      // Try to get workflow context for active idea
      let workflowContextStr: string | null = null;
      if (effectiveIdeaId) {
        try {
          workflowContextStr = await invoke<string | null>("generate_ai_context", { ideaId: effectiveIdeaId });
        } catch (e) {
          console.warn("Could not fetch workflow context:", e);
        }
      }
      
      // Base system prompt for guided workflows (no project context)
      const baseGuidedPrompt = `You are an AI assistant integrated into Launchpad, a Micro-SaaS shipping framework.
You help developers go from idea to revenue using a structured 13-step SOP (Standard Operating Procedure) system.

The SOP Pipeline:
- SOP-00 to 03: Ideation (Capture idea → Validate → Lock scope → Lock pricing)
- SOP-04: Design (Plan UI before code)
- SOP-05 to 06: Setup (Scaffold project → Provision infrastructure)
- SOP-07 to 08: Build (Develop features → Test/QA)
- SOP-09 to 10: Launch (Pre-ship checklist → Go live)
- SOP-11 to 12: Post-Launch (Monitor → Market)

You guide users through each phase with structured questions and checklists.
Be conversational but action-oriented. Track progress and suggest next steps.`;

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

        // Inject SOP-specific guided prompt if detected
        if (sopContext) {
          systemPrompt += `\n\n${sopContext.guidedPrompt}`;
        }
      } else if (sopContext) {
        // No project context, but user is asking about SOP workflow
        systemPrompt = `${baseGuidedPrompt}\n\n${sopContext.guidedPrompt}`;
      }

      // Inject workflow context if available (takes precedence)
      if (workflowContextStr) {
        const workflowInjection = `\n\n${workflowContextStr}`;
        if (systemPrompt) {
          systemPrompt += workflowInjection;
        } else {
          systemPrompt = `${baseGuidedPrompt}${workflowInjection}`;
        }
      }

      // Add resume-specific instructions if detected
      if (isResumeIntent && workflowContextStr) {
        const resumeInstructions = `

## USER WANTS TO RESUME

The user is asking where they left off. Based on the workflow context above:
1. Summarize what has been completed so far
2. State what step they're currently on
3. Remind them of any data they've already provided
4. Guide them to continue from exactly where they left off

Be welcoming and oriented: "Welcome back! Last time we were working on [X]. You've completed [Y] and we're currently on [Z]. Let's continue..."`;
        systemPrompt = (systemPrompt || baseGuidedPrompt) + resumeInstructions;
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

  linkConversationToIdea: async (conversationId: string, ideaId: string) => {
    try {
      await invoke("link_conversation_to_idea", { conversationId, ideaId });
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? { ...c, idea_id: ideaId } : c
        ),
        currentConversation:
          state.currentConversation?.id === conversationId
            ? { ...state.currentConversation, idea_id: ideaId }
            : state.currentConversation,
        activeIdeaId: ideaId,
      }));
    } catch (err) {
      console.error("Failed to link conversation to idea:", err);
      throw err;
    }
  },

  saveSessionSummary: async (conversationId: string, summary: string) => {
    try {
      await invoke("save_session_summary", { conversationId, summary });
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? { ...c, session_summary: summary } : c
        ),
        currentConversation:
          state.currentConversation?.id === conversationId
            ? { ...state.currentConversation, session_summary: summary }
            : state.currentConversation,
      }));
    } catch (err) {
      console.error("Failed to save session summary:", err);
      throw err;
    }
  },

  getConversationWithContext: async (conversationId: string) => {
    try {
      const result = await invoke<ConversationWithContext>("get_conversation_with_context", {
        conversationId,
      });
      return result;
    } catch (err) {
      console.error("Failed to get conversation with context:", err);
      return null;
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

  // ==========================================
  // Workflow Actions
  // ==========================================

  setActiveIdea: (ideaId: string | null) => {
    set({ activeIdeaId: ideaId });
    if (ideaId) {
      // Automatically fetch workflow context when idea is set
      get().fetchWorkflowContext(ideaId);
    } else {
      set({ currentWorkflow: null, currentWorkflowContext: null });
    }
  },

  startWorkflow: async (ideaId: string) => {
    set({ workflowLoading: true });
    try {
      const workflow = await invoke<WorkflowProgress>("start_workflow", { ideaId });
      set({ currentWorkflow: workflow, workflowLoading: false, activeIdeaId: ideaId });
      // Also fetch the full context
      get().fetchWorkflowContext(ideaId);
      return workflow;
    } catch (err) {
      console.error("Failed to start workflow:", err);
      set({ workflowLoading: false });
      throw err;
    }
  },

  getWorkflowState: async (ideaId: string) => {
    try {
      const workflow = await invoke<WorkflowProgress | null>("get_workflow_state", { ideaId });
      if (workflow) {
        set({ currentWorkflow: workflow });
      }
      return workflow;
    } catch (err) {
      console.error("Failed to get workflow state:", err);
      return null;
    }
  },

  completeStep: async (input: CompleteStepInput) => {
    try {
      const workflow = await invoke<WorkflowProgress>("complete_step", { input });
      set({ currentWorkflow: workflow });
      // Refresh context after completing step
      get().fetchWorkflowContext(input.idea_id);
      return workflow;
    } catch (err) {
      console.error("Failed to complete step:", err);
      throw err;
    }
  },

  advanceSop: async (ideaId: string) => {
    try {
      const workflow = await invoke<WorkflowProgress>("advance_sop", { ideaId });
      set({ currentWorkflow: workflow });
      // Refresh context after advancing
      get().fetchWorkflowContext(ideaId);
      return workflow;
    } catch (err) {
      console.error("Failed to advance SOP:", err);
      throw err;
    }
  },

  updateValidation: async (ideaId: string, score: number, decision: string) => {
    try {
      const workflow = await invoke<WorkflowProgress>("update_validation", { ideaId, score, decision });
      set({ currentWorkflow: workflow });
      // Refresh context after validation update
      get().fetchWorkflowContext(ideaId);
      return workflow;
    } catch (err) {
      console.error("Failed to update validation:", err);
      throw err;
    }
  },

  fetchWorkflowContext: async (ideaId: string) => {
    set({ workflowLoading: true });
    try {
      const context = await invoke<WorkflowContext | null>("get_workflow_context", { ideaId });
      set({ 
        currentWorkflowContext: context, 
        currentWorkflow: context?.workflow ?? null,
        workflowLoading: false 
      });
      return context;
    } catch (err) {
      console.error("Failed to fetch workflow context:", err);
      set({ workflowLoading: false });
      return null;
    }
  },

  generateAIContext: async (ideaId: string) => {
    try {
      const context = await invoke<string | null>("generate_ai_context", { ideaId });
      return context;
    } catch (err) {
      console.error("Failed to generate AI context:", err);
      return null;
    }
  },
}));
