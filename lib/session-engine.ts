import type {
  DiscoveryLayers,
  FeedbackApiResponse,
  PersonaId,
  SessionApiResponse,
  SessionEntry,
  SessionMode,
} from '@/types/session';

const MAX_RETRIES = 2;
const BASE_DELAY_MS = 500;

async function fetchWithRetry(
  url: string,
  body: unknown,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) return response;

      const errorData = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      const message = errorData?.error ?? `Request failed with status ${response.status}`;

      if (response.status >= 400 && response.status < 500) {
        throw new Error(message);
      }

      lastError = new Error(message);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError ?? new Error('Request failed after retries');
}

export async function callSessionAPI(
  messages: readonly SessionEntry[],
  scenario: string,
  scenarioContext: string,
  personaId: PersonaId,
  round: number,
  mode: SessionMode,
  discoveryLayers?: DiscoveryLayers,
): Promise<SessionApiResponse> {
  const response = await fetchWithRetry('/api/session', {
    messages,
    scenario,
    scenarioContext,
    personaId,
    round,
    mode,
    discoveryLayers,
  });

  return response.json() as Promise<SessionApiResponse>;
}

export async function callFeedbackAPI(
  transcript: readonly SessionEntry[],
  scenario: string,
  personaId: PersonaId,
  mode: SessionMode,
): Promise<FeedbackApiResponse> {
  const response = await fetchWithRetry('/api/feedback', {
    transcript,
    scenario,
    personaId,
    mode,
  });

  return response.json() as Promise<FeedbackApiResponse>;
}
