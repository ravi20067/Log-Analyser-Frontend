import { Search, Bell, User, Settings, LogOut, Shield, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, UserResponse } from "@/api/userService";
import { useAuth } from "../context/AuthContext";


const TopBar = () => {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const { logout } = useAuth();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, []);


  const notifications = [
    { id: 1, text: "Critical: SQL injection detected in web server logs", time: "2 min ago", type: "critical" },
    { id: 2, text: "Analysis complete: Network log scan finished", time: "15 min ago", type: "info" },
    { id: 3, text: "New blog post published: Ransomware Defense", time: "1 hr ago", type: "info" },
    { id: 4, text: "Warning: Brute force attempt detected", time: "3 hrs ago", type: "warning" },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4 gap-4 sticky top-0 z-30">
      <div className="flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search threats, logs, articles..." className="pl-9 bg-secondary border-border h-9 text-sm" />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary" onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}>
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-[10px] flex items-center justify-center text-destructive-foreground">4</span>
          </Button>
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 glass-card p-3 space-y-2 animate-fade-in z-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading text-sm font-semibold text-primary">Notifications</h3>
                <button className="text-[10px] text-muted-foreground hover:text-primary">Mark all read</button>
              </div>
              {notifications.map((n) => (
                <div key={n.id} className={`p-2.5 rounded-lg text-xs border ${n.type === "critical" ? "border-destructive/20 bg-destructive/5" :
                    n.type === "warning" ? "border-cyber-orange/20 bg-cyber-orange/5" :
                      "border-border bg-secondary/50"
                  }`}>
                  <p className="text-foreground">{n.text}</p>
                  <p className="text-muted-foreground mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <Link to="/home/settings">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Settings size={18} /></Button>
        </Link>

        {/* User Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-medium text-foreground leading-tight">{user?.name || "Loading..."}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{user?.role || "Loading..."}</p>
            </div>
            <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-56 glass-card p-2 animate-fade-in z-50">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-sm font-medium text-foreground">{user?.name || "Loading..."}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="text-[10px] text-primary mt-1 flex items-center gap-1"><Shield size={10} /> {user?.role}</p>
              </div>
              <Link to="/home/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-md transition-colors">
                <User size={14} /> Profile Settings
              </Link>
              <Link to="/home/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-md transition-colors">
                <Settings size={14} /> Preferences
              </Link>
              <button
                onClick={() => { logout(); setShowProfile(false); navigate("/login"); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-secondary rounded-md transition-colors w-full"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
