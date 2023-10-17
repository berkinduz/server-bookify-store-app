export const getDatabaseConfiguration = (
  tableName: string,
  attributeDefinitions: {
    AttributeName: string;
    AttributeType: string;
  }[],
  keySchema: {
    AttributeName: string;
    KeyType: string;
  }[]
) => ({
  [tableName]: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: tableName,
      AttributeDefinitions: [...attributeDefinitions],
      KeySchema: [...keySchema],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  },
});
