"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Check, Eye, EyeOff, Loader2, Key, Shield, Cpu, Sun, Moon, Monitor, Palette } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function SettingsPage() {
  const { settings, setSetting } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings.anthropic_api_key) {
      setApiKey(settings.anthropic_api_key);
    }
  }, [settings.anthropic_api_key]);

  const handleSaveApiKey = async () => {
    setSaving(true);
    try {
      await setSetting("anthropic_api_key", apiKey);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save API key:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[var(--normandy-void)] normandy-scroll">
      <div className="mx-auto max-w-2xl p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="normandy-heading text-2xl tracking-wide">SYSTEM CONFIGURATION</h1>
          <p className="normandy-label mt-2">Configure Launchpad systems and integrations</p>
        </div>

        <div className="space-y-6">
          {/* API Key Section */}
          <div className="normandy-panel p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-[var(--normandy-orange)] opacity-15" />
                <div className="absolute inset-0 rounded-lg border border-[var(--normandy-orange)] opacity-40" />
                <Key className="relative h-6 w-6 text-[var(--normandy-orange)]" />
              </div>
              <div className="flex-1">
                <h3 className="normandy-heading text-lg">Anthropic API Access</h3>
                <p className="text-sm text-[var(--normandy-text-secondary)] mt-1">
                  Required for AI operations. Obtain key from{" "}
                  <a
                    href="https://console.anthropic.com/settings/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--normandy-cyan)] hover:text-[var(--normandy-orange)] underline transition-colors"
                  >
                    console.anthropic.com
                  </a>
                </p>
              </div>
            </div>
            <div className="normandy-divider mb-6" />
            <div className="space-y-3">
              <label className="normandy-label">API Key</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="normandy-input w-full pr-10 normandy-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--normandy-text-muted)] hover:text-[var(--normandy-cyan)] transition-colors"
                  >
                    {showKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <button
                  onClick={handleSaveApiKey}
                  disabled={saving || !apiKey}
                  className="normandy-btn normandy-btn-primary px-4 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : saved ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Automation Section */}
          <div className="normandy-panel p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-[var(--normandy-cyan)] opacity-15" />
                <div className="absolute inset-0 rounded-lg border border-[var(--normandy-cyan)] opacity-40" />
                <Cpu className="relative h-6 w-6 text-[var(--normandy-cyan)]" />
              </div>
              <div className="flex-1">
                <h3 className="normandy-heading text-lg">Automation Systems</h3>
                <p className="text-sm text-[var(--normandy-text-secondary)] mt-1">
                  Configure automatic project scanning and analysis
                </p>
              </div>
            </div>
            <div className="normandy-divider mb-6" />
            <div className="flex items-center justify-between rounded border border-[var(--normandy-border)] bg-[var(--normandy-surface)] p-4">
              <div>
                <p className="font-medium text-[var(--normandy-text-primary)]">Auto-Analyze Missions</p>
                <p className="text-sm text-[var(--normandy-text-muted)] mt-1">
                  Automatically scan project directories when opened
                </p>
              </div>
              <button
                onClick={() => setSetting("auto_analyze", String(!settings.auto_analyze))}
                className={`normandy-btn px-4 py-2 text-xs ${
                  settings.auto_analyze
                    ? "bg-[rgba(0,255,136,0.1)] border-[var(--normandy-success)] text-[var(--normandy-success)]"
                    : ""
                }`}
              >
                {settings.auto_analyze ? "ENABLED" : "DISABLED"}
              </button>
            </div>
          </div>

          {/* Theme Section */}
          <div className="normandy-panel p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-[var(--normandy-orange)] opacity-15" />
                <div className="absolute inset-0 rounded-lg border border-[var(--normandy-orange)] opacity-40" />
                <Palette className="relative h-6 w-6 text-[var(--normandy-orange)]" />
              </div>
              <div className="flex-1">
                <h3 className="normandy-heading text-lg">Interface Theme</h3>
                <p className="text-sm text-[var(--normandy-text-secondary)] mt-1">
                  Switch between dark and light modes
                </p>
              </div>
            </div>
            <div className="normandy-divider mb-6" />
            <div className="flex flex-col gap-3">
              <label className="normandy-label">Display Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded border p-4 transition-all ${
                    theme === "light"
                      ? "border-[var(--normandy-orange)] bg-[var(--normandy-orange-subtle)] text-[var(--normandy-orange)] shadow-[0_0_12px_var(--normandy-orange-glow)]"
                      : "border-[var(--normandy-border)] bg-[var(--normandy-surface)] text-[var(--normandy-text-secondary)] hover:border-[var(--normandy-text-muted)]"
                  }`}
                >
                  <Sun className="h-5 w-5" />
                  <span className="font-medium">Light</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded border p-4 transition-all ${
                    theme === "dark"
                      ? "border-[var(--normandy-cyan)] bg-[var(--normandy-cyan-subtle)] text-[var(--normandy-cyan)] shadow-[0_0_12px_var(--normandy-cyan-glow)]"
                      : "border-[var(--normandy-border)] bg-[var(--normandy-surface)] text-[var(--normandy-text-secondary)] hover:border-[var(--normandy-text-muted)]"
                  }`}
                >
                  <Moon className="h-5 w-5" />
                  <span className="font-medium">Dark</span>
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded border p-4 transition-all ${
                    theme === "system"
                      ? "border-[var(--normandy-text-primary)] bg-[var(--normandy-elevated)] text-[var(--normandy-text-primary)] ring-1 ring-[var(--normandy-border)]"
                      : "border-[var(--normandy-border)] bg-[var(--normandy-surface)] text-[var(--normandy-text-secondary)] hover:border-[var(--normandy-text-muted)]"
                  }`}
                >
                  <Monitor className="h-5 w-5" />
                  <span className="font-medium">System</span>
                </button>
              </div>
              <p className="text-xs text-[var(--normandy-text-muted)] mt-1">
                {theme === "system"
                  ? "Follows your operating system preference"
                  : theme === "dark"
                    ? "Deep space command center aesthetic"
                    : "Clean, professional interface"}
              </p>
            </div>
          </div>

          {/* System Info */}
          <div className="normandy-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-[var(--normandy-cyan)]" />
              <span className="normandy-label">System Status</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--normandy-text-muted)]">Version</span>
                <p className="normandy-mono text-[var(--normandy-cyan)]">1.7.0</p>
              </div>
              <div>
                <span className="text-[var(--normandy-text-muted)]">Theme</span>
                <p className="normandy-mono text-[var(--normandy-orange)]">NORMANDY</p>
              </div>
              <div>
                <span className="text-[var(--normandy-text-muted)]">Runtime</span>
                <p className="normandy-mono text-[var(--normandy-text-primary)]">Tauri 2.0</p>
              </div>
              <div>
                <span className="text-[var(--normandy-text-muted)]">AI Status</span>
                <div className="flex items-center gap-2">
                  <div className={`normandy-led ${apiKey ? 'normandy-led-online' : 'normandy-led-offline'}`} />
                  <span className="normandy-mono text-[var(--normandy-text-primary)]">
                    {apiKey ? "CONNECTED" : "OFFLINE"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
