import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
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

  // ThreeJS refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const torusRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const speedRef = useRef(rotationSpeed);
  const rafRef = useRef<number>(0);

  // Keep speed ref in sync without needing to restart the scene
  useEffect(() => { speedRef.current = rotationSpeed; }, [rotationSpeed]);

  // Bootstrap Three.js after the canvas is actually in the DOM with real dimensions
  useEffect(() => {
    if (activeTab !== "3d") return;

    // Give AnimatePresence time to mount the canvas
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Use offsetWidth/Height which reflect CSS layout (not 0)
      const width = canvas.offsetWidth || 600;
      const height = canvas.offsetHeight || 360;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.z = 24;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      const geometry = new THREE.TorusKnotGeometry(7, 2.2, 120, 16);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(glowColor),
        wireframe: true,
        transparent: true,
        opacity: 0.45
      });
      const knot = new THREE.Mesh(geometry, material);
      scene.add(knot);
      torusRef.current = knot;
      materialRef.current = material;

      const animate = () => {
        rafRef.current = requestAnimationFrame(animate);
        knot.rotation.x += 0.003 * speedRef.current;
        knot.rotation.y += 0.006 * speedRef.current;
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (!canvas) return;
        const w = canvas.offsetWidth || 600;
        const h = canvas.offsetHeight || 360;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      window.addEventListener("resize", handleResize);

      // Store cleanup on the renderer ref so the return can reference it
      (renderer as any).__cleanup = () => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener("resize", handleResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        rendererRef.current = null;
        torusRef.current = null;
        materialRef.current = null;
      };
    }, 80); // 80 ms is enough for framer-motion enter animation

    return () => {
      clearTimeout(timer);
      if (rendererRef.current) {
        (rendererRef.current as any).__cleanup?.();
      }
    };
  }, [activeTab]);

  // Update ThreeJS material properties when dials are adjusted
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(glowColor);
    }
  }, [glowColor]);

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
