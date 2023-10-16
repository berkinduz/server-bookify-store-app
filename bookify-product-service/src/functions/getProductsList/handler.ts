import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";

import schema from "./schema";

import { middyfy } from "@libs/lambda";
import { products } from "mock-products";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  return formatJSONResponse({
    data: products,
    event,
  });
};

export const main = middyfy(getProductsList);
