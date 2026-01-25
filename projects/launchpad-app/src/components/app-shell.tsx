"use client";

import { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Sidebar } from "@/components/sidebar";
import { TitleBar } from "@/components/titlebar";
import { ErrorToast } from "@/components/error-toast";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  // Use individual selectors to prevent unnecessary re-renders
  const fetchSettings = useAppStore((state) => state.fetchSettings);
  const checkOnboardingStatus = useAppStore((state) => state.checkOnboardingStatus);
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);
  const onboardingLoading = useAppStore((state) => state.onboardingLoading);
  const createConversation = useAppStore((state) => state.createConversation);
  const setCurrentConversation = useAppStore((state) => state.setCurrentConversation);
  const router = useRouter();
  const pathname = usePathname();

  const isOnboardingPage = pathname === "/onboarding";

  useEffect(() => {
    fetchSettings();
    checkOnboardingStatus();
  }, [fetchSettings, checkOnboardingStatus]);

  // Redirect to onboarding if not completed (and not already there)
  useEffect(() => {
    if (!onboardingLoading && !hasCompletedOnboarding && !isOnboardingPage) {
      router.push("/onboarding");
    }
  }, [onboardingLoading, hasCompletedOnboarding, isOnboardingPage, router]);

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

  // Show loading state while checking onboarding
  if (onboardingLoading) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <TitleBar />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="normandy-led normandy-led-warning" style={{ width: 16, height: 16 }} />
            <p className="normandy-mono text-sm text-[var(--normandy-text-muted)]">
              Initializing...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Onboarding page: no sidebar, minimal chrome
  if (isOnboardingPage) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <TitleBar />
        <main className="flex-1 overflow-hidden">{children}</main>
        <ErrorToast />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
      <ErrorToast />
    </div>
  );
}
