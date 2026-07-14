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
  Play
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LandingPage() {
  // 1. Mouse Parallax Coordinate States
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 45,
        y: (e.clientY - window.innerHeight / 2) / 45,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 2. Interactive Calculator States
  const [revenue, setRevenue] = useState(150000);
  const [conversionRate, setConversionRate] = useState(2.8);
  const [marketingBudget, setMarketingBudget] = useState(18000);

  // Math simulation formulas
  const simulatedRevenue = Math.round(revenue * (conversionRate / 2.5));
  const simulatedMargin = 22; // baseline percent
  const simulatedProfit = Math.round(simulatedRevenue * (simulatedMargin / 100) - marketingBudget);
  const simulatedRoi = Math.round(((simulatedRevenue * (simulatedMargin / 100)) / (marketingBudget || 1)) * 100);

  // 3. FAQ Accordion States
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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
    <div className="dark relative min-h-screen overflow-hidden bg-[#030303] text-[#f5f5f7] select-none">
      
      {/* Siri Ambient Glow Background Layer */}
      <div className="ambient-container">
        <div className="ambient-orb orb-blue animate-pulse-glow" style={{ opacity: 0.12 }} />
        <div className="ambient-orb orb-pink animate-pulse-glow" style={{ animationDelay: "-3s", opacity: 0.08 }} />
      </div>

      {/* Floating Header */}
      <header className="sticky top-4 z-50 w-[92%] max-w-6xl mx-auto rounded-full apple-glass border-white/10 shadow-apple-dock py-3.5 px-6 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-apple-subtle">
              <Activity className="h-4.5 w-4.5" />
            </div>
            <span className="font-sans text-sm font-bold tracking-tight">
              DecisionPilot<span className="text-primary font-normal">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#sandbox" className="hover:text-white transition-colors">Demo</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/auth/login" className="text-xs font-semibold hover:text-white text-muted-foreground transition-colors mr-2">
              Sign In
            </Link>
            <Link to="/auth/signup">
              <Button size="sm" variant="primary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION with Mouse Parallax & Generated Illustration */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left pitch copy */}
        <div className="lg:col-span-6 space-y-6 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-primary shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Decision Intelligence Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/50 leading-[1.08]"
          >
            DecisionPilot AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="text-lg sm:text-xl font-bold text-gradient leading-tight"
          >
            "Simulate Every Decision Before You Make It."
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-md font-medium"
          >
            A high-fidelity simulation engine designed for modern SMEs. Map margins, opex changes, and marketing paths before spending cash.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 pt-2"
          >
            <Link to="/auth/signup">
              <Button size="lg" variant="primary">
                Simulate Now
                <ArrowRight className="h-4.5 w-4.5" />
              </Button>
            </Link>
            <a href="#sandbox">
              <Button size="lg" variant="outline">
                <Play className="h-4 w-4" />
                Live Demo
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Right 3D Visual Asset with Mouse Parallax & Overlapping cards */}
        <div className="lg:col-span-6 flex justify-center relative min-h-[420px]">
          {/* Animated illustration background container */}
          <motion.div
            style={{ x: mousePosition.x * 0.7, y: mousePosition.y * 0.7 }}
            className="relative w-full max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-apple-dialog bg-card/10 backdrop-blur-sm"
          >
            <img
              src="/hero_decision_network.png"
              alt="Futuristic Decision Pathway Model"
              className="w-full h-auto object-cover opacity-85 pointer-events-none"
            />
          </motion.div>

          {/* Floating Glass Card 1 (Parallax depth 1.4) */}
          <motion.div
            style={{ x: mousePosition.x * 1.6, y: mousePosition.y * 1.6 }}
            className="absolute top-8 left-[-20px] w-48 rounded-2xl apple-glass border-white/20 p-4 shadow-apple-dock z-20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Confidence</span>
              <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-ping" />
            </div>
            <div className="text-xl font-bold font-mono">94.2%</div>
            <p className="text-[8px] text-muted-foreground mt-1">Calculated via Monte Carlo path modeling</p>
          </motion.div>

          {/* Floating Glass Card 2 (Parallax depth 2.2) */}
          <motion.div
            style={{ x: -mousePosition.x * 2.2, y: -mousePosition.y * 2.2 }}
            className="absolute bottom-10 right-[-10px] w-52 rounded-2xl apple-glass border-white/20 p-4 shadow-apple-dialog z-20"
          >
            <div className="flex items-center gap-2 mb-2 text-primary">
              <TrendingUp className="h-4 w-4" />
              <span className="text-[9px] font-bold uppercase">ROI Projection</span>
            </div>
            <div className="text-xl font-bold font-mono text-green-400">+192.4%</div>
            <p className="text-[8px] text-muted-foreground mt-1">Compared against opex adjustments</p>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-28 border-t border-white/5 relative z-10">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Features Suite</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Engineered for precision business modelling.
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            Run math models locally or via backend pipelines with Apple HIG responsiveness.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Liquid Range Workbenches",
              desc: "Slide margins, budget items, and salaries locally to recalculate trend charts instantly.",
              icon: Layers,
              color: "text-blue-400",
            },
            {
              title: "Sensitivity Vulnerability",
              desc: "Determine which underlying business variables impact final profits and cap margins.",
              icon: TrendingUp,
              color: "text-green-400",
            },
            {
              title: "Apple HIG Native Flow",
              desc: "Enjoy gorgeous frosted containers, floating docks, sliding indicator tabs, and spring physics.",
              icon: ShieldCheck,
              color: "text-purple-400",
            },
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} isHoverable className="apple-glass border-white/5 hover:border-white/10 p-8 space-y-4">
                <div className={`p-2.5 rounded-2xl bg-white/5 inline-flex ${feat.color}`}>
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="text-base font-extrabold text-white">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-semibold">{feat.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5 relative z-10">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Process Pipeline</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            How DecisionPilot works.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3 relative">
          {[
            { step: "01", title: "Map Parameters", desc: "Define your current revenue, fixed opex, and commission models." },
            { step: "02", title: "Declare Options", desc: "Add options like hiring sales reps, renting new spaces, or raising prices." },
            { step: "03", title: "Recalculate Projections", desc: "Run python calculation models to plot cash margins and sensitivity risks." }
          ].map((step, idx) => (
            <div key={idx} className="relative p-6 rounded-3xl bg-white/[0.01] border border-white/5 space-y-4">
              <span className="text-5xl font-extrabold font-mono text-white/5 block">{step.step}</span>
              <h3 className="text-base font-bold text-white">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE DEMO SANDBOX (Visual AI Simulator Tool) */}
      <section id="sandbox" className="max-w-6xl mx-auto px-6 py-24 border-t border-white/5 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5 text-left">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Visual AI Simulator</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Try Decision Sandbox
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
              Interact with the slider workbench. See ROI indicators, profits projections, and simulation curves recalculate instantly.
            </p>
          </div>

          <div className="lg:col-span-7 w-full">
            <Card className="apple-glass border-white/5 p-6 space-y-6 shadow-apple-dialog">
              {/* Parameter controllers */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Monthly Revenues</span>
                    <span className="font-mono text-primary">${revenue.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="30000"
                    max="400000"
                    step="5000"
                    aria-label="Monthly Revenues"
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Website Conversion</span>
                    <span className="font-mono text-primary">{conversionRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.1"
                    aria-label="Website Conversion"
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Marketing Ad Spend</span>
                    <span className="font-mono text-primary">${marketingBudget.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="50000"
                    step="1000"
                    aria-label="Marketing Ad Spend"
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none"
                    value={marketingBudget}
                    onChange={(e) => setMarketingBudget(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Dynamic outcomes stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-muted-foreground font-bold block">Simulated Profit</span>
                  <motion.span
                    key={simulatedProfit}
                    initial={{ scale: 0.96 }}
                    animate={{ scale: 1 }}
                    className={`text-lg font-mono font-bold block mt-1 ${simulatedProfit >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    ${simulatedProfit.toLocaleString()}
                  </motion.span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-muted-foreground font-bold block">Expected ROI</span>
                  <motion.span
                    key={simulatedRoi}
                    initial={{ scale: 0.96 }}
                    animate={{ scale: 1 }}
                    className="text-lg font-mono font-bold block mt-1 text-primary"
                  >
                    {simulatedRoi}%
                  </motion.span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5 relative z-10">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Trusted by active SME founders.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              quote: "DecisionPilot helped us test pricing changes before updating checkout. We avoided a 12% conversion drop by modifying variables beforehand.",
              author: "Sarah Jenkins",
              role: "Founder, Bloom Logistics",
              stars: 5
            },
            {
              quote: "The interface is beautiful, and testing salary commission adjustments side-by-side using spring parameters is an incredible workflow.",
              author: "Marcus Vance",
              role: "CEO, Vanguard Devs",
              stars: 5
            }
          ].map((test, idx) => (
            <Card key={idx} className="apple-glass border-white/5 p-6.5 space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(test.stars)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-semibold italic">"{test.quote}"</p>
              <div>
                <div className="text-xs font-bold text-white">{test.author}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{test.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24 border-t border-white/5 relative z-10">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Flexible Plans</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            SME-friendly pricing options.
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {[
            { plan: "Free Sandbox", price: "$0", desc: "Basic scenario workbench.", features: ["3 decision drafts", "Standard parameters", "Local formulas"] },
            { plan: "Startup Pro", price: "$79", desc: "Core API integrations.", features: ["Unlimited decision drafts", "Supabase authentication", "Sensitivity forecasting", "FastAPI server priority"] },
            { plan: "Enterprise Custom", price: "$399", desc: "Unified custom calculation pipelines.", features: ["Unlimited workspaces", "Dedicated simulation queues", "Dedicated math formula triggers"] }
          ].map((pricing, idx) => (
            <Card key={idx} className="apple-glass border-white/5 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{pricing.plan}</h4>
                  <div className="text-4xl font-extrabold text-white mt-1.5 font-mono">{pricing.price}</div>
                  <p className="text-[10px] text-muted-foreground mt-1 font-semibold">{pricing.desc}</p>
                </div>
                <ul className="space-y-2 text-left">
                  {pricing.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-[10px] text-muted-foreground font-semibold">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/auth/signup">
                <Button className="w-full" variant={idx === 1 ? "primary" : "outline"}>
                  Get Started
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ SECTION with Accordion */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5 relative z-10">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const active = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(active ? null : idx)}
                  className="flex items-center justify-between w-full p-5 text-left text-xs font-bold text-white hover:bg-white/[0.02]"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${active ? "rotate-90 text-primary" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    >
                      <p className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed font-semibold">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="max-w-6xl mx-auto px-6 py-16 border-t border-white/5 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white shadow-apple-subtle">
            <Activity className="h-4 w-4" />
          </div>
          <span className="font-sans text-sm font-bold tracking-tight">
            DecisionPilot<span className="text-primary font-normal">AI</span>
          </span>
        </div>

        <p className="text-[10px] text-muted-foreground font-semibold">
          &copy; {new Date().getFullYear()} DecisionPilot AI. Built for SMEs with Apple iOS 26 HIG aesthetic style.
        </p>

        <div className="flex gap-6 text-[10px] font-bold text-muted-foreground">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#sandbox" className="hover:text-white transition-colors">Sandbox</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
      </footer>
    </div>
  );
}
