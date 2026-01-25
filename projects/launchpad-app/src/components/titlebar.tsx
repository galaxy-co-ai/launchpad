"use client";

import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X, Rocket, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isTauri, setIsTauri] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsTauri(typeof window !== "undefined" && "__TAURI__" in window);
  }, []);

  useEffect(() => {
    if (!isTauri) return;

    const checkMaximized = async () => {
      try {
        const maximized = await getCurrentWindow().isMaximized();
        setIsMaximized(maximized);
      } catch (e) {
        console.error("Failed to check maximized state:", e);
      }
    };

    checkMaximized();

    let unlisten: (() => void) | undefined;
    getCurrentWindow()
      .onResized(async () => {
        const maximized = await getCurrentWindow().isMaximized();
        setIsMaximized(maximized);
      })
      .then((fn) => {
        unlisten = fn;
      });

    return () => {
      unlisten?.();
    };
  }, [isTauri]);

  const handleMinimize = async () => {
    try {
      await getCurrentWindow().minimize();
    } catch (e) {
      console.error("Failed to minimize:", e);
    }
  };

  const handleMaximize = async () => {
    try {
      await getCurrentWindow().toggleMaximize();
    } catch (e) {
      console.error("Failed to toggle maximize:", e);
    }
  };

  const handleClose = async () => {
    try {
      await getCurrentWindow().close();
    } catch (e) {
      console.error("Failed to close:", e);
    }
  };

  if (!isTauri) return null;

  return (
    <div
      data-tauri-drag-region
      className="flex h-8 items-center justify-between border-b border-[var(--normandy-border)] bg-[var(--normandy-void)] select-none"
    >
      {/* App Title */}
      <div
        data-tauri-drag-region
        className="flex items-center gap-2 px-3"
      >
        {/* Normandy Logo */}
        <div className="relative flex h-5 w-5 items-center justify-center">
          <div className="absolute inset-0 rounded bg-[var(--normandy-orange)] opacity-15" />
          <Rocket className="relative h-3 w-3 text-[var(--normandy-orange)]" />
        </div>
        <span className="text-xs font-medium tracking-wide text-[var(--normandy-text-secondary)]">
          LAUNCHPAD
        </span>
        <span className="text-[10px] text-[var(--normandy-text-muted)]">
          COMMAND
        </span>
      </div>

      {/* System Status + Theme Toggle */}
      <div
        data-tauri-drag-region
        className="flex items-center gap-3 text-[10px] text-[var(--normandy-text-muted)]"
      >
        <div className="flex items-center gap-1.5">
          <div className="normandy-led normandy-led-online" style={{ width: '6px', height: '6px' }} />
          <span>SYS</span>
        </div>
        <span className="opacity-50">┃</span>
        <span className="normandy-mono text-[var(--normandy-cyan)]">
          {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </span>
        <span className="opacity-50">┃</span>

        {/* Theme Toggle */}
        <div className="flex items-center gap-0.5 rounded border border-[var(--normandy-border)] bg-[var(--normandy-panel)] p-0.5">
          <button
            onClick={() => setTheme("light")}
            className={`p-1.5 rounded transition-all ${
              theme === "light"
                ? "bg-[var(--normandy-orange)] text-white shadow-[0_0_8px_var(--normandy-orange-glow)]"
                : "text-[var(--normandy-text-muted)] hover:bg-[var(--normandy-surface)] hover:text-[var(--normandy-text-primary)]"
            }`}
            title="Light mode"
          >
            <Sun className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`p-1.5 rounded transition-all ${
              theme === "dark"
                ? "bg-[var(--normandy-cyan)] text-[var(--normandy-void)] shadow-[0_0_8px_var(--normandy-cyan-glow)]"
                : "text-[var(--normandy-text-muted)] hover:bg-[var(--normandy-surface)] hover:text-[var(--normandy-text-primary)]"
            }`}
            title="Dark mode"
          >
            <Moon className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`p-1.5 rounded transition-all ${
              theme === "system"
                ? "bg-[var(--normandy-surface)] text-[var(--normandy-text-primary)] ring-1 ring-[var(--normandy-border)]"
                : "text-[var(--normandy-text-muted)] hover:bg-[var(--normandy-surface)] hover:text-[var(--normandy-text-primary)]"
            }`}
            title="System preference"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Window Controls */}
      <div className="flex h-full">
        <button
          onClick={handleMinimize}
          className="flex h-full w-11 items-center justify-center text-[var(--normandy-text-muted)] transition-colors hover:bg-[var(--normandy-cyan-subtle)] hover:text-[var(--normandy-cyan)]"
          title="Minimize"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="flex h-full w-11 items-center justify-center text-[var(--normandy-text-muted)] transition-colors hover:bg-[var(--normandy-cyan-subtle)] hover:text-[var(--normandy-cyan)]"
          title={isMaximized ? "Restore" : "Maximize"}
        >
          <Square className="h-3 w-3" />
        </button>
        <button
          onClick={handleClose}
          className="flex h-full w-11 items-center justify-center text-[var(--normandy-text-muted)] transition-colors hover:bg-[var(--normandy-danger)] hover:text-white"
          title="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
