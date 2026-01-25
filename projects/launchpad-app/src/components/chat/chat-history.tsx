"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus, Trash2, X, Search, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/types";

interface ChatHistoryProps {
  open: boolean;
  onClose: () => void;
  projectId?: string;
}

export function ChatHistory({ open, onClose, projectId }: ChatHistoryProps) {
  const {
    conversations,
    fetchConversations,
    currentConversation,
    setCurrentConversation,
    createConversation,
    deleteConversation,
    chatLoading,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (c) => c.title?.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  useEffect(() => {
    if (open) {
      fetchConversations(projectId);
    }
  }, [open, projectId, fetchConversations]);

  const handleNewChat = async () => {
    await createConversation(projectId);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    onClose();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteConversation(id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "Today";
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Backdrop for mobile */}
      <div
        className="absolute inset-0 bg-[var(--normandy-void)]/80 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="normandy-panel absolute right-0 top-0 h-full w-80 border-l border-[var(--normandy-border)] bg-[var(--normandy-hull)] shadow-xl lg:relative lg:shadow-none">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-[var(--normandy-border)] px-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-[var(--normandy-cyan)]" />
            <h2 className="normandy-label text-[var(--normandy-text-primary)]">COMM LOGS</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleNewChat}
              className="normandy-btn p-2"
              title="New Session"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="normandy-btn p-2 lg:hidden"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-[var(--normandy-border)] p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--normandy-text-muted)]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="normandy-input w-full pl-9"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="h-[calc(100%-7.5rem)] normandy-scroll">
          <div className="p-2">
            {chatLoading ? (
              <div className="px-4 py-8 text-center">
                <div className="normandy-led normandy-led-warning mx-auto mb-3" />
                <p className="text-sm text-[var(--normandy-text-muted)] normandy-mono">
                  Scanning archives...
                </p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--normandy-cyan)]/20 bg-[var(--normandy-cyan-subtle)]">
                  <MessageSquare className="h-6 w-6 text-[var(--normandy-cyan)]/50" />
                </div>
                <p className="text-sm text-[var(--normandy-text-muted)]">
                  {searchQuery ? "No matching logs found" : "No comm logs recorded"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleNewChat}
                    className="normandy-btn normandy-btn-primary mt-4 px-4 py-2"
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Initialize Session
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={cn(
                      "group flex w-full items-start gap-3 rounded px-3 py-2 text-left transition-all border",
                      currentConversation?.id === conversation.id
                        ? "bg-[var(--normandy-orange-subtle)] text-[var(--normandy-orange)] border-[var(--normandy-orange)]/30 shadow-[0_0_12px_var(--normandy-orange-glow)]"
                        : "border-transparent hover:bg-[var(--normandy-cyan-subtle)] hover:border-[var(--normandy-cyan)]/20"
                    )}
                  >
                    <div className={cn(
                      "normandy-led mt-1.5",
                      currentConversation?.id === conversation.id
                        ? "normandy-led-online"
                        : "normandy-led-offline"
                    )} />
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-[var(--normandy-text-primary)]">
                        {conversation.title || "New session"}
                      </p>
                      <p className="text-xs text-[var(--normandy-text-muted)] normandy-mono">
                        {formatDate(conversation.created_at)}
                      </p>
                    </div>
                    <button
                      className="h-6 w-6 shrink-0 rounded p-1 opacity-0 transition-all group-hover:opacity-100 hover:bg-[rgba(255,68,68,0.1)] hover:text-[var(--normandy-danger)]"
                      onClick={(e) => handleDelete(e, conversation.id)}
                      title="Delete log"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
