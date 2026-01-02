"use client";

import { cn } from "@/lib/utils";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Message } from "@/lib/types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group flex gap-4 px-4 py-6 transition-colors",
        isUser ? "bg-transparent" : "bg-muted/40"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isUser
            ? "bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
            : "bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] shadow-[0_2px_8px_rgba(0,0,0,0.2),0_0_12px_rgba(59,130,246,0.15)]"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>
      <div className="flex-1 space-y-1.5 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {isUser ? "You" : "Launchpad AI"}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-border prose-code:text-primary prose-code:before:content-none prose-code:after:content-none">
          {isUser ? (
            <p className="whitespace-pre-wrap text-foreground">{message.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-3 list-disc pl-4 last:mb-0">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-3 list-decimal pl-4 last:mb-0">{children}</ol>
                ),
                li: ({ children }) => <li className="mb-1">{children}</li>,
                code: ({ className, children, ...props }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code
                        className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-primary"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="mb-3 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm last:mb-0">
                    {children}
                  </pre>
                ),
                h1: ({ children }) => (
                  <h1 className="mb-3 text-xl font-bold">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-2 text-lg font-semibold">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-2 text-base font-semibold">{children}</h3>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="mb-3 border-l-2 border-primary pl-4 italic text-muted-foreground">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
      {/* Copy button - only for AI messages */}
      {!isUser && (
        <button
          onClick={handleCopy}
          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          title="Copy message"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          )}
        </button>
      )}
    </div>
  );
}

// Typing indicator component
export function TypingIndicator() {
  return (
    <div className="flex gap-4 px-4 py-6 bg-muted/40">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] shadow-[0_2px_8px_rgba(0,0,0,0.2),0_0_12px_rgba(59,130,246,0.15)]">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="flex items-center gap-1 pt-2">
        <span className="text-sm font-semibold text-muted-foreground">Launchpad AI</span>
        <div className="flex items-center gap-1 ml-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60" />
        </div>
      </div>
    </div>
  );
}
