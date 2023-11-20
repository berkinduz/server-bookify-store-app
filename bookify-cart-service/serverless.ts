const serverlessConfiguration = {
  service: 'bookify-cart-service',
  frameworkVersion: '3',
  plugins: ['serverless-offline', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      PG_HOST: process.env.PG_HOST,
      PG_PORT: process.env.PG_PORT,
      PG_USERNAME: process.env.PG_USERNAME,
      PG_PASSWORD: process.env.PG_PASSWORD,
      PG_DATABASE: process.env.PG_DATABASE,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: {
    main: {
      handler: 'dist/src/main.handler',
      events: [
        {
          http: {
            method: 'any',
            path: '{proxy+}',
          },
        },
      ],
    },
  },
  custom: {
    'serverless-offline': {
      noPrependStageInUrl: true,
    },
  },
};

module.exports = serverlessConfiguration;
