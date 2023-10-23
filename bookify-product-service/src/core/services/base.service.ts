import * as AWS from "aws-sdk";
import { ServiceResponse } from "src/core/types";
import { v4 as uuidv4 } from "uuid";

export class BaseService<T> {
  constructor(tableName) {
    this.tableName = tableName;
  }

  protected tableName = "";
  protected client = new AWS.DynamoDB.DocumentClient();
  protected db = new AWS.DynamoDB();

  getUniqueId = () => uuidv4();

  getById = (id: string) =>
    new Promise<ServiceResponse<T>>((resolve, _) => {
      const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: this.tableName,
        Key: {
          id: id,
        },
      };

      this.client.get(params, (err, data) => {
        if (err) {
          resolve({
            data: null,
            message: `Eror while obtaining data with id ${id}`,
            error: err,
            success: false,
          });
        } else {
          if (data.Item) {
            const singleData = data.Item as T;

            resolve({
              success: true,
              data: singleData,
              message: `Data found with id ${id}`,
            });
          } else {
            resolve({
              success: false,
              message: `There is no data found with id ${id}`,
              data: null,
            });
          }
        }
      });
    });

  getAll = () =>
    new Promise<ServiceResponse<T[]>>((resolve, _) => {
      const params: AWS.DynamoDB.DocumentClient.ScanInput = {
        TableName: this.tableName,
      };

      this.client.scan(params, (err, data) => {
        if (!err && data.Items && Array.isArray(data.Items)) {
          const dataArr: T[] = data.Items as T[];
          resolve({
            data: dataArr,
            message: "Data list acquired",
            success: true,
          });
        } else {
          resolve({
            success: false,
            data: [],
            message: `An internal server error occurred`,
            error: err,
          });
          console.error("Error scanning data list:", err);
        }
      });
    });

  create = (entry: T) =>
    new Promise<ServiceResponse<T>>((resolve, _) => {
      const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: this.tableName,
        Item: entry,
      };

      this.client.put(params, (err) => {
        if (err) {
          resolve({
            data: null,
            message: "Error while creating a new entry",
            error: err,
            success: false,
          });
        } else {
          resolve({
            success: true,
            data: entry,
            message: "Entry created successfully",
          });
        }
      });
    });

  convertToObject = <T = any>(a: AWS.DynamoDB.AttributeMap) => {
    return AWS.DynamoDB.Converter.unmarshall(a) as T;
  };
}
