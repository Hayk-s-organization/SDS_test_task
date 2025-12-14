"use client"

import { TaskCard } from "./task-card"
import type { Task } from "@/api/types"
import { ClipboardList } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, status: "pending" | "completed") => void
  onClick: (task: Task) => void
  isLoading: boolean
}

export function TaskList({ tasks, onEdit, onDelete, onToggleStatus, onClick, isLoading }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <ClipboardList className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No tasks found</h3>
        <p className="text-sm text-muted-foreground">Create a new task to get started or adjust your filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onClick={onClick}
        />
      ))}
    </div>
  )
}
