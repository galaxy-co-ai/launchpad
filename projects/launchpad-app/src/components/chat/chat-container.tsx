"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { ChatMessage, TypingIndicator } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ChatHistory } from "./chat-history";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/design-system/primitives/glass";
import {
  Rocket,
  Sparkles,
  FolderSearch,
  GitBranch,
  Zap,
  Settings,
  History,
  Plus,
  Download,
  Search,
} from "lucide-react";

interface ChatContainerProps {
  projectId?: string;
  projectName?: string;
}

const suggestedPrompts = [
  {
    icon: FolderSearch,
    title: "Analyze Project",
    description: "Scan a project directory and generate a status report",
    prompt: "I want to analyze a project. Can you help me scan a directory and generate a status report?",
  },
  {
    icon: GitBranch,
    title: "Create New Project",
    description: "Start a new Micro-SaaS project from scratch",
    prompt: "I want to create a new Micro-SaaS project. What information do you need from me to get started?",
  },
  {
    icon: Zap,
    title: "Check Roadmap",
    description: "Review SOP progress for an existing project",
    prompt: "Show me the current roadmap status and what SOPs I should focus on next.",
  },
  {
    icon: Settings,
    title: "Setup Help",
    description: "Get help configuring services and integrations",
    prompt: "I need help setting up integrations. What services do I need to configure for a new project?",
  },
];

export function ChatContainer({ projectId, projectName }: ChatContainerProps) {
  const {
    messages,
    sendMessage,
    sendingMessage,
    settings,
    currentConversation,
    setCurrentConversation,
    createConversation,
  } = useAppStore();
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
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleNewChat = async () => {
    setCurrentConversation(null);
    await createConversation(projectId);
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;

    const chatContent = messages
      .map((m) => `## ${m.role === "user" ? "You" : "Launchpad AI"}\n\n${m.content}`)
      .join("\n\n---\n\n");

    const blob = new Blob([`# Chat Export\n\n${chatContent}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasApiKey = !!settings.anthropic_api_key;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-black/10 dark:border-white/10 bg-background/80 px-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] shadow-[0_4px_12px_rgba(0,0,0,0.25),0_0_20px_rgba(59,130,246,0.15)]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">
                {projectName ? `${projectName} Chat` : "Launchpad AI"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {projectName
                  ? "Project-aware assistant"
                  : "Your AI co-founder"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExportChat}
                className="rounded-lg"
                title="Export chat"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewChat}
              disabled={!hasApiKey}
              className="rounded-lg border-orange-500/30 bg-orange-500/10 text-orange-500 dark:text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.20)] hover:bg-orange-500/20 hover:shadow-[0_0_20px_rgba(249,115,22,0.30)]"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Chat
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setHistoryOpen(!historyOpen)}
              className="rounded-lg"
            >
              <History className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 overflow-hidden">
          {messages.length === 0 ? (
            /* Empty State */
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center px-4 py-12">
              {/* Gradient Icon */}
              <div className="relative mb-6">
                <div className="absolute -inset-4 rounded-3xl bg-blue-500/15 blur-2xl" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] shadow-[0_8px_20px_rgba(0,0,0,0.35),0_0_30px_rgba(59,130,246,0.20)]">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
              </div>

              <h2 className="mb-2 text-2xl font-bold text-foreground">
                {projectName ? `Chat about ${projectName}` : "Launchpad AI"}
              </h2>
              <p className="mb-8 max-w-md text-center text-muted-foreground">
                {projectName
                  ? "Ask questions about this project, get help with development, or update your roadmap."
                  : "Your AI co-founder for shipping Micro-SaaS products. Ask me anything!"}
              </p>

              {!hasApiKey && (
                <div className="mb-8 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span>Add your Anthropic API key in Settings to enable AI chat</span>
                </div>
              )}

              {/* Suggested Prompts */}
              <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {suggestedPrompts.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.title}
                      onClick={() => handleSend(item.prompt)}
                      disabled={!hasApiKey}
                      className="group flex items-start gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4 text-left backdrop-blur-sm transition-all hover:border-blue-500/20 hover:bg-black/10 dark:hover:bg-white/10 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15),0_0_20px_rgba(59,130,246,0.10)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] shadow-[0_4px_12px_rgba(0,0,0,0.25),0_0_12px_rgba(59,130,246,0.10)] transition-transform group-hover:scale-110 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.25),0_0_20px_rgba(59,130,246,0.20)]">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{item.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Messages */
            <div>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {sendingMessage && <TypingIndicator />}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-black/10 dark:border-white/10 bg-background/80 p-4 backdrop-blur-xl">
          <div className="mx-auto max-w-3xl">
            <ChatInput
              onSend={handleSend}
              loading={sendingMessage}
              disabled={!hasApiKey}
              placeholder={
                hasApiKey
                  ? projectName
                    ? `Ask about ${projectName}...`
                    : "Ask me about your projects..."
                  : "Add API key in Settings to chat"
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
