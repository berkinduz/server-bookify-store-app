import { formatJSONResponse } from "./api-gateway";

const { S3 } = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const s3 = new S3({ signatureVersion: "v4" });

module.exports.handler = async (event: any) => {
  const { queryStringParameters } = event;
  const { name } = queryStringParameters;

  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Name query parameter is required." }),
    };
  }

  const fileName = `uploaded/${uuidv4()}-${name}`;

  const params = {
    Bucket: "bookify-import-bucket",
    Key: fileName,
    Expires: 60, // URL expiration time in seconds
  };

  const signedUrl = s3.getSignedUrl("putObject", params);

  return formatJSONResponse({ signedUrl }, 200);
};
