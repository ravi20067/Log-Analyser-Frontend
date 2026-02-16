import { Activity, FileText, ShieldAlert, TrendingUp, Search, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const stats = [
  { label: "Total Analyses", value: "247", icon: Activity, change: "+12%" },
  { label: "Threats Detected", value: "89", icon: ShieldAlert, change: "+5%" },
  { label: "Reports Generated", value: "156", icon: FileText, change: "+18%" },
  { label: "Risk Score Avg", value: "7.4", icon: TrendingUp, change: "-3%" },
];

const history = [
  { id: 1, file: "apache_access.log", type: "Network", date: "2024-12-15", status: "Complete", risk: "Critical" },
  { id: 2, file: "windows_event.evtx", type: "Windows", date: "2024-12-14", status: "Complete", risk: "High" },
  { id: 3, file: "syslog_dec.log", type: "Linux", date: "2024-12-13", status: "Complete", risk: "Medium" },
  { id: 4, file: "android_logcat.txt", type: "Mobile", date: "2024-12-12", status: "Complete", risk: "Low" },
  { id: 5, file: "firewall_rules.log", type: "Network", date: "2024-12-11", status: "Complete", risk: "Critical" },
];

const chartData = [
  { name: "Mon", analyses: 12 }, { name: "Tue", analyses: 19 }, { name: "Wed", analyses: 8 },
  { name: "Thu", analyses: 25 }, { name: "Fri", analyses: 15 }, { name: "Sat", analyses: 5 }, { name: "Sun", analyses: 3 },
];

const pieData = [
  { name: "Critical", value: 25, color: "hsl(0,80%,55%)" },
  { name: "High", value: 30, color: "hsl(30,100%,55%)" },
  { name: "Medium", value: 28, color: "hsl(180,100%,50%)" },
  { name: "Low", value: 17, color: "hsl(150,100%,45%)" },
];

const threats = [
  "SQL Injection attempt from 192.168.1.45 — 2 min ago",
  "Brute force login detected on SSH port — 8 min ago",
  "Suspicious file download flagged — 25 min ago",
  "Privilege escalation attempt blocked — 1 hr ago",
];

const riskBadge = (risk: string) => {
  const c: Record<string, string> = { Critical: "bg-destructive/20 text-destructive", High: "bg-cyber-orange/20 text-cyber-orange", Medium: "bg-primary/20 text-primary", Low: "bg-accent/20 text-accent" };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${c[risk] || ""}`}>{risk}</span>;
};

const Dashboard = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="font-heading text-2xl font-bold text-primary">Dashboard</h1>
      <div className="flex gap-2">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Filter..." className="pl-8 pr-3 py-1.5 text-sm rounded bg-secondary border border-border text-foreground" />
        </div>
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-secondary border border-border text-muted-foreground hover:text-primary">
          <Filter size={14} /> Filter
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="glass-card p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <s.icon size={20} className="text-primary" />
            <span className={`text-xs ${s.change.startsWith("+") ? "text-accent" : "text-destructive"}`}>{s.change}</span>
          </div>
          <p className="font-heading text-2xl font-bold">{s.value}</p>
          <p className="text-xs text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 glass-card p-4">
        <h3 className="font-heading text-sm font-semibold text-primary mb-3">Weekly Analysis Activity</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,20%,15%)" />
            <XAxis dataKey="name" tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} />
            <YAxis tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(220,20%,7%)", border: "1px solid hsl(220,20%,15%)", color: "hsl(180,10%,85%)" }} />
            <Bar dataKey="analyses" fill="hsl(180,100%,50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card p-4">
        <h3 className="font-heading text-sm font-semibold text-primary mb-3">Risk Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "hsl(220,20%,7%)", border: "1px solid hsl(220,20%,15%)" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-2 mt-2">
          {pieData.map((d) => (
            <span key={d.name} className="text-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
              {d.name}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 glass-card p-4">
        <h3 className="font-heading text-sm font-semibold text-primary mb-3">Analysis History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground text-left">
              <th className="pb-2">File</th><th className="pb-2">Type</th><th className="pb-2">Date</th><th className="pb-2">Status</th><th className="pb-2">Risk</th>
            </tr></thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="py-2 text-foreground">{h.file}</td>
                  <td className="py-2 text-muted-foreground">{h.type}</td>
                  <td className="py-2 text-muted-foreground">{h.date}</td>
                  <td className="py-2"><span className="text-accent text-xs">● {h.status}</span></td>
                  <td className="py-2">{riskBadge(h.risk)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card p-4">
        <h3 className="font-heading text-sm font-semibold text-primary mb-3">Live Threat Feed</h3>
        <div className="space-y-3">
          {threats.map((t, i) => (
            <div key={i} className="p-2 rounded bg-secondary/50 text-xs text-foreground border-l-2 border-destructive">
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
