import { generateUID } from "./generateUid.util";

export function convertCsvProductToObject(csvData: any) {
  const propertyNames = ["title", "description", "price", "stock"];

  if (Object.keys(csvData || {}).length !== propertyNames.length) {
    throw new Error("Csv object has missing properties.");
  }
  const newObj = {};
  propertyNames.forEach((propertyName, index) => {
    // @ts-ignore
    newObj[propertyName] = csvData[index];
  });

  // @ts-ignore
  newObj["id"] = generateUID();
  return newObj;
}
