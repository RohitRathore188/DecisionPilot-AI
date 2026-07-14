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
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

    const riskBadge = (risk: Strategy["risk"]) => {
      const color = risk === "Low" ? "#16a34a" : risk === "Medium" ? "#d97706" : "#dc2626";
      const bg = risk === "Low" ? "#dcfce7" : risk === "Medium" ? "#fef9c3" : "#fee2e2";
      return `<span style="background:${bg};color:${color};border-radius:999px;padding:2px 10px;font-size:10px;font-weight:700;display:inline-block">${risk}</span>`;
    };

    const tableRows = activeStrategies.map((s) => `
      <tr style="border-bottom:1px solid #e5e7eb;${s.id === bestOption.id ? "background:#f0fdf4;" : ""}">
        <td style="padding:14px 16px;font-weight:700;color:#111827;font-size:13px">
          ${s.id === bestOption.id ? "⭐ " : ""}${s.name}
        </td>
        <td style="padding:14px 16px;text-align:right;font-family:monospace;font-size:13px;color:#374151">₹${s.revenue.toLocaleString()}</td>
        <td style="padding:14px 16px;text-align:right;font-family:monospace;font-size:13px;color:#374151">₹${s.cost.toLocaleString()}</td>
        <td style="padding:14px 16px;text-align:right;font-family:monospace;font-size:13px;color:#16a34a;font-weight:700">₹${s.profit.toLocaleString()}</td>
        <td style="padding:14px 16px;text-align:center">${riskBadge(s.risk)}</td>
        <td style="padding:14px 16px;font-size:12px;color:#374151">${s.inventory}</td>
        <td style="padding:14px 16px;font-size:12px;color:#6b7280;max-width:200px">${s.recommendation}</td>
      </tr>
    `).join("");

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Scenario Comparison Report — DecisionPilot AI</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; color: #111827; padding: 40px; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none !important; }
      @page { margin: 20mm; size: A4 landscape; }
    }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #111827; margin-bottom: 32px; }
    .logo { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }
    .logo span { color: #6366f1; }
    .meta { text-align: right; font-size: 12px; color: #6b7280; }
    .meta strong { display: block; font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 4px; }
    .highlights { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
    .highlight-card { border-radius: 12px; padding: 20px; }
    .highlight-card.best { background: #f0fdf4; border: 1.5px solid #86efac; }
    .highlight-card.worst { background: #fff1f2; border: 1.5px solid #fca5a5; }
    .highlight-card .label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .highlight-card.best .label { color: #16a34a; }
    .highlight-card.worst .label { color: #dc2626; }
    .highlight-card h3 { font-size: 14px; font-weight: 800; color: #111827; margin-bottom: 6px; }
    .highlight-card p { font-size: 12px; color: #6b7280; margin-bottom: 14px; line-height: 1.5; }
    .highlight-card .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 12px; }
    .highlight-card .stat-label { font-size: 10px; font-weight: 600; color: #9ca3af; margin-bottom: 4px; }
    .highlight-card .stat-value { font-size: 14px; font-weight: 800; color: #111827; }
    .roi-badge { float: right; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; }
    .roi-badge.best { background: #dcfce7; color: #16a34a; }
    .roi-badge.worst { background: #fee2e2; color: #dc2626; }
    .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #f9fafb; }
    thead th { padding: 12px 16px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; border-bottom: 2px solid #e5e7eb; }
    thead th:not(:first-child) { text-align: right; }
    thead th:nth-child(5) { text-align: center; }
    thead th:nth-child(6), thead th:nth-child(7) { text-align: left; }
    tbody tr:last-child { border-bottom: none; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
    .footer p { font-size: 11px; color: #9ca3af; }
    .print-btn { no-print: true; margin-bottom: 20px; }
    button { background: #6366f1; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; }
  </style>
</head>
<body>
  <div class="print-btn no-print">
    <button onclick="window.print()">⬇ Save as PDF</button>
  </div>

  <div class="header">
    <div class="logo">Decision<span>Pilot</span> AI</div>
    <div class="meta">
      <strong>Scenario Comparison Report</strong>
      Generated on ${dateStr}<br/>
      Workspace: Demo &nbsp;|&nbsp; ${activeStrategies.length} strategies compared
    </div>
  </div>

  <div class="section-title">Strategic Highlights</div>
  <div class="highlights">
    <div class="highlight-card best">
      <div class="label">👍 Best Strategic Option <span class="roi-badge best">${bestOption.roi}% ROI</span></div>
      <h3>${bestOption.name}</h3>
      <p>${bestOption.recommendation}</p>
      <div class="stats">
        <div>
          <div class="stat-label">Expected Net Profit</div>
          <div class="stat-value">₹${bestOption.profit.toLocaleString()}</div>
        </div>
        <div>
          <div class="stat-label">Inventory Buffer</div>
          <div class="stat-value">${bestOption.inventory}</div>
        </div>
      </div>
    </div>
    <div class="highlight-card worst">
      <div class="label">👎 High Risk / Low Return <span class="roi-badge worst">${worstOption.roi}% ROI</span></div>
      <h3>${worstOption.name}</h3>
      <p>${worstOption.recommendation}</p>
      <div class="stats">
        <div>
          <div class="stat-label">Expected Net Profit</div>
          <div class="stat-value">₹${worstOption.profit.toLocaleString()}</div>
        </div>
        <div>
          <div class="stat-label">Inventory Buffer</div>
          <div class="stat-value">${worstOption.inventory}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="section-title">Full Strategy Comparison</div>
  <table>
    <thead>
      <tr>
        <th>Strategy Name</th>
        <th style="text-align:right">Expected Revenue</th>
        <th style="text-align:right">Expected Costs</th>
        <th style="text-align:right">Expected Profit</th>
        <th style="text-align:center">Risk Level</th>
        <th>Inventory Safety</th>
        <th>AI Recommendation Summary</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>

  <div class="footer">
    <p>DecisionPilot AI — Confidential Business Report</p>
    <p>Generated ${dateStr} &nbsp;|&nbsp; AI-Powered Decision Intelligence</p>
  </div>
</body>
</html>`;

    const printWindow = window.open("", "_blank", "width=1200,height=800");
    if (!printWindow) return;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    // Auto-trigger print after content loads
    printWindow.onload = () => printWindow.print();
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
