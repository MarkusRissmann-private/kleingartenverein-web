import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || 'kleingartenverein-events';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  createdAt: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { httpMethod, body, pathParameters } = event;
  
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  };

  try {
    switch (httpMethod) {
      case 'OPTIONS':
        return { statusCode: 200, headers, body: '' };
      
      case 'GET':
        return await getEvents(headers);
      
      case 'POST':
        return await createEvent(JSON.parse(body || '{}'), headers);
      
      case 'PUT':
        return await updateEvent(
          pathParameters?.id || '', 
          JSON.parse(body || '{}'), 
          headers
        );
      
      case 'DELETE':
        return await deleteEvent(pathParameters?.id || '', headers);
      
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Unsupported method' })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      })
    };
  }
};

async function getEvents(headers: Record<string, string>): Promise<APIGatewayProxyResult> {
  const result = await dynamodb.send(new ScanCommand({ 
    TableName: TABLE_NAME 
  }));
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Items || [])
  };
}

async function createEvent(
  item: Partial<Event>, 
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const eventItem: Event = {
    id: Date.now().toString(),
    title: item.title || '',
    date: item.date || new Date().toLocaleDateString('de-DE'),
    time: item.time || '10:00',
    createdAt: new Date().toISOString()
  };
  
  await dynamodb.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: eventItem
  }));
  
  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(eventItem)
  };
}

async function updateEvent(
  id: string, 
  updates: Partial<Event>, 
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const result = await dynamodb.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set title = :title, #date = :date, #time = :time',
    ExpressionAttributeNames: {
      '#date': 'date',
      '#time': 'time'
    },
    ExpressionAttributeValues: {
      ':title': updates.title,
      ':date': updates.date,
      ':time': updates.time
    },
    ReturnValues: 'ALL_NEW'
  }));
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Attributes)
  };
}

async function deleteEvent(
  id: string, 
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  await dynamodb.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id }
  }));
  
  return {
    statusCode: 204,
    headers,
    body: ''
  };
}