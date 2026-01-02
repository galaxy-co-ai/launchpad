"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Sidebar } from "@/components/sidebar";
import { TitleBar } from "@/components/titlebar";
import { Loader2 } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { fetchSettings, settingsLoading, createConversation, setCurrentConversation } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Check for Ctrl/Cmd key
    const isMod = e.ctrlKey || e.metaKey;

    if (isMod) {
      switch (e.key.toLowerCase()) {
        case "n":
          // Ctrl+N: New chat
          e.preventDefault();
          setCurrentConversation(null);
          createConversation();
          router.push("/");
          break;
        case ",":
          // Ctrl+,: Settings
          e.preventDefault();
          router.push("/settings");
          break;
        case "p":
          // Ctrl+P: New project
          e.preventDefault();
          router.push("/new-project");
          break;
        case "h":
          // Ctrl+H: Home
          e.preventDefault();
          router.push("/");
          break;
      }
    }
  }, [router, createConversation, setCurrentConversation]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex h-screen flex-col bg-background">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
