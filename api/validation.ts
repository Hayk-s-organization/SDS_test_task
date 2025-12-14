import Joi from "joi"
import type { CreateTaskInput, UpdateTaskInput } from "./types"

// Joi validation schemas
export const createTaskSchema = Joi.object<CreateTaskInput>({
  title: Joi.string().min(1).max(200).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 1 character",
    "string.max": "Title must be less than 200 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().max(1000).allow("").optional().messages({
    "string.max": "Description must be less than 1000 characters",
  }),
  priority: Joi.string().valid("high", "medium", "low").required().messages({
    "any.only": "Priority must be high, medium, or low",
    "any.required": "Priority is required",
  }),
  dueDate: Joi.string().isoDate().allow("", null).optional().messages({
    "string.isoDate": "Due date must be a valid ISO date",
  }),
})

export const updateTaskSchema = Joi.object<UpdateTaskInput>({
  title: Joi.string().min(1).max(200).optional().messages({
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least 1 character",
    "string.max": "Title must be less than 200 characters",
  }),
  description: Joi.string().max(1000).allow("").optional().messages({
    "string.max": "Description must be less than 1000 characters",
  }),
  priority: Joi.string().valid("high", "medium", "low").optional().messages({
    "any.only": "Priority must be high, medium, or low",
  }),
  status: Joi.string().valid("pending", "completed").optional().messages({
    "any.only": "Status must be pending or completed",
  }),
  dueDate: Joi.string().isoDate().allow("", null).optional().messages({
    "string.isoDate": "Due date must be a valid ISO date",
  }),
})

export function validateCreateTask(data: unknown): { value?: CreateTaskInput; error?: string } {
  const { error, value } = createTaskSchema.validate(data, { abortEarly: false })
  if (error) {
    return { error: error.details.map((d) => d.message).join(", ") }
  }
  return { value }
}

export function validateUpdateTask(data: unknown): { value?: UpdateTaskInput; error?: string } {
  const { error, value } = updateTaskSchema.validate(data, { abortEarly: false })
  if (error) {
    return { error: error.details.map((d) => d.message).join(", ") }
  }
  return { value }
}
