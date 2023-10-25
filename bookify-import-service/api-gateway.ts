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
  };
};
