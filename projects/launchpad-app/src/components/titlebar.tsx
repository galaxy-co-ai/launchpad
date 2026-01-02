"use client";

import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X, Rocket } from "lucide-react";

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isTauri, setIsTauri] = useState(false);

  useEffect(() => {
    // Check if we're running in Tauri
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

    // Listen for resize events
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

  // Don't render in browser
  if (!isTauri) return null;

  return (
    <div
      data-tauri-drag-region
      className="flex h-8 items-center justify-between border-b border-black/10 dark:border-white/10 bg-background/95 backdrop-blur-xl select-none"
    >
      {/* App Title */}
      <div
        data-tauri-drag-region
        className="flex items-center gap-2 px-3"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] shadow-[0_2px_8px_rgba(0,0,0,0.25),0_0_12px_rgba(59,130,246,0.15)]">
          <Rocket className="h-3 w-3 text-white" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          Launchpad
        </span>
      </div>

      {/* Window Controls */}
      <div className="flex h-full">
        <button
          onClick={handleMinimize}
          className="flex h-full w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground"
          title="Minimize"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          onClick={handleMaximize}
          className="flex h-full w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground"
          title={isMaximized ? "Restore" : "Maximize"}
        >
          <Square className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleClose}
          className="flex h-full w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-red-500 hover:text-white"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
