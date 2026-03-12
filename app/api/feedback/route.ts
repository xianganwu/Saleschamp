import Anthropic from '@anthropic-ai/sdk';
import type { FeedbackApiRequest, FeedbackApiResponse } from '@/types/session';
import { COACH_FEEDBACK_PROMPT } from '@/lib/prompts';
import { getPersonaById } from '@/lib/personas';

export const maxDuration = 30;

const anthropic = new Anthropic();

function parseScores(text: string): number[] {
  const match = text.match(/SCORES:\s*\[([^\]]+)\]/);
  if (!match) return [3, 3, 3, 3, 3];
  const nums = match[1].split(',').map((s) => {
    const n = parseInt(s.trim(), 10);
    return isNaN(n) ? 3 : Math.max(1, Math.min(5, n));
  });
  while (nums.length < 5) nums.push(3);
  return nums.slice(0, 5);
}

function parseStrengths(text: string): string[] {
  const section = text.match(/STRENGTHS:\s*\n([\s\S]*?)(?=\nIMPROVE:)/);
  if (!section) return ['Good effort overall.', 'Kept the conversation going.'];
  const items = section[1]
    .split('\n')
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter((line) => line.length > 0);
  return items.length >= 2 ? items.slice(0, 2) : [...items, 'Kept the conversation going.'];
}

function parseImprovement(text: string): string {
  const section = text.match(/IMPROVE:\s*\n([\s\S]*?)(?=\nOVERALL:)/);
  if (!section) return 'Try to ask more discovery questions to understand the prospect\'s specific situation.';
  return section[1]
    .split('\n')
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter((line) => line.length > 0)
    .join(' ');
}

function parseOverall(text: string): string {
  const match = text.match(/OVERALL:\s*(.+)/);
  return match ? match[1].trim() : 'Continue practicing to build confidence with this scenario.';
}

export async function POST(request: Request): Promise<Response> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set');
    return Response.json(
      { error: 'Server configuration error: missing API key' },
      { status: 500 },
    );
  }

  const body = (await request.json()) as FeedbackApiRequest;
  const { transcript, scenario, personaId } = body;

  if (!transcript || transcript.length === 0 || !scenario || !personaId) {
    return Response.json(
      { error: 'Missing required fields: transcript, scenario, personaId' },
      { status: 400 },
    );
  }

  const persona = getPersonaById(personaId);
  const personaName = persona ? `${persona.name}, ${persona.title}` : personaId;

  try {
    const result = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 350,
      messages: [
        {
          role: 'user',
          content: COACH_FEEDBACK_PROMPT(transcript, scenario, personaName),
        },
      ],
    });

    const textBlock = result.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return Response.json(
        { error: 'No text response from Claude' },
        { status: 502 },
      );
    }

    const raw = textBlock.text.trim();

    const responseBody: FeedbackApiResponse = {
      scores: parseScores(raw),
      strengths: parseStrengths(raw),
      improvement: parseImprovement(raw),
      overall: parseOverall(raw),
    };
    return Response.json(responseBody);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error calling Claude API';
    console.error('Feedback API error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
