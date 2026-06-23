import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { commands } from './commands.js';

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!TOKEN || !CLIENT_ID) {
  console.error('Faltan TOKEN o CLIENT_ID en tu archivo .env');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(TOKEN);
const body = commands.map((command) => command.toJSON());

try {
  if (GUILD_ID) {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body });
    console.log(`✅ Comandos instalados en el servidor ${GUILD_ID}.`);
  } else {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body });
    console.log('✅ Comandos globales instalados. Pueden tardar en aparecer.');
  }
} catch (error) {
  console.error('❌ Error instalando comandos:', error);
  process.exit(1);
}
