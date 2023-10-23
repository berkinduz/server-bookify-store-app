import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import schema from "./schema";

const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const csv = require("csv-parser");

const importFileParser:
  | ValidatedEventAPIGatewayProxyEvent<typeof schema>
  | any = async (event: any) => {
  const records = [];

  event.Records.forEach(async (record) => {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;

    const s3Stream = s3
      .getObject({ Bucket: bucket, Key: key })
      .createReadStream();

    s3Stream
      .pipe(csv())
      .on("data", (data) => {
        records.push(data);
      })
      .on("end", () => {
        console.log("Parsed CSV Records:", records);
      });
  });
};

export const main = importFileParser;
