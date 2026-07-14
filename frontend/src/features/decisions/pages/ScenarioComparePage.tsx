import { useState } from "react";
import { 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown,
  Printer
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Strategy {
  id: string;
  name: string;
  revenue: number;
  cost: number;
  profit: number;
  risk: "Low" | "Medium" | "High";
  inventory: string;
  recommendation: string;
  roi: number;
  badge?: "best" | "worst";
}

const initialStrategies: Strategy[] = [
  {
    id: "s1",
    name: "Strategy 1: Aggressive Expansion",
    revenue: 280000,
    cost: 160000,
    profit: 120000,
    risk: "High",
    inventory: "Drops by 35% (Warning)",
    recommendation: "High cash velocity buy-in, risk of inventory stockouts.",
    roi: 75,
  },
  {
    id: "s2",
    name: "Strategy 2: Operational Optimization",
    revenue: 160000,
    cost: 85000,
    profit: 75000,
    risk: "Low",
    inventory: "Stable at 82%",
    recommendation: "Safe operational fallback protecting working capital.",
    roi: 88,
  },
  {
    id: "s3",
    name: "Strategy 3: Inventory Stock-Up Buffer",
    revenue: 190000,
    cost: 110000,
    profit: 80000,
    risk: "Medium",
    inventory: "Grows to 98% (Buffer)",
    recommendation: "Mitigates supply constraints, but locks capital in stock.",
    roi: 72,
  },
  {
    id: "s4",
    name: "Strategy 4: Premium Pricing Hike",
    revenue: 140000,
    cost: 70000,
    profit: 70000,
    risk: "Medium",
    inventory: "Stable at 88%",
    recommendation: "Vulnerable to client churn; lowest absolute profit gain.",
    roi: 100,
    badge: "worst"
  },
  {
    id: "s5",
    name: "Strategy 5: Hire Dedicated Sales Reps",
    revenue: 310000,
    cost: 140000,
    profit: 170000,
    risk: "Medium",
    inventory: "Stable at 78%",
    recommendation: "Highest long-term compounding profit and ROI yield.",
    roi: 121,
    badge: "best"
  }
];

export default function ScenarioComparePage() {
  const strategies = initialStrategies;
  const [selectedIds, setSelectedIds] = useState<string[]>(["s1", "s2", "s3", "s4", "s5"]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter((x) => x !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Find Best and Worst strategies in selected list
  const activeStrategies = strategies.filter((s) => selectedIds.includes(s.id));
  
  const bestOption = activeStrategies.reduce((prev, curr) => 
    (curr.roi > prev.roi) ? curr : prev
  , activeStrategies[0]);

  const worstOption = activeStrategies.reduce((prev, curr) => 
    (curr.roi < prev.roi) ? curr : prev
  , activeStrategies[0]);

  const handleExportPDF = () => {
    // Print window triggers native system PDF generator styled nicely for printing
    window.print();
  };

  const getRiskColor = (risk: Strategy["risk"]) => {
    switch (risk) {
      case "Low": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "Medium": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      default: return "text-red-400 bg-red-500/10 border-red-500/20";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none printable-section">
      
      {/* Page Header (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">
            Scenario Comparison
          </h1>
          <p className="text-muted-foreground text-xs font-semibold mt-0.5">
            Audit and compare 5 core SME business strategies side-by-side.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportPDF}
            className="rounded-full bg-white/5 border border-white/5 hover:border-white/10 text-white"
          >
            <Printer className="h-4 w-4" />
            Export PDF Report
          </Button>
        </div>
      </div>

      {/* Strategy Toggle Filters (Hidden when printing) */}
      <div className="flex flex-wrap gap-2.5 print:hidden">
        {strategies.map((s) => {
          const active = selectedIds.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggleSelect(s.id)}
              className={`px-4 py-2 rounded-2xl border text-xs font-bold transition-all ${
                active 
                  ? "bg-primary border-primary/20 text-white shadow-apple-subtle" 
                  : "bg-white/5 border-white/5 text-muted-foreground hover:text-white"
              }`}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      {/* HIGHLIGHTS CARDS GRID */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Best Option Card */}
        <Card isHoverable className="apple-glass border-green-500/20 bg-green-500/[0.01] p-6 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-[radial-gradient(circle,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider flex items-center gap-1.5">
              <ThumbsUp className="h-4 w-4 fill-green-400/10" />
              Best Strategic Option
            </span>
            <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold">
              {bestOption.roi}% ROI
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">{bestOption.name}</h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-semibold">
              {bestOption.recommendation}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5 text-[10px] font-semibold text-muted-foreground">
            <div>
              <span>Expected Net Profit</span>
              <span className="block text-white font-mono font-bold text-sm mt-0.5">₹{bestOption.profit.toLocaleString()}</span>
            </div>
            <div>
              <span>Inventory Buffer</span>
              <span className="block text-white font-bold mt-0.5">{bestOption.inventory}</span>
            </div>
          </div>
        </Card>

        {/* Worst Option Card */}
        <Card isHoverable className="apple-glass border-red-500/20 bg-red-500/[0.01] p-6 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-[radial-gradient(circle,rgba(239,68,68,0.06)_0%,transparent_70%)] pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <ThumbsDown className="h-4 w-4 fill-red-400/10" />
              High Risk / Low Return
            </span>
            <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">
              {worstOption.roi}% ROI
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">{worstOption.name}</h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-semibold">
              {worstOption.recommendation}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5 text-[10px] font-semibold text-muted-foreground">
            <div>
              <span>Expected Net Profit</span>
              <span className="block text-white font-mono font-bold text-sm mt-0.5">₹{worstOption.profit.toLocaleString()}</span>
            </div>
            <div>
              <span>Inventory Buffer</span>
              <span className="block text-white font-bold mt-0.5">{worstOption.inventory}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* DETAILED COMPARISON TABLE */}
      <Card className="apple-glass border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4.5">Strategy Name</th>
                <th className="px-6 py-4.5 text-right">Expected Revenue</th>
                <th className="px-6 py-4.5 text-right">Expected Costs</th>
                <th className="px-6 py-4.5 text-right">Expected Profit</th>
                <th className="px-6 py-4.5 text-center">Risk Level</th>
                <th className="px-6 py-4.5">Inventory Safety</th>
                <th className="px-6 py-4.5">AI Recommendation Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-muted-foreground font-semibold">
              {activeStrategies.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-5 text-white font-bold">
                    <div className="flex items-center gap-2">
                      {s.id === bestOption.id && <Sparkles className="h-4 w-4 text-green-400 shrink-0" />}
                      {s.name}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-mono">₹{s.revenue.toLocaleString()}</td>
                  <td className="px-6 py-5 text-right font-mono">₹{s.cost.toLocaleString()}</td>
                  <td className="px-6 py-5 text-right font-mono text-green-400">₹{s.profit.toLocaleString()}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold ${getRiskColor(s.risk)}`}>
                      {s.risk}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-white">{s.inventory}</td>
                  <td className="px-6 py-5 text-[10px] leading-relaxed max-w-xs">{s.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
