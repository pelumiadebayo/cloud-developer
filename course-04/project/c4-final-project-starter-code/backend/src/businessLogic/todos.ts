import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'


const bucketName = process.env.ATTACHMENT_S3_BUCKET
const todoAccess = new TodosAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  return await todoAccess.getTodosForUser(userId);
}

export async function createTodo(todoId: string, userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem>{
  const newItem = {
    todoId,
    userId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done:false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }

  return await todoAccess.createTodo(newItem);
}

export function updateTodo(todoId: string, userId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoUpdate> {
  return todoAccess.updateTodo(todoId, userId, updateTodoRequest);
}

export function deleteTodo(todoId: string, userId: string) {
  return todoAccess.deleteTodo(todoId, userId);
}

export async function createAttachmentPresignedUrl(imageId: string): Promise<String> {
  return await todoAccess.createAttachmentPresignedUrl(imageId)
}
