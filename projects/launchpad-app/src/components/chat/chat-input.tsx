"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Radio } from "lucide-react";
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
  placeholder = "Enter command...",
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
        "normandy-panel relative flex items-end gap-3 p-3 transition-all duration-200",
        isFocused && "normandy-panel-active",
        disabled && "opacity-50"
      )}
    >
      {/* Command prompt indicator */}
      <div className="flex items-center gap-2 self-center pl-1">
        <span className="text-xs font-bold text-[var(--normandy-orange)] normandy-mono">{">"}</span>
      </div>

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
          className="w-full resize-none bg-transparent px-1 py-1.5 text-sm text-[var(--normandy-text-primary)] outline-none placeholder:text-[var(--normandy-text-muted)] disabled:cursor-not-allowed normandy-mono"
        />
      </div>

      <div className="flex items-center gap-3">
        {loading && (
          <div className="flex items-center gap-2 text-xs">
            <Radio className="h-3 w-3 animate-pulse text-[var(--normandy-cyan)]" />
            <span className="text-[var(--normandy-cyan)] uppercase tracking-wider">Transmitting</span>
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || disabled || loading}
          className={cn(
            "normandy-btn flex h-9 w-9 shrink-0 items-center justify-center rounded transition-all",
            message.trim() && !disabled && !loading
              ? "normandy-btn-primary"
              : "opacity-50 cursor-not-allowed"
          )}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
