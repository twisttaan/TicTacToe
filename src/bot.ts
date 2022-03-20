import { APIPingInteraction } from "discord-api-types/payloads/v9/_interactions/ping";
import {
  APIApplicationCommandInteraction,
  APIEmbed,
  APIInteractionResponse,
  APIMessageComponentButtonInteraction,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from "discord-api-types/v9";
import {
  newGame,
  playTurnFromInteraction,
  ticTacToeBoardToActionRow,
} from "./utils/boardUtils";
import { reportToWebhook } from "./utils/webhook";
import { verify } from "./verify";

export async function handleRequest(request: Request): Promise<Response> {
  if (
    !request.headers.get("X-Signature-Ed25519") ||
    !request.headers.get("X-Signature-Timestamp")
  )
    return Response.redirect("https://evie.pw");
  if (!(await verify(request))) return new Response("", { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (await request.json()) as any;

  if (raw.data.custom_id) {
    console.log(raw.data.custom_id);
    if (!raw.data.custom_id.startsWith("button"))
      return new Response("", { status: 401 });
    const interaction = raw as APIMessageComponentButtonInteraction;

    const turn = playTurnFromInteraction(interaction);
    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        components: ticTacToeBoardToActionRow(turn, interaction.data.custom_id),
      },
    });
  }

  const interaction = raw as
    | APIPingInteraction
    | APIApplicationCommandInteraction;

  reportToWebhook(`Got an interaction: ${interaction.data?.name}`);

  if (interaction.type === InteractionType.Ping)
    return respond({
      type: InteractionResponseType.Pong,
    });

  if (interaction.data.name === "invite")
    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Pong!",
        flags: MessageFlags.Ephemeral,
      },
    });

  if (interaction.data.name === "tictactoe") {
    const embed: APIEmbed = {
      description: "TicTacToe",
    };

    const game = newGame();

    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        embeds: [embed],
        components: game,
      },
    });
  }

  if (!interaction.data.resolved)
    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Please update your client to use this command.",
        flags: MessageFlags.Ephemeral,
      },
    });

  return respond({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: "It seems like this command does not exist.",
      flags: MessageFlags.Ephemeral,
    },
  });
}

const respond = (response: APIInteractionResponse) =>
  new Response(JSON.stringify(response), {
    headers: { "content-type": "application/json" },
  });
