import { NextResponse } from "next/server"
import { getAllTasks, createTask } from "@/api/db"
import { validateCreateTask } from "@/api/validation"
import type { ApiResponse, Task } from "@/api/types"

// GET /api/tasks - Get all tasks
export async function GET() {
  try {
    const tasks = getAllTasks()
    return NextResponse.json<ApiResponse<Task[]>>({
      success: true,
      data: tasks,
    })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to fetch tasks" }, { status: 500 })
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input with Joi
    const { value, error } = validateCreateTask(body)
    if (error) {
      return NextResponse.json<ApiResponse>({ success: false, error }, { status: 400 })
    }

    const task = createTask(value!)
    return NextResponse.json<ApiResponse<Task>>({ success: true, data: task }, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to create task" }, { status: 500 })
  }
}
