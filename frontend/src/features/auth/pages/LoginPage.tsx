import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import { Activity, ArrowRight, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => localStorage.getItem("decision-pilot-remembered-email") || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem("decision-pilot-remembered-email"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const setSession = useAuthStore((s) => s.setSession);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Save or delete email from localStorage for "Remember Me"
    if (rememberMe) {
      localStorage.setItem("decision-pilot-remembered-email", email);
    } else {
      localStorage.removeItem("decision-pilot-remembered-email");
    }

    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        // Mock Login for setup verification when Supabase is not configured
        setTimeout(() => {
          setSession({
            access_token: "mock-token",
            refresh_token: "mock-refresh",
            expires_in: 3600,
            token_type: "bearer",
            user: {
              id: "mock-user-id",
              app_metadata: {},
              user_metadata: { role: "owner" },
              aud: "authenticated",
              created_at: new Date().toISOString(),
              email,
            },
          });
          setLoading(false);
          navigate("/dashboard");
        }, 800);
        return;
      }

      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (err) throw err;

      if (data.session) {
        setSession(data.session);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="dark relative flex min-h-screen items-center justify-center bg-[#030303] text-[#f5f5f7] px-6 select-none">
      
      {/* Siri Ambient Glow Background Layer */}
      <div className="ambient-container">
        <div className="ambient-orb orb-blue animate-pulse-glow" />
        <div className="ambient-orb orb-pink animate-pulse-glow" style={{ animationDelay: "-3s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="w-full max-w-sm rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-apple-dialog backdrop-blur-2xl"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.05 }}
            className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#00c6ff] text-white shadow-apple-subtle"
          >
            <Activity className="h-6 w-6" />
          </motion.div>
          <h2 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70">
            Welcome back
          </h2>
          <p className="text-muted-foreground text-xs font-semibold mt-1">
            Access your decision modeling dashboard
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs font-bold text-destructive"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <span className="absolute left-3.5 top-9 text-muted-foreground/60 z-10">
              <Mail className="h-4 w-4" />
            </span>
            <Input
              id="email"
              type="email"
              required
              label="Email Address"
              className="pl-10 h-11 rounded-2xl border-white/10 bg-white/[0.02] text-white placeholder:text-muted-foreground/40 focus:border-primary focus:ring-primary/20"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-9 text-muted-foreground/60 z-10">
              <Lock className="h-4 w-4" />
            </span>
            <Input
              id="password"
              type="password"
              required
              label="Password"
              className="pl-10 h-11 rounded-2xl border-white/10 bg-white/[0.02] text-white focus:border-primary focus:ring-primary/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Remember Me & Forgot Password Toggles */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-white transition-colors">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 bg-white/[0.02] text-primary focus:ring-0 cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full h-11 rounded-2xl bg-primary text-white hover:bg-primary/95 text-xs tracking-wide"
          >
            {!loading && (
              <>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground font-semibold">
          Don't have an account?{" "}
          <Link to="/auth/signup" className="text-primary font-bold hover:underline">
            Create account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
