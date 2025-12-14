"use client"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ListFilter } from "lucide-react"

interface TaskFiltersProps {
  statusFilter: "all" | "pending" | "completed"
  onStatusFilterChange: (status: "all" | "pending" | "completed") => void
  priorityFilter: "all" | "high" | "medium" | "low"
  onPriorityFilterChange: (priority: "all" | "high" | "medium" | "low") => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function TaskFilters({
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  searchQuery,
  onSearchChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
      <div className="relative w-full sm:flex-1 sm:min-w-[180px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 w-full"
          aria-label="Search tasks"
        />
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as "all" | "pending" | "completed")}>
          <SelectTrigger className="flex-1 sm:flex-none sm:w-[140px]" aria-label="Filter by status">
            <ListFilter className="h-4 w-4 mr-2 shrink-0" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter}
          onValueChange={(v) => onPriorityFilterChange(v as "all" | "high" | "medium" | "low")}
        >
          <SelectTrigger className="flex-1 sm:flex-none sm:w-[140px]" aria-label="Filter by priority">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                High
              </span>
            </SelectItem>
            <SelectItem value="medium">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Medium
              </span>
            </SelectItem>
            <SelectItem value="low">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Low
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
