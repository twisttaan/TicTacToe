import { handleRequest } from "./bot";
import { reportToWebhook } from "./utils/webhook";

addEventListener("fetch", (event) => {
  try {
    event.respondWith(handleRequest(event.request));
  } catch (err) {
    reportToWebhook("Caught exception: " + err);
  }
});
