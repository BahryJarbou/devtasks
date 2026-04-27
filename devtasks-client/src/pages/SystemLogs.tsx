import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Terminal, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const INITIAL_LOGS = [
  { id: 1, type: "info", timestamp: "2026-04-25 19:12:01", message: "Kernel boot sequence initiated", source: "SYSTEM" },
  { id: 2, type: "info", timestamp: "2026-04-25 19:12:05", message: "Subsystem 'NETWORK' initialized", source: "NET_MODULE" },
  { id: 3, type: "shield", timestamp: "2026-04-25 19:12:10", message: "JWT validation interceptor active", source: "AUTH_SVC" },
  { id: 4, type: "warning", timestamp: "2026-04-25 19:15:22", message: "High latency detected in cluster region 'EU-WEST-1'", source: "H_MONITOR" },
  { id: 5, type: "info", timestamp: "2026-04-25 19:20:45", message: "New session established for user: testuser@test.com", source: "SESSION_MGR" },
];

export default function SystemLogs() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [filter, setFilter] = useState("");

  // Simulated live logs
  useEffect(() => {
    const timer = setInterval(() => {
      const newLog = {
        id: Date.now(),
        type: Math.random() > 0.8 ? "warning" : "info",
        timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
        message: `Heartbeat detected - Process ID ${Math.floor(Math.random() * 9000) + 1000}`,
        source: "CORE_MON",
      };
      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(filter.toLowerCase()) || 
    log.source.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-10 w-full max-w-7xl mx-auto space-y-6">
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-accent">
            <Terminal className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Event_Stream</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold font-mono tracking-tighter uppercase">System_Logs</h1>
            <div className="relative group max-w-md w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted opacity-40 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Query logs..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-card border border-line pl-9 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-accent transition-all rounded-sm"
              />
            </div>
          </div>
        </header>

        <div className="bg-card border border-line rounded-sm overflow-hidden flex flex-col shadow-lg">
          <div className="bg-bg/50 border-b border-line px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
              <span className="text-[10px] font-mono font-bold text-muted uppercase">Terminal -- bash</span>
            </div>
            <span className="text-[10px] font-mono text-muted uppercase opacity-40">{filteredLogs.length} EVENTS_LOADED</span>
          </div>
          
          <div className="h-[60vh] overflow-y-auto p-4 font-mono text-xs space-y-2 selection:bg-accent selection:text-white scrollbar-thin scrollbar-thumb-line">
            <AnimatePresence mode="popLayout">
              {filteredLogs.map((log) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-4 hover:bg-bg/40 p-1 -m-1 transition-colors group"
                >
                  <span className="text-muted opacity-40 shrink-0">[{log.timestamp}]</span>
                  <span className={`shrink-0 font-bold ${
                    log.type === 'warning' ? 'text-yellow-500' : 
                    log.type === 'shield' ? 'text-accent' : 
                    'text-muted'
                  }`}>[{log.source}]</span>
                  <span className="text-primary truncate">{log.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredLogs.length === 0 && (
              <div className="py-20 text-center opacity-30">
                <p>NO_MATCHING_SEQUENCES_FOUND</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
