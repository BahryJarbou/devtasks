import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../hooks/useAuth";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: userData } = useAuth();
  const { user } = userData;

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar user={user} isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-card border-b border-line flex items-center px-4 sticky top-0 z-20 shadow-sm backdrop-blur-md">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-primary hover:bg-bg rounded-sm transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-2 text-lg font-bold font-mono tracking-tighter uppercase whitespace-nowrap">
            DevTasks
          </h1>
        </header>

        <div className="flex-1 flex flex-col">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
