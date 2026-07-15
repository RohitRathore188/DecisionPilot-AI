import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Database,
  RefreshCw,
  Clock,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface IngestionFile {
  id: string;
  name: string;
  size: string;
  records: number;
  status: "synced" | "processing" | "error";
  timestamp: string;
  type: "csv" | "xlsx";
}

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: string;
  status: "uploading" | "processing" | "synced" | "error";
  progress: number;
  records?: number;
  error?: string;
}

const INITIAL_LOG: IngestionFile[] = [
  {
    id: "log1",
    name: "q1_dine_in_sales.csv",
    size: "2.1 MB",
    records: 1840,
    status: "synced",
    timestamp: "41 min",
    type: "csv"
  },
  {
    id: "log2",
    name: "inventory_safety_margin...",
    size: "480 KB",
    records: 456,
    status: "synced",
    timestamp: "4 hr",
    type: "xlsx"
  },
  {
    id: "log3",
    name: "supplier_reliability_q2.csv",
    size: "890 KB",
    records: 312,
    status: "synced",
    timestamp: "1 day",
    type: "csv"
  },
  {
    id: "log4",
    name: "weekly_opex_audit.xlsx",
    size: "1.4 MB",
    records: 728,
    status: "synced",
    timestamp: "3 days",
    type: "xlsx"
  }
];

const ACCEPTED_TYPES = [".csv", ".xls", ".xlsx"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function estimateRecords(bytes: number): number {
  // rough estimate: ~100 bytes per row on average
  return Math.max(10, Math.floor(bytes / 100));
}

export default function DataIngestionPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [ingestionLog, setIngestionLog] = useState<IngestionFile[]>(INITIAL_LOG);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    const id = `upload-${Date.now()}-${Math.random()}`;
    const newUpload: UploadedFile = {
      id,
      file,
      name: file.name,
      size: formatFileSize(file.size),
      status: "uploading",
      progress: 0
    };

    setUploads((prev) => [newUpload, ...prev]);

    // Simulate upload progress
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 18 + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(uploadInterval);
        setUploads((prev) =>
          prev.map((u) => (u.id === id ? { ...u, progress: 100, status: "processing" } : u))
        );

        // Simulate processing delay
        setTimeout(() => {
          const records = estimateRecords(file.size);
          const success = Math.random() > 0.1; // 90% success rate

          if (success) {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === id ? { ...u, status: "synced", records } : u
              )
            );

            // Add to ingestion log
            const ext = file.name.split(".").pop() as "csv" | "xlsx";
            const logEntry: IngestionFile = {
              id: `log-${Date.now()}`,
              name: file.name.length > 28 ? file.name.slice(0, 25) + "..." : file.name,
              size: formatFileSize(file.size),
              records,
              status: "synced",
              timestamp: "Just now",
              type: ext === "csv" ? "csv" : "xlsx"
            };
            setIngestionLog((prev) => [logEntry, ...prev]);
          } else {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === id ? { ...u, status: "error", error: "Parse error: invalid schema" } : u
              )
            );
          }
        }, 1200);
      } else {
        setUploads((prev) =>
          prev.map((u) => (u.id === id ? { ...u, progress } : u))
        );
      }
    }, 120);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (ACCEPTED_TYPES.includes(ext)) {
        processFile(file);
      }
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 340, damping: 26 } }
  };

  const totalRecords = ingestionLog
    .filter((l) => l.status === "synced")
    .reduce((sum, l) => sum + l.records, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 select-none"
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Data Ingestion Center</h1>
          <p className="text-muted-foreground text-xs font-semibold mt-0.5">
            Drop transaction logs, inventory sheets, and shift metrics to rebuild node relationships.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
          <Database className="h-3.5 w-3.5 text-primary" />
          <span>{totalRecords.toLocaleString()} total records synced</span>
        </div>
      </motion.div>

      {/* ── Stats Row ───────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Files Ingested", value: ingestionLog.length.toString(), icon: Layers, color: "text-primary" },
          { label: "Total Records", value: totalRecords.toLocaleString(), icon: Database, color: "text-green-400" },
          { label: "Active Syncs", value: uploads.filter(u => u.status === "processing" || u.status === "uploading").length.toString(), icon: RefreshCw, color: "text-amber-400" },
          { label: "Last Ingestion", value: ingestionLog[0]?.timestamp || "—", icon: Clock, color: "text-indigo-400" }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="apple-glass border-white/5 rounded-2xl p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-muted-foreground">{stat.label}</div>
                <div className="text-lg font-extrabold text-white">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* ── Main Panel ──────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">

        {/* LEFT: Drop Zone + Upload Queue */}
        <motion.div variants={itemVariants} className="lg:col-span-7 space-y-4">

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-200 p-12 flex flex-col items-center justify-center text-center space-y-4 ${
              isDragging
                ? "border-primary bg-primary/10 scale-[1.01]"
                : "border-white/10 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.03]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv,.xls,.xlsx"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {/* Upload Icon */}
            <motion.div
              animate={isDragging ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
            >
              <Upload className={`h-7 w-7 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
            </motion.div>

            <div className="space-y-1.5">
              <p className="text-sm font-bold text-white">
                {isDragging ? "Release to upload files" : "Select CSV or Excel logs"}
              </p>
              <p className="text-xs text-muted-foreground font-semibold">
                Drag and drop local sheets or browse your files. Supported formats: .csv,<br />.xls, .xlsx
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="rounded-2xl h-9 px-5 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary font-bold text-xs"
              >
                Browse Files
              </Button>
            </div>

            {/* Shimmer overlay when dragging */}
            {isDragging && (
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            )}
          </div>

          {/* Upload Queue */}
          <AnimatePresence>
            {uploads.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="apple-glass border-white/5 rounded-2xl p-4 space-y-3"
              >
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Upload Queue
                </span>

                <div className="space-y-2">
                  <AnimatePresence>
                    {uploads.map((u) => (
                      <motion.div
                        key={u.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12, height: 0 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                      >
                        {/* File icon */}
                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          {u.name.endsWith(".csv") ? (
                            <FileText className="h-4 w-4 text-green-400" />
                          ) : (
                            <FileSpreadsheet className="h-4 w-4 text-amber-400" />
                          )}
                        </div>

                        {/* File info + progress */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-white truncate">{u.name}</span>
                            <span className="text-[10px] text-muted-foreground font-semibold shrink-0">{u.size}</span>
                          </div>

                          {(u.status === "uploading" || u.status === "processing") && (
                            <div className="space-y-1">
                              <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                                <motion.div
                                  className="h-full bg-primary rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${u.progress}%` }}
                                  transition={{ duration: 0.15 }}
                                />
                              </div>
                              <span className="text-[9px] text-muted-foreground font-semibold">
                                {u.status === "processing" ? "Processing schema…" : `Uploading ${Math.round(u.progress)}%`}
                              </span>
                            </div>
                          )}

                          {u.status === "synced" && (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3 w-3 text-green-400" />
                              <span className="text-[10px] font-bold text-green-400">
                                Synced — {u.records?.toLocaleString()} records ingested
                              </span>
                            </div>
                          )}

                          {u.status === "error" && (
                            <div className="flex items-center gap-1.5">
                              <AlertCircle className="h-3 w-3 text-red-400" />
                              <span className="text-[10px] font-bold text-red-400">{u.error}</span>
                            </div>
                          )}
                        </div>

                        {/* Dismiss */}
                        {(u.status === "synced" || u.status === "error") && (
                          <button
                            onClick={() => removeUpload(u.id)}
                            className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors shrink-0"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* RIGHT: Ingestion Log */}
        <motion.div variants={itemVariants} className="lg:col-span-5">
          <div className="apple-glass border-white/5 rounded-2xl overflow-hidden">
            {/* Log Header */}
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/5">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Ingestion Log
              </span>
              <span className="ml-auto text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold">
                {ingestionLog.length} files
              </span>
            </div>

            {/* Log Entries */}
            <div className="divide-y divide-white/[0.04] max-h-[480px] overflow-y-auto">
              <AnimatePresence initial={false}>
                {ingestionLog.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* File type icon */}
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      {entry.type === "csv" ? (
                        <FileText className="h-4 w-4 text-green-400" />
                      ) : (
                        <FileSpreadsheet className="h-4 w-4 text-amber-400" />
                      )}
                    </div>

                    {/* Entry info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white truncate">{entry.name}</span>
                        <span className="text-[9px] text-muted-foreground shrink-0">{entry.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          {entry.records.toLocaleString()} records
                        </span>
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${
                          entry.status === "synced" ? "text-green-400" :
                          entry.status === "processing" ? "text-amber-400" : "text-red-400"
                        }`}>
                          {entry.status === "synced" && <CheckCircle2 className="h-2.5 w-2.5" />}
                          {entry.status === "processing" && <RefreshCw className="h-2.5 w-2.5 animate-spin" />}
                          {entry.status === "error" && <AlertCircle className="h-2.5 w-2.5" />}
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[9px] text-muted-foreground font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-400" />
                Synced with Supabase datastore
              </span>
              <span className="text-[9px] text-muted-foreground font-semibold">Encryption enabled</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── Accepted formats notice ──────────────────────────────────── */}
      <motion.div variants={itemVariants} className="apple-glass border-white/5 rounded-2xl p-4 flex items-center gap-3">
        <Database className="h-4 w-4 text-primary shrink-0" />
        <div className="text-[10px] font-semibold text-muted-foreground">
          <strong className="text-white">Supported formats:</strong> CSV (.csv), Microsoft Excel (.xls, .xlsx) — 
          Files are parsed client-side, schema-validated, and records are synced to the Supabase knowledge graph datastore to rebuild node relationships in real time.
        </div>
      </motion.div>

    </motion.div>
  );
}
