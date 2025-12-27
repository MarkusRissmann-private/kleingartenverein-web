import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || 'kleingartenverein-news';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  content: string;
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
        return await getNews(headers);
      
      case 'POST':
        return await createNews(JSON.parse(body || '{}'), headers);
      
      case 'PUT':
        return await updateNews(
          pathParameters?.id || '', 
          JSON.parse(body || '{}'), 
          headers
        );
      
      case 'DELETE':
        return await deleteNews(pathParameters?.id || '', headers);
      
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

async function getNews(headers: Record<string, string>): Promise<APIGatewayProxyResult> {
  const result = await dynamodb.send(new ScanCommand({ 
    TableName: TABLE_NAME 
  }));
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Items || [])
  };
}

async function createNews(
  item: Partial<NewsItem>, 
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const newsItem: NewsItem = {
    id: Date.now().toString(),
    title: item.title || '',
    content: item.content || '',
    date: item.date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };
  
  await dynamodb.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: newsItem
  }));
  
  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(newsItem)
  };
}

async function updateNews(
  id: string, 
  updates: Partial<NewsItem>, 
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const result = await dynamodb.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set title = :title, content = :content, #date = :date',
    ExpressionAttributeNames: {
      '#date': 'date'
    },
    ExpressionAttributeValues: {
      ':title': updates.title,
      ':content': updates.content,
      ':date': updates.date
    },
    ReturnValues: 'ALL_NEW'
  }));
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Attributes)
  };
}

async function deleteNews(
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