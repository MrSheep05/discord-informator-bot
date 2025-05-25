import { REST, Routes } from "discord.js";
import { config } from "dotenv";

config();

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error(
    "Missing required environment variables: DISCORD_TOKEN, CLIENT_ID"
  );
  process.exit(1);
}

async function deregisterCommands() {
  try {
    const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

    console.log("Started removing application (/) commands.");

    if (GUILD_ID) {
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: [],
      });
      console.log(`Successfully removed all commands from guild ${GUILD_ID}.`);
    } else {
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });
      console.log("Successfully removed all global commands.");
    }
  } catch (error) {
    console.error("Error removing commands:", error);
  }
}

deregisterCommands();
