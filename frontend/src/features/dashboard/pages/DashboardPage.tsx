import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDecisionStore, Decision } from "@/store/decisionStore";
import { useAuthStore } from "@/store/authStore";
import { 
  Plus, 
  BarChart3, 
  ChevronRight, 
  Sparkles, 
  AlertTriangle, 
  RotateCw, 
  Sliders, 
  CheckCircle2, 
  Package, 
  Lightbulb, 
  Bell,
  Cpu,
  Database,
  Shield,
  Terminal,
  HardDrive,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const decisions = useDecisionStore((state) => state.decisions);
  const role = useAuthStore((state) => state.role);

  // States to animate values on load (Futuristic loading states)
  const [chartLoading, setChartLoading] = useState(true);

  const [healthScore, setHealthScore] = useState(0);

  useEffect(() => {
    // Simulate futuristic loading curves for charts
    const timer = setTimeout(() => setChartLoading(false), 900);
    // Animate Business Health Score count-up
    const interval = setInterval(() => {
      setHealthScore((prev) => {
        if (prev >= 86) {
          clearInterval(interval);
          return 86;
        }
        return prev + 2;
      });
    }, 20);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const getStatusStyle = (status: Decision["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "running":
        return "bg-primary/10 text-primary border-primary/20 animate-pulse";
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } },
  };

  if (role === "admin") {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8 select-none"
      >
        {/* Title Header */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gradient">
              Admin Control Center
            </h1>
            <p className="text-muted-foreground text-xs font-semibold mt-0.5">
              Global system diagnostics, user sessions, calculation queue, and API usage.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-ping" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">System Operational</span>
          </div>
        </motion.div>

        {/* ── System Diagnostics Row ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "System Latency", value: "12 ms", desc: "FastAPI endpoints response", icon: Cpu, color: "text-blue-400" },
            { label: "API Rate Limits", value: "99.8%", desc: "Capacity buffer healthy", icon: Shield, color: "text-green-400" },
            { label: "FastAPI Task Queue", value: "0 active", desc: "Monte Carlo engine idle", icon: Terminal, color: "text-amber-400" },
            { label: "DB Connections", value: "4 / 20", desc: "Supabase pools active", icon: Database, color: "text-purple-400" }
          ].map((diag) => {
            const Icon = diag.icon;
            return (
              <div key={diag.label} className="apple-glass border-white/5 rounded-2xl p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Icon className={`h-4.5 w-4.5 ${diag.color}`} />
                </div>
                <div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{diag.label}</div>
                  <div className="text-lg font-extrabold text-white mt-0.5">{diag.value}</div>
                  <div className="text-[8px] text-muted-foreground font-semibold">{diag.desc}</div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* ── Admin Grid ── */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          
          {/* User Registry & Roles (7 Cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-7">
            <Card className="apple-glass-card border-white/5 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">User Registry & Workspace Roles</h3>
                  <p className="text-[9px] text-muted-foreground mt-0.5 font-semibold">Active accounts in current organization session</p>
                </div>
                <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold">3 Users</span>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { email: "owner@decisionpilot.ai", role: "Business Owner", active: "active", icon: Users, badge: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                  { email: "employee@decisionpilot.ai", role: "Employee", active: "active", icon: Users, badge: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
                  { email: "admin@decisionpilot.ai", role: "System Admin", active: "active", icon: Shield, badge: "bg-green-500/10 text-green-400 border-green-500/20" }
                ].map((u) => {
                  const Icon = u.icon;
                  return (
                    <div key={u.email} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.01]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{u.email}</p>
                          <p className="text-[9px] text-muted-foreground font-semibold mt-0.5">{u.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[8px] font-bold ${u.badge}`}>
                          {u.role.split(" ").pop()}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* FastAPI Monte Carlo Queue (5 Cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-5">
            <Card className="apple-glass-card border-white/5 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4.5 w-4.5 text-primary" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">FastAPI Sim Queue</span>
                </div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">Normal Load</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-white">Active Workers</span>
                    <span className="text-green-400 font-mono">2 / 2 threads operational</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-full" />
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[8px] text-muted-foreground uppercase font-bold block">Calculation Logs</span>
                  <div className="font-mono text-[9px] text-muted-foreground space-y-1 leading-relaxed mt-1">
                    <p className="text-green-400">INFO: [Queue] MC Simulation Task started</p>
                    <p>INFO: [FastAPI] 1000 trials resolved in 1.48s</p>
                    <p className="text-green-400">INFO: [Queue] Completed task: MC-9023</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

        </div>

        {/* ── Billing & SME Licenses (12 Cols) ── */}
        <motion.div variants={itemVariants}>
          <Card className="apple-glass-card border-white/5 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">SME Licenses & Billing Health</h3>
                <p className="text-[9px] text-muted-foreground mt-0.5 font-semibold">Subscription bands and billing MRR tracking</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-green-400 font-mono">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span>₹178,000 MRR</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { plan: "Free Sandbox", count: "128 licenses", mrr: "₹0", icon: Users, color: "text-blue-400" },
                { plan: "Startup Pro", count: "24 licenses", mrr: "₹143,976", icon: HardDrive, color: "text-purple-400" },
                { plan: "Enterprise", count: "1 custom", mrr: "₹34,024", icon: Shield, color: "text-green-400" }
              ].map((sub) => {
                const Icon = sub.icon;
                return (
                  <div key={sub.plan} className="p-4.5 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8.5 w-8.5 rounded-xl bg-white/5 flex items-center justify-center">
                        <Icon className={`h-4.5 w-4.5 ${sub.color}`} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{sub.plan}</h4>
                        <p className="text-[9px] text-muted-foreground mt-0.5 font-semibold">{sub.count}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-white font-mono">{sub.mrr}</span>
                      <span className="text-[8px] text-muted-foreground block font-bold uppercase mt-0.5">MRR contribution</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* ── AI Token Usage ── */}
        <motion.div variants={itemVariants}>
          <Card className="apple-glass-card border-white/5 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Gemini AI Token Costs</span>
              </div>
              <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">Usage Period: July</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">Flash Model Input</span>
                  <span className="text-lg font-extrabold text-white mt-1 block font-mono">1,489,200 tokens</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">Cost</span>
                  <span className="text-base font-extrabold text-green-400 mt-1 block font-mono">₹112.44</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">Flash Model Output</span>
                  <span className="text-lg font-extrabold text-white mt-1 block font-mono">684,500 tokens</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">Cost</span>
                  <span className="text-base font-extrabold text-green-400 mt-1 block font-mono font-mono">₹156.12</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 select-none"
    >
      {/* Title Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-xs font-semibold mt-0.5">
            Active workspace health overview & simulation metrics.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/decisions/new">
            <Button variant="primary" className="rounded-full shadow-apple-subtle">
              <Plus className="h-4.5 w-4.5" />
              New Simulation
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* DYNAMIC GRID LAYOUT (Futuristic dashboard structure) */}
      <div className="grid gap-6 md:grid-cols-12">
        
        {/* 1. BUSINESS HEALTH SCORE & GAUGES (5 Cols) */}
        <motion.div variants={itemVariants} className="md:col-span-5 h-full">
          <Card isHoverable className="apple-glass-card border-white/5 p-6 flex flex-col justify-between h-full min-h-[280px]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Business Health Index</span>
                <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold">Stable</span>
              </div>
              <p className="text-[10px] text-muted-foreground/75 mt-0.5">Aggregated metrics calculation score.</p>
            </div>

            {/* Circular Ring Score */}
            <div className="flex items-center justify-center py-6">
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="url(#healthGradient)"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 52}
                    animate={{ strokeDashoffset: (2 * Math.PI * 52) * (1 - healthScore / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#007AFF" />
                      <stop offset="100%" stopColor="#00c6ff" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold font-mono text-white">{healthScore}</span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Health Score</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              Workspace is operating at <span className="text-white font-bold">optimal margin</span> limits.
            </div>
          </Card>
        </motion.div>

        {/* 2. TODAY'S RECOMMENDATION & CONFIDENCE (7 Cols) */}
        <motion.div variants={itemVariants} className="md:col-span-7 h-full">
          <Card isHoverable className="apple-glass-card border-white/5 p-6 h-full flex flex-col justify-between min-h-[280px] bg-gradient-to-br from-white/[0.01] to-white/[0.04]">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary animate-bounce">
                  <Lightbulb className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Today's AI Recommendation</h3>
                  <span className="text-[9px] text-primary font-bold">Priority Actions Queue</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Increase Q3 Conversion Campaign Spend
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                  Calculations predict raising website conversion spend by <span className="text-white font-bold">$15,000</span> will expand net margin margins to <span className="text-green-400 font-bold">+18.4%</span>.
                </p>
              </div>
            </div>

            {/* AI Confidence metrics banner */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">AI Confidence Score</span>
                <span className="text-2xl font-extrabold font-mono text-primary mt-1 block">94.6%</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Simulations Audited</span>
                <span className="text-2xl font-extrabold font-mono text-white mt-1 block">142 runs</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 3. REVENUE FORECAST & PROFIT PREDICTIONS (8 Cols) */}
        <motion.div variants={itemVariants} className="md:col-span-8">
          <Card className="apple-glass-card border-white/5 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Revenue Forecast & Profit Predictions</h3>
                <span className="text-[9px] text-muted-foreground">6-Month dynamic compounding model projections</span>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[9px] font-bold text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Revenue
                </span>
                <span className="flex items-center gap-1 text-[9px] font-bold text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-400" /> Net Profit
                </span>
              </div>
            </div>

            {/* Chart Grid with animated loading bars */}
            <div className="h-48 flex flex-col justify-end relative">
              <AnimatePresence>
                {chartLoading ? (
                  <motion.div
                    key="loader"
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex justify-between items-end gap-4 pt-6 animate-pulse"
                  >
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-full flex flex-col items-center">
                        <div className="flex items-end justify-center w-full gap-1 h-36">
                          <div className="w-full bg-white/5 h-16 rounded-t-sm" />
                          <div className="w-full bg-white/5 h-10 rounded-t-sm" />
                        </div>
                        <div className="w-8 bg-white/5 h-2 rounded mt-2" />
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="bars"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-between items-end h-full gap-4 pt-6"
                  >
                    {[
                      { month: "Month 1", rev: 70, prf: 40 },
                      { month: "Month 2", rev: 80, prf: 48 },
                      { month: "Month 3", rev: 95, prf: 60 },
                      { month: "Month 4", rev: 110, prf: 72 },
                      { month: "Month 5", rev: 130, prf: 90 },
                      { month: "Month 6", rev: 160, prf: 118 },
                    ].map((data, idx) => (
                      <div key={idx} className="w-full flex flex-col items-center group">
                        <div className="flex items-end justify-center w-full gap-1 h-36">
                          {/* Revenue Bar */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${data.rev / 1.6}%` }}
                            transition={{ type: "spring", stiffness: 280, damping: 25, delay: idx * 0.05 }}
                            className="w-full bg-primary rounded-t-sm"
                          />
                          {/* Profit Bar */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${data.prf / 1.6}%` }}
                            transition={{ type: "spring", stiffness: 280, damping: 25, delay: idx * 0.05 + 0.1 }}
                            className="w-full bg-green-400 rounded-t-sm"
                          />
                        </div>
                        <span className="text-[8px] text-muted-foreground font-bold font-mono mt-2 uppercase">{data.month}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        {/* 4. INVENTORY HEALTH & RISK PROFILE (4 Cols) */}
        <motion.div variants={itemVariants} className="md:col-span-4 space-y-6">
          {/* Inventory Health */}
          <Card isHoverable className="apple-glass-card border-white/5 p-6 space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-4.5 w-4.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Inventory Health</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-white">Optimum stock</span>
                <span className="font-mono text-primary">78%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "78%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-primary"
                />
              </div>
              <p className="text-[9px] text-muted-foreground leading-relaxed font-semibold">
                Stocking models are optimized. <span className="text-amber-400">Restock Alert</span> on Category B.
              </p>
            </div>
          </Card>

          {/* Business Risk */}
          <Card isHoverable className="apple-glass-card border-white/5 p-6 space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Risk profile</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-white">Risk vulnerability</span>
                <span className="font-mono text-amber-500">Low Threat</span>
              </div>
              <p className="text-[9px] text-muted-foreground leading-relaxed font-semibold">
                Cash-to-opex buffers are <span className="text-green-400 font-bold">1.4x</span>. Leverage exposure remains inside baseline safety parameters.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* 5. QUICK ACTIONS & ALERTS (4 Cols) */}
        <motion.div variants={itemVariants} className="md:col-span-4">
          <Card className="apple-glass-card border-white/5 p-6 space-y-4 h-full min-h-[300px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Workbench Tools</h3>
            
            <div className="space-y-3">
              <Link to="/decisions/new" className="block">
                <Button className="w-full justify-between rounded-2xl h-11 bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.06] text-white text-xs">
                  <span className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    Configure Scenario
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </Link>

              <button
                onClick={() => {
                  setChartLoading(true);
                  setTimeout(() => setChartLoading(false), 850);
                }}
                className="flex items-center justify-between w-full rounded-2xl h-11 bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.06] px-4 text-white text-xs transition-colors"
              >
                <span className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4 text-primary" />
                  Reload calculation pipeline
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>

            {/* Micro warning notifications list */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Real-time alerts</span>
              <div className="flex gap-2 p-2.5 rounded-xl bg-white/[0.01] border border-white/5 text-[9px] font-semibold text-muted-foreground">
                <Bell className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                No pending API exceptions. Server is running normally.
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 6. RECENT SIMULATIONS MATRIX (8 Cols) */}
        <motion.div variants={itemVariants} className="md:col-span-8">
          <Card className="apple-glass-card border-white/5 overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Scenario Decisions</h2>
              <span className="text-[9px] bg-secondary px-2.5 py-0.5 rounded-full font-bold text-muted-foreground">
                {decisions.length} Active
              </span>
            </div>

            {decisions.length === 0 ? (
              <div className="p-16 text-center max-w-sm mx-auto space-y-4">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/60 text-muted-foreground">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">No decisions configured</h3>
                  <p className="text-muted-foreground text-[10px] font-semibold mt-1 mb-4">
                    Simulate your first scenario to predict ROI curves.
                  </p>
                  <Link to="/decisions/new">
                    <Button size="sm" className="rounded-full h-8 text-[10px]">
                      <Plus className="h-3 w-3" />
                      Configure Scenario
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {decisions.slice(0, 3).map((decision) => (
                  <Link
                    key={decision.id}
                    to={`/decisions/${decision.id}`}
                    className="flex items-center justify-between px-6 py-4.5 transition-colors hover:bg-secondary/20 block group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/60 text-muted-foreground group-hover:text-primary transition-colors border border-border/15">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs truncate text-white group-hover:text-primary transition-colors">
                          {decision.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5 font-semibold">
                          {decision.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold ${getStatusStyle(decision.status)}`}>
                        {decision.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}
