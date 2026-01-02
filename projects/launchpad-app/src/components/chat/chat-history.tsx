"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Plus, Trash2, X, Search } from "lucide-react";
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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-80 border-l border-black/10 dark:border-white/10 bg-background/95 shadow-xl backdrop-blur-xl lg:relative lg:shadow-none">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-black/10 dark:border-white/10 px-4">
          <h2 className="font-semibold text-foreground">Chat History</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleNewChat} className="rounded-lg">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-lg lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-black/10 dark:border-white/10 p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="pl-9 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 focus:border-blue-500/50"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="h-[calc(100%-7.5rem)]">
          <div className="p-2">
            {chatLoading ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <MessageSquare className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No matching conversations" : "No conversations yet"}
                </p>
                {!searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"
                    onClick={handleNewChat}
                  >
                    Start a new chat
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={cn(
                      "group flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-all",
                      currentConversation?.id === conversation.id
                        ? "bg-orange-500/10 text-orange-500 dark:text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                        : "hover:bg-black/5 dark:hover:bg-white/5"
                    )}
                  >
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium">
                        {conversation.title || "New conversation"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(conversation.created_at)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => handleDelete(e, conversation.id)}
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </Button>
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
