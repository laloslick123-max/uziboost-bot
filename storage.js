import { promises as fs } from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_PATH = path.join(DATA_DIR, 'settings.json');
const TICKETS_PATH = path.join(DATA_DIR, 'tickets.json');
const FAQS_PATH = path.join(DATA_DIR, 'faqs.json');
const CUSTOM_FAQS_PATH = path.join(DATA_DIR, 'customFaqs.json');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readJson(filePath, fallback) {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeJson(filePath, fallback);
      return structuredClone(fallback);
    }
    console.error(`No se pudo leer ${filePath}:`, error);
    return structuredClone(fallback);
  }
}

export async function writeJson(filePath, data) {
  await ensureDataDir();
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tempPath, filePath);
}

export async function getGuildSettings(guildId) {
  const settings = await readJson(SETTINGS_PATH, { guilds: {} });
  return settings.guilds[guildId] ?? {};
}

export async function patchGuildSettings(guildId, patch) {
  const settings = await readJson(SETTINGS_PATH, { guilds: {} });
  settings.guilds[guildId] = {
    ...(settings.guilds[guildId] ?? {}),
    ...patch,
  };
  await writeJson(SETTINGS_PATH, settings);
  return settings.guilds[guildId];
}

export async function getTicket(channelId) {
  const data = await readJson(TICKETS_PATH, { tickets: {} });
  return data.tickets[channelId] ?? null;
}

export async function saveTicket(channelId, ticket) {
  const data = await readJson(TICKETS_PATH, { tickets: {} });
  data.tickets[channelId] = {
    ...(data.tickets[channelId] ?? {}),
    ...ticket,
  };
  await writeJson(TICKETS_PATH, data);
  return data.tickets[channelId];
}

export async function findOpenTicketByUser(guildId, userId) {
  const data = await readJson(TICKETS_PATH, { tickets: {} });
  for (const [channelId, ticket] of Object.entries(data.tickets)) {
    if (ticket.guildId === guildId && ticket.userId === userId && ticket.status === 'open') {
      return { channelId, ...ticket };
    }
  }
  return null;
}

export async function listGuildTickets(guildId) {
  const data = await readJson(TICKETS_PATH, { tickets: {} });
  return Object.entries(data.tickets)
    .filter(([, ticket]) => ticket.guildId === guildId)
    .map(([channelId, ticket]) => ({ channelId, ...ticket }));
}

export async function getFaqs(guildId) {
  const defaults = await readJson(FAQS_PATH, []);
  const custom = await readJson(CUSTOM_FAQS_PATH, { guilds: {} });
  return [
    ...defaults,
    ...(custom.guilds[guildId] ?? []),
  ];
}

export async function addCustomFaq(guildId, faq) {
  const custom = await readJson(CUSTOM_FAQS_PATH, { guilds: {} });
  if (!custom.guilds[guildId]) custom.guilds[guildId] = [];
  custom.guilds[guildId].push(faq);
  await writeJson(CUSTOM_FAQS_PATH, custom);
  return faq;
}
