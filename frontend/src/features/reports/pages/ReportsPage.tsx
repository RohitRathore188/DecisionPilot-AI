import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  FileSpreadsheet
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ReportTemplate {
  id: string;
  name: string;
  type: "Business Summary" | "Weekly Report" | "Monthly Report" | "AI Summary" | "Executive Dashboard";
  size: string;
  description: string;
  lastGenerated: string;
  csvContent: string;
}

const templates: ReportTemplate[] = [
  {
    id: "rep1",
    name: "Core Business Summary",
    type: "Business Summary",
    size: "1.2 MB",
    description: "Includes current revenues, fixed opex, and overall stock optimization scores.",
    lastGenerated: "Today, 10:45 AM",
    csvContent: "Metric,Value,Status\nMonthly Revenue,₹150000,Stable\nMonthly Opex,₹95000,Stable\nStock Optimization,92%,Healthy\nRisk Profile,Low,Safe"
  },
  {
    id: "rep2",
    name: "Weekly Cash Velocity Audit",
    type: "Weekly Report",
    size: "950 KB",
    description: "Weekly breakdown of cash flow velocities, opex variations, and low stock warnings.",
    lastGenerated: "Yesterday",
    csvContent: "Week,Revenue,Opex,StockAlerts\nWeek 1,₹35000,₹22000,0\nWeek 2,₹38000,₹24000,0\nWeek 3,₹42000,₹25000,2\nWeek 4,₹35000,₹24000,0"
  },
  {
    id: "rep3",
    name: "Monthly Multi-Scenario Forecast",
    type: "Monthly Report",
    size: "2.4 MB",
    description: "Compounding projections comparing Aggressive, Balanced, and Defensive operational routes.",
    lastGenerated: "3 days ago",
    csvContent: "Scenario,Revenue,Cost,Profit,Risk\nExpansion,₹280000,₹160000,₹120000,High\nOptimization,₹160000,₹85000,₹75000,Low\nStaffing,₹310000,₹140000,₹170000,Medium"
  },
  {
    id: "rep4",
    name: "AI Consultant Deep Assessment",
    type: "AI Summary",
    size: "450 KB",
    description: "Qualitative reports detailing supply chain changes, pricing hikes, and risk mitigation.",
    lastGenerated: "Just now",
    csvContent: "StrategicAdvice,CriticalVulnerability,Timeline\nSwitch produce suppliers,Fulfillment delay risk,Immediate\nImplement 10% pricing hike,Premium tier customer churn,Q3 Start\nBuy 15% inventory buffer,Holding costs expansion,Next 15 days"
  },
  {
    id: "rep5",
    name: "Unified Executive Dashboard",
    type: "Executive Dashboard",
    size: "4.8 MB",
    description: "Unified export compiling financials, supply chain performance, and AI evaluations.",
    lastGenerated: "5 days ago",
    csvContent: "Category,Metric,Score,Verdict\nFinancials,Expected Profit,₹170000,High ROI\nInventory,Stock Level,78%,Optimized\nSupplier,FreshFoods,96%,Highly Reliable"
  }
];

export default function ReportsPage() {
  const [activeRepId, setActiveRepId] = useState("rep1");
  const [exporting, setExporting] = useState<string | null>(null);

  const activeRep = templates.find((t) => t.id === activeRepId) || templates[0];

  const handleCSVDownload = (format: "csv" | "excel") => {
    setExporting(format);
    setTimeout(() => {
      // Generate client-side text download file
      const blob = new Blob([activeRep.csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${activeRep.name.toLowerCase().replace(/\s+/g, "_")}.${format === "excel" ? "xls" : "csv"}`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExporting(null);
    }, 900);
  };

  const handlePDFExport = () => {
    setExporting("pdf");
    setTimeout(() => {
      window.print();
      setExporting(null);
    }, 500);
  };

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
      className="space-y-8 select-none printable-section"
    >
      {/* Title Header (Hidden when printing) */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Reports Engine</h1>
          <p className="text-muted-foreground text-xs font-semibold mt-0.5">
            Configure financial summaries, weekly audits, and executive dashboard exports.
          </p>
        </div>
      </motion.div>

      {/* DUAL PANEL WORKSPACE */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* LEFT COLUMN: REPORT TEMPLATE SELECTOR (4 Cols - Hidden when printing) */}
        <div className="lg:col-span-4 space-y-4 print:hidden">
          <Card className="apple-glass border-white/5 p-4 space-y-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Report Catalog</span>
            <div className="space-y-2">
              {templates.map((temp) => {
                const isActive = activeRepId === temp.id;
                return (
                  <button
                    key={temp.id}
                    onClick={() => setActiveRepId(temp.id)}
                    className={`flex items-center justify-between w-full p-3 rounded-2xl border text-left transition-all ${
                      isActive 
                        ? "bg-primary border-primary/20 text-white shadow-apple-subtle" 
                        : "bg-white/5 border-white/5 text-muted-foreground hover:text-white"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{temp.name}</div>
                      <div className="text-[9px] text-muted-foreground mt-0.5">{temp.type} &bull; {temp.size}</div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: PREVIEW & EXPORT ACTIONS (8 Cols) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRep.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="space-y-6"
            >
              {/* Template details card */}
              <Card className="apple-glass border-white/5 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-white">{activeRep.name}</h3>
                    <span className="text-[9px] text-primary font-bold uppercase">{activeRep.type}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold">Size: {activeRep.size}</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                  {activeRep.description}
                </p>

                <div className="flex gap-4 text-[10px] font-semibold text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Last Generated: {activeRep.lastGenerated}
                  </div>
                </div>
              </Card>

              {/* Interactive export actions panel (Hidden when printing) */}
              <Card className="apple-glass border-white/5 p-6 space-y-5 print:hidden">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Export Formats</h4>
                
                <div className="grid gap-3 sm:grid-cols-3">
                  
                  {/* Export PDF Button */}
                  <Button
                    onClick={handlePDFExport}
                    isLoading={exporting === "pdf"}
                    className="rounded-2xl h-12 bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.06] text-white font-bold"
                  >
                    <FileText className="h-4.5 w-4.5 text-primary shrink-0" />
                    Export PDF
                  </Button>

                  {/* Export CSV Button */}
                  <Button
                    onClick={() => handleCSVDownload("csv")}
                    isLoading={exporting === "csv"}
                    className="rounded-2xl h-12 bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.06] text-white font-bold"
                  >
                    <Download className="h-4.5 w-4.5 text-green-400 shrink-0" />
                    Export CSV
                  </Button>

                  {/* Export Excel Button */}
                  <Button
                    onClick={() => handleCSVDownload("excel")}
                    isLoading={exporting === "excel"}
                    className="rounded-2xl h-12 bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.06] text-white font-bold"
                  >
                    <FileSpreadsheet className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                    Export Excel
                  </Button>

                </div>

                <div className="pt-4 border-t border-white/5 text-[9px] text-muted-foreground font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                    Fulfillment reports synced with Supabase datastore.
                  </span>
                  <span>Encryption enabled</span>
                </div>
              </Card>

              {/* Printable visual representation of Report contents */}
              <Card className="apple-glass border-white/5 p-6 space-y-6 relative overflow-hidden bg-white/[0.01]">
                <div className="absolute top-0 right-0 h-28 w-28 bg-[radial-gradient(circle,rgba(0,122,255,0.04)_0%,transparent_70%)] pointer-events-none" />
                
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Sparkles className="h-4.5 w-4.5 text-primary" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Report Preview Data</span>
                </div>

                {/* Simulated table representation of report data */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[10px] font-semibold text-muted-foreground">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01] text-white font-bold uppercase">
                        {activeRep.csvContent.split("\n")[0].split(",").map((col, i) => (
                          <th key={i} className="px-4 py-2.5">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {activeRep.csvContent.split("\n").slice(1).map((row, i) => (
                        <tr key={i} className="hover:bg-white/[0.01]">
                          {row.split(",").map((val, idx) => (
                            <td key={idx} className="px-4 py-3 text-white font-mono">{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </motion.div>
  );
}
