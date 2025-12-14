import { NextResponse } from "next/server"
import { getTaskById, updateTask, deleteTask } from "@/api/db"
import { validateUpdateTask } from "@/api/validation"
import type { ApiResponse, Task } from "@/api/types"

// GET /api/tasks/:id - Get a single task
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const task = getTaskById(id)

    if (!task) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json<ApiResponse<Task>>({
      success: true,
      data: task,
    })
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to fetch task" }, { status: 500 })
  }
}

// PUT /api/tasks/:id - Update a task
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if task exists
    const existingTask = getTaskById(id)
    if (!existingTask) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Task not found" }, { status: 404 })
    }

    // Validate input with Joi
    const { value, error } = validateUpdateTask(body)
    if (error) {
      return NextResponse.json<ApiResponse>({ success: false, error }, { status: 400 })
    }

    const updatedTask = updateTask(id, value!)
    return NextResponse.json<ApiResponse<Task>>({
      success: true,
      data: updatedTask!,
    })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to update task" }, { status: 500 })
  }
}

// DELETE /api/tasks/:id - Delete a task
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Check if task exists
    const existingTask = getTaskById(id)
    if (!existingTask) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Task not found" }, { status: 404 })
    }

    deleteTask(id)
    return NextResponse.json<ApiResponse>({
      success: true,
    })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to delete task" }, { status: 500 })
  }
}
