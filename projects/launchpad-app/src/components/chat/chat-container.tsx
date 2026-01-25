"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { ChatMessage, TypingIndicator } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ChatHistory } from "./chat-history";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Rocket,
  FolderSearch,
  GitBranch,
  Settings,
  History,
  Plus,
  Download,
  Terminal,
  Target,
  Shield,
  Radio,
} from "lucide-react";

interface ChatContainerProps {
  projectId?: string;
  projectName?: string;
}

const suggestedPrompts = [
  {
    icon: FolderSearch,
    title: "Scan Mission",
    description: "Analyze project directory and generate intel report",
    prompt: "I want to analyze a project. Can you help me scan a directory and generate a status report?",
  },
  {
    icon: GitBranch,
    title: "New Mission",
    description: "Initialize a new Micro-SaaS deployment",
    prompt: "I want to create a new Micro-SaaS project. What information do you need from me to get started?",
  },
  {
    icon: Target,
    title: "Mission Status",
    description: "Review SOP progress and next objectives",
    prompt: "Show me the current roadmap status and what SOPs I should focus on next.",
  },
  {
    icon: Settings,
    title: "Systems Config",
    description: "Configure services and integrations",
    prompt: "I need help setting up integrations. What services do I need to configure for a new project?",
  },
];

export function ChatContainer({ projectId, projectName }: ChatContainerProps) {
  // Use individual selectors to prevent unnecessary re-renders
  const messages = useAppStore((state) => state.messages);
  const sendMessage = useAppStore((state) => state.sendMessage);
  const sendingMessage = useAppStore((state) => state.sendingMessage);
  const settings = useAppStore((state) => state.settings);
  const setCurrentConversation = useAppStore((state) => state.setCurrentConversation);
  const createConversation = useAppStore((state) => state.createConversation);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    try {
      await sendMessage(content);
    } catch {
      // Error is already handled in the store
    }
  };

  const handleNewChat = async () => {
    setCurrentConversation(null);
    await createConversation(projectId);
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;

    const chatContent = messages
      .map((m) => `## ${m.role === "user" ? "Commander" : "Launchpad AI"}\n\n${m.content}`)
      .join("\n\n---\n\n");

    const blob = new Blob([`# Mission Log\n\n${chatContent}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mission-log-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasApiKey = !!settings.anthropic_api_key;

  return (
    <div className="flex h-full overflow-hidden bg-[var(--normandy-void)]">
      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header - Command Bar */}
        <div className="flex h-12 items-center justify-between border-b border-[var(--normandy-border)] bg-[var(--normandy-hull)] px-4">
          <div className="flex items-center gap-3">
            {/* Status Icon */}
            <div className="relative flex h-8 w-8 items-center justify-center">
              <div className="absolute inset-0 rounded bg-[var(--normandy-cyan)] opacity-10" />
              <div className="absolute inset-0 rounded border border-[var(--normandy-cyan)] opacity-30" />
              <Terminal className="relative h-4 w-4 text-[var(--normandy-cyan)]" />
            </div>
            <div>
              <h1 className="text-sm font-medium text-[var(--normandy-text-primary)] tracking-wide">
                {projectName ? projectName.toUpperCase() : "COMMAND TERMINAL"}
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-[var(--normandy-text-muted)]">
                {projectName ? "Mission Interface" : "AI Co-Pilot Active"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={handleExportChat}
                className="normandy-btn flex items-center gap-1.5 px-3 py-1.5 text-xs"
                title="Export log"
                aria-label="Export chat log as markdown file"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}
            <button
              onClick={handleNewChat}
              disabled={!hasApiKey}
              className="normandy-btn normandy-btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs disabled:opacity-50"
              aria-label="Start new chat session"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>New Session</span>
            </button>
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className="normandy-btn flex items-center justify-center px-2 py-1.5"
              title="Mission logs"
              aria-label={historyOpen ? "Close chat history" : "Open chat history"}
              aria-expanded={historyOpen}
            >
              <History className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 overflow-hidden">
          {messages.length === 0 ? (
            /* Empty State - Command Center */
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center px-4 py-12">
              {/* Normandy Logo */}
              <div className="relative mb-8">
                <div className="absolute -inset-8 rounded-full bg-[var(--normandy-orange)] opacity-10 blur-3xl" />
                <div className="relative flex h-20 w-20 items-center justify-center">
                  {/* Hexagonal frame effect */}
                  <div className="absolute inset-0 rounded-xl border-2 border-[var(--normandy-orange)] opacity-40" />
                  <div className="absolute inset-2 rounded-lg bg-gradient-to-br from-[var(--normandy-orange-subtle)] to-transparent" />
                  <Rocket className="relative h-10 w-10 text-[var(--normandy-orange)]" />
                </div>
              </div>

              <h2 className="normandy-heading mb-2 text-2xl tracking-wide">
                {projectName ? projectName.toUpperCase() : "LAUNCHPAD COMMAND"}
              </h2>
              <p className="normandy-label mb-8 text-center">
                {projectName
                  ? "Mission-aware AI interface ready"
                  : "Your AI co-founder for shipping Micro-SaaS"}
              </p>

              {!hasApiKey && (
                <div className="mb-8 flex items-center gap-3 rounded normandy-card px-4 py-3">
                  <Shield className="h-5 w-5 text-[var(--normandy-warning)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--normandy-warning)]">
                      API Key Required
                    </p>
                    <p className="text-xs text-[var(--normandy-text-muted)]">
                      Configure Anthropic API key in Settings to enable AI
                    </p>
                  </div>
                </div>
              )}

              {/* Mission Prompts Grid */}
              <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {suggestedPrompts.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.title}
                      onClick={() => handleSend(item.prompt)}
                      disabled={!hasApiKey}
                      className="group normandy-card-action flex items-start gap-3 p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {/* Icon */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--normandy-orange)] border-opacity-30 bg-[var(--normandy-orange-subtle)] transition-colors group-hover:border-opacity-60">
                        <Icon className="h-5 w-5 text-[var(--normandy-orange)]" />
                      </div>
                      {/* Text */}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[var(--normandy-text-primary)] group-hover:text-[var(--normandy-orange)]">
                          {item.title}
                        </div>
                        <div className="text-xs text-[var(--normandy-text-muted)]">
                          {item.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Decorative Elements */}
              <div className="normandy-divider mt-8 w-full max-w-md" />
              <div className="mt-4 flex items-center gap-2 text-[10px] text-[var(--normandy-text-muted)]">
                <Radio className="h-3 w-3 text-[var(--normandy-cyan)]" />
                <span>COMMS READY</span>
                <span className="opacity-50">•</span>
                <span>STANDBY FOR ORDERS</span>
              </div>
            </div>
          ) : (
            /* Messages */
            <div
              className="normandy-grid min-h-full"
              role="log"
              aria-label="Chat messages"
              aria-live="polite"
            >
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {sendingMessage && <TypingIndicator />}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-[var(--normandy-border)] bg-[var(--normandy-hull)] p-4">
          <div className="mx-auto max-w-3xl">
            <ChatInput
              onSend={handleSend}
              loading={sendingMessage}
              disabled={!hasApiKey}
              placeholder={
                hasApiKey
                  ? projectName
                    ? `Orders for ${projectName}...`
                    : "Enter command..."
                  : "Configure API key in Settings"
              }
            />
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      <ChatHistory
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        projectId={projectId}
      />
    </div>
  );
}
