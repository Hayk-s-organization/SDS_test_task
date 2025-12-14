"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Flag, AlignLeft, Type, Loader2 } from "lucide-react"
import type { Task, UpdateTaskInput } from "@/api/types"
import { cn } from "@/lib/utils"

interface TaskDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  onUpdate: (id: string, data: UpdateTaskInput) => Promise<void>
}

const priorityDots = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
}

const statusColors = {
  pending: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
}

export function TaskDetailModal({ open, onOpenChange, task, onUpdate }: TaskDetailModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [localTask, setLocalTask] = useState<Task | null>(null)

  const titleInputRef = useRef<HTMLInputElement>(null)
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null)

  // Simulate loading when modal opens
  useEffect(() => {
    if (open && task) {
      setIsLoading(true)
      setLocalTask(task)
      const timer = setTimeout(
        () => {
          setIsLoading(false)
        },
        500 + Math.random() * 500
      ) // 0.5-1s fake loading
      return () => clearTimeout(timer)
    }
  }, [open, task])

  // Focus input when editing starts
  useEffect(() => {
    if (editingField === "title" && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
    if (editingField === "description" && descriptionInputRef.current) {
      descriptionInputRef.current.focus()
      descriptionInputRef.current.select()
    }
  }, [editingField])

  const handleSaveField = async (field: string, value: string) => {
    if (!localTask || !task) return

    const updateData: UpdateTaskInput = { [field]: value }

    // Don't save if value hasn't changed
    if (localTask[field as keyof Task] === value) {
      setEditingField(null)
      return
    }

    setIsSaving(true)
    setEditingField(null)

    try {
      await onUpdate(task.id, updateData)
      setLocalTask({ ...localTask, [field]: value })
    } catch (_error) {
      console.log(_error)
      setLocalTask(task)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSelectChange = async (field: string, value: string) => {
    if (!localTask || !task) return

    setIsSaving(true)
    setLocalTask({ ...localTask, [field]: value })

    try {
      await onUpdate(task.id, { [field]: value })
    } catch (_error) {
      console.log(_error)
      setLocalTask(task)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDateChange = async (value: string) => {
    if (!localTask || !task) return

    setIsSaving(true)
    setLocalTask({ ...localTask, dueDate: value || undefined })

    try {
      await onUpdate(task.id, { dueDate: value || undefined })
    } catch (_error) {
      console.log(_error)
      setLocalTask(task)
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[550px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading task details...</p>
          </div>
        ) : localTask ? (
          <>
            <DialogHeader className="pr-6 sm:pr-8">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="outline" className={cn("text-xs", statusColors[localTask.status])}>
                  {localTask.status.charAt(0).toUpperCase() + localTask.status.slice(1)}
                </Badge>
                {isSaving && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </div>
                )}
              </div>

              {/* Editable Title */}
              {editingField === "title" ? (
                <Input
                  ref={titleInputRef}
                  defaultValue={localTask.title}
                  className="text-lg sm:text-xl font-semibold"
                  onBlur={(e) => handleSaveField("title", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveField("title", e.currentTarget.value)
                    }
                    if (e.key === "Escape") {
                      setEditingField(null)
                    }
                  }}
                />
              ) : (
                <DialogTitle
                  className="text-lg sm:text-xl font-semibold cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors break-words"
                  onClick={() => setEditingField("title")}
                  title="Click to edit"
                >
                  {localTask.title}
                </DialogTitle>
              )}
            </DialogHeader>

            <div className="space-y-5 sm:space-y-6 mt-4">
              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <AlignLeft className="h-4 w-4" />
                  Description
                </div>
                {editingField === "description" ? (
                  <Textarea
                    ref={descriptionInputRef}
                    defaultValue={localTask.description || ""}
                    placeholder="Add a description..."
                    className="min-h-[100px] resize-none text-sm sm:text-base"
                    onBlur={(e) => handleSaveField("description", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setEditingField(null)
                      }
                    }}
                  />
                ) : (
                  <p
                    className={cn(
                      "text-sm rounded px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors min-h-[60px] break-words",
                      localTask.description ? "text-foreground" : "text-muted-foreground italic"
                    )}
                    onClick={() => setEditingField("description")}
                    title="Click to edit"
                  >
                    {localTask.description || "Click to add a description..."}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Priority */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Flag className="h-4 w-4" />
                    Priority
                  </div>
                  <Select value={localTask.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <span className={cn("w-2 h-2 rounded-full", priorityDots[localTask.priority])} />
                          {localTask.priority.charAt(0).toUpperCase() + localTask.priority.slice(1)}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          High
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Low
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Type className="h-4 w-4" />
                    Status
                  </div>
                  <Select value={localTask.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue>{localTask.status.charAt(0).toUpperCase() + localTask.status.slice(1)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </div>
                <Input
                  type="date"
                  value={formatDateForInput(localTask.dueDate)}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full sm:w-[200px]"
                />
                {localTask.dueDate && <p className="text-xs text-muted-foreground">{formatDate(localTask.dueDate)}</p>}
              </div>

              {/* Created At (Read-only) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Created
                </div>
                <p className="text-sm text-foreground px-3 py-2 bg-muted/30 rounded break-words">
                  {formatDate(localTask.createdAt)}
                </p>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
