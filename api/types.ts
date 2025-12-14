// Task types shared between frontend and backend
export type Priority = "high" | "medium" | "low"
export type Status = "pending" | "completed"

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  status: Status
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  priority: Priority
  dueDate?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  priority?: Priority
  status?: Status
  dueDate?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
