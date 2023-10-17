import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { ProductService } from "src/core/services/products.service";
import schema from "./schema";
import { convertServiceResponseToRecord } from "src/core/util/data.util";
import { Product } from "src/core/types";

const productService = new ProductService();

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const body = event.body as unknown as Product;

  if (!body) {
    return formatJSONResponse(
      {
        data: null,
        message: "Please provide valid product data",
      },
      400
    );
  }

  const productResponse = await productService.createWithStocks(body);

  if (!productResponse.success) {
    return formatJSONResponse(
      convertServiceResponseToRecord(productResponse),
      productResponse.error ? 500 : 400
    );
  }

  return formatJSONResponse(
    convertServiceResponseToRecord(productResponse),
    201
  );
};

export const main = middyfy(createProduct);
