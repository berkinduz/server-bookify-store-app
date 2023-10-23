import { MOCK_PRODUCTS } from "src/core/common/mock-products";
import { PRODUCT_TABLE_NAME, STOCK_TABLE_NAME } from "src/core/util/globals";

const AWS = require("aws-sdk");

const seedData = () => {
  AWS.config.update({ region: "us-east-1" });

  const client = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: "products",
    Select: "COUNT",
  };

  client.scan(params, (err, data) => {
    if (err) {
      console.error("Error scanning the table:", err);
    } else {
      const itemCount = data.Count;
      if (itemCount > 0) {
        console.log(`Table has ${itemCount} item(s).`);
      } else {
        dataSeeder(client);
      }
    }
  });
};

const dataSeeder = (client) => {
  const putRequestsProducts = MOCK_PRODUCTS.map((product) => ({
    PutRequest: {
      Item: { ...product },
    },
  }));

  const putRequestsStocks = MOCK_PRODUCTS.map((product) => ({
    PutRequest: {
      Item: {
        product_id: product.id,
        count: product.count,
      },
    },
  }));

  const params = {
    RequestItems: {
      [PRODUCT_TABLE_NAME]: putRequestsProducts,
      [STOCK_TABLE_NAME]: putRequestsStocks,
    },
  };

  client.batchWrite(params, (err, _) => {
    if (err) {
      console.error("Error performing bulk write:", err);
    } else {
      console.log("Bulk write successful");
    }
  });
};

export const main = seedData;
