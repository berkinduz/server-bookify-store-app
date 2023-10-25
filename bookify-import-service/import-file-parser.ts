import { S3Event, S3Handler } from "aws-lambda";
import * as AWS from "aws-sdk";
import * as Papa from "papaparse";

const s3 = new AWS.S3();

export const handler: S3Handler = async (event: S3Event) => {
  for (const record of event.Records) {
    const s3Object = record.s3;
    const bucketName = s3Object.bucket.name;
    const objectKey = s3Object.object.key;

    console.log(`Processing S3 object: ${objectKey} in bucket: ${bucketName}`);

    // Use the S3 SDK to get the object
    const s3Response = await s3
      .getObject({ Bucket: bucketName, Key: objectKey })
      .promise();

    // Create a readable stream from the object's Body
    const s3Stream = s3Response.Body;

    // Parse the CSV using PapaParse
    Papa.parse(s3Stream as any, {
      header: true, // Assuming the first row is the header
      dynamicTyping: true, // Convert data types if possible
      complete: (results) => {
        const records = results.data;
        for (const row of records) {
          // Log each record to CloudWatch
          console.log("CSV Record:", row);
        }
      },
    });
  }
};
