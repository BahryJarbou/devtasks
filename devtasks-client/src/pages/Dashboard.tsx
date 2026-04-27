import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import {
  getHabits,
  createHabit,
  toggleHabit,
  deleteHabit,
} from "../api/habits";
import { useAuth } from "../hooks/useAuth";
import type { Task, Habit, Project } from "../types";
import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";
import HabitHeatmap from "../components/HabitHeatmap";
import { calculateStreak } from "../utils/habitsUtils";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal,
  Activity,
  Server,
  Database,
  Search,
  Flame,
  CheckCircle2,
  Trash2,
  Plus,
} from "lucide-react";
import Layout from "../components/Layout";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../api/projects";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [newHabitName, setNewHabitName] = useState("");

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const { data: habits = [] } = useQuery<Habit[]>({
    queryKey: ["habits"],
    queryFn: getHabits,
  });

  const createHabitMutation = useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
  const toggleHabitMutation = useMutation({
    mutationFn: (id: string) => toggleHabit(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["habits"] });
      const previousTotal = queryClient.getQueryData<Habit[]>(["habits"]);
      queryClient.setQueryData<Habit[]>(["habits"], (old) =>
        old?.map((habit) => (habit.id === id ? { ...habit } : habit)),
      );
      return { previousTotal };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["habits"], context?.previousTotal);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: (id: string) => deleteHabit(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["habits"] });
      const previousHabits = queryClient.getQueryData<Habit[]>(["habits"]);
      queryClient.setQueryData<Habit[]>(["habits"], (old) =>
        old?.filter((habit) => habit.id !== id),
      );
      return { previousHabits };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["habits"], context?.previousHabits);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      updateTask(id, { completed }),
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTotal = queryClient.getQueryData<Task[]>(["tasks"]);
      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        old?.map((task) => (task.id === id ? { ...task, completed } : task)),
      );
      return { previousTotal };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTotal);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        old?.filter((task) => task.id !== id),
      );
      return { previousTasks };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const { isLoading: authLoading, isError } = useAuth();

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const completedCount = tasks.filter((t) => t.completed).length;

  if (authLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-bg font-mono">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex items-center gap-3 text-xs uppercase font-bold tracking-widest"
        >
          <Server className="w-4 h-4 animate-pulse text-accent" />
          Initialising_Environment...
        </motion.div>
      </div>
    );

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg p-8 technical-grid">
        <div className="text-center space-y-6 max-w-sm">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
            <Terminal className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-mono uppercase tracking-tighter">
            Access denied
          </h1>
          <p className="text-sm text-muted font-medium">
            Authentication token expired or missing. Please re-validate your
            profile credentials.
          </p>
          <a
            href="/login"
            className="inline-block bg-primary text-white py-3 px-8 font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-md"
          >
            Authenticate Profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-card border-b border-line flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-20 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold font-mono tracking-tighter uppercase whitespace-nowrap">
                Objective_Map
              </h1>
              <div className="hidden sm:block h-4 w-px bg-line" />
              <span className="hidden sm:block text-[10px] font-mono font-bold text-muted uppercase tracking-widest text-nowrap">
                v1.4.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden xl:flex gap-4">
              <Stat
                icon={Activity}
                value={`${(Array.isArray(tasks) ? tasks : []).length}`}
                label="Total"
              />
              <Stat
                icon={Terminal}
                value={`${completedCount}`}
                label="Resolved"
              />
              <Stat icon={Database} value="99.9%" label="Uptime" />
            </div>
            <div className="hidden xl:block h-8 w-px bg-line" />
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted opacity-40" />
              <input
                type="text"
                placeholder="Query..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-bg border border-line pl-9 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-accent w-28 sm:w-48 lg:w-64 rounded-sm transition-all placeholder:text-[10px]"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-10 w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="md:hidden flex gap-4 p-4 bg-card border border-line mb-6 overflow-x-auto no-scrollbar">
            <Stat
              icon={Activity}
              value={`${(Array.isArray(tasks) ? tasks : []).length}`}
              label="All"
            />
            <Stat icon={Terminal} value={`${completedCount}`} label="Done" />
            <Stat icon={Database} value="99.9%" label="UP" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TaskForm
              onSubmit={(title, dueDate, priority, projectId) =>
                createTaskMutation.mutate({
                  title,
                  dueDate,
                  priority,
                  projectId,
                })
              }
              isLoading={createTaskMutation.isPending}
              projects={projects}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-line">
                <h2 className="text-[10px] font-mono uppercase font-bold text-muted tracking-[0.2em]">
                  Active :: Resolution_Stack
                </h2>
                <span className="text-[10px] font-mono text-accent font-bold uppercase">
                  {filteredTasks.length} NODE(S)
                </span>
              </div>

              <AnimatePresence mode="popLayout">
                {filteredTasks.length === 0 ? (
                  <motion.div
                    key="empty-stack"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 sm:py-20 text-center border-2 border-dashed border-line rounded-sm"
                  >
                    <Terminal className="w-10 h-10 sm:w-12 sm:h-12 text-line mx-auto mb-4" />
                    <p className="text-xs sm:text-sm font-mono text-muted uppercase tracking-widest">
                      Stack_Empty :: No match found
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="tasks-list">
                    {/* Uncategorized Tasks */}
                    {filteredTasks
                      .filter((t) => !t.projectId)
                      .map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggle={(id, completed) =>
                            toggleTaskMutation.mutate({ id, completed })
                          }
                          onDelete={(id) => deleteTaskMutation.mutate(id)}
                          isUpdating={
                            toggleTaskMutation.isPending &&
                            (toggleTaskMutation.variables as { id: string })
                              ?.id === task.id
                          }
                        />
                      ))}

                    {/* Grouped by project */}
                    {projects.map((project) => {
                      const projectTasks = filteredTasks.filter(
                        (t) => t.projectId === project.id,
                      );
                      if (projectTasks.length === 0) return null;
                      return (
                        <div key={project.id} className="mt-8 mb-4">
                          <div className="flex items-center gap-2 mb-4 opacity-60">
                            <div className="w-1 h-3 bg-accent" />
                            <h3 className="text-[10px] font-mono uppercase font-bold text-primary tracking-widest">
                              Project :: {project.name}
                            </h3>
                          </div>
                          {projectTasks.map((task) => (
                            <TaskItem
                              key={task.id}
                              task={task}
                              onToggle={(id, completed) =>
                                toggleTaskMutation.mutate({ id, completed })
                              }
                              onDelete={(id) => deleteTaskMutation.mutate(id)}
                              isUpdating={
                                toggleTaskMutation.isPending &&
                                (toggleTaskMutation.variables as { id: string })
                                  ?.id === task.id
                              }
                            />
                          ))}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Habits Section */}
              <div className="mt-12 space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <h2 className="text-[10px] font-mono uppercase font-bold text-muted tracking-[0.2em]">
                    Routine :: Persistent_Habits
                  </h2>
                  <span className="text-[10px] font-mono text-accent font-bold uppercase">
                    {habits.length} ACTIVE_MODES
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {habits.map((habit) => {
                    const today = new Date().toDateString();
                    const completedToday = habit.logs.some(
                      (log) => new Date(log.date).toDateString() === today,
                    );
                    const streak = calculateStreak(habit.logs);

                    return (
                      <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-line p-5 rounded-sm space-y-4 hover:border-accent/30 transition-colors group relative"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold font-mono tracking-tight uppercase">
                              {habit.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Flame
                                className={`w-3 h-3 ${streak > 0 ? "text-orange-500" : "text-muted opacity-30"}`}
                              />
                              <span className="text-[10px] font-mono font-bold text-muted">
                                STREAK: {streak}_DAYS
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                deleteHabitMutation.mutate(habit.id)
                              }
                              className="p-1.5 text-muted opacity-0 group-hover:opacity-60 hover:opacity-100 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                toggleHabitMutation.mutate(habit.id)
                              }
                              className={`
                                flex items-center gap-2 px-3 py-1.5 rounded-sm font-mono text-[10px] font-bold uppercase transition-all
                                ${
                                  completedToday
                                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                    : "bg-bg text-muted border border-line hover:border-accent hover:text-primary"
                                }
                              `}
                            >
                              <CheckCircle2
                                className={`w-3.5 h-3.5 ${completedToday ? "animate-pulse" : ""}`}
                              />
                              {completedToday ? "SYNCD" : "SYNC_MODE"}
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-line/50">
                          <HabitHeatmap logs={habit.logs} />
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Add Habit Card */}
                  <div className="bg-bg border border-line border-dashed p-5 rounded-sm flex flex-col justify-center items-center gap-4 group hover:border-accent/50 transition-colors">
                    <div className="w-full space-y-3">
                      <div className="text-[10px] font-mono font-bold text-muted uppercase text-center opacity-40">
                        Add_New_Routine
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="HABIT_NAME..."
                          value={newHabitName}
                          onChange={(e) => setNewHabitName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newHabitName.trim()) {
                              createHabitMutation.mutate(newHabitName);
                              setNewHabitName("");
                            }
                          }}
                          className="flex-1 bg-card border border-line p-2 text-xs font-mono focus:outline-none focus:border-accent rounded-sm h-9"
                        />
                        <button
                          disabled={
                            !newHabitName.trim() ||
                            createHabitMutation.isPending
                          }
                          onClick={() => {
                            createHabitMutation.mutate(newHabitName);
                            setNewHabitName("");
                          }}
                          className="px-3 bg-primary text-white rounded-sm hover:bg-accent transition-colors disabled:opacity-50 h-9"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer HUD */}
        <footer className="mt-auto p-4 border-t border-line bg-card flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-mono text-muted opacity-60">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />{" "}
              SYSTEM_STABLE
            </span>
          </div>
          <div>DevTasks_v0.0.0-RELEASE</div>
        </footer>
      </main>
    </Layout>
  );
};

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="p-1.5 bg-bg border border-line rounded-sm">
        <Icon className="w-3 h-3 text-accent" />
      </div>
      <div>
        <div className="text-xs font-bold font-mono uppercase leading-none tracking-tighter tabular-nums">
          {value}
        </div>
        <div className="text-[9px] font-mono uppercase opacity-50 leading-none mt-0.5">
          {label}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
