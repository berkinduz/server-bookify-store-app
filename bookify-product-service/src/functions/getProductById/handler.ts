import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";

import schema from "./schema";
import { products } from "mock-products";
import { middyfy } from "@libs/lambda";

const { DynamoDB } = require("aws-sdk");
const dynamoDB = new DynamoDB({ region: "us-east-1" }); // Uygulamanızın bölgesine göre değiştirin
const tableName = "ProductsList"; // DynamoDB tablo adınızı buraya giri

const getDBProductById = async (event) => {
  const productId = event.pathParameters.id; // API Gateway üzerinden gelen parametre

  try {
    const params = {
      TableName: tableName,
      Key: {
        ProductId: { S: productId }, // ProductId yerine tabloya uygun anahtar adını kullanın
      },
    };

    const result = await dynamoDB.getItem(params).promise();

    if (result.Item) {
      // Veri başarıyla alındı, bu nedenle bu veriyi işleyebilirsiniz
      const product = result.Item;
      return {
        statusCode: 200,
        body: JSON.stringify(product),
      };
    } else {
      console.log("Not Found.");
      return {
        statusCode: 404,
        body: "Book is Not Found.",
      };
    }
  } catch (error) {
    console.error("Error occured: :", error);
    return {
      statusCode: 500,
      body: "Error occured: :",
    };
  }
};

const getProductById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const { pathParameters } = event;
  const { productId } = pathParameters;
  const getProd = await getDBProductById(productId);

  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "ids query parameter is missing" }),
    };
  }

  const product = products.find((prod) => prod.id === productId);

  if (!product) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "product not fount with given id" }),
    };
  }

  return formatJSONResponse({
    data: product,
    getProd,
    event,
  });
};

export const main = middyfy(getProductById);
