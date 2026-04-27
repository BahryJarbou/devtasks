export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  projectId?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "active" | "archived";
}

export interface User {
  id: string;
  email: string;
}

export interface Habit {
  id: string;
  name: string;
  logs: { id: string; date: string }[];
}
