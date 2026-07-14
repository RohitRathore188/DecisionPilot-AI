import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts";
import { 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Star,
  ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/Card";

interface Supplier {
  id: string;
  name: string;
  category: string;
  deliveryTime: string; // e.g. "1.2 days"
  costScore: number; // out of 100
  qualityScore: number; // out of 100
  reliabilityScore: number; // out of 100
  rating: number; // star rating out of 5
  historyData: { month: string; performance: number }[];
  recommendation: string;
  details: string;
}

const initialSuppliers: Supplier[] = [
  {
    id: "sup1",
    name: "FreshFoods Wholesalers",
    category: "Raw Materials",
    deliveryTime: "1-2 days",
    costScore: 82,
    qualityScore: 94,
    reliabilityScore: 96,
    rating: 4.8,
    historyData: [
      { month: "Jan", performance: 95 },
      { month: "Feb", performance: 94 },
      { month: "Mar", performance: 96 },
      { month: "Apr", performance: 97 },
      { month: "May", performance: 95 },
      { month: "Jun", performance: 96 },
    ],
    recommendation: "Highly recommended for fast fulfillment. Material quality remains stable, but costs run 8% above market baselines.",
    details: "FreshFoods handles 70% of raw grain and vegetable materials. Maintains standard warehousing channels near your logistics hub."
  },
  {
    id: "sup2",
    name: "OrganicFoods Supply",
    category: "Raw Materials",
    deliveryTime: "3-4 days",
    costScore: 92,
    qualityScore: 96,
    reliabilityScore: 85,
    rating: 4.2,
    historyData: [
      { month: "Jan", performance: 80 },
      { month: "Feb", performance: 84 },
      { month: "Mar", performance: 83 },
      { month: "Apr", performance: 86 },
      { month: "May", performance: 88 },
      { month: "Jun", performance: 85 },
    ],
    recommendation: "Best pricing candidate. Switch vegetable orders here to expand gross operating margins by 5.2% if longer lead times are acceptable.",
    details: "Focuses on certified organic produce. Lead times run longer due to decentralized farming hub allocations."
  },
  {
    id: "sup3",
    name: "Acme EcoPack Co.",
    category: "Packaging",
    deliveryTime: "2 days",
    costScore: 78,
    qualityScore: 90,
    reliabilityScore: 92,
    rating: 4.5,
    historyData: [
      { month: "Jan", performance: 90 },
      { month: "Feb", performance: 91 },
      { month: "Mar", performance: 90 },
      { month: "Apr", performance: 93 },
      { month: "May", performance: 92 },
      { month: "Jun", performance: 92 },
    ],
    recommendation: "Solid baseline for compostable materials. Highly reliable, but bulk pricing hikes are predicted in Q3.",
    details: "Supplies all biodegradable trays and kraft cups. Excellent logistics track record."
  },
  {
    id: "sup4",
    name: "Polar Ice Foods",
    category: "Raw Materials",
    deliveryTime: "2-3 days",
    costScore: 85,
    qualityScore: 92,
    reliabilityScore: 94,
    rating: 4.6,
    historyData: [
      { month: "Jan", performance: 93 },
      { month: "Feb", performance: 92 },
      { month: "Mar", performance: 94 },
      { month: "Apr", performance: 95 },
      { month: "May", performance: 93 },
      { month: "Jun", performance: 94 },
    ],
    recommendation: "Stable cold-chain logistics. Recommended choice for keeping temperature-controlled inventory optimized.",
    details: "Supplies frozen fruits and dairy items. Employs active sensor-monitored refrigerated trucks."
  }
];

export default function SupplierPage() {
  const [activeSupId, setActiveSupId] = useState("sup1");
  const [compareSupId, setCompareSupId] = useState<string | null>("sup2");
  const [compareMode, setCompareMode] = useState(false);

  const activeSup = initialSuppliers.find((s) => s.id === activeSupId) || initialSuppliers[0];
  const compareSup = initialSuppliers.find((s) => s.id === compareSupId) || initialSuppliers[1];

  const radarData = [
    { subject: "Cost Score", A: activeSup.costScore, B: compareSup.costScore, fullMark: 100 },
    { subject: "Quality", A: activeSup.qualityScore, B: compareSup.qualityScore, fullMark: 100 },
    { subject: "Reliability", A: activeSup.reliabilityScore, B: compareSup.reliabilityScore, fullMark: 100 },
  ];

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
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Supplier Intelligence</h1>
          <p className="text-muted-foreground text-xs font-semibold mt-0.5">
            Audit fulfillment timelines, quality indices, and cost comparison matrices.
          </p>
        </div>

        <div className="flex rounded-full bg-white/5 border border-white/10 p-1 backdrop-blur-xl">
          <button
            onClick={() => setCompareMode(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              !compareMode
                ? "bg-primary text-white shadow-apple-subtle"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            Fulfillment Details
          </button>
          <button
            onClick={() => setCompareMode(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              compareMode
                ? "bg-primary text-white shadow-apple-subtle"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            Side-by-Side Compare
          </button>
        </div>
      </motion.div>

      {/* DUAL COLUMN INTERACTIVE WORKSPACE */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* LEFT COLUMN: SUPPLIER SELECTION LIST (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="apple-glass border-white/5 p-4 space-y-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Fulfillment Partners</span>
            <div className="space-y-2">
              {initialSuppliers.map((sup) => {
                const isActive = activeSupId === sup.id;
                const isComp = compareSupId === sup.id && compareMode;
                return (
                  <button
                    key={sup.id}
                    onClick={() => {
                      if (compareMode) {
                        if (sup.id !== activeSupId) {
                          setCompareSupId(sup.id);
                        }
                      } else {
                        setActiveSupId(sup.id);
                      }
                    }}
                    className={`flex items-center justify-between w-full p-3 rounded-2xl border text-left transition-all ${
                      isActive 
                        ? "bg-primary border-primary/20 text-white shadow-apple-subtle"
                        : isComp
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        : "bg-white/5 border-white/5 text-muted-foreground hover:text-white"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{sup.name}</div>
                      <div className="text-[9px] text-muted-foreground mt-0.5">{sup.category} &bull; {sup.deliveryTime}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: DETAIL OR COMPARE WORKBENCH (8 Cols) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!compareMode ? (
              // FULFILLMENT DETAIL VIEW
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="space-y-6"
              >
                {/* Core Supplier Stats Row */}
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { title: "Delivery Lead", value: activeSup.deliveryTime, icon: Clock, color: "text-blue-400 bg-blue-500/10" },
                    { title: "Reliability Score", value: `${activeSup.reliabilityScore}%`, icon: ShieldCheck, color: "text-green-400 bg-green-500/10" },
                    { title: "Quality Rating", value: `${activeSup.qualityScore}/100`, icon: Activity, color: "text-purple-400 bg-purple-500/10" }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <Card key={i} className="apple-glass border-white/5 p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">{stat.title}</span>
                          <div className={`p-1.5 rounded-lg ${stat.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="text-xl font-extrabold text-white font-mono">{stat.value}</div>
                      </Card>
                    );
                  })}
                </div>

                {/* AI Recommendation Banner */}
                <Card className="apple-glass border-white/5 p-6 bg-gradient-to-br from-white/[0.01] to-white/[0.03] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
                      AI Partner Recommendation
                    </span>
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(activeSup.rating) ? "fill-amber-400" : "text-muted-foreground/35"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-white leading-relaxed font-semibold">
                    {activeSup.recommendation}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                    {activeSup.details}
                  </p>
                </Card>

                {/* Historical Performance Line Chart */}
                <Card className="apple-glass border-white/5 p-6 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Historical Fulfillment Performance</h3>
                    <span className="text-[9px] text-muted-foreground">On-time delivery success percentages over 6 months</span>
                  </div>

                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={activeSup.historyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} domain={[70, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: "#0f0f11", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "10px" }} />
                        <Line type="monotone" dataKey="performance" stroke="#007aff" strokeWidth={2.5} dot={{ r: 3 }} name="On-Time Delivery (%)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>
            ) : (
              // SIDE-BY-SIDE RADAR COMPARE VIEW
              <motion.div
                key="compare"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="space-y-6"
              >
                {/* Radar Performance comparison chart */}
                <Card className="apple-glass border-white/5 p-6 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Fulfillment Radar Compare</h3>
                    <span className="text-[9px] text-muted-foreground">Comparison matrix between active selected suppliers</span>
                  </div>

                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                        <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.4)" fontSize={9} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" fontSize={8} />
                        <Radar name={activeSup.name} dataKey="A" stroke="#007aff" fill="#007aff" fillOpacity={0.2} />
                        <Radar name={compareSup.name} dataKey="B" stroke="#eab308" fill="#eab308" fillOpacity={0.15} />
                        <Legend wrapperStyle={{ fontSize: "9px" }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Compare parameters table list */}
                <Card className="apple-glass border-white/5 overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs font-semibold text-muted-foreground">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01] text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="px-6 py-4">Fulfillment Metric</th>
                        <th className="px-6 py-4 text-primary font-bold">{activeSup.name} (Active)</th>
                        <th className="px-6 py-4 text-amber-400 font-bold">{compareSup.name} (Compare)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="hover:bg-white/[0.01]">
                        <td className="px-6 py-4 text-white">Delivery Lead Time</td>
                        <td className="px-6 py-4 font-mono text-white">{activeSup.deliveryTime}</td>
                        <td className="px-6 py-4 font-mono text-white">{compareSup.deliveryTime}</td>
                      </tr>
                      <tr className="hover:bg-white/[0.01]">
                        <td className="px-6 py-4 text-white">Reliability Score</td>
                        <td className="px-6 py-4 font-mono text-green-400">{activeSup.reliabilityScore}%</td>
                        <td className="px-6 py-4 font-mono text-green-400">{compareSup.reliabilityScore}%</td>
                      </tr>
                      <tr className="hover:bg-white/[0.01]">
                        <td className="px-6 py-4 text-white">Cost Rating</td>
                        <td className="px-6 py-4 font-mono">{activeSup.costScore}/100</td>
                        <td className="px-6 py-4 font-mono">{compareSup.costScore}/100</td>
                      </tr>
                      <tr className="hover:bg-white/[0.01]">
                        <td className="px-6 py-4 text-white">Quality Index</td>
                        <td className="px-6 py-4 font-mono">{activeSup.qualityScore}/100</td>
                        <td className="px-6 py-4 font-mono">{compareSup.qualityScore}/100</td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </motion.div>
  );
}
