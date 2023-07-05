import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'
import { getAllToDo } from '../../business/ToDo'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
const logger = createLogger('TodosAccess')

// TODO: Get all TODO items for a current user

export const handler = middy( async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Processing Event ', event)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const toDos = await getAllToDo(jwtToken)
  const result = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: toDos
    })
  }
  logger.info("result: " ,  result)
  return result
})

handler.use(
  cors({
    credentials: true
  })
)
