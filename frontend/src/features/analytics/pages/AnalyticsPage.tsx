import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { 
  Sparkles, 
  Sliders, 
  Users,
  Truck
} from "lucide-react";
import { Card } from "@/components/ui/Card";

// Financial Projections Mock Data
const financialData = [
  { month: "Jan", revenue: 110000, profit: 42000, customers: 1200 },
  { month: "Feb", revenue: 125000, profit: 51000, customers: 1450 },
  { month: "Mar", revenue: 140000, profit: 58000, customers: 1800 },
  { month: "Apr", revenue: 155000, profit: 62000, customers: 2100 },
  { month: "May", revenue: 175000, profit: 79000, customers: 2550 },
  { month: "Jun", revenue: 210000, profit: 98000, customers: 3100 },
];

// Supply Chain & Inventory Mock Data
const supplyChainData = [
  { day: "Mon", inventory: 85, orders: 45 },
  { day: "Tue", inventory: 80, orders: 58 },
  { day: "Wed", inventory: 72, orders: 62 },
  { day: "Thu", inventory: 68, orders: 50 },
  { day: "Fri", inventory: 90, orders: 75 },
  { day: "Sat", inventory: 95, orders: 80 },
  { day: "Sun", inventory: 88, orders: 40 },
];

// Supplier Performance Mock Data
const supplierPerformanceData = [
  { subject: "Delivery Rate", A: 95, B: 85, fullMark: 100 },
  { subject: "Quality Index", A: 92, B: 90, fullMark: 100 },
  { subject: "Pricing Score", A: 80, B: 95, fullMark: 100 },
  { subject: "Communication", A: 98, B: 75, fullMark: 100 },
  { subject: "Capacity Buffer", A: 85, B: 90, fullMark: 100 },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"financial" | "supply" | "3d">("financial");
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [glowColor, setGlowColor] = useState("#007aff");

  // 2D Canvas refs — no WebGL needed
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const angleRef = useRef({ rx: 0, ry: 0 });
  const speedRef = useRef(rotationSpeed);
  const colorRef = useRef(glowColor);

  useEffect(() => { speedRef.current = rotationSpeed; }, [rotationSpeed]);
  useEffect(() => { colorRef.current = glowColor; }, [glowColor]);

  // ── Parametric Torus Knot projected with simple perspective ──────
  const drawKnot = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, rx: number, ry: number) => {
    ctx.clearRect(0, 0, w, h);

    // Torus knot parameters: p=2, q=3 (trefoil)
    const p = 2, q = 3;
    const R = Math.min(w, h) * 0.28;  // major radius
    const r = Math.min(w, h) * 0.09;  // tube radius
    const STEPS = 300;
    const fov = 800;
    const camZ = Math.min(w, h) * 1.2;

    const sinRx = Math.sin(rx), cosRx = Math.cos(rx);
    const sinRy = Math.sin(ry), cosRy = Math.cos(ry);

    // Project 3D → 2D with perspective
    const project = (x3: number, y3: number, z3: number): [number, number, number] => {
      // Rotate Y
      const x1 = x3 * cosRy - z3 * sinRy;
      const z1 = x3 * sinRy + z3 * cosRy;
      // Rotate X
      const y2 = y3 * cosRx - z1 * sinRx;
      const z2 = y3 * sinRx + z1 * cosRx;
      const scale = fov / (fov + camZ - z2);
      return [w / 2 + x1 * scale, h / 2 + y2 * scale, z2];
    };

    // Collect all projected points
    const pts: Array<[number, number, number]> = [];
    for (let i = 0; i <= STEPS; i++) {
      const t = (i / STEPS) * Math.PI * 2;
      const x = (R + r * Math.cos(q * t)) * Math.cos(p * t);
      const y = (R + r * Math.cos(q * t)) * Math.sin(p * t);
      const z = r * Math.sin(q * t);
      pts.push(project(x, y, z));
    }

    // Parse hex color to rgba
    const hex = colorRef.current.replace("#", "");
    const cr = parseInt(hex.substring(0, 2), 16);
    const cg = parseInt(hex.substring(2, 4), 16);
    const cb = parseInt(hex.substring(4, 6), 16);

    // Draw segments, depth-faded
    const zMin = Math.min(...pts.map(p => p[2]));
    const zMax = Math.max(...pts.map(p => p[2]));
    const zRange = zMax - zMin || 1;

    ctx.lineWidth = 1.2;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1, z1] = pts[i];
      const [x2, y2] = pts[i + 1];
      const alpha = 0.15 + 0.7 * ((z1 - zMin) / zRange);
      ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw cross-section circles for tube wireframe feel
    const TUBE_STEPS = 8;
    for (let i = 0; i < STEPS; i += Math.floor(STEPS / 40)) {
      const t = (i / STEPS) * Math.PI * 2;
      const cx = (R + r * Math.cos(q * t)) * Math.cos(p * t);
      const cy = (R + r * Math.cos(q * t)) * Math.sin(p * t);
      const cz = r * Math.sin(q * t);
      const [px, py, pz] = project(cx, cy, cz);
      const alpha2 = 0.08 + 0.25 * ((pz - zMin) / zRange);
      const dotR = 1.5 + 1.5 * ((pz - zMin) / zRange);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha2.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(px, py, dotR, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  // ── Start / stop 2D animation loop when tab changes ─────────────
  useEffect(() => {
    if (activeTab !== "3d") {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const loop = () => {
        const w = canvas.offsetWidth || 600;
        const h = canvas.offsetHeight || 340;
        canvas.width = w;
        canvas.height = h;

        angleRef.current.ry += 0.006 * speedRef.current;
        angleRef.current.rx += 0.003 * speedRef.current;
        drawKnot(ctx, w, h, angleRef.current.rx, angleRef.current.ry);
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    }, 60);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [activeTab, drawKnot]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 select-none"
    >
      {/* Title Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Analytics Engine</h1>
          <p className="text-muted-foreground text-xs font-semibold mt-0.5">
            Real-time compounding projections, supply health, and 3D modeling curves.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex rounded-full bg-white/5 border border-white/10 p-1 backdrop-blur-xl">
          {[
            { id: "financial", name: "Financial Trends" },
            { id: "supply", name: "Supply Chain" },
            { id: "3d", name: "3D Forecast Knot" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-apple-subtle"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* RENDER DYNAMIC SLIDES BASED ON ACTIVE TAB */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: FINANCIAL TRENDS */}
        {activeTab === "financial" && (
          <motion.div
            key="financial"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid gap-6 md:grid-cols-12"
          >
            {/* Revenue Area Chart (8 Cols) */}
            <div className="md:col-span-8">
              <Card className="apple-glass border-white/5 p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Revenue & Profit Trends</h3>
                    <span className="text-[9px] text-muted-foreground">Compounded monthly growth aggregates</span>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financialData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="5%" stopColor="#007aff" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#007aff" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorPrf" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f0f11", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "11px" }} />
                      <Area type="monotone" dataKey="revenue" stroke="#007aff" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} name="Revenue ($)" />
                      <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorPrf)" strokeWidth={2} name="Profit ($)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Customer Growth Line Chart (4 Cols) */}
            <div className="md:col-span-4 space-y-6">
              <Card className="apple-glass border-white/5 p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Users className="h-4.5 w-4.5 text-primary" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Customer Growth</span>
                </div>
                
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={8} tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={8} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f0f11", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "10px" }} />
                      <Line type="monotone" dataKey="customers" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Customers" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
                  Monthly customer counts grew by <span className="text-white font-bold">+158%</span> over Q1-Q2 cycles.
                </p>
              </Card>
            </div>
          </motion.div>
        )}

        {/* TAB 2: SUPPLY CHAIN & INVENTORY */}
        {activeTab === "supply" && (
          <motion.div
            key="supply"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid gap-6 md:grid-cols-12"
          >
            {/* Inventory Safety & Orders Chart (8 Cols) */}
            <div className="md:col-span-8">
              <Card className="apple-glass border-white/5 p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Inventory Levels vs Orders</h3>
                    <span className="text-[9px] text-muted-foreground">Daily capacity response checks</span>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={supplyChainData}>
                      <defs>
                        <linearGradient id="colorInv" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="5%" stopColor="#eab308" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#eab308" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f0f11", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "11px" }} />
                      <Area type="monotone" dataKey="inventory" stroke="#eab308" fillOpacity={1} fill="url(#colorInv)" strokeWidth={2} name="Inventory Stock (%)" />
                      <Area type="monotone" dataKey="orders" stroke="#3b82f6" fillOpacity={0} strokeWidth={2} name="Orders Received" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Supplier Performance Radar Chart (4 Cols) */}
            <div className="md:col-span-4 space-y-6">
              <Card className="apple-glass border-white/5 p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Truck className="h-4.5 w-4.5 text-primary" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Supplier Performance</span>
                </div>
                
                <div className="h-48 flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={supplierPerformanceData}>
                      <PolarGrid stroke="rgba(255,255,255,0.05)" />
                      <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.4)" fontSize={8} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" fontSize={8} />
                      <Radar name="Primary Supplier (A)" dataKey="A" stroke="#007aff" fill="#007aff" fillOpacity={0.2} />
                      <Radar name="Secondary Partner (B)" dataKey="B" stroke="#eab308" fill="#eab308" fillOpacity={0.1} />
                      <Legend wrapperStyle={{ fontSize: "8px" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* TAB 3: FUTURISTIC 3D FORECAST KNOT */}
        {activeTab === "3d" && (
          <motion.div
            key="3d"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid gap-6 md:grid-cols-12"
          >
            {/* 3D WebGL Torus Knot Canvas container (8 Cols) */}
            <div className="md:col-span-8">
              <Card className="apple-glass border-white/5 p-6 relative overflow-hidden h-[360px] flex items-center justify-center">
                {/* Floating WebGL Canvas */}
                <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                
                {/* Visual context tags */}
                <div className="absolute top-6 left-6 z-10 space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    3D Simulation Knot
                  </h3>
                  <p className="text-[9px] text-muted-foreground font-semibold">Torus knot represents high-order multi-variable intersections</p>
                </div>

                <div className="absolute bottom-6 right-6 z-10 text-right">
                  <span className="text-[8px] text-muted-foreground block uppercase font-mono">Glow Frequency</span>
                  <span className="text-xs font-bold text-primary font-mono">{rotationSpeed * 100} MHz</span>
                </div>
              </Card>
            </div>

            {/* Interactive dials to change 3D Speed & Color (4 Cols) */}
            <div className="md:col-span-4 space-y-6">
              <Card className="apple-glass border-white/5 p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Sliders className="h-4.5 w-4.5 text-primary" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">3D Controller Dials</span>
                </div>

                {/* Speed Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Rotation speed</span>
                    <span className="font-mono text-primary">{rotationSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="4.0"
                    step="0.1"
                    aria-label="Rotation speed"
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none"
                    value={rotationSpeed}
                    onChange={(e) => setRotationSpeed(Number(e.target.value))}
                  />
                </div>

                {/* Color Selector */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Mesh Light Streaks Color</span>
                  <div className="flex gap-3">
                    {[
                      { hex: "#007aff", label: "Blue" },
                      { hex: "#10b981", label: "Green" },
                      { hex: "#d946ef", label: "Pink" },
                      { hex: "#eab308", label: "Gold" }
                    ].map((col) => (
                      <button
                        key={col.hex}
                        onClick={() => setGlowColor(col.hex)}
                        className={`h-6 w-6 rounded-full border transition-all ${
                          glowColor === col.hex ? "scale-115 border-white ring-2 ring-primary/45" : "border-white/10 hover:scale-105"
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">AI Forecast Summary</span>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mt-1 font-semibold">
                    Interactive canvas renders mathematical correlation matrices. Aligning inputs reveals peak operating efficiencies.
                  </p>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI INSIGHTS & FORECAST REPORTS */}
      <motion.div variants={itemVariants}>
        <Card className="apple-glass border-white/5 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">AI Compounding Forecast Insights</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Capital Efficiency Boost",
                desc: "SME financial curves show operations operating at 74% capital efficiency, leaving Room for ₹25,000 margin scaling."
              },
              {
                title: "Supplier Delivery Variance",
                desc: "Primary supplier (A) delivery rates fluctuate by 4.2% around week-ends. Order stock 3 days early to avoid bottleneck risks."
              },
              {
                title: "Demand Curve Alignment",
                desc: "Compound conversion rates correlate strongly with Month 5 projections. Scaling campaigns then multiplies cash flows."
              }
            ].map((ins, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-white/5 bg-white/[0.01]">
                <h4 className="text-xs font-bold text-white mb-1.5">{ins.title}</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed font-semibold">{ins.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
