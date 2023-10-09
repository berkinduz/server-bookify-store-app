import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";

import schema from "./schema";
import { products } from "mock-products";
import { middyfy } from "@libs/lambda";

const getProductById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const { pathParameters } = event;
  const { productId } = pathParameters;

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
    event,
  });
};

export const main = middyfy(getProductById);
