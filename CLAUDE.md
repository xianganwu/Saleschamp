# SalesChamp
**AI-Powered Objection Handling Practice for Red Hat AAP Sales Specialists**

---

## Project Vision

SalesChamp is a voice-enabled objection handling practice app where Red Hat Sales Specialists sharpen their competitive positioning skills for **Ansible Automation Platform (AAP)**. The rep selects a competitive scenario, chooses a prospect persona, and goes head-to-head with an AI-simulated prospect across 3 rounds of realistic sales conversation. At the end, an AI Coach delivers targeted feedback on technique, accuracy, and persuasiveness.

The core goal: build *muscle memory* for handling the toughest objections in real customer conversations. Every rep should walk away feeling more confident and better prepared for competitive deals.

**Inspiration:** Flight simulator for sales calls. Low-stakes practice, high-fidelity scenarios.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + CSS variables |
| Animation | Framer Motion |
| State | Zustand |
| AI | Anthropic API (`claude-sonnet-4-6`) |
| Voice In | Web Speech API (`SpeechRecognition`) |
| Voice Out | Web Speech API (`SpeechSynthesis`) |
| Deployment | Vercel |

---

## Project Structure

```
sales-champ/
├── app/
│   ├── layout.tsx              # Root layout, fonts (Inter, JetBrains Mono)
│   ├── globals.css             # Tailwind + CSS theme variables
│   ├── page.tsx                # Home / scenario selector screen
│   ├── session/
│   │   └── page.tsx            # Main sparring arena (Begin Session + voice/text)
│   ├── results/
│   │   └── page.tsx            # Feedback + scorecard screen
│   └── api/
│       ├── session/route.ts    # Prospect response API (Claude)
│       └── feedback/route.ts   # Coach feedback API (Claude)
├── components/
│   ├── ui/
│   │   └── Button.tsx          # Reusable animated button (Framer Motion)
│   ├── session/
│   │   ├── ProspectAvatar.tsx  # Animated prospect persona with speaking/thinking states
│   │   ├── VoiceButton.tsx     # Mic button + text input with responsive mobile layout
│   │   ├── TranscriptBubble.tsx # Chat-style transcript bubbles (left/right aligned)
│   │   └── RoundIndicator.tsx  # Shows current round with animated dots
│   └── home/
│       ├── ScenarioGrid.tsx    # Grid of selectable scenarios by category
│       ├── ScenarioCard.tsx    # Individual scenario card with selection state
│       └── PersonaSelector.tsx # Choose prospect persona (3 personas)
├── lib/
│   ├── session-engine.ts       # Client-side API caller with retry logic
│   ├── scenarios.ts            # Scenario bank with categories
│   ├── personas.ts             # 3 prospect persona definitions
│   ├── store.ts                # Zustand session state store
│   ├── prompts.ts              # Claude system prompts (prospect + coach)
│   └── sounds.ts               # Web Audio API synthesized sound effects (ding, whoosh)
├── hooks/
│   ├── useSpeechRecognition.ts # Voice input hook (Web Speech API)
│   ├── useSpeechSynthesis.ts   # Voice output hook with Chrome workarounds
│   └── useSession.ts           # Main session orchestration hook
├── types/
│   └── session.ts              # All TypeScript types
└── scripts/
    └── simulate.ts             # CLI simulation for testing without voice
```

---

## Core User Flow

```
HOME SCREEN
  -> Browse scenario grid (organized by competitive category)
  -> Click a scenario card
  -> Choose prospect persona (3 buyer types)
  -> "Start Session" button

BEGIN SESSION SCREEN
  -> "Begin Session" button (required for user gesture to enable TTS)
  -> Optional "Test Audio" diagnostic button

SPARRING SESSION
  -> Prospect introduces themselves (TTS + transcript bubble)
  -> Round 1 (Opening): Rep responds via voice or text -> Prospect pushes back (TTS)
  -> Round 2 (Deep Dive): Rep goes deeper -> Prospect challenges further (TTS)
  -> Round 3 (Close): Rep delivers final pitch -> Prospect gives final reaction (TTS)
  -> "See Your Scorecard" button

RESULTS SCREEN
  -> Star rating (average of 5 dimensions)
  -> Score bars for each dimension (1-5)
  -> Two specific strengths identified
  -> One targeted improvement with example phrasing
  -> Overall readiness summary
  -> Expandable full conversation transcript
  -> "Run Again" (same scenario) or "New Scenario"
```

---

## Platform Support

### Desktop (Full Experience)
- **Chrome / Edge**: Full voice input + output. Recommended browser.
- **Firefox**: No Web Speech API support. Text-only input, TTS may be limited.
- **Safari**: Text-only input. TTS works but `SpeechRecognition` is unsupported.

### Mobile (Supported)
- **Android Chrome**: Full voice input + output. Same experience as desktop Chrome.
- **iOS Safari / iOS Chrome**: Text-only input. `SpeechRecognition` is not available on any iOS browser (WebKit limitation). `SpeechSynthesis` works but requires a user gesture per `speak()` call.

### Responsive Design
All pages are fully responsive with mobile-first breakpoints:
- **Home page**: Scenario grid stacks to single column on mobile (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- **Session page**: Compact header, smaller mic button on mobile (`56px` vs `80px` desktop), text input always available alongside mic
- **Results page**: Score bars and action buttons stack vertically on mobile (`flex-col sm:flex-row`)
- **VoiceButton**: Responsive sizing throughout; text input shown alongside mic when not recording, so users can always type regardless of voice support
- All interactive elements meet 44x44px minimum touch targets
- Uses `h-dvh` / `min-h-dvh` for proper mobile viewport handling (accounts for browser chrome)

### Browser Compatibility Notices
- Home page shows a dismissible banner when `SpeechRecognition` is unavailable
- Session page shows a banner when voice is unavailable, with text input as fallback
- The app never blocks usage -- text input is always available as a fallback

---

## Scenario Bank

Scenarios are organized by competitive category. Each represents a real objection AAP sales specialists encounter in the field.

### vs. Upstream / Open Source (3 scenarios)
1. "Ansible CLI is free -- why would we pay for AAP?"
2. "We're running AWX in production and it does everything we need."
3. "We don't need enterprise support -- our team handles open source just fine."

### vs. Competitive Tooling (4 scenarios)
4. "We standardized on Terraform for all our infrastructure automation."
5. "We have Puppet and it works fine for configuration management."
6. "Our cloud provider's native tools handle everything."
7. "ServiceNow already handles our IT automation and ITSM workflows."

### Value & Business Justification (3 scenarios)
8. "The subscription cost is too high -- we can't justify the budget."
9. "We're early in our automation journey -- we're not ready for a platform."
10. "We can't show ROI on automation to our leadership."

### Technical & Architecture (5 scenarios)
11. "We're moving everything to Kubernetes -- shouldn't we use K8s-native tooling?"
12. "Ansible is too slow for our scale -- we've had performance issues."
13. "Our security team has concerns about agentless SSH-based automation."
14. "We just need a job scheduler, not a whole automation platform."
15. "AI-generated automation is unreliable -- we don't trust Lightspeed for production."

---

## Prospect Personas

Three distinct buyer archetypes. Each changes how the AI argues during sessions.

### Morgan Chen -- VP of Infrastructure
- **Role:** Budget holder, reports to CIO
- **Style:** Data-driven, bottom-line focused, slightly impatient
- **Hot buttons:** Cost, ROI, headcount efficiency, risk to uptime
- **Convinced by:** Hard numbers, TCO comparisons, customer case studies, risk framing
- **Voice:** pitch 0.95, rate 1.1 (slightly fast -- impatient executive)

### Jamie Torres -- Senior Platform Engineer
- **Role:** Technical evaluator, open source contributor
- **Style:** Technically deep, community-oriented, allergic to marketing speak
- **Hot buttons:** Technical merit, open source integrity, engineering velocity, no vendor lock-in
- **Convinced by:** Honest technical differentiation, upstream contribution record, architecture specifics
- **Voice:** pitch 1.0, rate 0.95 (measured, thoughtful engineer)

### Sam Okafor -- CISO
- **Role:** Owns security and compliance posture
- **Style:** Methodical, compliance-focused, zero-trust mindset
- **Hot buttons:** Attack surface, credential management, audit trails, regulatory compliance
- **Convinced by:** FIPS certifications, SOC 2 readiness, RBAC details, credential isolation, CVE response SLAs
- **Voice:** pitch 0.85, rate 0.95 (deep, precise)

---

## Voice Implementation

### Speech Recognition (`hooks/useSpeechRecognition.ts`)
- Checks for `SpeechRecognition` or `webkitSpeechRecognition` at init
- `continuous: true`, `interimResults: true` for live transcript display
- 3.5s silence timeout auto-stops recording
- Cleans up recognition instance on unmount
- Returns `isSupported` flag used to toggle voice/text-only UI modes

### Speech Synthesis (`hooks/useSpeechSynthesis.ts`)

This hook has extensive workarounds for Chrome/macOS TTS bugs:

**Sentence splitting:**
```typescript
// Split on sentence-ending punctuation followed by whitespace.
// Uses capture group -- NOT lookbehind (Safari < 16.4 throws SyntaxError on lookbehind)
const parts = text.split(/([.!?])\s+/);
```

**Chrome/macOS keepalive workaround:**
Chrome delegates TTS to macOS `AVSpeechSynthesizer`, which can hang without producing audio or firing `onend`. The fix is a periodic `pause()/resume()`:
```typescript
const keepAlive = setInterval(() => {
  if (!window.speechSynthesis.speaking) { clearInterval(keepAlive); return; }
  speechSynthesis.pause();
  speechSynthesis.resume();
}, 3_000);
```

**Timeout guards (never let TTS hang the session):**
- 15s global timeout across all sentences
- 8s per-sentence timeout (skips to next sentence if one hangs)
- `settled` boolean guard prevents double-resolution of the Promise

**Cancel/speak race condition:**
```typescript
// Only delay after cancel() if speech was actually playing.
// Otherwise call speak() immediately to preserve user gesture context.
if (wasSpeaking) {
  setTimeout(speakNext, 50);
} else {
  speakNext();
}
```

**Audio diagnostic (`testAudio`):**
Exposed via the session hook for a "Test Audio" button on the Begin Session screen. Returns voice count, voice names, and pass/fail status. Helps users diagnose TTS issues before starting a session.

### User Gesture Requirement
`speechSynthesis.speak()` requires a user gesture in Chrome. The session page uses a "Begin Session" button click to trigger the first `speak()` call. This replaced an earlier `useEffect`-based auto-start that broke TTS because it lacked gesture context.

### Turn-Taking State Machine
```
IDLE -> (Begin Session clicked)
  -> PROSPECT (intro TTS plays, transcript bubble shown)
    -> REP (mic enabled OR text input, "Your turn" indicator)
      -> PROCESSING (spinner, API call to Claude)
        -> PROSPECT (response TTS plays)
          -> REP (loop, round advances)
            -> FEEDBACK (after round 3, "See Your Scorecard")
```

---

## Session Orchestration (`hooks/useSession.ts`)

Key behaviors:
- `startSession`: Builds intro script from persona name/title, adds it as a transcript entry (so the intro is visible even if TTS fails), then speaks it via TTS
- `submitRepArgument`: Adds rep entry to transcript, calls Claude API, adds prospect response to transcript, plays TTS, advances round or triggers feedback
- `playProspectResponse`: Speaks prospect text, catches TTS errors non-fatally, then either advances to next round or calls feedback API
- `voiceSupported`: True only when both `SpeechRecognition` and `SpeechSynthesis` are available
- Sound effects: "ding" when it's the rep's turn, "whoosh" when prospect responds

---

## Claude API -- System Prompts

### Prospect Prompt (`lib/prompts.ts`)
- Receives persona details, scenario, context, and current round number
- Round 3 includes `[SESSION_COMPLETE]` tag instruction
- Keeps responses to 3-5 sentences
- Persona stays in character throughout
- References realistic environment details

### Coach Feedback Prompt (`lib/prompts.ts`)
- Receives formatted transcript with round labels
- Scores 5 dimensions (1-5 each): Objection Acknowledgment, Value Articulation, Competitive Accuracy, Discovery & Listening, Conversation Advancement
- Returns structured format: `SCORES: [n,n,n,n,n]`, `STRENGTHS:`, `IMPROVE:`, `OVERALL:`
- Fallback parsing in `app/api/feedback/route.ts` handles deviations from format

---

## API Routes

### `POST /api/session`
- Body: `{ messages, scenario, scenarioContext, personaId, round }`
- Returns: `{ response: string, isComplete: boolean }`
- Model: `claude-sonnet-4-6`, max_tokens: 200
- `isComplete` derived from `[SESSION_COMPLETE]` tag presence
- `maxDuration: 30` (Vercel serverless timeout)

### `POST /api/feedback`
- Body: `{ transcript, scenario, personaId }`
- Returns: `{ scores: number[], strengths: string[], improvement: string, overall: string }`
- Model: `claude-sonnet-4-6`, max_tokens: 350
- Regex-based parsing with fallback defaults for each field

### Client-side (`lib/session-engine.ts`)
- `fetchWithRetry`: 2 retries with exponential backoff (500ms, 1000ms)
- 4xx errors are not retried (client errors)
- 5xx and network errors are retried

---

## State Management (Zustand -- `lib/store.ts`)

```typescript
interface SessionState {
  scenario: Scenario | null;
  persona: Persona | null;
  currentRound: number;    // 1-3
  maxRounds: 3;
  turnState: TurnState;    // 'idle' | 'rep' | 'processing' | 'prospect' | 'feedback'
  transcript: readonly SessionEntry[];

  setScenario: (scenario: Scenario) => void;
  setPersona: (persona: Persona) => void;
  addTranscriptEntry: (entry: SessionEntry) => void;
  advanceRound: () => void;
  setTurnState: (state: TurnState) => void;
  resetSession: () => void;
}

interface SessionEntry {
  speaker: 'rep' | 'prospect';
  text: string;
  round: number;
  timestamp: Date;
}

type PersonaId = 'morgan_chen' | 'jamie_torres' | 'sam_okafor';
```

---

## UI/UX Design

### Color Palette
```css
--color-primary: #EE0000;       /* Red Hat red -- CTAs and accents */
--color-secondary: #4394E5;     /* Professional blue -- trust, prospect bubbles */
--color-accent: #F0AB00;        /* Warm amber -- highlights, mid scores */
--color-dark: #151515;          /* Near-black -- primary background */
--color-surface: #1E1E1E;       /* Card backgrounds, elevated surfaces */
--color-surface-light: #2D2D2D; /* Hover states, secondary surfaces */
--color-success: #3E8635;       /* Positive scores, strengths */
--color-danger: #C9190B;        /* Low scores, recording state */
```

### Typography
- Headings & body: `Inter` -- clean, professional, highly legible
- Monospace (scores): `JetBrains Mono` -- technical credibility
- Loaded via `next/font/google` in `layout.tsx`

### Animation (Framer Motion)
- Spring physics with moderate damping (professional, not bouncy)
- ProspectAvatar: gentle pulse when speaking, glow ring, animated sound bars
- VoiceButton: ripple rings when recording/ready, spinner when processing
- TranscriptBubble: slide in from left (prospect) or right (rep)
- Score bars: staggered fill animation on results page
- `prefers-reduced-motion` respected via CSS in `globals.css`

### Sound Effects (`lib/sounds.ts`)
- Synthesized via Web Audio API (no audio files needed)
- "ding" (440-880Hz, 150ms): signals rep's turn
- "whoosh" (600-200Hz, 200ms): prospect response incoming
- Failures are never fatal (wrapped in try/catch)

---

## Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=your_key_here
```

---

## Key Constraints & Gotchas

1. **Web Speech API browser support** -- `SpeechRecognition` is Chrome/Edge only. iOS has no `SpeechRecognition` on any browser (WebKit limitation). Always show text input as fallback.
2. **Chrome TTS hangs on macOS** -- `speechSynthesis.speak()` can accept utterances but `onend` never fires. The `pause()/resume()` keepalive every 3s is essential. Without it, sessions freeze at "Prospect is Speaking".
3. **Lookbehind regex crashes Safari** -- `(?<=...)` throws `SyntaxError` in Safari < 16.4. Use capture group splits instead.
4. **TTS requires user gesture in Chrome** -- Never call `speechSynthesis.speak()` from `useEffect` after navigation. The "Begin Session" button provides the gesture context.
5. **Long utterances silently dropped** -- Chrome drops long `SpeechSynthesisUtterance` texts. Always split into sentences.
6. **Cancel/speak race in Chrome** -- `cancel()` immediately before `speak()` drops the utterance. Only add a 50ms delay if speech was actually playing.
7. **Voices load asynchronously** -- Wait for `speechSynthesis.onvoiceschanged`. The hook also does a sync `getVoices()` fallback before speaking.
8. **Never run STT and TTS simultaneously** -- Creates echo feedback. Turn-taking state machine strictly enforces this.
9. **Claude API calls go server-side** -- Never expose the API key in client code. Routes are in `app/api/`.
10. **Conversation history passed on every API call** -- Claude has no memory between requests.
11. **TTS Promises must have timeouts** -- Never let TTS hang the session. Global 15s timeout + 8s per-sentence timeout ensure the session always continues.
12. **Intro must be in transcript** -- The prospect's intro is added as a `SessionEntry` before TTS plays. If TTS fails, the user can still read the opening.
13. **Score parsing needs fallbacks** -- The structured feedback format may occasionally deviate. Each parse function has a sensible default.
14. **Competitive claims must be accurate** -- The AI must make factual claims about AAP and competitors. The system prompt emphasizes this.
15. **iOS TTS per-call gesture** -- On iOS, each `speechSynthesis.speak()` needs a user gesture. The current architecture (button click triggers session start) satisfies the first call, but mid-session TTS may require additional handling on iOS.

---

## AAP Knowledge Reference

### Core AAP Components
- **Automation Controller** (formerly Ansible Tower) -- RBAC, workflows, scheduling, audit trails, API, credential management
- **Automation Mesh** -- scalable, resilient execution plane; hop nodes and execution nodes across network zones
- **Event-Driven Ansible (EDA)** -- event-driven automation for auto-remediation
- **Automation Hub** -- certified content collections, private hub for internal content
- **Execution Environments** -- containerized, portable automation runtime
- **Ansible Lightspeed with IBM watsonx Code Assistant** -- AI-powered content creation

### Competitive Positioning Summary
| Competitor | Relationship | Key Message |
|-----------|-------------|-------------|
| Ansible CLI | Upstream | AAP adds governance, scale, and security around the Ansible language |
| AWX | Upstream of Controller | AWX is one component without support; AAP is a complete platform |
| Terraform | Complementary | Terraform = provisioning (Day 0/1); Ansible = configuration + operations (Day 1/2) |
| Puppet/Chef | Alternative | Agentless, YAML, broader scope, stronger community momentum |
| Cloud-native tools | Alternative | Multi-cloud consistency, no vendor lock-in, hybrid/edge coverage |
| ServiceNow | Complementary | AAP as execution engine; deeper infra automation; edge execution |

---

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint check
npm run type-check   # TypeScript check (if configured)
vercel --prod        # Deploy to production
```
