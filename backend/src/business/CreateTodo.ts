import { TodoItem } from '../models/TodoItem'
// import { parseUserId } from '../auth/utils'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { AllToDoAccess } from '../dataLayer/AllToDoAccess'

import * as uuid from 'uuid';
const allToDoAccess = new AllToDoAccess()

export function createToDo(
    createTodoRequest: CreateTodoRequest,
    // jwtToken: string,
    userId: string
  ): Promise<TodoItem> {
    // const userId = parseUserId(jwtToken)
    const todoId = uuid()
    // const s3BucketName = process.env.ATTACHMENT_S3_BUCKET_VALUE
    // const urlAttachment = ``
    return allToDoAccess.createToDo({
      userId: userId,
      todoId: todoId,
      createdAt: new Date().getTime().toString(),
      attachmentUrl: null,
      done: false,
      ...createTodoRequest
    })
  }