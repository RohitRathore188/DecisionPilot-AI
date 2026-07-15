import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import { Activity, ArrowRight, Mail, Lock, Building, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<"owner" | "employee" | "admin">("owner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const setSession = useAuthStore((s) => s.setSession);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        // Mock sign up if no Supabase credentials configured
        setTimeout(() => {
          setSession({
            access_token: "mock-token",
            refresh_token: "mock-refresh",
            expires_in: 3600,
            token_type: "bearer",
            user: {
              id: "mock-user-id",
              app_metadata: {},
              user_metadata: { companyName, role },
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

      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            companyName,
            role,
          },
        },
      });

      if (err) throw err;

      if (data.session) {
        setSession(data.session);
        navigate("/dashboard");
      } else {
        // Attempt to auto-login immediately using the credentials
        try {
          const { data: logInData } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (logInData?.session) {
            setSession(logInData.session);
            navigate("/dashboard");
            return;
          }
        } catch {
          // Ignore and fallback
        }
        alert("Account created! Please check your email for the confirmation link to complete sign up.");
        navigate("/auth/login");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
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
        <div className="flex flex-col items-center text-center mb-6">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.05 }}
            className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#00c6ff] text-white shadow-apple-subtle"
          >
            <Activity className="h-6 w-6" />
          </motion.div>
          <h2 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70">
            Create account
          </h2>
          <p className="text-muted-foreground text-xs font-semibold mt-1">
            Build decision intelligence into your business
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

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <span className="absolute left-3.5 top-9 text-muted-foreground/60 z-10">
              <Building className="h-4 w-4" />
            </span>
            <Input
              id="company"
              type="text"
              required
              label="Company Name"
              className="pl-10 h-11 rounded-2xl border-white/10 bg-white/[0.02] text-white placeholder:text-muted-foreground/40 focus:border-primary focus:ring-primary/20"
              placeholder="Acme SME Ltd"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

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

          {/* Role selection dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground">
              Select Workspace Role
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-muted-foreground/60 z-10">
                <Shield className="h-4 w-4" />
              </span>
              <select
                className="flex w-full h-11 pl-10 pr-3.5 rounded-2xl border border-white/10 bg-white/[0.02] text-white text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="owner" className="bg-[#0f0f11] text-white">Business Owner</option>
                <option value="employee" className="bg-[#0f0f11] text-white">Employee</option>
                <option value="admin" className="bg-[#0f0f11] text-white">System Admin</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full h-11 rounded-2xl bg-primary text-white hover:bg-primary/95 text-xs tracking-wide mt-2"
          >
            {!loading && (
              <>
                Sign Up
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground font-semibold">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
