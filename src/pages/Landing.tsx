import { Link } from "react-router-dom";
import { Shield, ShieldCheck, Activity, FileText, Zap, ChevronRight, BarChart3, Lock, Globe, Cpu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MatrixRain from "@/components/MatrixRain";

const features = [
  { icon: Zap, title: "AI-Powered Analysis", desc: "Upload log files and get instant threat detection using advanced AI models." },
  { icon: ShieldCheck, title: "Kill Chain Reconstruction", desc: "Visualize the full 7-stage cyber kill chain from your log data." },
  { icon: BarChart3, title: "Impact Assessment", desc: "Detailed graphs showing affected areas, risk distribution, and attack timelines." },
  { icon: FileText, title: "Downloadable Reports", desc: "Generate comprehensive threat reports and remediation guides as downloadable files." },
  { icon: Lock, title: "Remediation Guides", desc: "Get actionable step-by-step remedies for every detected attack chain." },
  { icon: Globe, title: "Multi-Platform Logs", desc: "Support for Web, Mobile, Windows, Network, and Linux log formats." },
];

const stats = [
  { value: "10K+", label: "Logs Analyzed" },
  { value: "99.2%", label: "Detection Rate" },
  { value: "7-Stage", label: "Kill Chain" },
  { value: "24/7", label: "Monitoring" },
];

const attackTypes = [
  "SQL Injection", "Cross-Site Scripting", "Brute Force", "Ransomware",
  "Phishing", "DDoS", "Man-in-the-Middle", "Zero-Day Exploits",
];

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <MatrixRain />

      {/* Top Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-4 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <Shield size={28} className="text-primary" />
          <span className="font-heading text-xl font-bold text-primary cyber-glow">CYBERSHIELD</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 font-heading">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-primary text-primary-foreground font-heading">
              Register Now
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary mb-6 animate-fade-in">
          <Cpu size={14} /> AI-Powered Cyber Threat Intelligence Platform
        </div>

        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold max-w-4xl leading-tight animate-fade-in">
          <span className="text-foreground">Reconstruct</span>{" "}
          <span className="text-primary cyber-glow">Cyber Kill Chains</span>{" "}
          <span className="text-foreground">From Your Logs</span>
        </h1>

        <p className="mt-6 text-muted-foreground max-w-2xl text-base md:text-lg leading-relaxed animate-fade-in">
          Upload your log files — Web, Mobile, Windows, Network, or Linux — and let our AI engine
          detect threats, reconstruct attack chains, and generate actionable remediation reports.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-fade-in">
          <Link to="/register">
            <Button size="lg" className="bg-primary text-primary-foreground font-heading text-lg px-8 py-6 cyber-box-glow">
              Get Started Free <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline" className="border-border text-foreground font-heading text-lg px-8 py-6 hover:border-primary/50">
              Explore Features <ChevronRight size={18} className="ml-1" />
            </Button>
          </a>
        </div>

        {/* Stats Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 animate-fade-in">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl md:text-4xl font-bold text-primary cyber-glow">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 md:px-12 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Powerful <span className="text-primary">Security Analysis</span> Features
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
            Everything you need to detect, analyze, and respond to cyber threats.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card p-6 group hover:cyber-box-glow transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon size={22} className="text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Attack Detection Showcase */}
      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24 border-t border-border/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Detect <span className="text-primary">Every Attack</span> Vector
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Our AI engine identifies a wide range of attack types across all log formats,
              mapping them to the MITRE ATT&CK framework for comprehensive threat intelligence.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {attackTypes.map((a) => (
                <span key={a} className="px-3 py-1.5 rounded-md border border-border bg-secondary/50 text-xs text-foreground font-medium">
                  {a}
                </span>
              ))}
            </div>
            <Link to="/register" className="inline-block mt-8">
              <Button className="bg-primary text-primary-foreground font-heading">
                Start Analyzing <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>

          {/* Kill Chain Preview */}
          <div className="glass-card p-6">
            <h3 className="font-heading text-sm font-semibold text-primary mb-4 flex items-center gap-2">
              <Activity size={16} /> Cyber Kill Chain Preview
            </h3>
            {["Reconnaissance", "Weaponization", "Delivery", "Exploitation", "Installation", "Command & Control", "Actions on Objectives"].map((stage, i) => (
              <div key={stage} className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  i >= 3 ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
                }`}>
                  {i + 1}
                </div>
                <span className="text-sm text-foreground">{stage}</span>
                <div className={`ml-auto px-2 py-0.5 rounded text-[10px] ${
                  i >= 3 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                }`}>
                  {i >= 3 ? "CRITICAL" : "DETECTED"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-12 py-20 text-center border-t border-border/30">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Ready to Secure Your <span className="text-primary cyber-glow">Infrastructure</span>?
        </h2>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
          Join thousands of security professionals using CyberShield to detect and respond to threats faster.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/register">
            <Button size="lg" className="bg-primary text-primary-foreground font-heading text-lg px-10 py-6 cyber-box-glow">
              Register Now <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="border-primary/50 text-primary font-heading text-lg px-10 py-6">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-primary" />
            <span className="font-heading text-sm text-primary">CYBERSHIELD</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2025 CyberShield. AI-Powered Cyber Threat Intelligence.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
