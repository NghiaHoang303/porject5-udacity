import { parseUserId } from '../auth/utils'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { TodoUpdate } from '../models/TodoUpdate'
import { AllToDoAccess } from '../dataLayer/AllToDoAccess'

const allToDoAccess = new AllToDoAccess()

export const  updateToDo = async (updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string) => {
    const userId = parseUserId(jwtToken);
    await allToDoAccess.updateTodo(updateTodoRequest, todoId, userId);
}