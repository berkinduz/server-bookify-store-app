import { Context, SQSEvent } from "aws-lambda";
import { ProductService } from "src/core/services/products.service";
import * as AWS from "aws-sdk";
const productService = new ProductService();
const sns = new AWS.SNS();

export const catalogBatchProcess = async (event: SQSEvent, _: Context) => {
  const message = {
    Message: "A new product has been created.",
    TopicArn: "arn:aws:sns:us-east-1:447998169571:createProductTopic",
  };

  try {
    let createdProducts = [];
    for (const record of event.Records) {
      let messageBody;
      try {
        messageBody = JSON.parse(record.body);
      } catch (err) {
        console.log("Error while parsing message", err);
      }

      if (typeof messageBody == "object") {
        const product = await productService.createWithStocks({
          ...messageBody,
          stock: {
            count: messageBody.stock,
          },
        });

        createdProducts.push(product.data);
      }
    }

    if (createdProducts.length) {
      try {
        await sns.publish(message).promise();
        console.log("Published event to SNS topic");
      } catch (error) {
        console.error("Error publishing event to SNS:", error);
      }
      createdProducts = [];
    }
    console.log("SQS processing complete.");
  } catch (error) {
    console.error("Error processing SQS messages", error);
    throw error;
  }
};

export const main = catalogBatchProcess;
