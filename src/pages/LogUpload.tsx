import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Smartphone,
  Terminal,
  FileUp,
  X,
  Globe,
  CheckCircle,
  Clock,
  Zap,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadLog, downloadLog, getMyLogs } from "@/api/logService";
import { LogResponse } from "@/types/logResponse";

const categories = [
  { id: "web", label: "Web Logs", icon: Globe },
  { id: "android", label: "Android Logs", icon: Smartphone },
  { id: "ios", label: "iOS Logs", icon: Smartphone },
  { id: "network", label: "Network Logs", icon: Globe },
  { id: "linux", label: "Linux Logs", icon: Terminal },
];

const LogUpload = () => {
  const navigate = useNavigate();

  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] =
    useState<"uploading" | "parsing" | "analyzing" | "done">("uploading");

  const [logs, setLogs] = useState<LogResponse[]>([]);

  // 🔥 Load logs on page load
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await getMyLogs();
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  // ✅ Validate file
  const validateFile = (f: File) => {
    if (!f.name.endsWith(".log")) {
      alert("Only .log files allowed");
      return false;
    }
    if (f.size > 50 * 1024 * 1024) {
      alert("Max size 50MB");
      return false;
    }
    return true;
  };

  const getDeviceType = () => {
    switch (selectedCat) {
      case "web":
        return "WEB_SERVER";
      case "android":
        return "ANDROID";
      case "ios":
        return "IOS";
      case "network":
        return "NETWORKING";
      case "linux":
        return "LINUX";
      default:
        return "";
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedCat) return;

    try {
      setUploading(true);
      setProgress(20);
      setPhase("uploading");

      const metadata = await uploadLog(file, getDeviceType());

      setPhase("parsing");
      setProgress(50);

      setTimeout(() => {
        setPhase("analyzing");
        setProgress(80);
      }, 1000);

      setTimeout(() => {
        setPhase("done");
        setProgress(100);

        // 🔥 Add new log to recent list immediately
        setLogs((prev) => [metadata, ...prev]);

        setFile(null);
        setSelectedCat(null);
        setUploading(false);
        setTimeout(() => {
          navigate("/home/analysis/?fileId=" + metadata.fileId);
        }, 1200);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
      setUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-primary">
        Upload Log Files
      </h1>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const isActive = selectedCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCat(cat.id);
                setFile(null);
              }}
              className={`rounded-lg p-4 text-left border transition ${
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              }`}
            >
              <cat.icon size={22} />
              <h3 className="font-semibold mt-2">{cat.label}</h3>
            </button>
          );
        })}
      </div>

      {/* Upload Area */}
      {selectedCat && (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          {!uploading ? (
            <>
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <FileUp size={28} />
                  <p>{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(file.size)}
                  </p>
                  <button
                    onClick={() => setFile(null)}
                    className="text-xs text-destructive"
                  >
                    <X size={12} /> Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={28} />
                  <p className="mt-2">Only .log files allowed</p>

                  <input
                    type="file"
                    accept=".log"
                    hidden
                    id="fileUpload"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f && validateFile(f)) setFile(f);
                    }}
                  />

                  <label
                    htmlFor="fileUpload"
                    className="mt-4 inline-block cursor-pointer bg-secondary px-4 py-2 rounded-lg"
                  >
                    Browse File
                  </label>
                </>
              )}

              {file && (
                <div className="mt-4">
                  <Button onClick={handleUpload}>
                    <Zap size={16} className="mr-2" />
                    Start Analysis
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <p>{phase.toUpperCase()}...</p>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {phase === "done" && (
                <p className="text-green-400 flex items-center justify-center gap-2">
                  <CheckCircle size={16} />
                  Analysis Complete
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 🔥 Dynamic Recent Uploads */}
      <div className="glass-card p-5">
        <h3 className="font-heading text-base font-semibold text-primary mb-3 flex items-center gap-2">
          <Clock size={16} /> Recent Uploads
        </h3>

        {logs.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No uploads yet.
          </p>
        ) : (
          <div className="space-y-2">
            {logs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition"
              >
                <div className="flex items-center gap-3">
                  <FileUp size={16} className="text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {log.fileName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {log.deviceType} · {formatSize(log.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      log.analysisStatus === "COMPLETED"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {log.analysisStatus}
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      downloadLog(log.fileId, log.fileName)
                    }
                    className="border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate("/home/analysis/?fileId=" + log.fileId)
                    }
                    className="border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Download size={14} className="mr-1" />
                    See Analysis Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogUpload;
