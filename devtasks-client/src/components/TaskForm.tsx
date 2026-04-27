import { useState } from "react";
import { Plus, Terminal } from "lucide-react";

import type { Project } from "../types";

interface TaskFormProps {
  onSubmit: (
    title: string,
    dueDate?: string,
    priority?: "low" | "medium" | "high",
    projectId?: string,
  ) => void;
  isLoading?: boolean;
  projects?: Project[];
  initialProjectId?: string;
}

export default function TaskForm({
  onSubmit,
  isLoading,
  projects = [],
  initialProjectId,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [projectId, setProjectId] = useState(initialProjectId || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title, dueDate || undefined, priority, projectId || undefined);
      setTitle("");
      setDueDate("");
      setPriority("medium");
    }
  };

  return (
    <div className="bg-card border border-line p-6 mb-8 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.02] pointer-events-none">
        <Terminal className="w-full h-full" />
      </div>

      <form onSubmit={handleSubmit} className="relative z-10">
        <h3 className="text-[10px] font-mono uppercase font-bold text-muted mb-4 tracking-widest flex items-center gap-2">
          <Terminal className="w-3 h-3 text-accent" />
          CMD :: INIT_NEW_TASK
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                placeholder="Type your objective..."
                className="flex-1 bg-bg border border-line px-4 py-3 text-sm font-mono focus:outline-none focus:border-accent transition-all placeholder:opacity-30"
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isLoading}
                className="bg-bg border border-line px-4 py-3 text-sm font-mono focus:outline-none focus:border-accent transition-all text-muted"
              />
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "low" | "medium" | "high")
                }
                disabled={isLoading}
                className="bg-bg border border-line px-4 py-3 text-sm font-mono focus:outline-none focus:border-accent transition-all text-muted"
              >
                <option value="low">LOW_PRIORITY</option>
                <option value="medium">MED_PRIORITY</option>
                <option value="high">HIGH_PRIORITY</option>
              </select>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                disabled={isLoading}
                className="bg-bg border border-line px-4 py-3 text-sm font-mono focus:outline-none focus:border-accent transition-all text-muted"
              >
                <option value="">NO_PROJECT</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className={`
                bg-primary text-white p-3 font-mono text-xs font-bold uppercase transition-all
                ${isLoading || !title.trim() ? "opacity-30" : "hover:bg-accent active:scale-95"}
              `}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
