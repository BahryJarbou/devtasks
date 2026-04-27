import { motion } from "motion/react";
import {
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  AlertCircle,
} from "lucide-react";
import type { Task } from "../types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  isUpdating,
}: TaskItemProps) {
  const isOverdue =
    task.dueDate &&
    !task.completed &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const priorityColors = {
    low: "text-blue-500",
    medium: "text-yellow-500",
    high: "text-red-500",
  };

  const priorityLabel = {
    low: "LOW",
    medium: "MED",
    high: "HIGH",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`
        group relative flex items-center justify-between p-3 sm:p-4 bg-card border border-line 
        hover:border-accent/30 transition-all shadow-sm mb-3
        ${task.completed ? "bg-bg/50" : ""}
        ${isUpdating ? "opacity-50 pointer-events-none" : ""}
        ${isOverdue ? "border-red-500/30" : ""}
      `}
    >
      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
        <button
          onClick={() => onToggle(task.id, !task.completed)}
          className={`
            transition-all transform active:scale-90 p-1
            ${task.completed ? "text-green-500" : "text-muted hover:text-accent"}
          `}
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Circle className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>

        <div className="flex flex-col overflow-hidden">
          <span
            className={`
            text-sm font-medium transition-all truncate
            ${task.completed ? "line-through text-muted italic opacity-60" : "text-primary"}
          `}
          >
            {task.title}
          </span>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-0.5 opacity-40">
            <div className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              <span className="text-[9px] font-mono uppercase tracking-wider truncate">
                Created :: {new Date(task.createdAt).toLocaleDateString()}{" "}
                {new Date(task.createdAt).toLocaleTimeString()}
              </span>
            </div>
            {task.dueDate && (
              <div
                className={`flex items-center gap-1 ${isOverdue ? "text-red-500 opacity-100 font-bold" : ""}`}
              >
                <Calendar className="w-2.5 h-2.5" />
                <span className="text-[9px] font-mono uppercase tracking-wider">
                  Due :: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {task.priority && (
              <div
                className={`flex items-center gap-1 ${priorityColors[task.priority]}`}
              >
                <AlertCircle className="w-2.5 h-2.5" />
                <span className="text-[9px] font-mono uppercase tracking-wider font-bold">
                  PRIO :: {priorityLabel[task.priority]}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-2 text-muted hover:text-red-500 hover:bg-red-50 transition-all rounded-sm shrink-0"
      >
        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Direct touch target for mobile delete */}
      <div
        className="lg:hidden p-2 text-muted/30"
        onClick={() => onDelete(task.id)}
      >
        <Trash2 className="w-4 h-4" />
      </div>

      {task.completed && (
        <div className="absolute right-0 top-0 h-full w-1 bg-green-500/20" />
      )}
    </motion.div>
  );
}
