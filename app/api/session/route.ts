import Anthropic from '@anthropic-ai/sdk';
import type { SessionApiRequest, SessionApiResponse } from '@/types/session';
import { getProspectPrompt, buildConversationHistory } from '@/lib/prompts';
import { getPersonaById } from '@/lib/personas';

export const maxDuration = 30;

const SESSION_COMPLETE_TAG = '[SESSION_COMPLETE]';

const anthropic = new Anthropic();

export async function POST(request: Request): Promise<Response> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set');
    return Response.json(
      { error: 'Server configuration error: missing API key' },
      { status: 500 },
    );
  }

  const body = (await request.json()) as SessionApiRequest;
  const { messages, scenario, scenarioContext, personaId, round, mode = 'objection', discoveryLayers } = body;

  if (!scenario || !personaId || !round || !messages) {
    return Response.json(
      { error: 'Missing required fields: messages, scenario, personaId, round' },
      { status: 400 },
    );
  }

  const persona = getPersonaById(personaId);
  if (!persona) {
    return Response.json(
      { error: `Unknown persona: ${personaId}` },
      { status: 400 },
    );
  }

  try {
    const conversationHistory = buildConversationHistory(messages);

    const result = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system: getProspectPrompt(mode, scenario, scenarioContext, persona, round, discoveryLayers),
      messages: conversationHistory,
    });

    const textBlock = result.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return Response.json(
        { error: 'No text response from Claude' },
        { status: 502 },
      );
    }

    const rawText = textBlock.text;
    const isComplete = rawText.includes(SESSION_COMPLETE_TAG);
    const response = rawText.replace(SESSION_COMPLETE_TAG, '').trim();

    const responseBody: SessionApiResponse = { response, isComplete };
    return Response.json(responseBody);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error calling Claude API';
    console.error('Session API error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
