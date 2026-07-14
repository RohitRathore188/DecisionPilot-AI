import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import AppRoutes from "@/routes";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import "./index.css";

function App() {
  const applyTheme = useThemeStore((s) => s.applyTheme);
  const setSession = useAuthStore((s) => s.setSession);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    // 1. Initialize Active Theme Styling
    applyTheme();

    // 2. Initialize Auth Session State
    const initAuth = async () => {
      try {
        if (!import.meta.env.VITE_SUPABASE_URL) {
          // If env credentials are missing, we run in mock mode
          setLoading(false);
          setInitialized(true);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (err) {
        console.error("Auth initialization failed:", err);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();

    // 3. Listen for auth updates from Supabase auth channel
    let subscription: any = null;
    if (import.meta.env.VITE_SUPABASE_URL) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
      subscription = data.subscription;
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [applyTheme, setSession, setLoading, setInitialized]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
