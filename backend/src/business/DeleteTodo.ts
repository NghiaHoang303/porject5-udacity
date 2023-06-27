
import { parseUserId } from '../auth/utils'
import { AllToDoAccess } from '../dataLayer/AllToDoAccess'

const allToDoAccess = new AllToDoAccess()

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
  console.log("todoId: ", todoId, "| jwtToken: ", jwtToken)
const userId = parseUserId(jwtToken)
return allToDoAccess.deleteToDo(todoId, userId)
}