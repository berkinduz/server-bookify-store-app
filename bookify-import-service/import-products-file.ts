import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { S3 } from "aws-sdk";

const s3 = new S3();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Extract the file name from the query parameters
    const fileName = event.queryStringParameters?.name;
    if (!fileName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing "name" parameter in the query string',
        }),
      };
    }

    // Generate a signed URL for uploading the file to S3
    const signedUrl = s3.getSignedUrl("putObject", {
      Bucket: "bookify-import-bucket",
      Key: `uploaded/${fileName}`,
      Expires: 60, // URL expiration time in seconds
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ signedUrl }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
