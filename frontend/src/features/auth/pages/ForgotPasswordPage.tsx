import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Mail, Key } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        // Mock recovery flow when Supabase is not configured
        setTimeout(() => {
          setSent(true);
          setLoading(false);
        }, 800);
        return;
      }

      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/login`,
      });

      if (err) throw err;
      setSent(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "An error occurred during password reset.");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#030303] text-[#f5f5f7] px-6 select-none">
      
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
            <Key className="h-5 w-5" />
          </motion.div>
          <h2 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70">
            Reset Password
          </h2>
          <p className="text-muted-foreground text-xs font-semibold mt-1">
            We will send you a password recovery link
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-center"
          >
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-xs font-bold text-green-400">
              Recovery link has been sent! Check your inbox.
            </div>
            <Link to="/auth/login" className="block">
              <Button className="w-full rounded-2xl">Return to Sign In</Button>
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {error && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs font-bold text-destructive">
                {error}
              </div>
            )}

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

            <Button
              type="submit"
              isLoading={loading}
              className="w-full h-11 rounded-2xl bg-primary text-white hover:bg-primary/95 text-xs tracking-wide"
            >
              {!loading && (
                <>
                  Send Recovery Link
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <div className="text-center text-xs text-muted-foreground font-semibold">
              <Link to="/auth/login" className="text-primary font-bold hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
