import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
const logger = createLogger('TodosAccess')

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE, 
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
  }

  async getTodosForUser(userId: string): Promise<TodoItem[]> {
    //try {
      console.log('Getting todos')
      const result = await this.docClient.query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      }).promise()

      logger.info('Got Todo items: ', result.Items)
      return result.Items as TodoItem[]

    // } catch (error) {
    //   logger.error('Error Getting Todo items', { error: error.message })
    // }
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
   // try {
      await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
      }).promise()
      logger.info('Created Todo item: ', todo)
  
      return todo
    // } catch (error) {
    //   logger.error('Error Creating Todo item', { error: error.message })
    // }
  }
  

  async updateTodo(todoId: string, userId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> {
    //try {
      console.log("Updating todo");

      const params = {
        TableName: this.todosTable,
        Key: {
            "userId": userId,
            "todoId": todoId
        },
        UpdateExpression: "set #a = :a, #b = :b, #c = :c",
        ExpressionAttributeNames: {
            "#a": "name",
            "#b": "dueDate",
            "#c": "done"
        },
        ExpressionAttributeValues: {
            ":a": todoUpdate['name'],
            ":b": todoUpdate['dueDate'],
            ":c": todoUpdate['done']
        },
        ReturnValues: "ALL_NEW"
      };
      const result = await this.docClient.update(params).promise();
      logger.info('Updated Todo item: ', result.Attributes)

      return result.Attributes as TodoUpdate;
    // } catch (error) {
    //   logger.error('Error Updating Todo item', { error: error.message })
    // }
  }

  async deleteTodo(todoId: string, userId: string){
    //try {
      console.log("Deleting todo");

      const params = {
          TableName: this.todosTable,
          Key: {
              "userId": userId,
              "todoId": todoId
          },
      };
  
      await this.docClient.delete(params).promise();
      logger.info('Deleted Todo item with Id: ', todoId)
  
      return;
    // } catch (error) {
    //   logger.error('Error Deleting Todo item', { error: error.message })
    // }
  }
  
  async createAttachmentPresignedUrl(imageId: string): Promise<String> {
    //try {
      return s3.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: imageId,
        Expires: this.urlExpiration
      })
    // } catch (error) {
    //   logger.error('Error creating Presigned Url ', { error: error.message })
    // }
  }
  
}
 

// function createDynamoDBClient() {
//   if (process.env.IS_OFFLINE) {
//     console.log('Creating a local DynamoDB instance')
//     return new XAWS.DynamoDB.DocumentClient({
//       region: 'localhost',
//       endpoint: 'http://localhost:8000'
//     })
//   }

//   return new XAWS.DynamoDB.DocumentClient()
// }
