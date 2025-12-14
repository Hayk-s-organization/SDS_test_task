import type { Task } from "./types"

const tasks: Task[] = [
  {
    id: "task1",
    title: "Complete project documentation",
    description:
      "Write comprehensive documentation for the task management system including API endpoints and user guide",
    priority: "high",
    status: "pending",
    dueDate: "2025-01-20",
    createdAt: "2024-12-10T08:00:00.000Z",
    updatedAt: "2024-12-10T08:00:00.000Z",
  },
  {
    id: "task2",
    title: "Review code pull requests",
    description: "Review and provide feedback on pending pull requests from the development team",
    priority: "medium",
    status: "pending",
    dueDate: "2025-01-15",
    createdAt: "2024-12-11T09:30:00.000Z",
    updatedAt: "2024-12-11T09:30:00.000Z",
  },
  {
    id: "task3",
    title: "Update dependencies",
    description: "Update all project dependencies to their latest stable versions and test for compatibility",
    priority: "low",
    status: "completed",
    dueDate: "2024-12-14",
    createdAt: "2024-12-09T14:20:00.000Z",
    updatedAt: "2024-12-14T10:15:00.000Z",
  },
  {
    id: "task4",
    title: "Prepare demo presentation",
    description: "Create slides and prepare demo for the upcoming stakeholder meeting",
    priority: "high",
    status: "pending",
    dueDate: "2025-01-18",
    createdAt: "2024-12-12T11:45:00.000Z",
    updatedAt: "2024-12-12T11:45:00.000Z",
  },
  {
    id: "task5",
    title: "Fix login page bug",
    description: "Investigate and fix the authentication issue reported by users on the login page",
    priority: "high",
    status: "pending",
    dueDate: "2025-01-16",
    createdAt: "2024-12-13T10:20:00.000Z",
    updatedAt: "2024-12-13T10:20:00.000Z",
  },
  {
    id: "task6",
    title: "Design new dashboard layout",
    description: "Create mockups for the new analytics dashboard with improved UX",
    priority: "medium",
    status: "pending",
    dueDate: "2025-01-25",
    createdAt: "2024-12-11T15:30:00.000Z",
    updatedAt: "2024-12-11T15:30:00.000Z",
  },
  {
    id: "task7",
    title: "Database backup",
    description: "Set up automated daily backups for production database",
    priority: "high",
    status: "completed",
    dueDate: "2024-12-13",
    createdAt: "2024-12-08T07:00:00.000Z",
    updatedAt: "2024-12-13T16:45:00.000Z",
  },
  {
    id: "task8",
    title: "Client meeting preparation",
    description: "Gather metrics and prepare status report for quarterly client review",
    priority: "medium",
    status: "pending",
    dueDate: "2025-01-22",
    createdAt: "2024-12-12T13:10:00.000Z",
    updatedAt: "2024-12-12T13:10:00.000Z",
  },
  {
    id: "task9",
    title: "Write unit tests",
    description: "Add comprehensive unit tests for the new API endpoints with edge cases",
    priority: "medium",
    status: "pending",
    dueDate: "2025-01-19",
    createdAt: "2024-12-10T16:25:00.000Z",
    updatedAt: "2024-12-10T16:25:00.000Z",
  },
  {
    id: "task10",
    title: "Refactor authentication module",
    description: "Improve code structure and add support for OAuth providers",
    priority: "low",
    status: "pending",
    dueDate: "2025-02-01",
    createdAt: "2024-12-09T11:50:00.000Z",
    updatedAt: "2024-12-09T11:50:00.000Z",
  },
  {
    id: "task11",
    title: "Update privacy policy",
    description: "Review and update privacy policy to comply with new data protection regulations",
    priority: "low",
    status: "completed",
    dueDate: "2024-12-12",
    createdAt: "2024-12-05T09:00:00.000Z",
    updatedAt: "2024-12-12T14:30:00.000Z",
  },
  {
    id: "task12",
    title: "Performance optimization",
    description: "Analyze and optimize application load times and reduce bundle size",
    priority: "medium",
    status: "completed",
    dueDate: "2024-12-14",
    createdAt: "2024-12-07T12:15:00.000Z",
    updatedAt: "2024-12-14T18:20:00.000Z",
  },
]

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function getAllTasks(): Task[] {
  return [...tasks]
}

export function getTaskById(id: string): Task | undefined {
  return tasks.find((task) => task.id === id)
}

export function createTask(input: {
  title: string
  description?: string
  priority: "high" | "medium" | "low"
  dueDate?: string
}): Task {
  const now = new Date().toISOString()
  const newTask: Task = {
    id: generateId(),
    title: input.title,
    description: input.description || undefined,
    priority: input.priority,
    status: "pending",
    dueDate: input.dueDate || undefined,
    createdAt: now,
    updatedAt: now,
  }
  tasks.push(newTask)
  return newTask
}

export function updateTask(id: string, input: Partial<Task>): Task | null {
  const index = tasks.findIndex((task) => task.id === id)
  if (index === -1) return null

  const updatedTask: Task = {
    ...tasks[index],
    ...input,
    updatedAt: new Date().toISOString(),
  }
  tasks[index] = updatedTask
  return updatedTask
}

export function deleteTask(id: string): boolean {
  const index = tasks.findIndex((task) => task.id === id)
  if (index === -1) return false
  tasks.splice(index, 1)
  return true
}
