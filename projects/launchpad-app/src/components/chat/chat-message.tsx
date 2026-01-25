"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { User, Copy, Check, Terminal } from "lucide-react";
import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import type { Message } from "@/lib/types";

interface ChatMessageProps {
  message: Message;
}

// Clean AI response content - strip function call XML and format nicely
function cleanAIContent(content: string): string {
  // Remove XML function call tags and their content
  const cleaned = content
    // Remove anythingllm function calls
    .replace(/<anythingllm-function-call>[\s\S]*?<\/anythingllm-function-call>/g, '')
    .replace(/<anythingllm-function-call-response>[\s\S]*?<\/anythingllm-function-call-response>/g, '')
    // Remove invoke tags
    .replace(/<invoke[\s\S]*?<\/invoke>/g, '')
    .replace(/<invoke[\s\S]*?\/>/g, '')
    // Remove parameter tags
    .replace(/<parameter[\s\S]*?<\/parameter>/g, '')
    // Remove any remaining XML-like tags that look like function calls
    .replace(/<[a-z-]+>[\s\S]*?<\/[a-z-]+>/gi, (match) => {
      // Keep markdown code blocks and common HTML
      if (match.includes('```') || /^<(p|div|span|a|em|strong|code|pre|ul|ol|li|h[1-6]|blockquote)>/i.test(match)) {
        return match;
      }
      return '';
    })
    // Clean up excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // If content is mostly empty after cleaning, provide a helpful message
  if (cleaned.length < 20 && content.length > 100) {
    return "I'm processing your request. The response contained technical data that has been processed.";
  }

  return cleaned;
}

export const ChatMessage = memo(function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  // Clean AI content before rendering
  const displayContent = useMemo(() => {
    if (isUser) return message.content;
    return cleanAIContent(message.content);
  }, [message.content, isUser]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group flex gap-4 px-4 py-5 transition-colors",
        isUser
          ? "bg-transparent"
          : "bg-[var(--normandy-cyan-subtle)] border-l-2 border-[var(--normandy-cyan)]"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "relative flex h-8 w-8 shrink-0 items-center justify-center rounded",
          isUser
            ? "bg-[var(--normandy-orange-subtle)] border border-[var(--normandy-orange)] border-opacity-40"
            : "bg-[var(--normandy-cyan-subtle)] border border-[var(--normandy-cyan)] border-opacity-40"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-[var(--normandy-orange)]" />
        ) : (
          <Terminal className="h-4 w-4 text-[var(--normandy-cyan)]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1.5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            isUser ? "text-[var(--normandy-orange)]" : "text-[var(--normandy-cyan)]"
          )}>
            {isUser ? "Commander" : "Launchpad AI"}
          </span>
          <span className="text-[10px] text-[var(--normandy-text-muted)] normandy-mono">
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Message Content */}
        <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-p:text-[var(--normandy-text-primary)] prose-headings:text-[var(--normandy-text-primary)]">
          {isUser ? (
            <p className="whitespace-pre-wrap text-[var(--normandy-text-primary)]">{displayContent}</p>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0 text-[var(--normandy-text-primary)] leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-3 list-disc pl-4 last:mb-0 marker:text-[var(--normandy-cyan)] space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-3 list-decimal pl-4 last:mb-0 marker:text-[var(--normandy-cyan)] space-y-1">{children}</ol>
                ),
                li: ({ children }) => <li className="text-[var(--normandy-text-primary)]">{children}</li>,
                code: ({ className, children, ...props }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code
                        className="rounded bg-[var(--normandy-panel)] px-1.5 py-0.5 text-sm font-mono text-[var(--normandy-cyan)] border border-[var(--normandy-border)]"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className={cn("text-[var(--normandy-text-primary)]", className)} {...props}>
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="normandy-panel mb-3 overflow-x-auto rounded-lg p-4 text-sm last:mb-0 border border-[var(--normandy-border)]">
                    {children}
                  </pre>
                ),
                h1: ({ children }) => (
                  <h1 className="mb-4 mt-6 text-xl font-bold text-[var(--normandy-orange)] first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-3 mt-5 text-lg font-semibold text-[var(--normandy-cyan)] first:mt-0">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-2 mt-4 text-base font-semibold text-[var(--normandy-text-primary)] first:mt-0">{children}</h3>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="mb-3 border-l-2 border-[var(--normandy-orange)] pl-4 italic text-[var(--normandy-text-secondary)] bg-[var(--normandy-orange-subtle)] py-2 rounded-r">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-[var(--normandy-cyan)] underline underline-offset-2 hover:text-[var(--normandy-orange)] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-[var(--normandy-orange)]">{children}</strong>
                ),
                hr: () => (
                  <hr className="normandy-divider my-4" />
                ),
              }}
            >
              {displayContent}
            </ReactMarkdown>
          )}
        </div>
      </div>

      {/* Copy button - only for AI messages */}
      {!isUser && (
        <button
          onClick={handleCopy}
          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 p-1 rounded hover:bg-[var(--normandy-surface)]"
          title="Copy message"
        >
          {copied ? (
            <Check className="h-4 w-4 text-[var(--normandy-success)]" />
          ) : (
            <Copy className="h-4 w-4 text-[var(--normandy-text-muted)] hover:text-[var(--normandy-cyan)]" />
          )}
        </button>
      )}
    </div>
  );
});

// Typing indicator component
export function TypingIndicator() {
  return (
    <div className="flex gap-4 px-4 py-5 bg-[var(--normandy-cyan-subtle)] border-l-2 border-[var(--normandy-cyan)]">
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[var(--normandy-cyan-subtle)] border border-[var(--normandy-cyan)] border-opacity-40">
        <Terminal className="h-4 w-4 text-[var(--normandy-cyan)]" />
      </div>
      <div className="flex items-center gap-2 pt-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--normandy-cyan)]">
          Launchpad AI
        </span>
        <div className="flex items-center gap-1 ml-2">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--normandy-cyan)] [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--normandy-cyan)] [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--normandy-cyan)]" />
        </div>
        <span className="text-[10px] text-[var(--normandy-text-muted)] ml-2">PROCESSING</span>
      </div>
    </div>
  );
}
