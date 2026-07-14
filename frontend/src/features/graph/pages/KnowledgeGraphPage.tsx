import { useState, useEffect, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  MarkerType,
  NodeProps
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Truck,
  Package,
  Utensils,
  ShoppingCart,
  Users,
  Building,
  DollarSign,
  Sparkles,
  RefreshCw,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import api from "@/services/api";

// -------------------------------------------------------------
// Category Styling Configuration
// -------------------------------------------------------------
const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: any }
> = {
  SUPPLIER: {
    label: "Supplier",
    color: "#ff9500", // Orange
    bg: "rgba(255, 149, 0, 0.1)",
    border: "rgba(255, 149, 0, 0.3)",
    icon: Truck
  },
  INVENTORY: {
    label: "Inventory",
    color: "#af52de", // Purple
    bg: "rgba(175, 82, 222, 0.1)",
    border: "rgba(175, 82, 222, 0.3)",
    icon: Package
  },
  "MENU ITEM": {
    label: "Menu Item",
    color: "#30b0c7", // Cyan/Teal
    bg: "rgba(48, 176, 199, 0.1)",
    border: "rgba(48, 176, 199, 0.3)",
    icon: Utensils
  },
  ORDERS: {
    label: "Orders",
    color: "#ffcc00", // Yellow
    bg: "rgba(255, 204, 0, 0.1)",
    border: "rgba(255, 204, 0, 0.3)",
    icon: ShoppingCart
  },
  CUSTOMERS: {
    label: "Customers",
    color: "#5ac8fa", // Teal
    bg: "rgba(90, 200, 250, 0.1)",
    border: "rgba(90, 200, 250, 0.3)",
    icon: Users
  },
  RESTAURANT: {
    label: "Restaurant",
    color: "#007aff", // Blue
    bg: "rgba(0, 122, 255, 0.1)",
    border: "rgba(0, 122, 255, 0.3)",
    icon: Building
  },
  REVENUE: {
    label: "Revenue",
    color: "#34c759", // Green
    bg: "rgba(52, 199, 9, 0.1)",
    border: "rgba(52, 199, 9, 0.3)",
    icon: DollarSign
  }
};

// -------------------------------------------------------------
// Custom Node Component
// -------------------------------------------------------------
function KnowledgeGraphNode({ data }: NodeProps) {
  const config = CATEGORY_CONFIG[data.type] || {
    label: data.type,
    color: "#8e8e93",
    bg: "rgba(142, 142, 147, 0.1)",
    border: "rgba(142, 142, 147, 0.3)",
    icon: HelpCircle
  };

  const Icon = config.icon;
  const isDimmed = data.isDimmed;
  const isSelected = data.isSelected;

  return (
    <div
      className={`relative px-4 py-3 rounded-2xl transition-all duration-300 w-52 text-left border select-none ${
        isSelected
          ? "border-primary bg-primary/10 shadow-apple-subtle ring-2 ring-primary/20 scale-[1.03]"
          : "border-white/[0.08] dark:border-white/[0.03] bg-white/[0.03] dark:bg-black/[0.15]"
      } ${isDimmed ? "opacity-30 filter grayscale-[20%]" : "opacity-100"} hover:border-white/20 backdrop-blur-xl`}
      style={{
        boxShadow: isSelected
          ? `0 0 20px rgba(0, 198, 255, 0.15)`
          : "0 8px 32px 0 rgba(0, 0, 0, 0.08)"
      }}
    >
      {/* Node Top Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 !bg-primary border-2 border-background !transition-all hover:scale-125"
      />

      {/* Category Tag */}
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ backgroundColor: config.bg, color: config.color }}
        >
          {config.label}
        </span>
        
        {/* Status indicator */}
        <span className="text-[9px] text-muted-foreground font-bold">
          {data.status}
        </span>
      </div>

      {/* Title & Icon Row */}
      <div className="flex items-center gap-2.5 mt-1">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-inner shrink-0"
          style={{
            background: `linear-gradient(135deg, ${config.color} 30%, rgba(255,255,255,0.1))`
          }}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-foreground truncate leading-tight">
            {data.label}
          </p>
        </div>
      </div>

      {/* Node Bottom Handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 !bg-primary border-2 border-background !transition-all hover:scale-125"
      />
    </div>
  );
}

// Register Custom Node Type
const nodeTypes = {
  customNode: KnowledgeGraphNode
};

// -------------------------------------------------------------
// Main Graph Page Component
// -------------------------------------------------------------
export default function KnowledgeGraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rawNodes, setRawNodes] = useState<any[]>([]);
  const [rawEdges, setRawEdges] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Category filter state - default to all checked
  const [activeFilters, setActiveFilters] = useState<string[]>(
    Object.keys(CATEGORY_CONFIG)
  );

  // Fetch graph configuration on mount
  useEffect(() => {
    async function loadGraphData() {
      try {
        setLoading(true);
        const res = await api.get<any>("/v1/graph/");
        setRawNodes(res.nodes || []);
        setRawEdges(res.edges || []);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load graph mapping data.");
      } finally {
        setLoading(false);
      }
    }
    loadGraphData();
  }, []);

  // Filter and style nodes and edges based on search and filters
  useEffect(() => {
    if (rawNodes.length === 0) return;

    // Determine nodes to display based on category filters
    const filteredNodesList = rawNodes.filter((node) =>
      activeFilters.includes(node.type)
    );

    // Apply search query highlighting (dim unmatched nodes)
    const hasSearch = searchQuery.trim().length > 0;
    const searchLower = searchQuery.toLowerCase();

    const displayNodes = filteredNodesList.map((node) => {
      const isMatch =
        !hasSearch ||
        node.label.toLowerCase().includes(searchLower) ||
        node.type.toLowerCase().includes(searchLower) ||
        (node.status && node.status.toLowerCase().includes(searchLower));

      return {
        id: node.id,
        type: "customNode",
        position: node.position,
        data: {
          label: node.label,
          type: node.type,
          status: node.status,
          details: node.details,
          isDimmed: hasSearch && !isMatch,
          isSelected: selectedNodeId === node.id
        }
      };
    });

    // Filter edges to only connect visible nodes
    const visibleNodeIds = new Set(displayNodes.map((n) => n.id));
    const displayEdges = rawEdges
      .filter(
        (edge) =>
          visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
      )
      .map((edge) => {
        // Dim edge if source or target is dimmed
        const sourceNode = displayNodes.find((n) => n.id === edge.source);
        const targetNode = displayNodes.find((n) => n.id === edge.target);
        const isDimmed =
          (sourceNode?.data.isDimmed || targetNode?.data.isDimmed) ?? false;

        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label || undefined,
          animated: !isDimmed,
          type: "smoothstep",
          style: {
            stroke: isDimmed ? "rgba(255,255,255,0.06)" : "rgba(0, 198, 255, 0.4)",
            strokeWidth: isDimmed ? 1 : 2,
            transition: "stroke 0.3s, stroke-width 0.3s"
          },
          labelStyle: {
            fill: isDimmed ? "rgba(255,255,255,0.15)" : "#8e8e93",
            fontWeight: 600,
            fontSize: 9
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 16,
            height: 16,
            color: isDimmed ? "rgba(255,255,255,0.08)" : "rgba(0, 198, 255, 0.6)"
          }
        };
      });

    setNodes(displayNodes);
    setEdges(displayEdges);
  }, [rawNodes, rawEdges, activeFilters, searchQuery, selectedNodeId]);

  // Toggle filter logic
  const toggleFilter = (category: string) => {
    setActiveFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Node Selection callback
  const onNodeClick = (_event: any, node: any) => {
    setSelectedNodeId(node.id);
  };

  // Extract selected node details
  const selectedNodeDetails = useMemo(() => {
    if (!selectedNodeId) return null;
    const node = rawNodes.find((n) => n.id === selectedNodeId);
    if (!node) return null;

    // Find connections
    const incoming = rawEdges
      .filter((e) => e.target === selectedNodeId)
      .map((e) => {
        const sourceNode = rawNodes.find((n) => n.id === e.source);
        return {
          id: e.source,
          label: sourceNode?.label || e.source,
          type: sourceNode?.type || "Unknown",
          relation: e.label || "Connected"
        };
      });

    const outgoing = rawEdges
      .filter((e) => e.source === selectedNodeId)
      .map((e) => {
        const targetNode = rawNodes.find((n) => n.id === e.target);
        return {
          id: e.target,
          label: targetNode?.label || e.target,
          type: targetNode?.type || "Unknown",
          relation: e.label || "Feeds"
        };
      });

    return {
      ...node,
      incoming,
      outgoing
    };
  }, [selectedNodeId, rawNodes, rawEdges]);

  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* 1. Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            Knowledge Graph
          </h1>
          <p className="text-muted-foreground text-xs font-semibold mt-0.5">
            Interconnected visualization of suppliers, products, transactions, and corporate cash flows.
          </p>
        </div>
      </div>

      {/* 2. Controls Toolbar (Search & Filter Pills) */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl bg-secondary/15 border border-border/10 backdrop-blur-md">
        
        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-secondary/30 border border-border/10 rounded-xl px-4 py-2 w-full max-w-md">
          <Search className="h-4.5 w-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search graph nodes (e.g. Sysco, salad, optimal)..."
            className="w-full bg-transparent outline-none text-xs placeholder:text-muted-foreground/60 text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground mr-2">
            Categories:
          </span>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const isActive = activeFilters.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  isActive
                    ? "bg-white/[0.08] dark:bg-white/[0.04] text-foreground"
                    : "bg-transparent text-muted-foreground border-transparent opacity-50 hover:opacity-80"
                }`}
                style={{
                  borderColor: isActive ? config.border : "transparent"
                }}
              >
                <span
                  className="h-2 w-2 rounded-full shadow-inner"
                  style={{ backgroundColor: config.color }}
                />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Workspace Area */}
      <div className="relative flex-1 rounded-3xl overflow-hidden border border-border/10 min-h-[500px] flex">
        
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-30">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
              <span className="text-xs font-semibold text-muted-foreground">
                Mapping corporate relationships...
              </span>
            </div>
          </div>
        )}

        {/* Error Callout */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-background/50 backdrop-blur-sm z-30">
            <div className="max-w-md p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center space-y-4">
              <h3 className="text-sm font-extrabold text-red-500">Failed to load Knowledge Graph</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
              >
                Retry Request
              </button>
            </div>
          </div>
        )}

        {/* Graph Canvas */}
        <div className="flex-1 h-full bg-[#050505] relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.2}
            maxZoom={1.5}
            defaultEdgeOptions={{ type: "smoothstep" }}
          >
            <Controls className="!bg-secondary/40 !border-white/10 !rounded-xl !p-1 apple-glass shadow-apple-subtle" />
            <MiniMap
              nodeColor={(node) => {
                const config = CATEGORY_CONFIG[node.data?.type];
                return config ? config.color : "#ccc";
              }}
              maskColor="rgba(0, 0, 0, 0.6)"
              className="!bg-black/60 !border-white/10 !rounded-xl overflow-hidden shadow-apple-dock"
            />
            <Background color="#222" gap={16} size={1} />
          </ReactFlow>
        </div>

        {/* 4. Sliding Right Detail Drawer */}
        <AnimatePresence>
          {selectedNodeDetails && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="absolute right-0 top-0 bottom-0 w-80 md:w-96 border-l border-border/10 bg-card/90 backdrop-blur-2xl p-6 z-20 flex flex-col shadow-apple-dock select-none"
            >
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-border/20 pb-4">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor:
                        CATEGORY_CONFIG[selectedNodeDetails.type]?.color ||
                        "#ccc"
                    }}
                  />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                    {CATEGORY_CONFIG[selectedNodeDetails.type]?.label ||
                      selectedNodeDetails.type}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="p-1 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Drawer Body - Scrollable */}
              <div className="flex-1 overflow-y-auto py-6 space-y-6">
                
                {/* Node Label & Status */}
                <div>
                  <h2 className="text-xl font-extrabold text-foreground leading-snug">
                    {selectedNodeDetails.label}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Status:
                    </span>
                    <span className="text-xs font-bold text-primary">
                      {selectedNodeDetails.status}
                    </span>
                  </div>
                </div>

                {/* Node Details Description */}
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                    Overview Details
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-secondary/10 border border-border/10 rounded-2xl p-4">
                    {selectedNodeDetails.details}
                  </p>
                </div>

                {/* Connections Section */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                    Operational Mapping
                  </h3>
                  
                  {/* Incoming/Parents */}
                  {selectedNodeDetails.incoming.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Source Dependencies
                      </h4>
                      <div className="space-y-2">
                        {selectedNodeDetails.incoming.map((item: any) => (
                          <div
                            key={item.id}
                            onClick={() => setSelectedNodeId(item.id)}
                            className="flex items-center justify-between p-2.5 rounded-xl border border-border/10 bg-secondary/20 hover:border-primary/45 transition-colors cursor-pointer"
                          >
                            <div>
                              <div className="text-xs font-bold text-foreground">
                                {item.label}
                              </div>
                              <div className="text-[9px] text-muted-foreground uppercase mt-0.5">
                                {CATEGORY_CONFIG[item.type]?.label || item.type}
                              </div>
                            </div>
                            <div className="text-[9px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md">
                              {item.relation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Outgoing/Children */}
                  {selectedNodeDetails.outgoing.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Target Outputs
                      </h4>
                      <div className="space-y-2">
                        {selectedNodeDetails.outgoing.map((item: any) => (
                          <div
                            key={item.id}
                            onClick={() => setSelectedNodeId(item.id)}
                            className="flex items-center justify-between p-2.5 rounded-xl border border-border/10 bg-secondary/20 hover:border-primary/45 transition-colors cursor-pointer"
                          >
                            <div>
                              <div className="text-xs font-bold text-foreground">
                                {item.label}
                              </div>
                              <div className="text-[9px] text-muted-foreground uppercase mt-0.5">
                                {CATEGORY_CONFIG[item.type]?.label || item.type}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] font-semibold text-muted-foreground">
                              <span>{item.relation}</span>
                              <ArrowRight className="h-3 w-3 text-primary" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
