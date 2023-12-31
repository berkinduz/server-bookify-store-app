export const formatJSONResponse = (
  response: Record<string, unknown>,
  statusCode = 200
) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(response),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT",
    },
    authorizer: {
      arn: "arn:aws:lambda:us-east-1:447998169571:function:authorization-service-dev-basicAuthorizer",
      name: "basicAuthorizer",
      resultTtlInSeconds: 0,
      identitySource: "method.request.header.Authorization",
      type: "token",
    },
  };
};
