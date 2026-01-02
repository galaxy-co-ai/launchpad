"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  loading = false,
  placeholder = "Type your message...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !disabled && !loading) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-end gap-2 rounded-2xl border bg-card p-3 shadow-sm transition-all duration-200",
        isFocused
          ? "border-primary/50 ring-2 ring-primary/20"
          : "border-border",
        disabled && "opacity-60"
      )}
    >
      {/* Subtle gradient accent */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />

      <div className="flex-1">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled || loading}
          rows={1}
          className="w-full resize-none bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex items-center gap-2">
        {loading && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 animate-pulse text-primary" />
            <span>Thinking...</span>
          </div>
        )}
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || disabled || loading}
          size="sm"
          className={cn(
            "shrink-0 rounded-xl transition-all",
            message.trim() && !disabled && !loading
              ? "bg-primary hover:bg-primary/90"
              : "bg-muted text-muted-foreground"
          )}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
