import { create } from "zustand";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyTheme: () => void;
}

/**
 * Zustand store to manage active UI theme (light, dark, or system preferences).
 */
export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: (localStorage.getItem("decision-pilot-theme") as Theme) || "system",
  setTheme: (theme) => {
    localStorage.setItem("decision-pilot-theme", theme);
    set({ theme });
    get().applyTheme();
  },
  applyTheme: () => {
    const theme = get().theme;
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  },
}));

// Set up system theme listener on import (for runtime OS changes)
if (typeof window !== "undefined") {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const { theme, applyTheme } = useThemeStore.getState();
    if (theme === "system") {
      applyTheme();
    }
  });
}
