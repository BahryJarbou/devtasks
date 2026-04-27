import { motion, AnimatePresence } from "motion/react";
import React from "react";
import {
  SquareCheckBig,
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  Terminal,
  Activity,
  Layers,
  X,
} from "lucide-react";
import { logout } from "../api/auth";
import { useNavigate, NavLink, useLocation } from "react-router";

interface SidebarProps {
  user: { email: string } | null;
  isOpen: boolean;
  onToggle: (state: boolean) => void;
}

interface SidebarContentProps {
  user: { email: string } | null;
  onToggle: (state: boolean) => void;
  onLogout: () => void;
}

const SidebarContent = ({ user, onToggle, onLogout }: SidebarContentProps) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-line flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm">
            <SquareCheckBig className="text-white w-5 h-5" />
          </div>
          <span className="font-mono font-bold tracking-tighter text-lg uppercase">
            DevTasks
          </span>
        </div>
        <button
          onClick={() => onToggle(false)}
          className="lg:hidden p-2 text-muted hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <NavItem
          to="/"
          icon={LayoutDashboard}
          label="Dashboard"
          active={location.pathname === "/"}
        />
        <NavItem
          to="/projects"
          icon={Layers}
          label="Projects"
          active={location.pathname === "/projects"}
        />
        <NavItem
          to="/monitoring"
          icon={Activity}
          label="Monitoring"
          active={location.pathname === "/monitoring"}
        />
        <NavItem
          to="/logs"
          icon={Terminal}
          label="System Logs"
          active={location.pathname === "/logs"}
        />
      </nav>

      <div className="p-4 mt-auto border-t border-line space-y-4">
        {user && (
          <div className="flex items-center gap-3 px-2 py-3 bg-bg border border-line rounded-sm">
            <div className="w-8 h-8 bg-line rounded-sm flex items-center justify-center text-muted">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-mono font-bold truncate">
                {(user?.email || "Anonymous").split("@")[0]}
              </p>
              <p className="text-[10px] font-mono text-muted truncate opacity-60">
                ADMIN_ACCESS
              </p>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) => `
              w-full flex items-center gap-3 px-3 py-2 text-sm font-mono transition-colors
              ${isActive ? "text-primary" : "text-muted hover:text-primary"}
            `}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </NavLink>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-mono text-red-500 hover:bg-red-50 transition-all rounded-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Sidebar({ user, isOpen, onToggle }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <aside className="hidden lg:flex w-64 border-r border-line bg-card flex-col h-screen sticky top-0">
        <SidebarContent
          user={user}
          onToggle={onToggle}
          onLogout={handleLogout}
        />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onToggle(false)}
            className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[100] lg:hidden"
          />
        )}
        {isOpen && (
          <motion.aside
            key="sidebar-panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-card border-r border-line z-[101] lg:hidden"
          >
            <SidebarContent
              user={user}
              onToggle={onToggle}
              onLogout={handleLogout}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({
  to,
  icon: Icon,
  label,
  active = false,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <NavLink
      to={to}
      className={`
      w-full flex items-center gap-3 px-3 py-2 text-sm font-mono transition-all group relative
      ${active ? "text-primary font-bold" : "text-muted hover:text-primary hover:bg-bg"}
    `}
    >
      <Icon
        className={`w-4 h-4 ${active ? "text-accent" : "group-hover:text-accent"}`}
      />
      <span>{label}</span>
      {active && (
        <motion.div
          layoutId="active-indicator"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-accent rounded-l-full"
        />
      )}
    </NavLink>
  );
}
