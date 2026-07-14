import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { 
  Moon, 
  LogOut, 
  Sparkles, 
  Key, 
  Building 
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();

  // Settings State Hooks
  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "ai" | "security">("profile");
  const [companyName, setCompanyName] = useState(user?.user_metadata?.companyName || "Acme Catering Services");
  const [headcount, setHeadcount] = useState(12);
  const [currency, setCurrency] = useState("INR (₹)");
  const [language, setLanguage] = useState("en");

  // AI preferences
  const [creativity, setCreativity] = useState(0.7);
  const [alertLimit, setAlertLimit] = useState(85); // percentage confidence threshold

  // Appearance
  const [glassOpacity, setGlassOpacity] = useState(0.45);
  const [borderRadius, setBorderRadius] = useState(24);

  // Notification Toggles
  const [notifyStock, setNotifyStock] = useState(true);
  const [notifySimulation, setNotifySimulation] = useState(true);

  // API Keys
  const [apiKey, setApiKey] = useState("dp_live_948f2a1b9e8382c7d42f");
  const [keyVisible, setKeyVisible] = useState(false);


  const handleGenerateKey = () => {
    const randomHex = Array.from({ length: 20 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    setApiKey(`dp_live_${randomHex}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Workspace Settings</h1>
        <p className="text-muted-foreground text-xs font-semibold mt-0.5">
          Configure business parameters, security configurations, and visual interface preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12 items-start">
        
        {/* Left Tabs List (4 Cols) */}
        <div className="md:col-span-4 space-y-4">
          <Card className="apple-glass border-white/5 p-4 space-y-2">
            {[
              { id: "profile", name: "Business Profile", icon: Building },
              { id: "appearance", name: "Appearance & Theme", icon: Moon },
              { id: "ai", name: "AI Preferences", icon: Sparkles },
              { id: "security", name: "API & Security Keys", icon: Key }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 w-full p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-primary border-primary/20 text-white shadow-apple-subtle"
                      : "bg-white/5 border-white/5 text-muted-foreground hover:text-white"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {tab.name}
                </button>
              );
            })}
          </Card>

          {/* Logout Box */}
          <Card className="apple-glass border-white/5 p-4">
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white text-xs font-bold border border-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out of Workspace
            </button>
          </Card>
        </div>

        {/* Right Settings panel (8 Cols) */}
        <div className="md:col-span-8">
          
          {/* TAB 1: BUSINESS PROFILE */}
          {activeTab === "profile" && (
            <Card className="apple-glass border-white/5 p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Building className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Business Settings</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  id="company"
                  type="text"
                  label="Company Name"
                  className="h-11 rounded-2xl border-white/10 bg-white/[0.01]"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-muted-foreground">Default Currency</label>
                  <select
                    className="flex w-full h-11 px-3.5 rounded-2xl border border-white/10 bg-white/[0.02] text-white text-sm outline-none cursor-pointer"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="INR (₹)" className="bg-[#0f0f11]">INR (₹)</option>
                    <option value="USD ($)" className="bg-[#0f0f11]">USD ($)</option>
                    <option value="EUR (€)" className="bg-[#0f0f11]">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  id="headcount"
                  type="number"
                  label="Employee Headcount"
                  className="h-11 rounded-2xl border-white/10 bg-white/[0.01]"
                  value={headcount || ""}
                  onChange={(e) => setHeadcount(Number(e.target.value))}
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-muted-foreground">Default Language</label>
                  <select
                    className="flex w-full h-11 px-3.5 rounded-2xl border border-white/10 bg-white/[0.02] text-white text-sm outline-none cursor-pointer"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en" className="bg-[#0f0f11]">English (en)</option>
                    <option value="es" className="bg-[#0f0f11]">Español (es)</option>
                    <option value="hi" className="bg-[#0f0f11]">Hindi (hi)</option>
                    <option value="de" className="bg-[#0f0f11]">Deutsch (de)</option>
                  </select>
                </div>
              </div>

              {/* Notifications Checkboxes */}
              <div className="pt-4 border-t border-white/5 space-y-4">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Fulfillment Alerts</h4>
                <div className="space-y-3 text-xs font-semibold">
                  <label className="flex items-center gap-3 cursor-pointer text-muted-foreground hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/10 bg-white/[0.02] text-primary focus:ring-0 cursor-pointer"
                      checked={notifyStock}
                      onChange={(e) => setNotifyStock(e.target.checked)}
                    />
                    Notify when inventory stock drops below 30% buffers
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer text-muted-foreground hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/10 bg-white/[0.02] text-primary focus:ring-0 cursor-pointer"
                      checked={notifySimulation}
                      onChange={(e) => setNotifySimulation(e.target.checked)}
                    />
                    Notify when Monte Carlo calculations complete
                  </label>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 2: APPEARANCE & THEME */}
          {activeTab === "appearance" && (
            <Card className="apple-glass border-white/5 p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Moon className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Appearance & Theme Style</h3>
              </div>

              {/* Theme choices */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Interface Theme</span>
                <div className="p-4.5 rounded-2xl border border-primary bg-primary/5 text-primary shadow-apple-subtle flex items-center gap-4">
                  <Moon className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">OLED Dark Mode Enforced</span>
                    <span className="text-[10px] text-muted-foreground font-semibold block mt-0.5">
                      DecisionPilot AI is optimized exclusively for OLED Dark Mode to render visual graphs and glowing decision nodes clearly.
                    </span>
                  </div>
                </div>
              </div>

              {/* Glass Sliders */}
              <div className="space-y-5 pt-4 border-t border-white/5">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Glass UI parameters</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Glass opacity</span>
                    <span className="font-mono text-primary">{Math.round(glassOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    aria-label="Glass opacity"
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none"
                    value={glassOpacity}
                    onChange={(e) => setGlassOpacity(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Border radius</span>
                    <span className="font-mono text-primary">{borderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="32"
                    step="2"
                    aria-label="Border radius"
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(Number(e.target.value))}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* TAB 3: AI PREFERENCES */}
          {activeTab === "ai" && (
            <Card className="apple-glass border-white/5 p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">AI preferences</h3>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Exploration Creativity (Temp)</span>
                    <span className="font-mono text-primary">{creativity}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.5"
                    step="0.1"
                    aria-label="Exploration Creativity (Temp)"
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none"
                    value={creativity}
                    onChange={(e) => setCreativity(Number(e.target.value))}
                  />
                  <p className="text-[9px] text-muted-foreground font-semibold leading-relaxed">
                    Higher creativity parameters generate wider Monte Carlo strategy options, lower parameters lock forecasts to tighter historical limits.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Min Confidence Alert Limit</span>
                    <span className="font-mono text-primary">{alertLimit}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="98"
                    step="1"
                    aria-label="Min Confidence Alert Limit"
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none"
                    value={alertLimit}
                    onChange={(e) => setAlertLimit(Number(e.target.value))}
                  />
                  <p className="text-[9px] text-muted-foreground font-semibold leading-relaxed">
                    Warn when AI confidence forecasting index drops below this threshold.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 4: API KEYS & SECURITY */}
          {activeTab === "security" && (
            <Card className="apple-glass border-white/5 p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Key className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">API Keys & Security</h3>
              </div>

              {/* API Key box */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold block text-white text-xs">Model API Integration Key</span>
                    <span className="text-[10px] text-muted-foreground">Query the calculations engine programmatically</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleGenerateKey}
                    className="rounded-full text-[10px] h-8"
                  >
                    Regenerate
                  </Button>
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type={keyVisible ? "text" : "password"}
                    readOnly
                    className="flex-1 h-10 px-4 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs outline-none font-mono"
                    value={apiKey}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-10 rounded-xl px-4 text-[10px] text-white"
                    onClick={() => setKeyVisible(!keyVisible)}
                  >
                    {keyVisible ? "Hide" : "Reveal"}
                  </Button>
                </div>
              </div>

              {/* Security password changing placeholder */}
              <div className="pt-5 border-t border-white/5 space-y-4">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Security credentials</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    id="pass"
                    type="password"
                    label="New Password"
                    className="h-10 rounded-xl border-white/10 bg-white/[0.01]"
                    placeholder="••••••••"
                  />
                  <div className="flex items-end">
                    <Button className="w-full h-10 rounded-xl text-xs bg-white/5 border border-white/5 text-white">
                      Update credentials
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

        </div>

      </div>

    </div>
  );
}
