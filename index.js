const { Client, Intents } = require("discord.js");
const config = require("./config.json");
const play = require("./play.js");

const prefix = "!";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

client.once("ready", () => {
  console.log("Ready!");
});

client.login(config.BOT_TOKEN);

client.on("messageCreate", function (message) {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  if (command === "play") {
    play.run(message, args)
  }
});
