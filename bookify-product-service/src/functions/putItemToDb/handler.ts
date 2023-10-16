import { products } from "mock-products";
const AWS = require("aws-sdk");

const putBooks = () => {
  AWS.config.update({ region: "us-east-1" });

  const documentClient = new AWS.DynamoDB.DocumentClient();

  console.log("Loading book data into DynamoDB");

  products.forEach(function (book) {
    const params = {
      TableName: "ProductsTable",
      Item: {
        id: book.id,
        title: book.title,
        price: book.price,
        count: book.count,
        description: book.description,
      },
    };

    documentClient.put(params, function (err, _data) {
      if (err) {
        console.error(
          "Can't add book. Darn. Well I guess Fernando needs to write better books."
        );
      } else {
        console.log("Succeeded adding an item for this song: ", book.title);
      }
    });
  });
};

export const main = putBooks;
