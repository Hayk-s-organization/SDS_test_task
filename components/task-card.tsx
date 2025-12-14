"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Calendar, Clock, Loader2 } from "lucide-react"
import type { Task } from "@/api/types"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, status: "pending" | "completed") => void
  onClick: (task: Task) => void
}

const priorityColors = {
  high: "bg-red-500/10 text-red-500 border-red-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
}

const priorityDots = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
}

export function TaskCard({ task, onEdit, onDelete, onToggleStatus, onClick }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const isCompleted = task.status === "completed"

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(task.id)
    setIsDeleting(false)
  }

  const handleToggle = async (checked: boolean) => {
    setIsToggling(true)
    await onToggleStatus(task.id, checked ? "completed" : "pending")
    setIsToggling(false)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest("button") || target.closest('[role="checkbox"]') || target.closest('[role="menuitem"]')) {
      return
    }
    onClick(task)
  }

  return (
    <Card
      className={cn(
        "group transition-all duration-200 hover:shadow-md border-border/50 cursor-pointer",
        isCompleted && "opacity-60"
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3 px-3 sm:px-6">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin mt-1 text-primary" />
            ) : (
              <Checkbox
                checked={isCompleted}
                onCheckedChange={handleToggle}
                className="mt-1"
                aria-label={`Mark task "${task.title}" as ${isCompleted ? "pending" : "completed"}`}
              />
            )}
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "font-medium text-foreground leading-snug text-sm sm:text-base",
                  isCompleted && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0"
                aria-label="Task options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:flex-wrap">
          <Badge variant="outline" className={cn("text-xs w-fit", priorityColors[task.priority])}>
            <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", priorityDots[task.priority])} />
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>

          {task.dueDate && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs w-fit",
                isOverdue ? "bg-red-500/10 text-red-500 border-red-500/20" : "text-muted-foreground"
              )}
            >
              <Calendar className="h-3 w-3 mr-1" />
              <span className="font-medium mr-1">Due:</span>
              {formatDate(task.dueDate)}
            </Badge>
          )}

          <Badge variant="outline" className="text-xs text-muted-foreground w-fit sm:ml-auto">
            <Clock className="h-3 w-3 mr-1" />
            <span className="font-medium mr-1">Created:</span>
            {formatDate(task.createdAt)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
