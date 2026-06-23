const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim() || '';
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL?.trim() || 'https://api.openai.com/v1';
const AI_TIMEOUT_MS = clampNumber(process.env.AI_TIMEOUT_MS, 10_000, 120_000, 30_000);

export function isAiApiConfigured() {
  return Boolean(OPENAI_API_KEY);
}

export async function generateAiTicketReply({
  model,
  instructions,
  prompt,
  maxOutputTokens = 450,
  userId = 'discord-user',
}) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no está configurada en .env');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(`${OPENAI_BASE_URL}/responses`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        instructions,
        input: prompt,
        max_output_tokens: clampNumber(maxOutputTokens, 80, 1200, 450),
        truncation: 'auto',
        store: false,
        safety_identifier: String(userId).slice(0, 128),
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.error?.message || `${response.status} ${response.statusText}`;
      throw new Error(`OpenAI API error: ${message}`);
    }

    if (data?.error) {
      throw new Error(`OpenAI API error: ${data.error.message || data.error.code || 'error desconocido'}`);
    }

    const outputText = extractOutputText(data);
    if (!outputText) {
      const reason = data?.incomplete_details?.reason ? ` (${data.incomplete_details.reason})` : '';
      throw new Error(`La IA no devolvió texto${reason}`);
    }

    return cleanDiscordReply(outputText);
  } finally {
    clearTimeout(timeout);
  }
}

function extractOutputText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const chunks = [];
  for (const item of data?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (typeof content?.text === 'string') chunks.push(content.text);
      if (typeof content?.output_text === 'string') chunks.push(content.output_text);
    }
  }

  return chunks.join('\n').trim();
}

function cleanDiscordReply(text) {
  return String(text ?? '')
    .replace(/@everyone/gi, '@ everyone')
    .replace(/@here/gi, '@ here')
    .trim()
    .slice(0, 1800);
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}
