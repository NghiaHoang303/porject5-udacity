import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'
import 'source-map-support/register'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createToDo } from '../../business/CreateTodo'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

export const handler = middy( async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  // TODO: Implement creating a new TODO item
  const toDoItem = await createToDo(newTodo, jwtToken)
  const result = {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: toDoItem
    })
  }
  return result
})

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)