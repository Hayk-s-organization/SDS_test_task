import { TaskDashboard } from "@/components/task-dashboard"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Task Manager</h1>
          <p className="text-muted-foreground mt-1">Organize and track your tasks efficiently</p>
        </header>

        {/* Dashboard */}
        <TaskDashboard />
      </div>
      <Toaster />
    </main>
  )
}
