import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>=> {
    const todoId = event.pathParameters.todoId
    const userId= getUserId(event)
    // TODO: Remove a TODO item by id
    const deleteData = await deleteTodo(todoId, userId)
    return {
      statusCode: 200,
      body:JSON.stringify({
        deleteData
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
