import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  CheckCircle2, 
  Truck, 
  Sparkles,
  Clock
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface InventoryItem {
  id: string;
  name: string;
  category: "Raw Materials" | "Packaging" | "Finished Goods";
  stockLevel: number; // in percentage
  quantity: number;
  unit: string;
  expiryDays: number; // remaining
  restockRecommended: boolean;
  predictedUsage: number; // units expected next month
  bestSupplier: string;
  altSupplier: string;
  priceDiff: number; // potential savings from alt supplier in %
}

const initialItems: InventoryItem[] = [
  {
    id: "i1",
    name: "Refined Flour (Sacks)",
    category: "Raw Materials",
    stockLevel: 28,
    quantity: 45,
    unit: "bags",
    expiryDays: 45,
    restockRecommended: true,
    predictedUsage: 120,
    bestSupplier: "FreshFoods Wholesalers (₹850/bag)",
    altSupplier: "OrganicFoods Supply (₹810/bag)",
    priceDiff: 4.7
  },
  {
    id: "i2",
    name: "Compostable Meal Trays",
    category: "Packaging",
    stockLevel: 14,
    quantity: 250,
    unit: "units",
    expiryDays: 360,
    restockRecommended: true,
    predictedUsage: 1500,
    bestSupplier: "Acme EcoPack (₹12/unit)",
    altSupplier: "GreenPack Corp (₹13/unit)",
    priceDiff: -8.3
  },
  {
    id: "i3",
    name: "Cold-Pressed Canola Oil",
    category: "Raw Materials",
    stockLevel: 82,
    quantity: 90,
    unit: "liters",
    expiryDays: 12,
    restockRecommended: false,
    predictedUsage: 60,
    bestSupplier: "FreshFoods Wholesalers (₹190/L)",
    altSupplier: "Vedic Oils (₹180/L)",
    priceDiff: 5.2
  },
  {
    id: "i4",
    name: "Frozen Berries (Bulk Packs)",
    category: "Raw Materials",
    stockLevel: 94,
    quantity: 18,
    unit: "cases",
    expiryDays: 90,
    restockRecommended: false,
    predictedUsage: 10,
    bestSupplier: "Polar Ice Foods (₹2,100/case)",
    altSupplier: "Himalaya ColdChain (₹2,200/case)",
    priceDiff: -4.7
  },
  {
    id: "i5",
    name: "DecisionPilot Premium Giftbox",
    category: "Finished Goods",
    stockLevel: 75,
    quantity: 120,
    unit: "boxes",
    expiryDays: 180,
    restockRecommended: false,
    predictedUsage: 45,
    bestSupplier: "Local Printing Inc (₹45/box)",
    altSupplier: "Metropolitan Boxes (₹42/box)",
    priceDiff: 6.6
  }
];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const handleRestock = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, stockLevel: 100, quantity: item.quantity + item.predictedUsage, restockRecommended: false }
          : item
      )
    );
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = items.filter((item) => item.stockLevel < 30).length;
  const expiryThreatCount = items.filter((item) => item.expiryDays < 15).length;
  const totalRecommendedCost = items
    .filter((item) => item.restockRecommended)
    .reduce((sum, item) => sum + (item.predictedUsage * 15), 0); // mock average cost factor

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
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Inventory Intelligence</h1>
          <p className="text-muted-foreground text-xs font-semibold mt-0.5">
            Optimize supply channels, audit expiry threats, and manage restock triggers.
          </p>
        </div>
      </motion.div>

      {/* TOP STATS STRIP (Floating Glass widgets) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Stock Optimization Score",
            value: "92%",
            status: "Healthy",
            color: "text-green-400 bg-green-500/10 border-green-500/20"
          },
          {
            title: "Low Stock Alerts",
            value: `${lowStockCount} Items`,
            status: lowStockCount > 0 ? "Action Required" : "Satisfactory",
            color: lowStockCount > 0 ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-green-400 bg-green-500/10 border-green-500/20"
          },
          {
            title: "Expiry Warnings",
            value: `${expiryThreatCount} Threat`,
            status: expiryThreatCount > 0 ? "Expiring Soon" : "Stable Buffer",
            color: expiryThreatCount > 0 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-green-400 bg-green-500/10 border-green-500/20"
          },
          {
            title: "Predicted Purchase",
            value: `₹${totalRecommendedCost.toLocaleString()}`,
            status: "Next 30 Days",
            color: "text-primary bg-primary/10 border-primary/20"
          }
        ].map((stat, idx) => (
          <Card key={idx} isHoverable className="apple-glass border-white/5 p-5 space-y-2">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">{stat.title}</span>
            <div className="text-2xl font-extrabold text-white font-mono">{stat.value}</div>
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[8px] font-bold ${stat.color}`}>
              {stat.status}
            </span>
          </Card>
        ))}
      </div>

      {/* FILTER & SEARCH STRIP */}
      <Card className="apple-glass border-white/5 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute left-3.5 top-3 text-muted-foreground/60 z-10">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search inventory items..."
            className="w-full h-10 pl-10 pr-3.5 rounded-2xl border border-white/10 bg-white/[0.01] text-white text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Toggles */}
        <div className="flex gap-2">
          {["All", "Raw Materials", "Packaging", "Finished Goods"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? "bg-primary border-primary/20 text-white shadow-apple-subtle"
                  : "bg-white/5 border-white/5 text-muted-foreground hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* INTERACTIVE INVENTORY DATA TABLE */}
      <Card className="apple-glass border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4.5">Item Name</th>
                <th className="px-6 py-4.5">Category</th>
                <th className="px-6 py-4.5">Stock Capacity</th>
                <th className="px-6 py-4.5 text-center">Expiry Status</th>
                <th className="px-6 py-4.5 text-right">Predicted Demand</th>
                <th className="px-6 py-4.5">Best Supplier Choice</th>
                <th className="px-6 py-4.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-muted-foreground font-semibold">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-5">
                    <div>
                      <div className="text-white font-bold">{item.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Quantity: {item.quantity} {item.unit}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-lg text-muted-foreground">
                      {item.category}
                    </span>
                  </td>
                  
                  {/* Stock capacity bar */}
                  <td className="px-6 py-5 min-w-[120px]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className={item.stockLevel < 30 ? "text-red-400" : "text-white"}>
                          {item.stockLevel}%
                        </span>
                      </div>
                      <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.stockLevel < 30 ? "bg-red-500 animate-pulse" : "bg-primary"}`}
                          style={{ width: `${item.stockLevel}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Expiry days */}
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 text-[10px]">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className={item.expiryDays < 15 ? "text-amber-400 font-bold" : "text-white"}>
                        {item.expiryDays} days left
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right font-mono text-white">
                    {item.predictedUsage} {item.unit}
                  </td>

                  {/* Supplier performance savings comparison */}
                  <td className="px-6 py-5">
                    <div>
                      <div className="text-white text-[11px] font-bold">{item.bestSupplier}</div>
                      {item.priceDiff > 0 ? (
                        <span className="text-[9px] text-green-400 font-bold">
                          Switch to alt: saves {item.priceDiff}%
                        </span>
                      ) : (
                        <span className="text-[9px] text-muted-foreground">
                          Optimal rates locked.
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Action trigger */}
                  <td className="px-6 py-5 text-center">
                    {item.restockRecommended ? (
                      <Button
                        size="sm"
                        onClick={() => handleRestock(item.id)}
                        className="rounded-full shadow-apple-subtle bg-primary text-white text-[10px]"
                      >
                        Restock (AI choice)
                      </Button>
                    ) : (
                      <span className="text-[10px] text-green-400 font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                        Healthy
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI SUGGESTION & SUPPLIER PREDICTION PANELS */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="apple-glass border-white/5 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">AI Procurement Predictions</h3>
          </div>
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1.5">
              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">Bottleneck alert</span>
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                Flour sacks buffer drops below 30% while Q3 demand multiplier compounds at 1.2x. Restock trigger recommended now.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1.5">
              <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider block">Cost savings suggestion</span>
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                Switching Canola Oil procurement to Vedic Oils offers <span className="text-white font-bold">5.2% savings</span>, expanding net operating margin buffers.
              </p>
            </div>
          </div>
        </Card>

        {/* Supplier Performance Comparison cards */}
        <Card className="apple-glass border-white/5 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Truck className="h-4.5 w-4.5 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Supplier Partner Comparisons</h3>
          </div>
          
          <div className="divide-y divide-white/5">
            {[
              { name: "FreshFoods Wholesalers", rate: "95% Delivery", save: "Standard pricing", lead: "1-2 days lead" },
              { name: "OrganicFoods Supply", rate: "85% Delivery", save: "5.2% cheaper on average", lead: "3-4 days lead" }
            ].map((sup, idx) => (
              <div key={idx} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                <div>
                  <h4 className="font-extrabold text-xs text-white">{sup.name}</h4>
                  <span className="text-[9px] text-muted-foreground font-semibold block mt-0.5">{sup.lead} &bull; {sup.rate}</span>
                </div>
                <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-lg font-bold">
                  {sup.save}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </motion.div>
  );
}
