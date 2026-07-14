import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type UserRole = "admin" | "owner" | "employee";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  role: UserRole | null;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;
  logout: () => Promise<void>;
}

/**
 * Zustand store to manage user authentication session and role permissions.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,
  role: null,

  setSession: (session) => {
    const user = session?.user ?? null;
    // Extract role from metadata, default to 'owner' for business signups
    const role = (user?.user_metadata?.role as UserRole) || (user ? "owner" : null);

    set({
      session,
      user,
      role,
      loading: false,
    });
  },

  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),

  hasRole: (allowedRoles) => {
    const userRole = get().role;
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
  },

  logout: async () => {
    set({ loading: true });
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        await supabase.auth.signOut();
      }
    } finally {
      set({ user: null, session: null, role: null, loading: false });
    }
  },
}));
