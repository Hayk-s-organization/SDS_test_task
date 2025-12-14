"use client"

import { useCallback, useMemo, useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { TaskList } from "./task-list"
import { TaskForm } from "./task-form"
import { TaskFilters } from "./task-filters"
import { TaskStats } from "./task-stats"
import { LoadingOverlay } from "./loading-overlay"
import { TaskDetailModal } from "./task-detail-modal"
import { TaskPagination } from "./task-pagination"
import { RefreshCw, Sparkles } from "lucide-react"
import type { ApiResponse, CreateTaskInput, Task, UpdateTaskInput } from "@/api/types"
import { useToast } from "@/hooks/use-toast"

const fakeDelay = (min = 500, max = 1500) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min))

const fetcher = async (url: string) => {
  await fakeDelay(800, 1500)
  const res = await fetch(url)
  const data: ApiResponse<Task[]> = await res.json()
  if (!data.success) throw new Error(data.error)
  return data.data
}

export function TaskDashboard() {
  const { data: tasks, error, isLoading, mutate } = useSWR<Task[]>("/api/tasks", fetcher)
  const { toast } = useToast()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const [loadingState, setLoadingState] = useState<{
    isLoading: boolean
    message: string
  }>({ isLoading: false, message: "" })

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // --- NEW HANDLERS to safely reset pagination on filter change ---

  const handleStatusFilterChange = useCallback((status: typeof statusFilter) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }, [])

  const handlePriorityFilterChange = useCallback((priority: typeof priorityFilter) => {
    setPriorityFilter(priority)
    setCurrentPage(1)
  }, [])

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  // -----------------------------------------------------------------

  const filteredTasks = useMemo(() => {
    if (!tasks) return []

    return tasks.filter((task) => {
      if (statusFilter !== "all" && task.status !== statusFilter) return false
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query)
      }
      return true
    })
  }, [tasks, statusFilter, priorityFilter, searchQuery])

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredTasks.slice(startIndex, endIndex)
  }, [filteredTasks, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage)

  // NOTE: The problematic useEffect that caused the linting error has been removed.
  // The logic to reset setCurrentPage(1) is now safely handled in the filter change handlers above.

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    setLoadingState({ isLoading: true, message: "Refreshing tasks..." })
    await fakeDelay(600, 1200)
    await mutate()
    setLoadingState({ isLoading: false, message: "" })
    setIsRefreshing(false)
  }, [mutate])

  const handleCreateTask = useCallback(
    async (data: CreateTaskInput | UpdateTaskInput) => {
      setLoadingState({ isLoading: true, message: "Creating task..." })
      await fakeDelay(800, 1500)

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result: ApiResponse<Task> = await res.json()

      if (!result.success) {
        setLoadingState({ isLoading: false, message: "" })
        toast({
          title: "Error",
          description: result.error || "Failed to create task",
          variant: "destructive",
        })
        throw new Error(result.error)
      }

      await mutate()
      setLoadingState({ isLoading: false, message: "" })
      toast({
        title: "Success",
        description: "Task created successfully",
      })
    },
    [mutate, toast]
  )

  const handleUpdateTask = useCallback(
    async (data: CreateTaskInput | UpdateTaskInput) => {
      if (!editingTask) return

      setLoadingState({ isLoading: true, message: "Saving changes..." })
      await fakeDelay(600, 1200)

      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result: ApiResponse<Task> = await res.json()

      if (!result.success) {
        setLoadingState({ isLoading: false, message: "" })
        toast({
          title: "Error",
          description: result.error || "Failed to update task",
          variant: "destructive",
        })
        throw new Error(result.error)
      }

      await mutate()
      setEditingTask(null)
      setLoadingState({ isLoading: false, message: "" })
      toast({
        title: "Success",
        description: "Task updated successfully",
      })
    },
    [editingTask, mutate, toast]
  )

  const handleInlineUpdate = useCallback(
    async (id: string, data: UpdateTaskInput) => {
      await fakeDelay(400, 800)

      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result: ApiResponse<Task> = await res.json()

      if (!result.success) {
        toast({
          title: "Error",
          description: result.error || "Failed to update task",
          variant: "destructive",
        })
        throw new Error(result.error)
      }

      await mutate()
      if (selectedTask && result.data) {
        setSelectedTask(result.data)
      }
    },
    [mutate, toast, selectedTask]
  )

  const handleDeleteTask = useCallback(
    async (id: string) => {
      setLoadingState({ isLoading: true, message: "Deleting task..." })
      await fakeDelay(600, 1000)

      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })
      const result: ApiResponse = await res.json()

      if (!result.success) {
        setLoadingState({ isLoading: false, message: "" })
        toast({
          title: "Error",
          description: result.error || "Failed to delete task",
          variant: "destructive",
        })
        return
      }

      await mutate()
      setLoadingState({ isLoading: false, message: "" })
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    },
    [mutate, toast]
  )

  const handleToggleStatus = useCallback(
    async (id: string, status: "pending" | "completed") => {
      await fakeDelay(400, 800)

      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const result: ApiResponse<Task> = await res.json()

      if (!result.success) {
        toast({
          title: "Error",
          description: result.error || "Failed to update task status",
          variant: "destructive",
        })
        return
      }

      await mutate()
    },
    [mutate, toast]
  )

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }, [])

  const handleFormClose = useCallback((open: boolean) => {
    setIsFormOpen(open)
    if (!open) setEditingTask(null)
  }, [])

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task)
    setIsDetailOpen(true)
  }, [])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <p className="text-destructive mb-4">Failed to load tasks</p>
        <Button onClick={handleRefresh}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <LoadingOverlay isVisible={loadingState.isLoading} message={loadingState.message} />

      <TaskStats tasks={tasks || []} />

      <div className="space-y-3">
        <TaskFilters
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange} // UPDATED
          priorityFilter={priorityFilter}
          onPriorityFilterChange={handlePriorityFilterChange} // UPDATED
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange} // UPDATED
        />

        <div className="flex gap-2 justify-start">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh tasks"
            className="shrink-0 bg-transparent h-10 w-10"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="font-medium">New Task</span>
          </Button>
        </div>
      </div>

      <TaskList
        tasks={paginatedTasks}
        onEdit={handleEdit}
        onDelete={handleDeleteTask}
        onToggleStatus={handleToggleStatus}
        onClick={handleTaskClick}
        isLoading={isLoading}
      />

      {filteredTasks.length > 0 && (
        <TaskPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredTasks.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}

      <TaskForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        task={editingTask}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
      />

      <TaskDetailModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        task={selectedTask}
        onUpdate={handleInlineUpdate}
      />
    </div>
  )
}
