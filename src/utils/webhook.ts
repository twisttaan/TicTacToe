import axios, { AxiosResponse } from "axios";
import { APIWebhook } from "discord-api-types/v9";

export async function reportToWebhook(
  error: string,
): Promise<AxiosResponse<APIWebhook>> {
  return await axios.post(
    `https://canary.discord.com/api/webhooks/955007137128529950/m6fOF6urzRGRhY_Yt12vLjc51U2b5IdN5Hv5Fy463GSMJzonr-Xwiq8H-yOLoR8QzU_9`,
    {
      content: error,
    },
  );
}
