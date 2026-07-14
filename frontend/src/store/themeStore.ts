import { create } from "zustand";

export type Theme = "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyTheme: () => void;
}

/**
 * Zustand store to manage active UI theme (enforced to dark).
 */
export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "dark",
  setTheme: () => {
    set({ theme: "dark" });
    get().applyTheme();
  },
  applyTheme: () => {
    const root = window.document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
  },
}));

// Force dark mode immediately on script evaluation
if (typeof window !== "undefined") {
  const root = window.document.documentElement;
  root.classList.remove("light");
  root.classList.add("dark");
}
