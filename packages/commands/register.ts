import {
  REST,
  Routes,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import { parse } from "yaml";
import { readFileSync } from "fs";
import { config } from "dotenv";
import * as path from "path";

config();

const { DISCORD_TOKEN, APPLICATION_ID: CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error(
    "Missing required environment variables: DISCORD_TOKEN, CLIENT_ID"
  );
  process.exit(1);
}

async function registerCommands() {
  try {
    const yamlFile = readFileSync(
      path.join(__dirname, "/schema/commands.yaml"),
      "utf8"
    );
    const data = parse(yamlFile);

    if (!data.commands || !Array.isArray(data.commands)) {
      throw new Error(
        "Invalid commands.yaml format. Expected 'commands' array."
      );
    }

    const commands: RESTPostAPIApplicationCommandsJSONBody[] =
      data.commands.map((cmd) => ({
        name: cmd.name,
        description: cmd.description,
        options: cmd.options || [],
      }));

    const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    if (GUILD_ID) {
      const data = await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
      );
      console.log(
        `Successfully registered ${data} commands to guild ${GUILD_ID}.`
      );
    } else {
      const data = await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: commands,
      });
      console.log(`Successfully registered ${data} global commands.`);
    }
  } catch (error) {
    console.error("Error registering commands:", error);
  }
}

registerCommands();
