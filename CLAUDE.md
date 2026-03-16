# SalesChamp
**AI-Powered Sales Practice for Red Hat AAP Sales Specialists**

---

## Project Vision

SalesChamp is a voice-enabled sales practice app where Red Hat Sales Specialists sharpen their skills for **Ansible Automation Platform (AAP)** across three practice modes that mirror the real sales cycle:

1. **Elevator Pitch** (2 rounds) -- Deliver a compelling AAP value pitch and earn a follow-up meeting. Rep goes first.
2. **Discovery Call** (5 rounds) -- Uncover an existing Red Hat customer's automation needs through strategic questioning. Prospects have hidden information layers revealed by good questions.
3. **Objection Handling** (3 rounds) -- Handle tough competitive objections across 3 rounds of realistic pushback.

The rep selects a mode, picks a scenario, chooses a prospect persona, and goes head-to-head with an AI-simulated prospect. At the end, an AI Coach delivers targeted feedback scored on mode-specific dimensions.

The core goal: build *muscle memory* for the full sales cycle. Every rep should walk away feeling more confident and better prepared for competitive deals.

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
│       ├── ScenarioGrid.tsx    # Grid of selectable scenarios filtered by mode
│       ├── ScenarioCard.tsx    # Individual scenario card with selection state
│       ├── PersonaSelector.tsx # Choose prospect persona (3 personas)
│       └── ModeSelector.tsx    # Tab selector for practice mode (objection/pitch/discovery)
├── lib/
│   ├── session-engine.ts       # Client-side API caller with retry logic
│   ├── scenarios.ts            # Scenario bank: 14 objection + 5 pitch + 6 discovery scenarios
│   ├── personas.ts             # 3 prospect persona definitions with environment context
│   ├── recommendations.ts     # Post-session scenario + cross-mode recommendation engine
│   ├── mode-config.ts          # Mode definitions (rounds, dimensions, flow direction)
│   ├── store.ts                # Zustand session state store (mode-aware)
│   ├── prompts.ts              # Claude system prompts per mode (prospect + coach)
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
  -> Select practice mode: Elevator Pitch | Discovery Call | Objection Handling
  -> Browse scenario grid (filtered by selected mode)
  -> Click a scenario card
  -> Choose prospect persona (3 buyer types)
  -> "Start Session" button

BEGIN SESSION SCREEN
  -> 3 coaching tips specific to the selected scenario
  -> "Begin Session" button (required for user gesture to enable TTS)
  -> Optional "Test Audio" diagnostic button

SESSION (mode-specific flow)
  ELEVATOR PITCH (2 rounds, rep goes first):
    -> Context line shown in transcript
    -> Rep delivers pitch via voice or text
    -> Prospect reacts (interested/lukewarm/skeptical)
    -> Rep adjusts based on reaction
    -> Prospect gives final verdict (would they take a meeting?)
    -> "See Your Scorecard"

  DISCOVERY CALL (5 rounds, prospect goes first):
    -> Prospect gives brief surface-level intro (existing Red Hat customer)
    -> Rounds 1-4: Rep asks questions -> Prospect reveals info based on question quality
    -> Round 5: Rep summarizes and proposes next step -> Prospect gives impression
    -> "See Your Scorecard"

  OBJECTION HANDLING (3 rounds, prospect goes first):
    -> Prospect introduces themselves and states objection (TTS)
    -> Round 1 (Opening): Rep responds -> Prospect pushes back
    -> Round 2 (Deep Dive): Rep goes deeper -> Prospect challenges further
    -> Round 3 (Close): Rep delivers final pitch -> Prospect gives final reaction
    -> "See Your Scorecard"

RESULTS SCREEN
  -> Star rating (average of 5 mode-specific dimensions)
  -> Score bars for each dimension (1-5)
  -> Two specific strengths identified
  -> One targeted improvement with example phrasing
  -> Overall readiness summary
  -> Expandable full conversation transcript
  -> Recommended next scenario (within same mode) based on weakest dimension
  -> Cross-mode recommendation if score is low (e.g., "Try Discovery Call mode")
  -> "Practice This" / "Run Again" / "New Scenario"
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

25 total scenarios across 3 modes. Every scenario includes 3 coaching tips shown on the Begin Session screen.

### Objection Handling (14 scenarios)
Organized by competitive category. Each represents a real objection AAP sales specialists encounter.

**vs. Upstream / Open Source (3):** CLI is free, AWX in production, don't need enterprise support
**vs. Competitive Tooling (4):** Terraform standard, Puppet works, cloud-native tools, ServiceNow ITSM
**Value & Business Justification (3):** Cost too high, not ready for platform, can't show ROI
**Technical & Architecture (4):** Moving to K8s, Ansible too slow, SSH security concerns, just need scheduler

### Elevator Pitch (5 scenarios)
Each is a SITUATION where the rep must deliver a compelling AAP pitch. Rep speaks first.

1. Conference networking -- 60 seconds with a VP of Infra
2. Executive briefing opener -- CIO gave you 2 minutes
3. Cold call -- they picked up, you have 30 seconds
4. Partner referral -- CISO heard from a peer about AAP
5. Trade show follow-up -- they saw a competitor demo yesterday

### Discovery Call (6 scenarios)
All prospects are EXISTING Red Hat customers (RHEL/OpenShift, not AAP). Each has 3 hidden information layers (surface/mid/deep) revealed through question quality.

1. RHEL estate, 3,500 servers -- exploring automation
2. OpenShift customer, 12 clusters -- needs Day 2 ops
3. RHEL + OpenShift -- security team wants compliance automation
4. Large RHEL customer evaluating Terraform -- hasn't explored Ansible
5. OpenShift customer post-acquisition -- needs to standardize operations
6. RHEL customer running AWX informally -- exploring enterprise path

---

## Prospect Personas

Three distinct buyer archetypes. Each changes how the AI argues during sessions.

### Morgan Chen -- VP of Infrastructure
- **Role:** Budget holder, reports to CIO
- **Style:** Data-driven, bottom-line focused, slightly impatient
- **Hot buttons:** Cost, ROI, headcount efficiency, risk to uptime
- **Convinced by:** Hard numbers, TCO comparisons, customer case studies, risk framing
- **Environment:** Financial services, 5,200 servers across 3 data centers (NY/London/Singapore), 40 engineers, hybrid cloud (60/40), $2.1M automation spend, board-mandated 15% cost cut
- **Voice:** pitch 0.95, rate 1.1 (slightly fast -- impatient executive)

### Jamie Torres -- Senior Platform Engineer
- **Role:** Technical evaluator, open source contributor
- **Style:** Technically deep, community-oriented, allergic to marketing speak
- **Hot buttons:** Technical merit, open source integrity, engineering velocity, no vendor lock-in
- **Convinced by:** Honest technical differentiation, upstream contribution record, architecture specifics
- **Environment:** SaaS platform, 8,500 servers across AWS/GCP, 12-person platform team, 70% containerized, 30+ internal Ansible collections, 3,000+ daily automation jobs, burned by Oracle lock-in
- **Voice:** pitch 1.0, rate 0.95 (measured, thoughtful engineer)

### Sam Okafor -- CISO
- **Role:** Owns security and compliance posture
- **Style:** Methodical, compliance-focused, zero-trust mindset
- **Hot buttons:** Attack surface, credential management, audit trails, regulatory compliance
- **Convinced by:** FIPS certifications, SOC 2 readiness, RBAC details, credential isolation, CVE response SLAs
- **Environment:** Healthcare tech, 3,800 servers (on-prem colo + Azure Gov), HIPAA/SOC 2/FedRAMP audits, 15-person security team, zero-trust initiative, credential exposure incident 18 months ago, 90-day security review gate
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
Objection / Discovery mode:
  IDLE -> (Begin Session) -> PROSPECT (intro TTS) -> REP -> PROCESSING -> PROSPECT -> REP (loop) -> FEEDBACK

Pitch mode (rep goes first):
  IDLE -> (Begin Session) -> REP (context shown, ding plays) -> PROCESSING -> PROSPECT -> REP (loop) -> FEEDBACK

Round count varies by mode: 2 (pitch), 3 (objection), 5 (discovery)
```

---

## Session Orchestration (`hooks/useSession.ts`)

Mode-aware session hook that adapts flow based on `ModeConfig`:

- `startSession`: Reads mode from store. For pitch mode (repGoesFirst): shows context line in transcript, sets turn to 'rep', plays ding. For objection/discovery: builds intro script, speaks via TTS, then sets turn to 'rep'.
- `submitRepArgument`: Adds rep entry to transcript, calls Claude API with mode and discoveryLayers, adds prospect response, plays TTS, advances round or triggers feedback based on mode's maxRounds.
- `playProspectResponse`: Speaks prospect text, catches TTS errors non-fatally, then either advances to next round or calls feedback API with mode.
- `voiceSupported`: True only when both `SpeechRecognition` and `SpeechSynthesis` are available
- Sound effects: "ding" when it's the rep's turn, "whoosh" when prospect responds

---

## Claude API -- System Prompts

All prompts are in `lib/prompts.ts`. The `getProspectPrompt()` and `getCoachPrompt()` functions select the right prompt based on `SessionMode`.

### Objection Handling Prompts
- **Prospect:** Receives persona + environment, scenario, round (1-3). Final round includes `[SESSION_COMPLETE]` tag.
- **Coach:** Scores: Objection Acknowledgment, Value Articulation, Competitive Accuracy, Discovery & Listening, Conversation Advancement.

### Elevator Pitch Prompts
- **Prospect:** Receives the rep's pitch (rep goes first). Round 1: react honestly. Round 2: final verdict (would they take a meeting?).
- **Coach:** Scores: Hook & Opening, Persona Relevance, Clarity & Conciseness, Differentiation, Call-to-Action.

### Discovery Call Prompts
- **Prospect:** Existing Red Hat customer with 3 information layers (surface/mid/deep). Revelation rules based on question quality: yes/no questions get minimal answers, good open-ended questions unlock mid info, strategic contextual follow-ups unlock deep info. Round 5 includes `[SESSION_COMPLETE]`.
- **Coach:** Scores: Question Quality, Active Listening, Need Identification, Qualification Depth, Next-Step Relevance.

### Coach Format (all modes)
- Returns structured format: `SCORES: [n,n,n,n,n]`, `STRENGTHS:`, `IMPROVE:`, `OVERALL:`
- Fallback parsing in `app/api/feedback/route.ts` handles deviations from format

---

## API Routes

### `POST /api/session`
- Body: `{ messages, scenario, scenarioContext, personaId, round, mode, discoveryLayers? }`
- Returns: `{ response: string, isComplete: boolean }`
- Model: `claude-sonnet-4-6`, max_tokens: 200
- `isComplete` derived from `[SESSION_COMPLETE]` tag presence
- `mode` selects the appropriate system prompt via `getProspectPrompt()`
- `discoveryLayers` passed for discovery mode scenarios
- `maxDuration: 30` (Vercel serverless timeout)

### `POST /api/feedback`
- Body: `{ transcript, scenario, personaId, mode }`
- Returns: `{ scores: number[], strengths: string[], improvement: string, overall: string }`
- Model: `claude-sonnet-4-6`, max_tokens: 350
- `mode` selects the appropriate coach prompt via `getCoachPrompt()`
- Regex-based parsing with fallback defaults for each field

### Client-side (`lib/session-engine.ts`)
- `fetchWithRetry`: 2 retries with exponential backoff (500ms, 1000ms)
- 4xx errors are not retried (client errors)
- 5xx and network errors are retried

---

## State Management (Zustand -- `lib/store.ts`)

```typescript
type SessionMode = 'objection' | 'pitch' | 'discovery';

interface SessionState {
  mode: SessionMode;
  scenario: Scenario | null;
  persona: Persona | null;
  currentRound: number;    // 1 to maxRounds
  maxRounds: number;       // 2 (pitch), 3 (objection), 5 (discovery)
  turnState: TurnState;    // 'idle' | 'rep' | 'processing' | 'prospect' | 'feedback'
  transcript: readonly SessionEntry[];

  setMode: (mode: SessionMode) => void;
  setScenario: (scenario: Scenario) => void;
  setPersona: (persona: Persona) => void;
  addTranscriptEntry: (entry: SessionEntry) => void;
  advanceRound: () => void;
  setTurnState: (state: TurnState) => void;
  resetSession: () => void;
}

interface ModeConfig {
  mode: SessionMode;
  label: string;
  description: string;
  maxRounds: number;
  repGoesFirst: boolean;      // true for pitch mode
  scoreDimensions: string[];  // 5 dimensions per mode
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
