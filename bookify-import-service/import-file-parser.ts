import { Readable } from "stream";
import { convertCsvProductToObject } from "./data.util";

const csv = require("csv-parser");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const queueUrl =
  "https://sqs.us-east-1.amazonaws.com/447998169571/catalogItemsQueue";

module.exports.handler = async (event: any) => {
  console.log("Parsing csv file.");
  for (const record of event.Records) {
    console.log(record, "record");
    const s3Object = record.s3;
    console.log(s3Object, "s3object");
    const bucketName = s3Object.bucket.name;
    const objectKey = s3Object.object.key;

    console.log(`Processing S3 object: ${objectKey} in bucket: ${bucketName}`);

    const s3Response = await s3
      .getObject({ Bucket: bucketName, Key: objectKey })
      .promise();

    const s3Stream = new Readable();
    s3Stream._read = () => {}; // Define a dummy _read function

    s3Stream.push(s3Response.Body); // Push the S3 response body into the stream
    s3Stream.push(null); // Signal the end of the stream
    const results: any = [];

    s3Stream
      .pipe(csv({ headers: false, separator: "," }))
      .on("data", (data: any) => {
        results.push(data);

        console.log("SQS Send Started");
      })
      .on("end", () => {
        const mappedResults = results.map(
          (data: any) => convertCsvProductToObject(data) as any
        );

        mappedResults.forEach((product: any) => {
          const sqsParams = {
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(product),
          };

          sqs.sendMessage(sqsParams, (err: any, data: any) => {
            if (err) {
              console.error("Error while sending message:", err);
            } else {
              console.log("SQS Message sent successfully!", data);
            }
          });
        });
      });
  }
};
