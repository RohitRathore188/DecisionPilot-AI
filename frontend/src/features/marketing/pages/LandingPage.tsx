import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Activity,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Layers,
  ChevronRight,
  Check,
  Star,
  Play,
  BarChart3,
  Network,
  Zap,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [revenue, setRevenue] = useState(150000);
  const [conversionRate, setConversionRate] = useState(2.8);
  const [marketingBudget, setMarketingBudget] = useState(18000);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const simulatedRevenue = Math.round(revenue * (conversionRate / 2.5));
  const simulatedMargin = 22;
  const simulatedProfit = Math.round(simulatedRevenue * (simulatedMargin / 100) - marketingBudget);
  const simulatedRoi = Math.round(((simulatedRevenue * (simulatedMargin / 100)) / (marketingBudget || 1)) * 100);

  const faqs = [
    {
      q: "How does the decision simulation calculate outcomes?",
      a: "Our backend engine compiles your input variables and runs sensitivity models using Python (FastAPI + NumPy) alongside historical confidence limits, projecting cash flow margins over 6-month trends.",
    },
    {
      q: "Can I connect my active CRM or Stripe metrics?",
      a: "Yes. DecisionPilot AI provides unified live API keys to sync your baseline monthly revenues, active conversion logs, and fixed operating expenses.",
    },
    {
      q: "Is there support for multi-variable sensitivity models?",
      a: "Absolutely. You can declare unlimited model parameters and options to compare best/worst budgets, hiring structures, or pricing changes side-by-side.",
    },
  ];

  return (
    <div className="dark relative min-h-screen overflow-x-hidden bg-[#030303] text-[#f5f5f7] select-none">

      {/* Ambient glow layers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] h-[700px] w-[700px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-600/8 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-violet-600/6 blur-[100px]" />
      </div>

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 30 ? "bg-[#030303]/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-8 lg:px-16 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
              <Activity className="h-4 w-4" />
            </div>
            <span className="font-bold text-base tracking-tight">
              DecisionPilot<span className="text-blue-400 font-normal">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-white/50">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#sandbox" className="hover:text-white transition-colors">Demo</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/auth/login" className="text-sm font-medium text-white/50 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/auth/signup">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">

        {/* Full-width grid lines background */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "80px 80px" }}
        />

        <div className="relative max-w-screen-2xl mx-auto w-full px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-64px)]">

            {/* Left: Copy */}
            <div className="space-y-8 py-20">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-400"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Decision Intelligence
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="text-5xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-black tracking-tight leading-[1.02]"
              >
                Simulate Every
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  Decision
                </span>
                <br />
                Before You Make It.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="text-lg text-white/50 leading-relaxed max-w-lg font-medium"
              >
                A high-fidelity Monte Carlo simulation engine for modern SMEs. Map margins, opex changes, and marketing paths — before spending a single rupee.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link to="/auth/signup">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: "0 20px 60px rgba(59,130,246,0.5)" }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-blue-500/30 transition-all"
                  >
                    Start Simulating Free
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </Link>

                <a href="#sandbox">
                  <motion.button
                    whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.3)" }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-white font-bold text-base backdrop-blur transition-all hover:bg-white/10"
                  >
                    <Play className="h-4 w-4 text-blue-400" />
                    Live Demo
                  </motion.button>
                </a>
              </motion.div>

              {/* Social proof row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-6 pt-4 text-xs text-white/40 font-medium"
              >
                {[
                  { icon: Users, text: "2,400+ SMEs" },
                  { icon: ShieldCheck, text: "SOC2 Secure" },
                  { icon: Zap, text: "93.5% Accuracy" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-blue-400" />
                    {text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative flex items-center justify-center py-20"
              style={{ x: mousePosition.x * 0.5, y: mousePosition.y * 0.5 }}
            >
              {/* Main visual card */}
              <div className="relative w-full max-w-2xl">
                <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60 bg-gradient-to-br from-white/5 to-white/[0.01] backdrop-blur-sm">
                  <img
                    src="/hero_decision_network.png"
                    alt="Decision Network"
                    className="w-full h-auto object-cover opacity-90"
                  />
                </div>

                {/* Floating stats card 1 */}
                <motion.div
                  style={{ x: mousePosition.x * 1.6, y: mousePosition.y * 1.6 }}
                  className="absolute -top-6 -left-6 w-52 rounded-2xl border border-white/15 bg-[#0f0f14]/90 backdrop-blur-xl p-5 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Confidence Score</span>
                    <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <div className="text-2xl font-black font-mono text-white">94.2%</div>
                  <p className="text-[9px] text-white/30 mt-1 font-medium">Monte Carlo path modeling</p>
                </motion.div>

                {/* Floating stats card 2 */}
                <motion.div
                  style={{ x: -mousePosition.x * 2, y: -mousePosition.y * 2 }}
                  className="absolute -bottom-6 -right-6 w-56 rounded-2xl border border-white/15 bg-[#0f0f14]/90 backdrop-blur-xl p-5 shadow-xl"
                >
                  <div className="flex items-center gap-2 mb-2 text-blue-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">ROI Projection</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-green-400">+192.4%</div>
                  <p className="text-[9px] text-white/30 mt-1 font-medium">vs opex baseline adjustments</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
      </section>

      {/* ── STATS BAND ──────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-white/[0.01] py-12">
        <div className="max-w-screen-2xl mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "2,400+", label: "Active SMEs", icon: Users },
              { value: "1M+", label: "Decisions Simulated", icon: BarChart3 },
              { value: "93.5%", label: "Prediction Accuracy", icon: Sparkles },
              { value: "< 2s", label: "Simulation Speed", icon: Zap },
            ].map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-2"
              >
                <Icon className="h-5 w-5 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-black text-white">{value}</div>
                <div className="text-xs text-white/40 font-semibold uppercase tracking-wider">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ────────────────────────────────────────── */}
      <section id="features" className="py-32 px-8 lg:px-16 max-w-screen-2xl mx-auto">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]"
          >
            Platform Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white mt-4 tracking-tight"
          >
            Engineered for precision.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-base mt-4 max-w-lg mx-auto font-medium"
          >
            Run math models locally or via backend pipelines — with Apple-grade responsiveness.
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Monte Carlo Simulation",
              desc: "1,000-trial normal distribution modeling across all your scenario options — powered by NumPy and Python.",
              icon: BarChart3,
              gradient: "from-blue-500/20 to-blue-500/0",
              accent: "text-blue-400",
              border: "hover:border-blue-500/30"
            },
            {
              title: "AI Consulting Reports",
              desc: "Google Gemini 1.5 Flash generates structured consulting reports — risks, opportunities, and alternative strategies per option.",
              icon: Sparkles,
              gradient: "from-violet-500/20 to-violet-500/0",
              accent: "text-violet-400",
              border: "hover:border-violet-500/30"
            },
            {
              title: "Knowledge Graph",
              desc: "Visualize your entire business ecosystem — suppliers, inventory, revenue, and customers — as an interactive node-edge graph.",
              icon: Network,
              gradient: "from-green-500/20 to-green-500/0",
              accent: "text-green-400",
              border: "hover:border-green-500/30"
            },
            {
              title: "Sensitivity Analysis",
              desc: "Determine which business variables drive the most variance in profits — and cap your downside risk intelligently.",
              icon: TrendingUp,
              gradient: "from-amber-500/20 to-amber-500/0",
              accent: "text-amber-400",
              border: "hover:border-amber-500/30"
            },
            {
              title: "Live AI Copilot",
              desc: "Word-by-word streaming business advisor — ask about hiring, pricing, suppliers, and inventory safety reserves.",
              icon: Zap,
              gradient: "from-pink-500/20 to-pink-500/0",
              accent: "text-pink-400",
              border: "hover:border-pink-500/30"
            },
            {
              title: "Secure by Default",
              desc: "Supabase JWT auth, Row Level Security, RBAC roles (Owner / Admin / Employee), and AES-encrypted data exports.",
              icon: ShieldCheck,
              gradient: "from-indigo-500/20 to-indigo-500/0",
              accent: "text-indigo-400",
              border: "hover:border-indigo-500/30"
            },
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className={`relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] ${feat.border} transition-all duration-300 overflow-hidden group`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative space-y-4">
                  <div className={`inline-flex p-3 rounded-2xl bg-white/5 ${feat.accent}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed font-medium">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section className="py-24 px-8 lg:px-16 border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">Process</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 tracking-tight">How it works.</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            {[
              { step: "01", title: "Map Your Variables", desc: "Define your revenue baseline, fixed opex, conversion rates, and commission models as simulation inputs.", icon: Layers },
              { step: "02", title: "Declare Strategy Options", desc: "Add competing options — hire sales reps, raise prices 10%, switch suppliers — each with parameter modifications.", icon: BarChart3 },
              { step: "03", title: "Run & Compare", desc: "1,000 Monte Carlo trials per option generate projected ROI, revenue trends, and AI consulting advice in seconds.", icon: Sparkles },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-6xl font-black font-mono text-white/5">{step.step}</span>
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed font-medium">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE DEMO SANDBOX ─────────────────────────────────── */}
      <section id="sandbox" className="py-32 px-8 lg:px-16 border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">Live Sandbox</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                Try it right now.<br/>
                <span className="text-white/40">No signup needed.</span>
              </h2>
              <p className="text-white/40 text-base leading-relaxed font-medium">
                Drag the sliders and watch your simulated profit and ROI recalculate in real time — powered by the same formula engine behind our backend.
              </p>
              <Link to="/auth/signup">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
                >
                  Start Full Simulation
                  <ArrowRight className="h-4.5 w-4.5" />
                </motion.button>
              </Link>
            </div>

            <div className="rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur p-8 space-y-8 shadow-2xl">
              {/* Sliders */}
              <div className="space-y-6">
                {[
                  { label: "Monthly Revenue", value: revenue, setValue: setRevenue, min: 30000, max: 400000, step: 5000, display: `₹${revenue.toLocaleString()}` },
                  { label: "Conversion Rate", value: conversionRate, setValue: setConversionRate, min: 0.5, max: 10, step: 0.1, display: `${conversionRate}%` },
                  { label: "Marketing Spend", value: marketingBudget, setValue: setMarketingBudget, min: 5000, max: 50000, step: 1000, display: `₹${marketingBudget.toLocaleString()}` },
                ].map(({ label, value, setValue, min, max, step, display }) => (
                  <div key={label} className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-white/50">{label}</span>
                      <span className="font-bold text-blue-400 font-mono">{display}</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                ))}
              </div>

              {/* Outputs */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1">
                  <span className="text-[11px] text-white/40 font-bold uppercase tracking-wider block">Simulated Profit</span>
                  <motion.span
                    key={simulatedProfit}
                    initial={{ scale: 0.95, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-2xl font-black font-mono block ${simulatedProfit >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    ₹{simulatedProfit.toLocaleString()}
                  </motion.span>
                </div>
                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1">
                  <span className="text-[11px] text-white/40 font-bold uppercase tracking-wider block">Expected ROI</span>
                  <motion.span
                    key={simulatedRoi}
                    initial={{ scale: 0.95, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-black font-mono block text-blue-400"
                  >
                    {simulatedRoi}%
                  </motion.span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-24 px-8 lg:px-16 border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">Testimonials</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 tracking-tight">
              Trusted by SME founders.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { quote: "DecisionPilot helped us test pricing changes before updating checkout. We avoided a 12% conversion drop by modifying variables beforehand.", author: "Sarah Jenkins", role: "Founder, Bloom Logistics", stars: 5 },
              { quote: "The interface is beautiful, and testing salary commission adjustments side-by-side using spring parameters is an incredible workflow.", author: "Marcus Vance", role: "CEO, Vanguard Devs", stars: 5 },
              { quote: "The Knowledge Graph alone is worth the subscription. Seeing all our suppliers, inventory, and revenue connected visually changed how we plan.", author: "Priya Mehta", role: "COO, FreshCo India", stars: 5 },
            ].map((test, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] space-y-5 transition-all hover:border-white/10"
              >
                <div className="flex gap-1 text-amber-400">
                  {[...Array(test.stars)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}
                </div>
                <p className="text-sm text-white/60 leading-relaxed font-medium italic">"{test.quote}"</p>
                <div>
                  <div className="text-sm font-bold text-white">{test.author}</div>
                  <div className="text-xs text-white/30 mt-0.5">{test.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────── */}
      <section id="pricing" className="py-32 px-8 lg:px-16 border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">Pricing</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 tracking-tight">SME-friendly plans.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              { plan: "Free Sandbox", price: "₹0", period: "/mo", desc: "Start simulating today.", features: ["3 decision drafts", "Standard parameters", "Local formula engine", "Community support"], highlight: false },
              { plan: "Startup Pro", price: "₹5,999", period: "/mo", desc: "Full simulation power.", features: ["Unlimited decisions", "Supabase auth + RBAC", "Sensitivity forecasting", "FastAPI priority queue", "Gemini AI reports", "PDF/CSV/Excel exports"], highlight: true },
              { plan: "Enterprise", price: "Custom", period: "", desc: "Dedicated infrastructure.", features: ["Unlimited workspaces", "Custom simulation queues", "Dedicated formula triggers", "SLA support + onboarding"], highlight: false },
            ].map((pricing, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative p-8 rounded-3xl border flex flex-col ${
                  pricing.highlight
                    ? "border-blue-500/40 bg-gradient-to-b from-blue-500/10 to-transparent shadow-xl shadow-blue-500/10"
                    : "border-white/5 bg-white/[0.02]"
                }`}
              >
                {pricing.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold">
                    Most Popular
                  </div>
                )}
                <div className="space-y-2 mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">{pricing.plan}</h4>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-white">{pricing.price}</span>
                    <span className="text-white/30 text-sm pb-1">{pricing.period}</span>
                  </div>
                  <p className="text-xs text-white/30 font-medium">{pricing.desc}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {pricing.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/60 font-medium">
                      <Check className="h-4 w-4 text-blue-400 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/auth/signup">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${
                      pricing.highlight
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    Get Started
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-8 lg:px-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">FAQ</span>
            <h2 className="text-4xl font-black text-white mt-4 tracking-tight">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const active = activeFaq === idx;
              return (
                <div key={idx} className={`rounded-2xl border transition-all ${active ? "border-blue-500/30 bg-blue-500/5" : "border-white/5 bg-white/[0.01]"}`}>
                  <button
                    onClick={() => setActiveFaq(active ? null : idx)}
                    className="flex items-center justify-between w-full p-6 text-left"
                  >
                    <span className="text-sm font-bold text-white pr-6">{faq.q}</span>
                    <ChevronRight className={`h-4 w-4 text-white/30 shrink-0 transition-transform ${active ? "rotate-90 text-blue-400" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-sm text-white/40 leading-relaxed font-medium">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────────────── */}
      <section className="py-32 px-8 lg:px-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Ready to make<br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                smarter decisions?
              </span>
            </h2>
            <p className="text-white/40 text-base mt-6 font-medium">
              Join 2,400+ SME operators running simulations before spending a rupee.
            </p>
          </motion.div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth/signup">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 24px 60px rgba(59,130,246,0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-blue-500/30 transition-all"
              >
                Start Free Today
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
            <Link to="/auth/login" className="text-sm text-white/40 hover:text-white transition-colors font-medium">
              Already have an account? Sign In →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 px-8 lg:px-16">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <Activity className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-sm tracking-tight">
              DecisionPilot<span className="text-blue-400 font-normal">AI</span>
            </span>
          </div>
          <p className="text-xs text-white/20 font-medium">
            © {new Date().getFullYear()} DecisionPilot AI. Built for SMEs with Apple HIG aesthetics.
          </p>
          <div className="flex gap-8 text-xs font-bold text-white/30">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#sandbox" className="hover:text-white transition-colors">Sandbox</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
