import { handlerPath } from "@libs/handler-resolver";
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "products/create",
        cors: {
          origins: ["*"],
          allowCredentials: true,
          methods: ["POST", "OPTIONS"] as (
            | "GET"
            | "POST"
            | "PUT"
            | "PATCH"
            | "OPTIONS"
            | "HEAD"
            | "DELETE"
            | "ANY"
          )[],
        },
      },
    },
  ],
};
