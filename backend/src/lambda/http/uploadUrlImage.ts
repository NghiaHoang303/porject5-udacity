import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { uploadUrlImage } from '../../business/UploadImage'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    console.log('Processing Event ', event)
    const todoId = event.pathParameters.todoId

    const URL = await uploadUrlImage(todoId)

    return {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        uploadUrl: URL
      })
    }
  }
)
handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
