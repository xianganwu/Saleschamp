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
│   ├── layout.tsx              # Root layout, fonts, global styles
│   ├── page.tsx                # Home / scenario selector screen
│   ├── session/
│   │   └── page.tsx            # Main sparring arena
│   └── results/
│       └── page.tsx            # Feedback + scorecard screen
├── components/
│   ├── ui/
│   │   ├── Button.tsx          # Reusable animated button
│   │   ├── Card.tsx            # Scenario card component
│   │   └── ProgressBar.tsx     # Round progress indicator
│   ├── session/
│   │   ├── SparringArena.tsx   # Main session layout
│   │   ├── ProspectAvatar.tsx  # Animated prospect persona
│   │   ├── VoiceButton.tsx     # Mic button with state
│   │   ├── TranscriptBubble.tsx # Chat-style transcript bubbles
│   │   └── RoundIndicator.tsx  # Shows current round
│   └── home/
│       ├── ScenarioGrid.tsx    # Grid of selectable scenarios
│       ├── ScenarioCard.tsx    # Individual scenario card
│       └── PersonaSelector.tsx # Choose prospect persona
├── lib/
│   ├── session-engine.ts       # Claude API integration
│   ├── speech.ts               # Web Speech API wrapper
│   ├── scenarios.ts            # Scenario bank with categories
│   ├── personas.ts             # Prospect persona definitions
│   ├── store.ts                # Zustand session state store
│   └── prompts.ts              # All Claude system prompts
├── hooks/
│   ├── useSpeechRecognition.ts # Voice input hook
│   ├── useSpeechSynthesis.ts   # Voice output hook
│   └── useSession.ts           # Main session orchestration hook
├── types/
│   └── session.ts              # All TypeScript types
└── public/
    └── sounds/                 # UI sound effects (optional)
```

---

## Core User Flow

```
HOME SCREEN
  -> Browse scenario grid (organized by competitive category)
  -> Click a scenario card
  -> Choose prospect persona (different buyer types)
  -> "Start Session" button

SPARRING SESSION
  -> Prospect introduces themselves, states their situation and objection (TTS)
  -> Round 1 (Opening): Rep responds (STT) -> Prospect pushes back (TTS)
  -> Round 2 (Deep Dive): Rep goes deeper (STT) -> Prospect challenges further (TTS)
  -> Round 3 (Close): Rep delivers final pitch (STT) -> Prospect gives final reaction (TTS)
  -> "See Your Scorecard" button

RESULTS SCREEN
  -> Full conversation transcript
  -> AI Coach scorecard across 5 dimensions
  -> Two specific strengths identified
  -> One targeted improvement with example phrasing
  -> Overall readiness rating (1-5 stars)
  -> "Run Again" (same scenario, refine approach) or "New Scenario"
```

---

## Scenario Bank

Scenarios are organized by competitive category. Each represents a real objection AAP sales specialists encounter in the field.

### vs. Upstream / Open Source

1. **"Ansible CLI is free -- why would we pay for AAP?"**
   The most common objection. Prospect uses community Ansible for ad-hoc tasks and sees no reason to pay.
   *Key angles: governance, RBAC, audit trails, automation controller, certified content, lifecycle support, automation mesh for scale.*

2. **"We're running AWX in production and it does everything we need."**
   Prospect self-hosts AWX and considers it equivalent to AAP's automation controller.
   *Key angles: no enterprise support/SLAs, no automation mesh, no Event-Driven Ansible, no certified content collections, no security certifications (FIPS, CVE response SLAs), no Lightspeed AI, unpredictable upstream lifecycle.*

3. **"We don't need enterprise support -- our team handles open source just fine."**
   Prospect has strong internal engineering and questions the value of a subscription.
   *Key angles: SLA-backed CVE response, certified and tested content, lifecycle predictability, opportunity cost of internal support vs. innovation, access to Red Hat ecosystem expertise.*

### vs. Competitive Tooling

4. **"We standardized on Terraform for all our infrastructure automation."**
   Prospect uses Terraform extensively and sees it as the single automation answer.
   *Key angles: Terraform = provisioning (Day 0/1), Ansible = configuration + ongoing operations (Day 1/2), complementary positioning, AAP excels at network/security/cloud operations automation where Terraform has gaps, multi-vendor device support.*

5. **"We have Puppet and it works fine for configuration management."**
   Prospect has an established Puppet (or Chef) deployment and sees no reason to change.
   *Key angles: agentless vs. agent-based (operational overhead, security surface), YAML vs. Ruby/DSL learning curve, broader automation scope beyond config management, community momentum toward Ansible, modernization without rip-and-replace.*

6. **"Our cloud provider's native tools handle everything -- AWS Systems Manager, Azure Automation."**
   Prospect is deep in a single cloud and sees native tools as sufficient.
   *Key angles: multi-cloud and hybrid cloud consistency, vendor lock-in risk, on-prem + edge + cloud unified automation, broader scope than cloud-native tools, single automation language across environments.*

7. **"ServiceNow already handles our IT automation and ITSM workflows."**
   Prospect views ServiceNow as their automation layer.
   *Key angles: complementary positioning (AAP as execution engine behind ServiceNow), deeper infrastructure/network/cloud automation capabilities, pre-built ServiceNow integration, execution at the edge where ServiceNow can't reach.*

### Value & Business Justification

8. **"The subscription cost is too high -- we can't justify the budget."**
   Classic budget objection, especially in cost-cutting environments.
   *Key angles: TCO analysis (hidden costs of DIY: staffing, downtime, security incidents), ROI from automation (time savings, error reduction), risk mitigation value, compliance cost avoidance, start-small subscription tiers.*

9. **"We're early in our automation journey -- we're not ready for a platform."**
   Prospect feels AAP is overkill for their current maturity level.
   *Key angles: AAP grows with you, start with automation controller basics, built-in best practices accelerate maturity, Lightspeed AI lowers content creation barrier, training and certification paths, crawl-walk-run adoption framework.*

10. **"We can't show ROI on automation to our leadership."**
    Prospect struggles to build an internal business case.
    *Key angles: Red Hat ROI frameworks and calculators, customer reference stories with quantified outcomes, time-to-value metrics, help them build the business case (partner, don't just sell).*

### Technical & Architecture Objections

11. **"We're moving everything to Kubernetes -- shouldn't we use K8s-native tooling?"**
    Prospect is deep into cloud-native transformation and questions Ansible's relevance.
    *Key angles: AAP runs on OpenShift/K8s (containerized AAP), automates K8s cluster lifecycle and Day 2 operations, manages infrastructure around and beneath K8s, Operator-based deployment, complements K8s-native tools rather than competing.*

12. **"Ansible is too slow for our scale -- we've had performance issues."**
    Prospect has hit scaling walls with community Ansible.
    *Key angles: automation mesh solves horizontal scaling, execution environments provide consistency, containerized architecture, strategy/free patterns for parallelism, AAP is architecturally different from running ansible-playbook on a single control node.*

13. **"Our security team has concerns about agentless SSH-based automation."**
    Prospect's security org pushes back on SSH-based management.
    *Key angles: automation mesh uses receptor network (not direct SSH from a single point), centralized credential management (no credentials on disk), RBAC and approval workflows, comprehensive audit logging, FIPS 140-2 compliance, reduced attack surface vs. persistent agents on every managed node.*

14. **"We just need a job scheduler, not a whole automation platform."**
    Prospect thinks cron or a simple scheduler is sufficient.
    *Key angles: governance and auditability beyond cron, RBAC (who can run what, where), error handling and notifications, workflow orchestration (conditional logic, approvals), self-service automation portal for non-experts, visibility and reporting across the organization.*

15. **"AI-generated automation is unreliable -- we don't trust Lightspeed for production."**
    Prospect is skeptical of Ansible Lightspeed with IBM watsonx Code Assistant.
    *Key angles: Lightspeed as productivity accelerator not replacement for human review, trained on curated Ansible content (not arbitrary code), generates content recommendations that humans approve, accelerates onboarding for less experienced team members, content quality analysis built in.*

---

## Prospect Personas

Each persona represents a different buyer archetype with distinct motivations, communication styles, and hot buttons. The rep selects a persona before starting, which changes how the AI argues.

### Morgan Chen -- VP of Infrastructure
- **Role:** Budget holder, reports to CIO
- **Style:** Data-driven, bottom-line focused, slightly impatient
- **Hot buttons:** Cost, ROI, headcount efficiency, risk to uptime
- **What convinces them:** Hard numbers, TCO comparisons, customer case studies with quantified outcomes, risk framing ("what does a 4-hour outage cost you?")
- **Voice cues:** Measured, direct, occasionally skeptical sighs

### Jamie Torres -- Senior Platform Engineer
- **Role:** Technical evaluator, open source contributor
- **Style:** Technically deep, community-oriented, allergic to marketing speak
- **Hot buttons:** Technical merit, open source integrity, engineering velocity, no vendor lock-in
- **What convinces them:** Honest technical differentiation, upstream contribution record, architecture diagrams, "show me, don't tell me"
- **Voice cues:** Casual, occasionally challenges with "but actually..."

### Casey Williams -- IT Director, Operations
- **Role:** Runs day-to-day IT ops, manages a team of 15
- **Style:** Risk-averse, pragmatic, values stability over innovation
- **Hot buttons:** Disruption to current workflows, migration effort, team retraining, reliability
- **What convinces them:** Smooth migration paths, coexistence strategies, customer stories from similar environments, training support
- **Voice cues:** Cautious, asks "what if" questions, references past vendor disappointments

### Riley Park -- Cloud Architect
- **Role:** Designs cloud strategy, reports to CTO
- **Style:** Forward-looking, opinionated, cloud-native mindset
- **Hot buttons:** Multi-cloud consistency, IaC best practices, developer experience, modern toolchain fit
- **What convinces them:** Hybrid/multi-cloud positioning, integration with cloud-native stack, automation mesh architecture, EDA capabilities
- **Voice cues:** Enthusiastic about tech, drops references to CNCF projects and cloud services

### Sam Okafor -- CISO
- **Role:** Owns security and compliance posture
- **Style:** Methodical, compliance-focused, zero-trust mindset
- **Hot buttons:** Attack surface, credential management, audit trails, regulatory compliance
- **What convinces them:** FIPS certifications, SOC 2 readiness, RBAC details, credential isolation, CVE response SLAs, comparison of agent vs. agentless security surface
- **Voice cues:** Precise, asks pointed questions, wants specifics not generalizations

---

## Claude API -- System Prompts

### Main Session Prompt (in `lib/prompts.ts`)

```typescript
export const PROSPECT_SYSTEM_PROMPT = (
  scenario: string,
  persona: Persona,
  scenarioContext: string
) => `
You are roleplaying as ${persona.name}, ${persona.title}. You are in a meeting with a Red Hat sales specialist who is pitching Ansible Automation Platform (AAP).

YOUR PERSONA:
- Role: ${persona.role}
- Communication style: ${persona.style}
- What matters to you: ${persona.hotButtons}
- You are convinced by: ${persona.convincedBy}

SCENARIO: "${scenario}"
CONTEXT: ${scenarioContext}

YOUR OBJECTIVE:
- You are a realistic, tough-but-fair prospect -- not impossibly difficult
- You have genuine concerns based on your persona and the scenario
- You push back with specifics when the rep gives vague or generic answers
- You acknowledge good points when the rep makes them ("Okay, that's helpful" or "I hadn't thought of that")
- You get increasingly interested if the rep demonstrates real expertise and listens to your concerns
- You stay skeptical if the rep sounds scripted or ignores what you said

CONVERSATION RULES:
- Keep each response to 3-5 sentences MAXIMUM
- Stay in character throughout -- react as your persona naturally would
- Reference your actual environment ("We currently run..." / "My team of 15..." / "Our compliance audit last quarter...")
- If the rep makes a strong point, acknowledge it before raising your next concern
- If the rep gives a weak or generic answer, press harder on the same point
- Ask follow-up questions that a real buyer would ask

ROUND STRUCTURE:
- Round 1: State your situation and primary objection clearly
- Round 2: Push back on their response -- go deeper, ask for specifics or proof points
- Round 3: Give a realistic final reaction -- if convinced, say what next step you'd consider; if not, say what's still missing

TONE:
- Professional but human -- you're a real person, not a robot
- Match your persona's communication style
- Never break character or reference that this is a simulation

After round 3 (the final round), end your response with exactly this tag: [SESSION_COMPLETE]
`;

export const COACH_FEEDBACK_PROMPT = (transcript: string, scenario: string, persona: string) => `
You are an expert sales coach reviewing a practice objection handling session.

SCENARIO: "${scenario}"
PROSPECT PERSONA: ${persona}

FULL TRANSCRIPT:
${transcript}

Score the rep on each dimension (1-5 scale) and provide your assessment:

1. **Objection Acknowledgment** - Did they validate the prospect's concern before countering? Did they listen and reference what the prospect actually said?

2. **Value Articulation** - Did they clearly connect AAP capabilities to business outcomes the prospect cares about? Or did they just list features?

3. **Competitive Accuracy** - Were their claims about AAP vs. the alternative technically accurate and honest? Did they avoid badmouthing competitors?

4. **Discovery & Listening** - Did they ask questions to understand the prospect's specific situation? Or did they just pitch at them?

5. **Conversation Advancement** - Did they move the conversation toward a logical next step (demo, POC, technical deep-dive, reference call)?

FORMAT YOUR RESPONSE EXACTLY AS:
SCORES: [n,n,n,n,n]

STRENGTHS:
- [Specific thing they did well, with a quote from the transcript] (1-2 sentences)
- [Second specific strength] (1-2 sentences)

IMPROVE:
- [One targeted, actionable improvement with an example of what they could have said instead] (2-3 sentences)

OVERALL: [A one-sentence summary of their readiness level for this scenario]

Keep the entire response under 200 words. Be direct and specific -- generic praise is useless. Reference actual moments from the conversation.
`;
```

---

## Voice Implementation

### Speech Recognition (`hooks/useSpeechRecognition.ts`)

```typescript
// Key implementation notes:
// - Always check browser support before initializing
// - Set interimResults: true for live transcript display
// - Use continuous: false (single utterance per turn)
// - Show visual feedback while mic is active
// - Add 2s silence detection to auto-stop (longer than kids' app -- adults pause to think)
// - DISABLE mic during prospect's speech to prevent echo
// - Consider longer max recording time (30s vs. 15s) -- sales answers are longer
```

### Speech Synthesis (`hooks/useSpeechSynthesis.ts`)

```typescript
// Key implementation notes:
// - Load voices after 'voiceschanged' event fires
// - Select voice based on persona (vary between personas for immersion)
// - Fall back gracefully if preferred voice unavailable
// - Dispatch event when speech ENDS so UI can re-enable mic
// - Cancel any ongoing speech before starting new utterance
// - Split long text at sentence boundaries for more natural delivery
```

### Persona Voice Configuration

```typescript
const personaVoices: Record<PersonaId, VoiceConfig> = {
  morgan_chen: {
    pitch: 0.95,
    rate: 1.1,      // slightly fast -- impatient executive
    preferredVoices: ['Google US English', 'Microsoft Mark'],
  },
  jamie_torres: {
    pitch: 1.0,
    rate: 0.95,     // measured, thoughtful engineer
    preferredVoices: ['Google UK English Male', 'Microsoft David'],
  },
  casey_williams: {
    pitch: 0.9,
    rate: 0.9,      // slower, deliberate ops manager
    preferredVoices: ['Google US English', 'Microsoft Zira'],
  },
  riley_park: {
    pitch: 1.05,
    rate: 1.05,     // energetic cloud architect
    preferredVoices: ['Google UK English Female', 'Microsoft Susan'],
  },
  sam_okafor: {
    pitch: 0.85,
    rate: 0.95,     // deep, precise CISO
    preferredVoices: ['Google US English', 'Microsoft David'],
  },
};
```

### Turn-Taking State Machine

```
IDLE
  -> REP_TURN (mic enabled, recording indicator shown)
    -> PROCESSING (spinner, mic disabled)
      -> PROSPECT_TURN (persona avatar animates, TTS playing, mic disabled)
        -> REP_TURN (loop)
          -> FEEDBACK (after round 3)
```

---

## UI/UX Design Principles

### Color Palette
```css
--color-primary: #EE0000;       /* Red Hat red -- used sparingly for CTAs and accents */
--color-primary-hover: #CC0000; /* darker red on hover */
--color-secondary: #4394E5;     /* professional blue -- trust, competence */
--color-accent: #F0AB00;        /* warm amber -- highlights, scores */
--color-dark: #151515;          /* near-black -- primary background */
--color-surface: #1E1E1E;       /* card backgrounds, elevated surfaces */
--color-surface-light: #2D2D2D; /* hover states, secondary surfaces */
--color-text: #E0E0E0;          /* primary text on dark backgrounds */
--color-text-muted: #8A8A8A;    /* secondary text */
--color-success: #3E8635;       /* positive scores, strengths */
--color-warning: #F0AB00;       /* mid-range scores */
--color-danger: #C9190B;        /* low scores, areas to improve */
```

### Typography
- Headings: `Inter` (weight 700) -- clean, professional, highly legible
- Body: `Inter` (weight 400/500) -- consistent, modern
- Monospace (scores, data): `JetBrains Mono` -- technical credibility
- Import via Google Fonts in `layout.tsx`

### Animation Guidelines (Framer Motion)
- Prospect avatar should have a subtle presence indicator when speaking (gentle pulse, not cartoonish)
- Mic button should have a clean red ring animation when recording
- Scenario cards should have a slight elevation + border glow on hover
- Transcript bubbles should fade and slide in from left (prospect) or right (rep)
- Round transitions should feel like a phase shift -- brief dimming and label change
- Use `spring` physics with moderate damping (professional, not bouncy)
- All animations should feel *polished and restrained*, not playful

### Layout
- Dark mode by default -- feels like a focused practice environment
- Desktop-first design (sales reps primarily use laptops)
- Wide transcript area with clear visual separation between speakers
- Persistent round/phase indicator in top bar
- Scenario and persona context always visible during session

### Accessibility
- Large touch targets (min 44x44px) for all interactive elements
- High contrast text (WCAG AA minimum, aim for AAA on critical elements)
- Screen reader labels on all icon buttons
- Keyboard navigation support throughout
- Visible focus indicators

---

## State Management (Zustand -- `lib/store.ts`)

```typescript
interface SessionStore {
  // Setup
  scenario: Scenario | null
  persona: Persona | null

  // Session state
  currentRound: number    // 1-3
  maxRounds: number       // 3
  turnState: 'idle' | 'rep' | 'processing' | 'prospect' | 'feedback'

  // Content
  transcript: SessionEntry[]  // Full conversation history
  scores: ScoreCard | null    // 5-dimension scoring after session

  // Actions
  setScenario: (scenario: Scenario) => void
  setPersona: (persona: Persona) => void
  addTranscriptEntry: (entry: SessionEntry) => void
  advanceRound: () => void
  setTurnState: (state: TurnState) => void
  setScores: (scores: ScoreCard) => void
  resetSession: () => void
}

interface ScoreCard {
  objectionAcknowledgment: number   // 1-5
  valueArticulation: number         // 1-5
  competitiveAccuracy: number       // 1-5
  discoveryAndListening: number     // 1-5
  conversationAdvancement: number   // 1-5
  strengths: string[]               // 2 specific strengths
  improvement: string               // 1 targeted improvement
  overall: string                   // Summary sentence
}

interface SessionEntry {
  speaker: 'rep' | 'prospect'
  content: string
  round: number
  timestamp: number
}

type TurnState = 'idle' | 'rep' | 'processing' | 'prospect' | 'feedback'
```

---

## API Routes

### `app/api/session/route.ts`

```typescript
// POST /api/session
// Body: {
//   messages: Message[],
//   scenario: string,
//   scenarioContext: string,
//   persona: Persona,
//   round: number
// }
// Returns: { response: string, isComplete: boolean }
//
// Notes:
// - max_tokens: 200 for session turns (prospect responses should be concise)
// - Full conversation history passed on each call
// - isComplete derived from presence of [SESSION_COMPLETE] tag
```

### `app/api/feedback/route.ts`

```typescript
// POST /api/feedback
// Body: {
//   transcript: SessionEntry[],
//   scenario: string,
//   persona: string
// }
// Returns: {
//   scores: number[],       // [n,n,n,n,n] for the 5 dimensions
//   strengths: string[],    // 2 items
//   improvement: string,    // 1 item
//   overall: string         // summary
// }
//
// Notes:
// - max_tokens: 350 for feedback (more detailed than session turns)
// - Parse the structured response format from the prompt
```

---

## Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=your_key_here
```

---

## Agents Used in This Project

This project was built using the following Claude Code sub-agents. Reference these when making changes:

### 1. `architect-agent`
Responsible for: Project scaffolding, Next.js config, TypeScript setup, folder structure, package.json dependencies.

### 2. `ui-agent`
Responsible for: All visual components, Tailwind styling, Framer Motion animations, prospect persona avatars, dark mode layout, scorecard visualization.

### 3. `voice-agent`
Responsible for: Web Speech API integration, turn-taking logic, persona-specific voice selection, mic state management, audio feedback.

### 4. `session-engine-agent`
Responsible for: Claude API integration, prompt engineering, conversation history management, feedback generation, score parsing.

### 5. `state-agent`
Responsible for: Zustand store, session loop logic, round progression, score management.

---

## Key Constraints & Gotchas

1. **Web Speech API is Chrome/Edge only** -- show a clear browser compatibility notice for Firefox/Safari users
2. **Voices load asynchronously** -- always wait for `speechSynthesis.onvoiceschanged` before attempting voice selection
3. **Never run STT and TTS simultaneously** -- creates echo feedback; strictly enforce turn-taking
4. **Claude API calls go server-side** -- never expose the API key in client code
5. **Conversation history must be passed on every API call** -- Claude has no memory between requests
6. **Mobile voice support is inconsistent** -- desktop-first design; mobile is a nice-to-have, not a requirement
7. **Keep Claude responses concise** -- enforce max_tokens: 200 for session turns, 350 for feedback
8. **Competitive claims must be accurate** -- if the AI makes inaccurate claims about AAP or competitors, it trains bad habits; the system prompt should emphasize factual grounding
9. **Persona consistency matters** -- the AI must stay in character for the entire session; breaking character ruins the simulation value
10. **Score parsing needs error handling** -- the structured feedback format may occasionally deviate; implement fallback parsing

---

## AAP Knowledge Reference

This is a condensed reference of key AAP capabilities and competitive positioning. Used to inform scenario context and validate rep responses. Keep this updated as the product evolves.

### Core AAP Components
- **Automation Controller** (formerly Ansible Tower) -- RBAC, workflows, scheduling, audit trails, API, credential management
- **Automation Mesh** -- scalable, resilient execution plane; hop nodes and execution nodes distributed across network zones
- **Event-Driven Ansible (EDA)** -- event-driven automation for auto-remediation and response
- **Automation Hub** -- certified content collections, private automation hub for curated internal content
- **Execution Environments** -- containerized, portable automation runtime (replaces virtualenvs)
- **Ansible Lightspeed with IBM watsonx Code Assistant** -- AI-powered content creation assistance

### Key Differentiators vs. Upstream
- Enterprise support with SLAs and CVE response commitments
- Certified, tested content collections with lifecycle guarantees
- Automation mesh for scale and security (not available in AWX)
- Event-Driven Ansible (not in community Ansible or AWX)
- FIPS 140-2 compliance and hardened container images
- Predictable lifecycle and upgrade paths
- Ansible Lightspeed AI integration
- Access to broader Red Hat ecosystem (OpenShift, RHEL, Satellite, Insights)

### Competitive Positioning Summary
| Competitor | Relationship | Key Message |
|-----------|-------------|-------------|
| Ansible CLI | Upstream project | AAP adds enterprise governance, scale, and security around the Ansible language |
| AWX | Upstream of Controller | AWX is one component without support; AAP is a complete platform with mesh, EDA, Hub, and lifecycle |
| Terraform | Complementary | Terraform = provisioning (Day 0/1); Ansible = configuration and operations (Day 1/2); better together |
| Puppet/Chef | Alternative | Agentless, lower learning curve (YAML), broader automation scope, stronger community momentum |
| Cloud-native tools | Alternative | Multi-cloud consistency, no vendor lock-in, hybrid/edge coverage, single language everywhere |
| ServiceNow | Complementary | AAP as execution engine; deeper infrastructure automation; edge execution; pre-built integration |

---

## Definition of Done

- [ ] Scenario selection screen with all 15 scenarios, organized by category
- [ ] Persona selector with 5 distinct prospect personas, each with visible description
- [ ] Sparring arena with working voice input and output
- [ ] 3-round session loop with clear round/phase indicators
- [ ] Prospect avatar with persona-specific visual treatment and speaking indicator
- [ ] Clean transcript display (bubbles, left/right aligned by speaker)
- [ ] Scorecard results screen with 5-dimension radar chart or bar visualization
- [ ] Strengths and improvement area clearly displayed
- [ ] "Run Again" (same scenario) and "New Scenario" flows without page reload
- [ ] Browser compatibility notice for non-Chrome/Edge users
- [ ] Desktop-optimized responsive layout
- [ ] Loading/error states for all API calls
- [ ] Dark mode by default
- [ ] Deployed to Vercel

---

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint check
npm run type-check   # TypeScript check
vercel --prod        # Deploy to production
```
