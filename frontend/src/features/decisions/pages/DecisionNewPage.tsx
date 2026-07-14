import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDecisionStore, Decision } from "@/store/decisionStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  Sparkles, 
  Building,
  Layers,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface ScenarioResult {
  title: string;
  revenue: number;
  cost: number;
  profit: number;
  risk: "Low" | "Medium" | "High";
  inventoryImpact: string;
  customerSatisfaction: number;
  confidence: number;
  explanation: string;
}

export default function DecisionNewPage() {
  const navigate = useNavigate();
  const addDecision = useDecisionStore((state) => state.addDecision);

  // Form input states
  const [businessType, setBusinessType] = useState("Catering & Food Service");
  const [currentRevenue, setCurrentRevenue] = useState(150000);
  const [currentInventory, setCurrentInventory] = useState(80); // in %
  const [currentCosts, setCurrentCosts] = useState(95000);
  const [supplier, setSupplier] = useState("FreshFoods Wholesalers");
  const [orderDetails, setOrderDetails] = useState("₹80,000 Catering Order for 250 guests");
  const [pricing, setPricing] = useState(80000);
  const [expectedDemand, setExpectedDemand] = useState(1.2); // multiplier
  const [question, setQuestion] = useState("Should I accept a ₹80,000 catering order?");

  // Simulation outcome states
  const [simulating, setSimulating] = useState(false);
  const [scenarios, setScenarios] = useState<ScenarioResult[] | null>(null);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulating(true);

    // Mock calculations running
    setTimeout(() => {
      // Math formula logic based on inputs
      const revenueInput = pricing;
      const baseCost = Math.round(revenueInput * 0.45);
      
      const scenarioA: ScenarioResult = {
        title: "Scenario A: Full Acceptance",
        revenue: currentRevenue + revenueInput,
        cost: currentCosts + baseCost,
        profit: (currentRevenue + revenueInput) - (currentCosts + baseCost),
        risk: "Low",
        inventoryImpact: `Reduces stock buffer by ${Math.round(currentInventory * 0.25)}%. Stock remains stable.`,
        customerSatisfaction: 94,
        confidence: 96,
        explanation: `Accepting the full order boosts profit by ₹${(revenueInput - baseCost).toLocaleString()} immediately. High supplier availability (${supplier}) ensures low delivery risks.`,
      };

      const scenarioB: ScenarioResult = {
        title: "Scenario B: Partial Delivery",
        revenue: currentRevenue + Math.round(revenueInput * 0.7),
        cost: currentCosts + Math.round(baseCost * 0.6),
        profit: (currentRevenue + Math.round(revenueInput * 0.7)) - (currentCosts + Math.round(baseCost * 0.6)),
        risk: "Medium",
        inventoryImpact: `Negligible inventory impact. Stock reserves remain at ${currentInventory - 5}%.`,
        customerSatisfaction: 78,
        confidence: 88,
        explanation: `Delivering 70% of the volume reduces inventory strain but limits maximum revenue gains and decreases customer satisfaction ratings due to unfulfilled capacity.`,
      };

      const scenarioC: ScenarioResult = {
        title: "Scenario C: Decline & Re-allocate",
        revenue: currentRevenue,
        cost: currentCosts - 5000, // optimized opex
        profit: currentRevenue - (currentCosts - 5000),
        risk: "High",
        inventoryImpact: "No inventory impact. Stock remains fully optimized.",
        customerSatisfaction: 85,
        confidence: 91,
        explanation: "Declining the order eliminates variable supplier costs and preserves capacity for high-margin regular clients, but misses the immediate ₹80,000 cash flow injection.",
      };

      setScenarios([scenarioA, scenarioB, scenarioC]);
      setSimulating(false);
    }, 1800);
  };

  const handleSaveToWorkspace = (selected: ScenarioResult) => {
    const newDecision: Decision = {
      id: `dec-${Math.random().toString(36).substr(2, 9)}`,
      title: `${question} - ${selected.title}`,
      description: selected.explanation,
      createdAt: new Date().toISOString(),
      status: "completed",
      variables: [
        { id: "v1", name: "Business Type", key: "business_type", type: "number", value: 1 },
        { id: "v2", name: "Current Revenue", key: "revenue", type: "currency", value: currentRevenue },
        { id: "v3", name: "Current Costs", key: "costs", type: "currency", value: currentCosts }
      ],
      options: [
        { id: "o1", name: selected.title, description: selected.explanation, modifications: { "revenue": selected.revenue - currentRevenue } }
      ],
      results: {
        decisionId: "temp-id",
        simulatedAt: new Date().toISOString(),
        confidenceScore: selected.confidence,
        outcomes: [
          {
            optionId: "o1",
            optionName: selected.title,
            metrics: {
              revenue: [currentRevenue, selected.revenue],
              cost: [currentCosts, selected.cost],
              profit: [currentRevenue - currentCosts, selected.profit],
              roi: Math.round(((selected.revenue - selected.cost) / (selected.cost || 1)) * 100)
            }
          }
        ],
        sensitivityAnalysis: [
          { variableKey: "revenue", impactLevel: selected.risk.toLowerCase() as any, description: selected.explanation }
        ]
      }
    };

    addDecision(newDecision);
    navigate("/dashboard");
  };

  const getRiskColor = (risk: ScenarioResult["risk"]) => {
    switch (risk) {
      case "Low":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-red-500/10 text-red-400 border-red-500/20";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none">
      {/* Back link */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Overview
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">
            AI Decision Simulator
          </h1>
          <p className="text-muted-foreground text-xs font-semibold mt-0.5">
            Model cash flows, opex adjustments and inventory risk side-by-side.
          </p>
        </div>
      </div>

      {/* Slide transition container */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {!scenarios ? (
            <motion.div
              key="form-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            >
              <form onSubmit={handleSimulate} className="grid gap-6 md:grid-cols-2">
                
                {/* Section 1: Financial & Business Profiles */}
                <Card className="apple-glass border-white/5 p-6 space-y-5">
                  <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    <Building className="h-4.5 w-4.5 text-primary" />
                    Business Parameters
                  </h2>

                  <div className="space-y-4">
                    <Input
                      id="businessType"
                      type="text"
                      required
                      label="Business Type"
                      className="h-11 rounded-2xl border-white/10 bg-white/[0.01] text-white focus:border-primary focus:ring-primary/20"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        id="revenue"
                        type="number"
                        required
                        label="Current Monthly Rev (₹)"
                        className="h-11 rounded-2xl border-white/10 bg-white/[0.01] text-white focus:border-primary focus:ring-primary/20"
                        value={currentRevenue || ""}
                        onChange={(e) => setCurrentRevenue(Number(e.target.value))}
                      />
                      <Input
                        id="costs"
                        type="number"
                        required
                        label="Current Monthly Costs (₹)"
                        className="h-11 rounded-2xl border-white/10 bg-white/[0.01] text-white focus:border-primary focus:ring-primary/20"
                        value={currentCosts || ""}
                        onChange={(e) => setCurrentCosts(Number(e.target.value))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        id="inventory"
                        type="number"
                        required
                        label="Current Inventory (%)"
                        className="h-11 rounded-2xl border-white/10 bg-white/[0.01] text-white focus:border-primary focus:ring-primary/20"
                        value={currentInventory || ""}
                        onChange={(e) => setCurrentInventory(Number(e.target.value))}
                      />
                      <Input
                        id="supplier"
                        type="text"
                        required
                        label="Supplier Partner"
                        className="h-11 rounded-2xl border-white/10 bg-white/[0.01] text-white focus:border-primary focus:ring-primary/20"
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                      />
                    </div>
                  </div>
                </Card>

                {/* Section 2: Order & Simulation Details */}
                <Card className="apple-glass border-white/5 p-6 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                      <Layers className="h-4.5 w-4.5 text-primary" />
                      Order Details
                    </h2>

                    <div className="space-y-4">
                      <Input
                        id="question"
                        type="text"
                        required
                        label="Decision Question"
                        className="h-11 rounded-2xl border-white/10 bg-white/[0.01] text-white focus:border-primary focus:ring-primary/20"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                      />

                      <Input
                        id="orderDetails"
                        type="text"
                        required
                        label="Order details"
                        className="h-11 rounded-2xl border-white/10 bg-white/[0.01] text-white focus:border-primary focus:ring-primary/20"
                        value={orderDetails}
                        onChange={(e) => setOrderDetails(e.target.value)}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          id="pricing"
                          type="number"
                          required
                          label="Order Value / Price (₹)"
                          className="h-11 rounded-2xl border-white/10 bg-white/[0.01] text-white focus:border-primary focus:ring-primary/20"
                          value={pricing || ""}
                          onChange={(e) => setPricing(Number(e.target.value))}
                        />
                        <Input
                          id="demand"
                          type="number"
                          step="0.1"
                          required
                          label="Expected Demand Multiplier"
                          className="h-11 rounded-2xl border-white/10 bg-white/[0.01] text-white focus:border-primary focus:ring-primary/20"
                          value={expectedDemand || ""}
                          onChange={(e) => setExpectedDemand(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <Button
                      type="submit"
                      isLoading={simulating}
                      className="rounded-full shadow-apple-subtle bg-primary text-white"
                    >
                      {!simulating && <Play className="h-4 w-4" />}
                      Run AI Simulator
                    </Button>
                  </div>
                </Card>

              </form>
            </motion.div>
          ) : (
            <motion.div
              key="results-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="space-y-8"
            >
              {/* Reset simulation button */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">
                  Simulating: <span className="text-white font-bold">"{question}"</span>
                </span>
                <Button
                  variant="secondary"
                  onClick={() => setScenarios(null)}
                  className="rounded-full"
                >
                  Configure New parameters
                </Button>
              </div>

              {/* Scenarios Cards grid */}
              <div className="grid gap-6 md:grid-cols-3">
                {scenarios.map((sc, idx) => (
                  <Card
                    key={idx}
                    isHoverable
                    className="apple-glass border-white/5 p-6 flex flex-col justify-between space-y-6 h-full min-h-[420px]"
                  >
                    <div className="space-y-4">
                      {/* Scenario Title & Risk Tag */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h3 className="font-extrabold text-sm text-primary">{sc.title}</h3>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold ${getRiskColor(sc.risk)}`}>
                          {sc.risk} Risk
                        </span>
                      </div>

                      {/* Scenario Financial Metrics */}
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-semibold">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-muted-foreground block text-[8px] uppercase">Revenue</span>
                          <span className="font-bold text-white block mt-1">₹{sc.revenue.toLocaleString()}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-muted-foreground block text-[8px] uppercase">Cost</span>
                          <span className="font-bold text-white block mt-1">₹{sc.cost.toLocaleString()}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-muted-foreground block text-[8px] uppercase">Profit</span>
                          <span className="font-bold text-green-400 block mt-1">₹{sc.profit.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Scenario Extra Metrics */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-semibold">Inventory Impact:</span>
                          <span className="font-bold text-white text-right text-[10px] max-w-[120px] truncate">{sc.inventoryImpact}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-semibold">Customer Satisfaction:</span>
                          <span className="font-bold text-primary font-mono">{sc.customerSatisfaction}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-semibold">Confidence Index:</span>
                          <span className="font-bold text-green-400 font-mono">{sc.confidence}%</span>
                        </div>
                      </div>

                      {/* AI Explanation block */}
                      <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 text-[10px] text-muted-foreground leading-relaxed font-semibold">
                        <span className="font-bold text-white flex items-center gap-1.5 mb-1 text-[9px] uppercase tracking-wider">
                          <Sparkles className="h-3 w-3 text-primary" />
                          AI Assessment
                        </span>
                        {sc.explanation}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleSaveToWorkspace(sc)}
                      className="w-full rounded-2xl h-10 bg-primary text-white hover:bg-primary/95 text-xs font-bold"
                    >
                      Save Scenario to Workspace
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
