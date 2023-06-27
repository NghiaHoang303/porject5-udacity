import { TodoItem } from '../models/TodoItem'
import { parseUserId } from '../auth/utils'
import { AllToDoAccess } from '../dataLayer/AllToDoAccess'

const allToDoAccess = new AllToDoAccess()

export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  return allToDoAccess.getAllToDo(userId)
}


