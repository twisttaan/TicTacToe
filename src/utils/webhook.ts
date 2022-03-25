import axios, { AxiosResponse } from "axios";
import { APIWebhook } from "discord-api-types/v9";

export async function reportToWebhook(
  error: string,
): Promise<AxiosResponse<APIWebhook>> {
  return await axios.post(
    process.env.ERROR_WEBHOOK
    {
      content: error,
    },
  );
}
