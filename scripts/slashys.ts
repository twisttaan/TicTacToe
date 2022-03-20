import { ApplicationCommandDataResolvable, Client, Intents } from "discord.js";
import "dotenv/config";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const slashys: ApplicationCommandDataResolvable[] = [
  {
    name: "invite",
    description: "Invite me to your own server",
  },
  {
    name: "tictactoe",
    description: "Start a game of TicTacToe",
    options: [
      {
        name: "opponent",
        type: "USER",
        description: "The opponent to play against",
        required: false,
      },
    ],
  },
];

client.once("ready", async () => {
  if (process.env.GUILD) {
    client.guilds.fetch(process.env.GUILD).then(async (guild) => {
      if (guild) {
        console.log("Registering slashys...");
        await guild.commands
          .set(slashys)
          .then(() => {
            console.log("Slashys registered!");
          })
          .catch(console.error);
      } else {
        console.log("Could not find guild!");
      }
    });
  } else {
    console.log("No guild specified!");
    console.log("Registering global slashys...");
    await client.application?.commands
      .set(slashys)
      .then(() => {
        console.log("Global slashys registered!");
      })
      .catch(console.error);
  }
});

client.login();
