import createProduct from "@functions/createProduct";
import getProductById from "@functions/getProductById";
import seedData from "@functions/seedData";
import type { AWS } from "@serverless/typescript";
import { PRODUCT_TABLE_NAME, STOCK_TABLE_NAME } from "src/core/util/globals";
import { getDatabaseConfiguration } from "src/core/util/resource.util";

const serverlessConfiguration: AWS = {
  service: "bookify-product-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:DescribeTable",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:BatchWriteItem",
        ],
        Resource: [
          "arn:aws:dynamodb:us-east-1:447998169571:table/products",
          "arn:aws:dynamodb:us-east-1:447998169571:table/stocks",
        ],
      },
    ],
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  // import the function via paths
  functions: {
    getProductList: {
      handler: "src/functions/getProductsList/handler.main",
      events: [
        {
          http: {
            method: "get",
            path: "products",
            cors: {
              origins: ["*"],
              allowCredentials: true,
              methods: ["ANY"],
            },
          },
        },
      ],
    },
    getProductById,
    seedData,
    createProduct,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      ...getDatabaseConfiguration(
        PRODUCT_TABLE_NAME,
        [
          {
            AttributeName: "id",
            AttributeType: "S",
          },
        ],
        [
          {
            AttributeName: "id",
            KeyType: "HASH",
          },
        ]
      ),
      ...getDatabaseConfiguration(
        STOCK_TABLE_NAME,
        [
          {
            AttributeName: "product_id",
            AttributeType: "S",
          },
        ],
        [
          {
            AttributeName: "product_id",
            KeyType: "HASH",
          },
        ]
      ),
    },
  },
};

module.exports = serverlessConfiguration;
