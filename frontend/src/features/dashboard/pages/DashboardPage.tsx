import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDecisionStore, Decision } from "@/store/decisionStore";
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
  Bell 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const decisions = useDecisionStore((state) => state.decisions);

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
