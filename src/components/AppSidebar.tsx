import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Upload, FileText, ShieldAlert, BookOpen, Settings, ChevronLeft, ChevronRight, LogOut, Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/home" },
  { label: "Upload Logs", icon: Upload, path: "/home/upload" },
  { label: "Analysis", icon: ShieldAlert, path: "/home/analysis/?fileId=notselected" },
  { label: "Web Server API", icon: FileText, path: "/home/webserverapi" },
  { label: "Blog & Articles", icon: BookOpen, path: "/home/blog" },
  { label: "Settings", icon: Settings, path: "/home/settings" },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();


  return (
    <aside className={`${collapsed ? "w-16" : "w-56"} transition-all duration-300 bg-sidebar border-r border-sidebar-border flex flex-col min-h-screen`}>
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <Shield size={24} className="text-primary shrink-0" />
        {!collapsed && <span className="font-heading text-lg font-bold text-primary cyber-glow">CYBERSHIELD</span>}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path || (item.path === "/home" && location.pathname === "/home");
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${active
                  ? "bg-sidebar-accent text-sidebar-primary border border-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
            >
              <item.icon size={18} className={active ? "text-primary" : ""} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-sidebar-border space-y-1">
        <button onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent w-full">
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
        </button>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-destructive hover:bg-sidebar-accent w-full">
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
