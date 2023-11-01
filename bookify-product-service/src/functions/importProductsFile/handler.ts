import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import schema from "./schema";

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const { name } = event.queryStringParameters;
    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Name parameter is required in the query string",
        }),
      };
    }

    // Create a pre-signed URL
    const s3Params = {
      Bucket: "bookify-uploaded",
      Key: `uploaded/${name}`,
      Expires: 3600, // URL expiration time in seconds
    };
    const importUrl = s3.getSignedUrl("putObject", s3Params);

    return {
      statusCode: 200,
      body: JSON.stringify({ importUrl }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

export const main = importProductsFile;
