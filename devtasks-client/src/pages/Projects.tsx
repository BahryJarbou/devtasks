import { useState } from "react";
import Layout from "../components/Layout";
import { Folder, ArrowUpRight, Box, ChevronLeft, Terminal, Archive, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { getProjects, createProject, updateProject } from "../api/projects";
import { getTasks, updateTask, deleteTask } from "../api/tasks";
import TaskItem from "../components/TaskItem";
import ProjectForm from "../components/ProjectForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Projects() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const createProjectMutation = useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) => createProject(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
  
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "archived" }) => updateProject(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => updateTask(id, { completed }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const selectedProject = (Array.isArray(projects) ? projects : []).find(p => p.id === selectedProjectId);
  const projectTasks = (Array.isArray(tasks) ? tasks : []).filter(t => t.projectId === selectedProjectId);

  if (projectsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[50vh]">
          <Terminal className="w-8 h-8 animate-pulse text-accent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-10 w-full max-w-7xl mx-auto space-y-8">
        <AnimatePresence mode="wait">
          {!selectedProjectId ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <header className="space-y-2">
                <div className="flex items-center gap-2 text-accent">
                  <Folder className="w-5 h-5" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Directory_Listing</span>
                </div>
                <h1 className="text-3xl font-bold font-mono tracking-tighter uppercase">Project_Manager</h1>
              </header>

              <ProjectForm 
                onSubmit={(name, description) => createProjectMutation.mutate({ name, description })}
                isLoading={createProjectMutation.isPending}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, i) => (
                  <motion.div 
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedProjectId(project.id)}
                    className="group p-6 bg-card border border-line hover:border-accent/40 transition-all shadow-sm flex flex-col gap-4 relative overflow-hidden cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-muted uppercase font-bold">{project.id}</span>
                        <h3 className="text-lg font-bold font-mono group-hover:text-accent transition-colors">{project.name}</h3>
                      </div>
                      <div className="p-2 bg-bg border border-line rounded-sm group-hover:border-accent transition-colors">
                        <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent" />
                      </div>
                    </div>

                    <p className="text-xs text-muted font-mono h-8 line-clamp-2">{project.description || "NO_DESCRIPTION_PROVIDED"}</p>

                    <div className="flex justify-between items-end pt-4 border-t border-line">
                      <div className="flex gap-4">
                        <Stat 
                          label="Nodes" 
                          value={(Array.isArray(tasks) ? tasks : []).filter(t => t.projectId === project.id).length.toString()} 
                          icon={Box} 
                        />
                      </div>
                      <StatusBadge status={project.status as "active" | "archived"} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <button 
                onClick={() => setSelectedProjectId(null)}
                className="flex items-center gap-2 text-muted hover:text-primary transition-colors mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Back_To_Directory</span>
              </button>

              <header className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-accent">
                    <Box className="w-5 h-5" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Project_Nexus :: {selectedProject?.id}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        if (!selectedProject) return;
                        updateProjectMutation.mutate({
                          id: selectedProject.id,
                          status: selectedProject.status === "active" ? "archived" : "active"
                        });
                      }}
                      disabled={updateProjectMutation.isPending}
                      className="flex items-center gap-2 px-3 py-1.5 bg-bg border border-line hover:border-accent group transition-all"
                    >
                      {selectedProject?.status === "active" ? (
                        <>
                          <Archive className="w-3 h-3 text-muted group-hover:text-accent" />
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted group-hover:text-accent">Archive_System</span>
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-3 h-3 text-muted group-hover:text-accent" />
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted group-hover:text-accent">Restore_System</span>
                        </>
                      )}
                    </button>
                    <StatusBadge status={(selectedProject?.status || "active") as "active" | "archived"} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold font-mono tracking-tighter uppercase">{selectedProject?.name}</h1>
                  <p className="text-sm text-muted font-mono">{selectedProject?.description}</p>
                </div>
              </header>

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-line">
                  <h2 className="text-[10px] font-mono uppercase font-bold text-muted tracking-[0.2em]">Associated_Nodes</h2>
                  <span className="text-[10px] font-mono text-accent font-bold uppercase">{projectTasks.length} NODES</span>
                </div>

                <div className="space-y-3">
                  {tasksLoading ? (
                    <div className="flex items-center justify-center p-10">
                      <Terminal className="w-6 h-6 animate-pulse text-accent/50" />
                    </div>
                  ) : projectTasks.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-line">
                      <p className="text-[10px] font-mono text-muted uppercase tracking-widest">No_Nodes_Connected</p>
                    </div>
                  ) : (
                    projectTasks.map((task) => (
                      <TaskItem 
                        key={task.id}
                        task={task}
                        onToggle={(id, completed) => toggleMutation.mutate({ id, completed })}
                        onDelete={(id) => deleteMutation.mutate(id)}
                        isUpdating={toggleMutation.isPending && (toggleMutation.variables as { id: string })?.id === task.id}
                      />
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

function Stat({ label, value, icon: Icon }: { label: string, value: string, icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3 h-3 text-muted" />
      <span className="text-[10px] font-mono uppercase text-muted">
        {label}::<span className="text-primary font-bold">{value}</span>
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: "active" | "archived" }) {
  const isActive = status === "active";
  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 border ${isActive ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500' : 'border-line bg-bg/50 text-muted'} transition-all`}>
      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-muted'}`} />
      <span className="text-[9px] font-mono font-bold uppercase tracking-widest">{status}</span>
    </div>
  );
}
