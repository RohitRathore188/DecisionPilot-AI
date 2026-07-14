import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  Plus,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  loading?: boolean;
  chartData?: any[];
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
}

export default function CopilotPage() {
  const { user } = useAuthStore();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am your AI Business Copilot. Ask me about hiring, pricing hikes, supplier switches, or inventory safety reserves to run simulated cash flow curves."
    }
  ]);
  const [history, setHistory] = useState<ChatHistory[]>([
    { id: "h1", title: "Employee Hiring Audit", timestamp: "Today" },
    { id: "h2", title: "Premium Pricing Elasticity", timestamp: "Yesterday" },
    { id: "h3", title: "FreshFoods Supplier Switch", timestamp: "3 days ago" }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamResponse = (fullText: string, chart?: any[]) => {
    const msgId = `copilot-${Math.random()}`;
    
    // 1. Set typing loader
    setMessages((prev) => [
      ...prev,
      { id: msgId, role: "assistant", content: "", loading: true }
    ]);

    const words = fullText.split(" ");
    let index = 0;
    let currentText = "";

    // 2. Stream tokens word-by-word
    const interval = setInterval(() => {
      if (index >= words.length) {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId
              ? { ...m, content: fullText, loading: false, chartData: chart }
              : m
          )
        );
        return;
      }
      currentText += (index === 0 ? "" : " ") + words[index];
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId ? { ...m, content: currentText, loading: false } : m
        )
      );
      index++;
    }, 40);
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI consultant reasoning answers
    const lower = textToSend.toLowerCase();
    if (lower.includes("hire") || lower.includes("employee")) {
      const resp = `**Verdict:** We recommend **proceeding** with hiring another employee. 

**Business Reasoning:** Adding 1 sales rep expands monthly fixed cost opex by ₹45,000, but lifts capacity limits from ₹150,000 to ₹220,000. Under current 1.2x demand indices, the hire achieves break-even by month 2, compounding net profit reserves by month 3.

**Risks:** Margin drops if demand index dips below 0.9x.
**Alternative:** Hire on a 3-month contract base first to validate conversion scaling.`;
      
      const chart = [
        { name: "Current", profit: 55000 },
        { name: "Month 1 (Hire)", profit: 10000 },
        { name: "Month 2 (B/E)", profit: 45000 },
        { name: "Month 3 (Net)", profit: 75000 },
      ];
      setTimeout(() => streamResponse(resp, chart), 600);
      
      // Update history sidebar
      setHistory(prev => [{ id: `h-${Date.now()}`, title: "New Hiring Analysis", timestamp: "Just now" }, ...prev]);

    } else if (lower.includes("price") || lower.includes("increase")) {
      const resp = `**Verdict:** We recommend a **10% pricing hike** on premium tiers.

**Business Reasoning:** Increasing pricing by 10% lifts net margins from 22% to 32%, but carries a 5-8% client churn vulnerability. Expected net revenues grow from ₹150,000 to ₹158,000 despite slight conversion volume drops.

**Supporting Factors:** Customer satisfaction levels are currently high (94%), providing safety cushions.
**Alternative:** Apply the price adjustment to new signups only to isolate legacy churn risks.`;

      const chart = [
        { name: "Baseline", profit: 55000 },
        { name: "10% Price Hike", profit: 63000 },
        { name: "15% Price Hike", profit: 60000 },
      ];
      setTimeout(() => streamResponse(resp, chart), 600);

    } else if (lower.includes("supplier") || lower.includes("switch")) {
      const resp = `**Verdict:** We recommend **switching** suppliers to OrganicFoods.

**Business Reasoning:** Transitioning reduces packaging variable costs by 15%, saving ₹9,000/mo. Reliability score checks indicate an 8% late-delivery vulnerability.

**Critical Risk:** Stockouts if delivery cycles mismatch.
**Alternative:** Allocate 30% volume to the new partner to build supply chain trust before full transition.`;

      const chart = [
        { name: "FreshFoods", cost: 95000 },
        { name: "OrganicFoods", cost: 86000 },
      ];
      setTimeout(() => streamResponse(resp, chart), 600);

    } else if (lower.includes("inventory") || lower.includes("buy")) {
      const resp = `**Verdict:** We recommend buying **15% inventory safety reserves**.

**Business Reasoning:** Stock reserves are optimized at 78%. Allocating a ₹18,000 procurement budget buffers the company against expected Q3 holiday surges.

**Risks:** Holding costs expand by ₹1,200/mo.
**Alternative:** Leverage just-in-time logistics contracts with Category A suppliers.`;

      const chart = [
        { name: "78% Buffer", risk: 60 },
        { name: "93% Buffer", risk: 20 },
      ];
      setTimeout(() => streamResponse(resp, chart), 600);

    } else {
      const resp = `I have received your query regarding "${textToSend}". 

Let's run simulated cash curves. Could you specify:
1. Expected operational costs adjustments?
2. Target margin goals?`;
      setTimeout(() => streamResponse(resp), 600);
    }
  };

  const handleSuggest = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="flex rounded-3xl apple-glass border-white/5 h-[calc(100vh-140px)] overflow-hidden select-none">
      
      {/* Side History Bar (Hidden on Mobile) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-white/[0.01]">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Conversation Log</span>
          <button 
            onClick={() => setMessages([{ id: "welcome", role: "assistant", content: "Hello! I am your AI Business Copilot. Ask me about hiring, pricing hikes, supplier switches, or inventory safety reserves to run simulated cash flow curves." }])}
            className="p-1 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {history.length === 0 ? (
            <div className="p-6 text-center space-y-2">
              <span className="text-[10px] text-muted-foreground block font-semibold leading-relaxed">
                No recent audits. Ask Copilot to run scenario audits.
              </span>
            </div>
          ) : (
            history.map((h) => (
              <button
                key={h.id}
                className="flex items-center gap-2.5 w-full p-2.5 rounded-xl hover:bg-white/[0.03] text-left text-xs font-semibold text-muted-foreground hover:text-white transition-all group"
              >
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-white text-[11px]">{h.title}</div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">{h.timestamp}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col justify-between bg-black/20 relative">
        
        {/* Messages Stream Pane */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m) => {
            const isAI = m.role === "assistant";
            return (
              <div key={m.id} className={`flex gap-4 ${isAI ? "justify-start" : "justify-end"}`}>
                
                {/* Profile icon */}
                {isAI && (
                  <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 shadow-apple-subtle">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className="max-w-xl space-y-4">
                  <div
                    className={`p-4 rounded-2xl border text-xs font-semibold leading-relaxed ${
                      isAI 
                        ? "apple-glass border-white/5 text-[#f5f5f7] rounded-tl-sm" 
                        : "bg-primary border-primary/20 text-white rounded-tr-sm shadow-apple-subtle"
                    }`}
                  >
                    {/* Render basic markdown bold formatting */}
                    {m.loading ? (
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    ) : (
                      <div className="whitespace-pre-line space-y-1">
                        {m.content.split("\n").map((line, idx) => {
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return <strong key={idx} className="block text-white font-extrabold mt-2">{line.replace(/\*\*/g, "")}</strong>;
                          }
                          if (line.includes("**")) {
                            // bold inline replacements
                            const parts = line.split("**");
                            return (
                              <p key={idx}>
                                {parts.map((p, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{p}</strong> : p)}
                              </p>
                            );
                          }
                          return <p key={idx}>{line}</p>;
                        })}
                      </div>
                    )}
                  </div>

                  {/* Inline Recharts graph */}
                  {isAI && m.chartData && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4.5 rounded-2xl border border-white/5 bg-[#0a0a0c] h-48 w-72 sm:w-96 shadow-apple-dialog"
                    >
                      <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">AI Prediction Model chart</span>
                      <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={m.chartData}>
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={8} tickLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={8} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: "#0f0f11", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "9px" }} />
                          <Bar dataKey={m.chartData[0].profit !== undefined ? "profit" : m.chartData[0].cost !== undefined ? "cost" : "risk"} fill="#007aff" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </motion.div>
                  )}
                </div>

                {!isAI && (
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-apple-subtle font-bold text-[10px]">
                    {user?.email?.[0].toUpperCase() || "U"}
                  </div>
                )}

              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion prompt boxes & Inputs */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01] space-y-4">
          
          {/* Quick Suggestion buttons */}
          {messages.length === 1 && (
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
              {[
                "Should I hire another employee?",
                "Should I increase prices?",
                "Should I switch supplier?",
                "How much inventory should I buy?"
              ].map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggest(sug)}
                  className="p-3 text-left rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 text-[10px] text-muted-foreground hover:text-white font-semibold transition-all flex justify-between items-center group"
                >
                  <span className="truncate pr-2">{sug}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Form input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2 max-w-4xl mx-auto"
          >
            <input
              type="text"
              placeholder="Ask AI Business Copilot..."
              className="flex-1 h-11 px-4.5 rounded-full border border-white/10 bg-white/[0.02] text-white text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              type="submit"
              className="h-11 w-11 rounded-full p-0 flex items-center justify-center bg-primary text-white shrink-0 shadow-apple-subtle"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>

        </div>

      </div>

    </div>
  );
}
