import { APIGatewayProxyEvent, APIGatewayProxyResult , APIGatewayProxyHandler} from 'aws-lambda'
import 'source-map-support/register'
// import * as middy from 'middy'
// import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { createAttachmentPresignedUrl } from '../../businessLogic/todos'

import * as uuid from 'uuid'

export const handler: APIGatewayProxyHandler  = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body);
    const userid= getUserId(event);
    const todoId = uuid.v4();
    // TODO: Implement creating a new TODO item
    const newItem = await createTodo(todoId, userid, newTodo)
    const url = await createAttachmentPresignedUrl(todoId);

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        newItem: newItem,
        uploadUrl: url
      })
    } 
  }


// handler.use(
//   cors({
//     credentials: true
//   })
// )
