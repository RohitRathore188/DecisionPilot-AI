import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { useDecisionStore } from "@/store/decisionStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  BarChart3, 
  Settings as SettingsIcon, 
  PlusCircle, 
  Sun, 
  Moon, 
  LogOut, 
  Search, 
  Command, 
  Building,
  Bell,
  ArrowRight,
  LineChart,
  Sparkles,
  Package,
  Truck,
  FileText
} from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const decisions = useDecisionStore((state) => state.decisions);
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Trigger search palette with Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: BarChart3 },
    { name: "Analytics Engine", href: "/analytics", icon: LineChart },
    { name: "Compare Scenarios", href: "/compare", icon: Activity },
    { name: "AI Copilot", href: "/copilot", icon: Sparkles },
    { name: "Inventory Intel", href: "/inventory", icon: Package },
    { name: "Supplier Intel", href: "/suppliers", icon: Truck },
    { name: "Fulfillment Reports", href: "/reports", icon: FileText },
    { name: "Simulate Decision", href: "/decisions/new", icon: PlusCircle },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const filteredDecisions = searchQuery
    ? decisions.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="relative min-h-screen flex bg-background text-foreground transition-colors duration-300">
      
      {/* Siri Ambient Glow Background Layer */}
      <div className="ambient-container">
        <div className="ambient-orb orb-blue animate-pulse-glow" />
        <div className="ambient-orb orb-pink animate-pulse-glow" style={{ animationDelay: "-3s" }} />
        <div className="ambient-orb orb-cyan animate-pulse-glow" style={{ animationDelay: "-5s" }} />
      </div>

      {/* FLOATING SIDEBAR DOCK (Apple iOS / iPadOS Style) */}
      <aside className="hidden md:flex flex-col fixed left-6 top-6 bottom-6 w-64 rounded-3xl apple-glass shadow-apple-dock border-white/[0.08] dark:border-white/[0.03] overflow-hidden z-40">
        
        {/* Dock Header */}
        <div className="p-6 flex items-center justify-between border-b border-border/20">
          <div className="flex items-center gap-2.5">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.05 }}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#00c6ff] text-white shadow-apple-subtle"
            >
              <Activity className="h-4.5 w-4.5" />
            </motion.div>
            <span className="font-sans text-base font-extrabold tracking-tight">
              DecisionPilot<span className="text-primary font-normal">AI</span>
            </span>
          </div>
        </div>

        {/* Workspace Widget */}
        <div className="mx-4 mt-6 p-4 rounded-2xl bg-secondary/25 border border-border/10 backdrop-blur-sm flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Workspace</span>
            <span className="text-xs font-bold truncate block">
              {user?.user_metadata?.companyName || "Personal SME"}
            </span>
          </div>
        </div>

        {/* Dynamic Nav Links with Sliding Background Highlight */}
        <nav className="flex-1 space-y-1.5 px-3 py-6 relative">
          {navigation.map((item) => {
            const active = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`relative flex items-center gap-3 h-11 px-4 rounded-2xl text-sm font-semibold transition-colors duration-200 group ${
                  active ? "text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeNavBackground"
                    className="absolute inset-0 bg-primary rounded-2xl -z-10 shadow-apple-subtle"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-105" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Dock Controls Footer */}
        <div className="p-4 border-t border-border/20 space-y-2.5">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full h-10 px-4 rounded-xl text-xs font-bold text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-all"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-indigo-500" />
                <span>Dark Theme</span>
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full h-10 px-4 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER (Layout floats and scrolls inside margins) */}
      <div className="flex-1 min-w-0 md:ml-[288px] min-h-screen flex flex-col p-4 md:p-6">
        
        {/* Floating Top Header Bar */}
        <header className="h-16 w-full rounded-2xl apple-glass shadow-apple-subtle border-white/[0.08] dark:border-white/[0.03] px-6 flex items-center justify-between z-30 mb-6">
          {/* Animated Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 h-9 px-4 rounded-xl bg-secondary/30 border border-border/10 text-muted-foreground text-xs hover:border-primary/40 hover:text-foreground transition-all w-48 sm:w-64"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Search models...</span>
            <div className="flex items-center gap-0.5 text-[9px] font-bold bg-secondary px-1.5 py-0.5 rounded border border-border/40 font-mono">
              <Command className="h-2.5 w-2.5" />K
            </div>
          </button>

          {/* Quick Controls */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(prev => !prev)}
                className="relative p-1.5 rounded-full hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="absolute right-0 mt-2.5 w-72 rounded-2xl border border-white/10 dark:border-white/5 bg-card/90 shadow-apple-dialog backdrop-blur-xl p-4 z-50 text-left space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Notifications</span>
                      <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold">1 New</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="text-xs font-bold text-foreground">Simulation calculations complete</div>
                        <div className="text-[9px] text-muted-foreground mt-0.5">SME Budget scenario completed successfully.</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile trigger */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-border/30">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white shadow-apple-subtle text-xs font-bold"
              >
                {user?.email?.[0].toUpperCase() || "G"}
              </motion.div>
              <span className="hidden sm:inline text-xs font-bold max-w-[120px] truncate text-gradient">
                {user?.email || "Guest User"}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Page Wrapper */}
        <main className="flex-1 w-full max-w-7xl mx-auto rounded-3xl apple-glass-card shadow-apple-card border-white/[0.04] p-6 md:p-8 overflow-y-auto min-h-[calc(100vh-120px)] safe-padding-bottom">
          <Outlet />
        </main>
      </div>

      {/* Floating Bottom Nav for Mobile Screen Sizes */}
      <div className="md:hidden fixed bottom-5 left-4 right-4 h-14 rounded-2xl apple-glass shadow-apple-dock border-white/[0.08] flex items-center justify-around px-4 z-40">
        {navigation.map((item) => {
          const active = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                active ? "text-primary scale-105 font-bold" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px]">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* INTERACTIVE COMMAND PALETTE (frosted overlay) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-6"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: -8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: -8 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="w-full max-w-lg rounded-2xl border border-white/10 dark:border-white/5 bg-card/90 shadow-apple-dialog backdrop-blur-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Input bar */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/20">
                <Search className="h-4.5 w-4.5 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Type to search simulations..."
                  className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded bg-secondary text-muted-foreground hover:text-foreground text-[10px] font-bold"
                >
                  ESC
                </button>
              </div>

              {/* Search Results list */}
              <div className="p-2 max-h-72 overflow-y-auto">
                {searchQuery ? (
                  filteredDecisions.length > 0 ? (
                    filteredDecisions.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setSearchOpen(false);
                          navigate(`/decisions/${d.id}`);
                        }}
                        className="flex items-center justify-between w-full p-2.5 rounded-xl hover:bg-secondary/40 text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold">{d.title}</div>
                          <div className="text-[10px] text-muted-foreground truncate max-w-[280px] mt-0.5">
                            {d.description}
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      No decisions match your search parameters.
                    </div>
                  )
                ) : (
                  <div className="p-6 text-center text-xs text-muted-foreground space-y-1">
                    <p className="font-semibold text-foreground">Quick Shortcuts</p>
                    <p>Type keywords to search Decision scenarios instantly.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
