"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/design-system/primitives/glass";
import { Check, Eye, EyeOff, Loader2, Key, Palette, Zap, Moon, Sun, Monitor } from "lucide-react";

export default function SettingsPage() {
  const { settings, setSetting, fetchSettings, settingsLoading } = useAppStore();
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

  const handleThemeChange = async (theme: string) => {
    await setSetting("theme", theme);
    // Apply theme to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  };

  const themeOptions = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure Launchpad to work with your services
          </p>
        </div>

        <div className="space-y-6">
          {/* API Key */}
          <GlassCard intensity="subtle" className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] shadow-[0_4px_12px_rgba(0,0,0,0.25),0_0_20px_rgba(59,130,246,0.15)]">
                <Key className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">Anthropic API Key</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Required for AI chat functionality. Get your key from{" "}
                  <a
                    href="https://console.anthropic.com/settings/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    console.anthropic.com
                  </a>
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="api-key"
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="pr-10 bg-black/5 dark:bg-white/10 border-black/10 dark:border-white/20 focus:border-blue-500/50 text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <Button
                  onClick={handleSaveApiKey}
                  disabled={saving || !apiKey}
                  className="bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] text-white shadow-[0_2px_8px_rgba(0,0,0,0.25),0_0_12px_rgba(249,115,22,0.25)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.30),0_0_16px_rgba(249,115,22,0.35)]"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : saved ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Theme */}
          <GlassCard intensity="subtle" className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3A3A3C] to-[#1C1C1E] shadow-[0_4px_12px_rgba(0,0,0,0.25),0_0_20px_rgba(59,130,246,0.15)]">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Choose your preferred color scheme
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = settings.theme === option.value;
                return (
                  <Button
                    key={option.value}
                    variant="outline"
                    onClick={() => handleThemeChange(option.value)}
                    className={`flex-1 gap-2 ${
                      isActive
                        ? "bg-orange-500/10 border-orange-500/50 text-orange-500 dark:text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.20)]"
                        : "border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </GlassCard>

          {/* Auto Analyze */}
          <GlassCard intensity="subtle" className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">Automation</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Configure automatic project analysis
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-black/5 dark:bg-white/5 p-4 border border-black/10 dark:border-white/10">
              <div>
                <p className="font-medium text-foreground">Auto-analyze projects</p>
                <p className="text-sm text-muted-foreground">
                  Automatically analyze project directories when opened
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  setSetting("auto_analyze", String(!settings.auto_analyze))
                }
                className={`${
                  settings.auto_analyze
                    ? "bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-300"
                    : "border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/5 text-foreground"
                }`}
              >
                {settings.auto_analyze ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
