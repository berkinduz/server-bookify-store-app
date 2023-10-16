import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { products } from "mock-products";
import schema from "./schema";

import { middyfy } from "@libs/lambda";

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAllProducts() {
  const params = {
    TableName: "ProductsLists", // DynamoDB tablonuzun adını buraya ekleyin
  };

  try {
    const data = await dynamodb.scan(params).promise();
    if (data.Items) {
      return data.Items;
    } else {
      return []; // Herhangi bir ürün bulunamadı
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const books = getAllProducts()
    .then((products) => {
      return products;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return formatJSONResponse({
    data: products,
    books,
    event,
  });
};

export const main = middyfy(getProductsList);
