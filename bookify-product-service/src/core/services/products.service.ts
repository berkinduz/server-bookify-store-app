import { BaseService } from "src/core/services/base.service";
import { Product } from "src/core/types/product.i";
import { PRODUCT_TABLE_NAME } from "../util/globals";
import { ServiceResponse, Stock } from "../types";
import { cloneObject } from "../util/object.util";
import { StocksService } from "./stocks.service";

export class ProductService extends BaseService<Product> {
  stocksService = new StocksService();
  constructor() {
    super();
  }

  protected override tableName = PRODUCT_TABLE_NAME;
  getByIdWithStocks = (productId: string) =>
    new Promise<ServiceResponse<Product>>(async (resolve, _) => {
      const productResponse = await this.getById(productId);
      const stockParams: AWS.DynamoDB.DocumentClient.ScanInput = {
        TableName: "stocks",
        FilterExpression: "#productId = :productId",
        ExpressionAttributeNames: {
          "#productId": "product_id",
        },
        ExpressionAttributeValues: {
          ":productId": productId,
        },
      };

      if (productResponse.success) {
        this.client.scan(stockParams, (stockErr, stockData) => {
          if (!stockErr && stockData.Items && Array.isArray(stockData.Items)) {
            const productWithStocks = {
              ...productResponse.data,
              stock: stockData.Items[0] as Stock,
            };
            resolve({
              success: true,
              data: productWithStocks,
              message: `Product and associated stock data acquired for product ID: ${productId}`,
            });
          } else {
            resolve({
              success: true,
              data: productResponse.data,
              message: `Product data acquired, but no stock data found for product ID: ${productId}`,
            });
          }
        });
      } else {
        resolve(productResponse);
      }
    });

  createWithStocks = (product: Product) =>
    new Promise<ServiceResponse<Product>>(async (resolve, _) => {
      if (!product.stock) {
        resolve({
          success: false,
          data: null,
          message: "Please provide valid stock data",
        });
      }

      const productResponse = await this.create(
        cloneObject(product, ["stock"])
      );

      if (productResponse.success) {
        const stocks = await this.stocksService.create({
          ...product.stock,
          product_id: productResponse.data.id,
        });
        if (stocks.success) {
          resolve({
            data: {
              ...productResponse.data,
              stock: stocks.data,
            },
            success: true,
            message: "Product created with stock",
          });
        } else {
          resolve({
            error: stocks.error,
            success: false,
            message: "Error while creating product with stocks",
            data: null,
          });
        }
      } else {
        resolve(productResponse);
      }
    });
}
