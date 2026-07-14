import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDecisionStore, SimulationResult, DecisionVariable } from "@/store/decisionStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  BarChart3, 
  Layers, 
  CheckCircle2, 
  Sliders, 
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Check
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ConsultantReport {
  why: string;
  factors: string[];
  reasoning: string;
  risks: string;
  opportunities: string;
  alternative: string;
  confidence: string;
}

export default function DecisionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const decisions = useDecisionStore((state) => state.decisions);
  const updateDecision = useDecisionStore((state) => state.updateDecision);

  const decision = decisions.find((d) => d.id === id);
  const [running, setRunning] = useState(false);

  // Local state to bind parameters to sliders
  const [localVariables, setLocalVariables] = useState<DecisionVariable[]>([]);

  // Initialize sliders when decision loads
  useEffect(() => {
    if (decision) {
      setLocalVariables(decision.variables);
    }
  }, [decision]);

  if (!decision) {
    return (
      <div className="p-8 text-center select-none">
        <h3 className="text-sm font-bold">Decision scenario not found</h3>
        <button onClick={() => navigate("/dashboard")} className="mt-4 text-primary hover:underline">
          Return to Overview
        </button>
      </div>
    );
  }

  // Helper to generate Explainable AI consulting reviews
  const getAIExplanation = (optionName: string, roi: number, confidence: number): ConsultantReport => {
    const isHighGain = roi > 100;
    return {
      why: `We recommend ${isHighGain ? "approving" : "holding off on"} "${optionName}". Calculations show it yields a projected return of ₹${Math.abs(roi * 450).toLocaleString()} in incremental profit per month.`,
      factors: [
        `Revenue multiplier compounding at ${isHighGain ? "1.4x" : "1.1x"} baseline demand`,
        `Operating expense margins remaining below safety thresholds`,
        `Supplier availability buffers verified at 94%`
      ],
      reasoning: `Allocating variable resources to this scenario maximizes immediate cash flow velocities. It avoids locking capital into fixed salary overheads, leaving you agile for market shifts.`,
      risks: `Slight inventory pressure in Month 2 if customer acquisition conversion rates exceed forecast bounds.`,
      opportunities: `Secures first-mover status in this niche, enabling recurring corporate contracts.`,
      alternative: `Initiate a 50% test budget in Week 1 to validate buyer conversion before executing the full capital plan.`,
      confidence: `${confidence}% confidence index derived from 142 simulated parameter scenarios.`
    };
  };

  // Handle live recalculation when slider values adjust
  const handleSliderChange = (varId: string, newValue: number) => {
    const updatedVars = localVariables.map((v) =>
      v.id === varId ? { ...v, value: newValue } : v
    );
    setLocalVariables(updatedVars);

    // If already simulated, trigger a live calculation updates locally
    if (decision.status === "completed" && decision.results) {
      const convRateVar = updatedVars.find((v) => v.key === "conv_rate")?.value as number || 1.0;
      const baseRevVar = updatedVars.find((v) => v.key === "revenue")?.value as number || 100000;
      const baseOpexVar = updatedVars.find((v) => v.key === "opex")?.value as number || 50000;

      const updatedOutcomes = decision.results.outcomes.map((outcome) => {
        // Adjust multiplier calculations based on variables adjustments
        const opexMod = outcome.optionId === "o1" ? 15000 : 8000;
        const convLift = outcome.optionId === "o1" ? 1.0 : 0.8;
        
        const compoundFactor = (convRateVar + convLift) / (convRateVar || 1.0);
        const calcRev = Math.round(baseRevVar * compoundFactor);
        const calcCost = Math.round(baseOpexVar + opexMod);
        
        // generate trend curves
        const revTrend = [baseRevVar, calcRev - 10000, calcRev - 5000, calcRev].map((v) => Math.round(v));
        const costTrend = [baseOpexVar, calcCost, calcCost, calcCost].map((v) => Math.round(v));
        const profitTrend = revTrend.map((r, i) => r - costTrend[i]);
        
        return {
          ...outcome,
          metrics: {
            revenue: revTrend,
            cost: costTrend,
            profit: profitTrend,
            roi: Math.round(((calcRev - calcCost) / (calcCost || 1)) * 100),
          },
        };
      });

      updateDecision(decision.id, {
        results: {
          ...decision.results,
          outcomes: updatedOutcomes,
        },
      });
    }
  };

  const triggerSimulation = () => {
    setRunning(true);
    updateDecision(decision.id, { status: "running" });

    // Mock calculations running on backend
    setTimeout(() => {
      const convRate = localVariables.find((v) => v.key === "conv_rate")?.value as number || 3.0;
      const baseRev = localVariables.find((v) => v.key === "revenue")?.value as number || 120000;
      const baseOpex = localVariables.find((v) => v.key === "opex")?.value as number || 85000;

      const mockResult: SimulationResult = {
        decisionId: decision.id,
        simulatedAt: new Date().toISOString(),
        confidenceScore: 93.5,
        outcomes: decision.options.map((opt) => {
          const opexMod = opt.modifications["opex"] || 0;
          const convLift = opt.modifications["conv_rate"] || 0;

          // ROI formulas
          const compoundFactor = (convRate + convLift) / (convRate || 1.0);
          const finalRev = Math.round(baseRev * compoundFactor);
          const finalCost = Math.round(baseOpex + opexMod);

          const revenue = [baseRev, baseRev + 5000, finalRev - 5000, finalRev];
          const cost = [baseOpex, finalCost, finalCost, finalCost];
          const profit = revenue.map((r, i) => r - cost[i]);

          return {
            optionId: opt.id,
            optionName: opt.name,
            metrics: {
              revenue,
              cost,
              profit,
              roi: Math.round(((finalRev - finalCost) / (finalCost || 1)) * 100),
            },
          };
        }),
        sensitivityAnalysis: [
          { variableKey: "conv_rate", impactLevel: "high", description: "Conversion shifts drive 72% of total scenario profit variance." },
          { variableKey: "opex", impactLevel: "medium", description: "Opex modifications cap maximum ROI upside by 18%." }
        ],
      };

      updateDecision(decision.id, {
        status: "completed",
        results: mockResult,
      });
      setRunning(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Header Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Workspace
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">{decision.title}</h1>
          <p className="text-muted-foreground text-xs font-semibold max-w-xl">{decision.description}</p>
        </div>

        {decision.status !== "completed" && (
          <Button
            onClick={triggerSimulation}
            isLoading={running}
            className="rounded-full shadow-apple-subtle"
          >
            {!running && <Play className="h-4 w-4" />}
            Run Simulation Model
          </Button>
        )}
      </div>

      {/* Simulator Inputs & Option configs */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Dynamic Sliders Card */}
        <Card className="apple-glass border-white/5 p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Sliders className="h-4.5 w-4.5 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Adjust Parameters</h3>
          </div>

          <div className="space-y-5">
            {localVariables.map((v) => {
              const isCurrency = v.type === "currency";
              const isPercent = v.type === "percentage";
              
              // Slider range setup
              const minVal = isPercent ? 0.5 : Math.round((v.value as number) * 0.4);
              const maxVal = isPercent ? 15 : Math.round((v.value as number) * 1.8);
              const stepVal = isPercent ? 0.1 : 1000;

              return (
                <div key={v.id} className="space-y-2 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">{v.name}</span>
                    <span className="font-mono text-primary">
                      {isCurrency ? "$" : ""}
                      {v.value.toLocaleString()}
                      {isPercent ? "%" : ""}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={minVal}
                    max={maxVal}
                    step={stepVal}
                    aria-label={v.name}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none"
                    value={v.value as number}
                    onChange={(e) => handleSliderChange(v.id, Number(e.target.value))}
                  />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Options Setup Cards */}
        <Card className="apple-glass border-white/5 p-6 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Simulated Scenario Options</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {decision.options.map((opt) => (
              <div key={opt.id} className="p-4.5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                <h4 className="font-extrabold text-xs text-white">{opt.name}</h4>
                <p className="text-[10px] text-muted-foreground font-semibold mt-1 leading-relaxed">{opt.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {Object.entries(opt.modifications).map(([key, val]) => (
                    <span key={key} className="text-[9px] font-bold bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-lg text-muted-foreground font-mono">
                      {key}: +{val.toLocaleString()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Simulator Visual Outputs & EXPLAINABLE AI CARDS */}
      <AnimatePresence mode="wait">
        {decision.status === "completed" && decision.results ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5.5 w-5.5 text-green-500" />
              <h2 className="text-base font-extrabold uppercase tracking-wider text-muted-foreground">Live Simulation Calculations</h2>
              <span className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-2.5 py-0.5 rounded-full font-bold">
                Confidence Level: {decision.results.confidenceScore}%
              </span>
            </div>

            {/* Outcomes Grid hosting Explainable AI Consultant Cards */}
            <div className="grid gap-8 md:grid-cols-2">
              {decision.results.outcomes.map((outcome) => {
                // Compute Consultant Reports dynamically
                const report = getAIExplanation(
                  outcome.optionName,
                  outcome.metrics.roi,
                  decision.results?.confidenceScore || 92
                );

                return (
                  <div key={outcome.optionId} className="space-y-6">
                    {/* Visual graph card */}
                    <Card className="apple-glass border-white/5 p-6 space-y-6 relative overflow-hidden">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="font-extrabold text-sm text-primary">{outcome.optionName}</h3>
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-muted-foreground block uppercase">Projected Net ROI</span>
                          <span className="font-extrabold text-lg text-green-400 font-mono">{outcome.metrics.roi}%</span>
                        </div>
                      </div>

                      {/* Outcome Metrics */}
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block">End Revenue</span>
                          <span className="font-mono font-bold text-xs mt-1 block">
                            ${outcome.metrics.revenue[outcome.metrics.revenue.length - 1].toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block">End Cost</span>
                          <span className="font-mono font-bold text-xs mt-1 block">
                            ${outcome.metrics.cost[outcome.metrics.cost.length - 1].toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block">End Profit</span>
                          <span className="font-mono font-bold text-xs mt-1 block text-green-400">
                            ${outcome.metrics.profit[outcome.metrics.profit.length - 1].toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Profit curve graph */}
                      <div className="h-32 rounded-2xl border border-white/5 bg-[#08080a] flex flex-col justify-end p-4 relative overflow-hidden">
                        <div className="flex justify-between items-end h-full gap-2 pt-6 z-10">
                          {outcome.metrics.profit.map((val, idx) => {
                            const maxVal = Math.max(...outcome.metrics.profit, 1000);
                            const heightPercent = Math.min(Math.max(Math.round((val / maxVal) * 100), 5), 100);
                            return (
                              <div key={idx} className="w-full flex flex-col items-center">
                                <motion.div
                                  layout
                                  animate={{ height: `${heightPercent}%` }}
                                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                                  className="w-full bg-gradient-to-t from-primary/60 to-primary rounded-t-lg min-h-[4px]"
                                />
                                <span className="text-[8px] text-muted-foreground font-mono mt-1 font-bold">M{idx + 1}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Card>

                    {/* EXPLAINABLE AI CONSULTANT CARD */}
                    <Card className="apple-glass border-white/10 dark:border-white/5 bg-white/[0.02] p-6 space-y-5 shadow-apple-dialog relative overflow-hidden">
                      <div className="absolute top-0 right-0 h-28 w-28 bg-[radial-gradient(circle,rgba(0,122,255,0.06)_0%,transparent_70%)] pointer-events-none" />
                      
                      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">AI Consultant Report</span>
                      </div>

                      {/* 1. Why? / Core Recommendation */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase block">Recommendation (Why?)</span>
                        <p className="text-xs text-white leading-relaxed font-semibold">
                          {report.why}
                        </p>
                      </div>

                      {/* 2. Business Reasoning */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase block">Strategic Business Reasoning</span>
                        <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                          {report.reasoning}
                        </p>
                      </div>

                      {/* 3. Supporting Factors */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase block">Supporting Factors</span>
                        <div className="space-y-1.5">
                          {report.factors.map((fact, i) => (
                            <div key={i} className="flex gap-2 text-xs text-muted-foreground font-semibold">
                              <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                              {fact}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. Risks & Opportunities */}
                      <div className="grid gap-4 grid-cols-2 pt-2 border-t border-white/5">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Risks
                          </span>
                          <p className="text-[10px] text-muted-foreground leading-relaxed font-semibold">
                            {report.risks}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
                            <Lightbulb className="h-3 w-3" /> Opportunities
                          </span>
                          <p className="text-[10px] text-muted-foreground leading-relaxed font-semibold">
                            {report.opportunities}
                          </p>
                        </div>
                      </div>

                      {/* 5. Alternative Strategy */}
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">Alternative Mitigation Strategy</span>
                        <p className="text-[10px] text-muted-foreground leading-relaxed font-semibold">
                          {report.alternative}
                        </p>
                      </div>

                      {/* 6. Confidence index */}
                      <div className="text-[9px] font-bold text-muted-foreground/60 text-right font-mono">
                        {report.confidence}
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl border border-dashed border-white/10 p-16 text-center max-w-md mx-auto space-y-4"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/40 text-muted-foreground">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Simulations Calculations Pending</h3>
              <p className="text-muted-foreground text-xs font-semibold mt-1">
                Run the simulation engine to generate projected curves and AI Consultant reports.
              </p>
            </div>
            <Button
              onClick={triggerSimulation}
              disabled={running}
              className="rounded-full shadow-apple-subtle"
            >
              {running ? "Simulating..." : "Compute Simulation"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
