import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
// import { uploadUrlImage } from '../../business/UploadImage'
import { createAttachmentUrl } from '../../business/createAttachment'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    console.log('Processing Event ', event)
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event);
    const URL = await createAttachmentUrl(userId, todoId)

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
    },
      body: JSON.stringify({
        uploadUrl: URL,
      })
    }
  }
)
handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
