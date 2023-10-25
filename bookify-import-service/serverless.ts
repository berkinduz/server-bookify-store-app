import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "bookify-import-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: "arn:aws:s3:::bookify-import-bucket/*", // Replace with your S3 bucket ARN
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
    importProductsFile: {
      handler: "import-products-file.handler",
      events: [
        {
          http: {
            method: "get",
            path: "import",
            cors: {
              origins: ["*"],
              allowCredentials: true,
              methods: ["POST", "OPTIONS"] as (
                | "GET"
                | "POST"
                | "PUT"
                | "PATCH"
                | "OPTIONS"
                | "HEAD"
                | "DELETE"
                | "ANY"
              )[],
            },
          },
        },
      ],
    },
    importFileParser: {
      handler: "import-file-parser.handler",
      events: [
        {
          s3: {
            bucket: "bookify-import-bucket",
            event: "s3:ObjectCreated:*",
            rules: [
              {
                prefix: "uploaded/",
              },
            ],
          },
        },
      ],
    },
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
  resources: {},
};

module.exports = serverlessConfiguration;
