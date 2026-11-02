"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const subscribe = () => () => {};
const getMountedSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("navigation");
  const mounted = useSyncExternalStore(
    subscribe,
    getMountedSnapshot,
    getServerSnapshot,
  );

  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className="glass-panel inline-flex size-11 rounded-full"
      />
    );
  }

  return (
    <AnimatedThemeToggler
      theme={resolvedTheme === "light" ? "light" : "dark"}
      onThemeChange={setTheme}
      aria-label={t("toggleTheme")}
      className="glass-panel inline-flex size-11 items-center justify-center rounded-full text-foreground transition-transform duration-200 hover:bg-foreground/10 active:scale-95"
    />
  );
}
