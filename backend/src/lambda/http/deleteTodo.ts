import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {deleteToDo} from "../../business/DeleteTodo";
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares'

export const handler =middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Remove a TODO item by id
    console.log("Event ", event);
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
    const todoId = event.pathParameters.todoId;
    const deleteData = await deleteToDo(todoId, jwtToken);
    
    const result = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: deleteData,
    }
    return result
});

handler.use(httpErrorHandler()).use(
    cors({
      credentials: true
    })
  )