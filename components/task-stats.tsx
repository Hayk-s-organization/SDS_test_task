"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle, ListTodo } from "lucide-react"
import type { Task } from "@/api/types"

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.status === "completed").length
  const pending = tasks.filter((t) => t.status === "pending").length
  const highPriority = tasks.filter((t) => t.priority === "high" && t.status === "pending").length

  const stats = [
    {
      label: "Total Tasks",
      value: total,
      icon: ListTodo,
      color: "text-foreground",
      bgColor: "bg-muted",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "High Priority",
      value: highPriority,
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
