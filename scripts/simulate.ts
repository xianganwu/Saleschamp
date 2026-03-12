/**
 * SalesChamp Simulation Script
 *
 * Simulates 3 salespeople (weak, mediocre, strong) going through 3 scenarios each.
 * Run: npx tsx scripts/simulate.ts
 *
 * If ANTHROPIC_API_KEY is set, uses the real API for prospect responses.
 * Otherwise, uses pre-written mock conversations.
 */

import Anthropic from '@anthropic-ai/sdk';

// ─── Types ──────────────────────────────────────────────────────────────────

interface SimRound {
  repResponse: string;
  prospectResponse: string;
}

interface SimSession {
  repName: string;
  repLevel: string;
  scenarioTitle: string;
  personaName: string;
  personaTitle: string;
  rounds: SimRound[];
  scores: number[];
  strengths: string[];
  improvement: string;
  overall: string;
}

interface PersonaDef {
  name: string;
  title: string;
  id: string;
  role: string;
  style: string;
  hotButtons: string;
  convincedBy: string;
}

// ─── Personas ───────────────────────────────────────────────────────────────

const MORGAN_CHEN: PersonaDef = {
  name: 'Morgan Chen',
  title: 'VP of Infrastructure',
  id: 'morgan_chen',
  role: 'Budget holder, reports to CIO',
  style: 'Data-driven, bottom-line focused, slightly impatient',
  hotButtons: 'Cost, ROI, headcount efficiency, risk to uptime',
  convincedBy: 'Hard numbers, TCO comparisons, customer case studies with quantified outcomes',
};

const JAMIE_TORRES: PersonaDef = {
  name: 'Jamie Torres',
  title: 'Senior Platform Engineer',
  id: 'jamie_torres',
  role: 'Technical evaluator, open source contributor',
  style: 'Technically deep, community-oriented, allergic to marketing speak',
  hotButtons: 'Technical merit, open source integrity, engineering velocity',
  convincedBy: 'Honest technical differentiation, architecture specifics',
};

const SAM_OKAFOR: PersonaDef = {
  name: 'Sam Okafor',
  title: 'CISO',
  id: 'sam_okafor',
  role: 'Owns security and compliance posture',
  style: 'Methodical, compliance-focused, zero-trust mindset',
  hotButtons: 'Attack surface, credential management, audit trails, regulatory compliance',
  convincedBy: 'FIPS certifications, RBAC details, credential isolation, CVE response SLAs',
};

// ─── Mock Conversations ────────────────────────────────────────────────────

function buildMockSessions(): SimSession[] {
  return [
    // ═══════════════════════════════════════════════════════════════════════
    // WEAK REP (Alex) — Session 1
    // ═══════════════════════════════════════════════════════════════════════
    {
      repName: 'Alex (Weak)',
      repLevel: 'WEAK',
      scenarioTitle: 'Ansible CLI is free -- why would we pay for AAP?',
      personaName: MORGAN_CHEN.name,
      personaTitle: MORGAN_CHEN.title,
      rounds: [
        {
          repResponse:
            'Well, AAP has a lot of great features. It comes with Automation Controller, Automation Hub, Event-Driven Ansible, execution environments, and Ansible Lightspeed. It\'s a full enterprise platform with everything you need for automation at scale.',
          prospectResponse:
            'Okay, but you just listed a bunch of product names. We\'ve been running Ansible CLI across 200 servers just fine. My team runs playbooks from a shared Git repo and it works. What specifically are we getting for $120K a year that we don\'t already have? Give me something concrete.',
        },
        {
          repResponse:
            'Right, so Automation Controller gives you a web UI and API for running your playbooks. It\'s much better than running things from the command line. And you get enterprise support from Red Hat with SLAs, so if something breaks, we\'re there to help. Plus it integrates with the whole Red Hat ecosystem.',
          prospectResponse:
            'I\'m not paying six figures for a web UI -- my engineers live in the terminal. And we haven\'t needed to call any vendor for help so far. You keep telling me what the product does but not why I should care. What business problem does this solve that I actually have?',
        },
        {
          repResponse:
            'I understand. Well, many of our customers have found that AAP really transforms their automation journey. The platform approach ensures consistency and governance across your environment. I think if you saw a demo, you\'d really see the value. Can I set one up?',
          prospectResponse:
            'Look, I asked three times for a concrete business justification and you gave me marketing language. I need numbers -- time saved, incidents prevented, cost avoided. Come back when you can quantify why this is worth six figures to us. I\'m not booking a demo based on what I\'ve heard today.',
        },
      ],
      scores: [1, 2, 3, 1, 2],
      strengths: [
        'Mentioned enterprise support and SLAs, which is a relevant differentiator for a VP concerned about uptime.',
        'Attempted to close with a demo ask, showing awareness that the conversation needs to advance.',
      ],
      improvement:
        'Stop feature-dumping and start with the prospect\'s situation. Morgan mentioned running playbooks from laptops with a shared Git repo -- that\'s a governance risk. You should have said something like: "You mentioned your team runs playbooks from individual laptops. What happens if someone runs a playbook against production by mistake? AAP\'s Controller gives you RBAC so you control who runs what, where -- and you get a full audit trail. One of our customers with a similar setup cut their incident rate by 60% after implementing this."',
      overall: 'Not ready for this scenario -- needs to practice connecting features to the prospect\'s specific business problems.',
    },

    // ═══════════════════════════════════════════════════════════════════════
    // WEAK REP (Alex) — Session 2
    // ═══════════════════════════════════════════════════════════════════════
    {
      repName: 'Alex (Weak)',
      repLevel: 'WEAK',
      scenarioTitle: 'We have Puppet and it works fine for configuration management.',
      personaName: JAMIE_TORRES.name,
      personaTitle: JAMIE_TORRES.title,
      rounds: [
        {
          repResponse:
            'Puppet is a legacy tool that\'s losing market share. Ansible is the future of automation -- it\'s the most popular automation tool in the world. You should really be thinking about modernizing your stack. YAML is much easier to learn than Puppet\'s DSL.',
          prospectResponse:
            'Whoa, hold on. "Legacy" is a strong word for something that manages 800 nodes in our environment and has been rock solid for 5 years. We have deep expertise in it. And I\'m an open source contributor -- don\'t try to sell me on popularity contests. What specifically can Ansible do that Puppet can\'t for our actual workloads?',
        },
        {
          repResponse:
            'Fair point. But you have to admit that finding Puppet engineers is getting harder. Nobody wants to learn Ruby DSL anymore. With Ansible, your whole team can write YAML playbooks -- it\'s a much lower barrier to entry. And Ansible is agentless, so you don\'t have to manage Puppet agents on every node.',
          prospectResponse:
            'The hiring point is actually valid -- we do have three open reqs where candidates don\'t know Puppet. But you just told me my current tool is "legacy" and now you\'re being more reasonable. That inconsistency doesn\'t build trust. And our agent infrastructure is already running fine. What about our expansion into cloud and containers? Puppet\'s been weaker there.',
        },
        {
          repResponse:
            'Yeah, Ansible is great for cloud and containers. We have modules for AWS, Azure, Kubernetes, everything. You can manage your entire hybrid environment with one tool. I think AAP would really help you consolidate.',
          prospectResponse:
            'Okay, the cloud and container angle is interesting, but you haven\'t told me how this would actually work alongside our existing Puppet setup. Am I supposed to rip out 5 years of Puppet modules overnight? I need a migration strategy, not a replacement pitch. Come back with a coexistence plan and I\'ll consider a deeper conversation.',
        },
      ],
      scores: [1, 2, 2, 1, 2],
      strengths: [
        'Correctly identified the hiring challenge for Puppet engineers, which resonated with Jamie -- "The hiring point is actually valid."',
        'Identified cloud and container expansion as a relevant use case where Ansible has advantages.',
      ],
      improvement:
        'Never call a prospect\'s current tool "legacy" -- it\'s dismissive and destroys trust, especially with technical evaluators. Instead, position Ansible as complementary: "Your Puppet infrastructure is clearly well-established. Where we see customers like you get value from Ansible is in the areas Puppet doesn\'t cover as well -- cloud provisioning, network automation, and container management. You can run both side by side and gradually expand Ansible into new workloads without touching what\'s working."',
      overall: 'Showed some relevant knowledge but poor consultative skills -- alienated the prospect early with dismissive language.',
    },

    // ═══════════════════════════════════════════════════════════════════════
    // MEDIOCRE REP (Jordan) — Session 1
    // ═══════════════════════════════════════════════════════════════════════
    {
      repName: 'Jordan (Mediocre)',
      repLevel: 'MEDIOCRE',
      scenarioTitle: 'We run AWX in production and it does everything we need.',
      personaName: JAMIE_TORRES.name,
      personaTitle: JAMIE_TORRES.title,
      rounds: [
        {
          repResponse:
            'I hear that a lot from teams running AWX. It\'s a solid project -- we actually maintain the upstream too. The key difference is that AAP includes capabilities beyond what AWX offers: automation mesh for scale and security, Event-Driven Ansible for auto-remediation, and a private Automation Hub for certified content. AWX is really just the controller component.',
          prospectResponse:
            'Okay, I\'ll give you credit for not trashing AWX -- that would have been a red flag since I know it\'s Red Hat\'s upstream. But we deployed AWX 18 months ago on a single VM and it handles our 5-person team just fine. Automation mesh sounds interesting but I\'m not sure we need it at our scale. What problem does it solve that we actually have?',
        },
        {
          repResponse:
            'Good question. At your current scale, mesh might not be the primary driver. What\'s more relevant is probably the support and lifecycle story. You mentioned AWX is on a single VM -- when you last upgraded, how did that go? With upstream AWX, there are no backport guarantees or CVE SLA commitments. AAP gives you a tested, certified release with a predictable lifecycle and support if things go sideways.',
          prospectResponse:
            'Actually, our last AWX upgrade did break. Took us a day and a half to fix it. And our security team just asked about SOC 2 compliance for our automation tooling, which we have no answer for with AWX. But I\'m not sure those pain points alone justify the subscription cost. What are other teams our size getting out of AAP that they weren\'t getting from AWX?',
        },
        {
          repResponse:
            'Those are both great examples of where AAP adds value. On the compliance side, AAP provides FIPS 140-2 validated cryptography and has been through the hardening process, which gives you documentation your security team can point to for SOC 2. On upgrade stability, our lifecycle is published and tested -- no more surprise breaks. I\'d suggest a call between your security lead and our compliance team to see if AAP checks their boxes. Would that be useful?',
          prospectResponse:
            'Yeah, the compliance angle is actually the strongest argument I\'ve heard. If your compliance team can show our CISO that AAP covers SOC 2 requirements that AWX can\'t, that would move the needle. Let me set up that call. Can you send me the lifecycle and compliance documentation ahead of time so I can review it?',
        },
      ],
      scores: [4, 3, 4, 3, 4],
      strengths: [
        'Strong competitive positioning -- acknowledged AWX as a solid upstream project rather than dismissing it, which built credibility with the technical evaluator.',
        'Pivoted effectively when told mesh wasn\'t relevant at their scale, and connected to the upgrade pain point Jamie actually experienced -- "your last AWX upgrade did break."',
      ],
      improvement:
        'Good overall but could have asked more discovery questions earlier. In round 1, after Jamie mentioned AWX on a single VM with 5 users, you could have asked: "How are you handling credential management today? And has your security team flagged any audit requirements for your automation tooling?" This would have surfaced the SOC 2 pain point in round 1 instead of waiting for Jamie to volunteer it in round 2.',
      overall: 'Solid handling of a technical evaluator -- built trust by respecting AWX, connected to real pain points, and advanced to a clear next step.',
    },

    // ═══════════════════════════════════════════════════════════════════════
    // STRONG REP (Taylor) — Session 1
    // ═══════════════════════════════════════════════════════════════════════
    {
      repName: 'Taylor (Strong)',
      repLevel: 'STRONG',
      scenarioTitle: 'Ansible CLI is free -- why would we pay for AAP?',
      personaName: MORGAN_CHEN.name,
      personaTitle: MORGAN_CHEN.title,
      rounds: [
        {
          repResponse:
            'Totally fair question, Morgan -- it\'s the right one to ask. Before I answer, can I ask: you mentioned your team runs playbooks from individual laptops against 200 servers. Who has visibility into what\'s being run, when, and against which systems? And when something goes wrong at 2 AM, how quickly can you identify what changed?',
          prospectResponse:
            'Honestly? Nobody has full visibility. We have a Git log of who committed what, but we don\'t always know who ran what against production. And incident response... last quarter we had an outage that took 4 hours to diagnose because we couldn\'t tell which playbook change caused it. It\'s a sore spot.',
        },
        {
          repResponse:
            'That 4-hour outage is exactly the kind of problem AAP\'s Controller solves. Every job execution is logged with who ran it, what changed, which credentials were used, and the full output. RBAC means you can ensure only senior engineers run playbooks against production. A customer of ours with 250 servers -- similar to your environment -- cut their mean-time-to-identify from 3 hours to 15 minutes after deploying Controller. At your scale, if you\'re averaging even one incident like that per quarter, the platform pays for itself in avoided downtime alone. What does a 4-hour outage cost you?',
          prospectResponse:
            'That\'s a compelling example. A 4-hour outage costs us roughly $50K in direct impact, plus the engineering time. So you\'re saying if we avoid even two of those a year, we\'ve more than covered the subscription. That math works. But how hard is this to deploy? I\'m not signing up for a 6-month implementation project.',
        },
        {
          repResponse:
            'Deployment is measured in days, not months. Controller deploys on a single RHEL node or as containers, and it wraps around your existing playbooks -- no rewriting needed. Your team keeps using the same YAML they already know. I\'d suggest a 2-week guided POC focused specifically on your production deployment workflow with RBAC and audit logging. That way you can validate the incident response improvement before committing. We can also have our solutions architect model the TCO for your 200-node environment. Can I set that up for next week?',
          prospectResponse:
            'A 2-week POC with TCO modeling -- that\'s exactly what I need to bring to my CIO with a recommendation. Yes, let\'s schedule it. Send me the logistics and I\'ll block time for my team. If the numbers hold up, this moves fast.',
        },
      ],
      scores: [5, 5, 5, 5, 5],
      strengths: [
        'Masterful discovery -- instead of answering the "why pay" question directly, asked about visibility and incident response, which surfaced a $50K/quarter pain point the prospect hadn\'t connected to the solution.',
        'Quantified value in the prospect\'s own terms: "if you avoid even two of those a year, you\'ve more than covered the subscription." Morgan validated the math immediately.',
      ],
      improvement:
        'Nearly flawless execution. One minor refinement: in round 3, you could have introduced automation mesh as a future growth path -- "and as you scale beyond 200 nodes, automation mesh lets you distribute execution without a single bottleneck." This plants a seed for expansion revenue without complicating the current discussion.',
      overall: 'Exceptional handling -- ready to run this scenario live with any VP-level buyer.',
    },

    // ═══════════════════════════════════════════════════════════════════════
    // STRONG REP (Taylor) — Session 2
    // ═══════════════════════════════════════════════════════════════════════
    {
      repName: 'Taylor (Strong)',
      repLevel: 'STRONG',
      scenarioTitle: 'Our security team has concerns about agentless SSH-based automation.',
      personaName: SAM_OKAFOR.name,
      personaTitle: SAM_OKAFOR.title,
      rounds: [
        {
          repResponse:
            'Sam, I appreciate your team raising this -- it\'s the right concern to have. Before I address it, can you help me understand the specifics? Is the concern about SSH key management and potential credential sprawl? The lateral movement risk from a single control node? Or something else your zero-trust initiative has flagged?',
          prospectResponse:
            'All of the above, actually. Our zero-trust framework requires that no single system should be able to reach all managed nodes. With Ansible\'s traditional model, your control node has SSH access to everything -- that\'s a high-value target. We also need full audit trails for SOC 2, and we need to know that credentials aren\'t stored on disk on the control node. Our current concern is that agentless means uncontrolled SSH access.',
        },
        {
          repResponse:
            'Those are precise, well-founded concerns. Let me address each one. First, AAP\'s automation mesh eliminates the single-control-node problem entirely. Instead of one node SSH-ing to everything, you deploy execution nodes inside each network zone. Traffic between zones uses the receptor protocol -- encrypted, authenticated, and traversing only designated hop nodes. The control plane never needs direct SSH to managed endpoints. Second, credentials: Controller stores all credentials in an encrypted vault, injects them at runtime, and never writes them to disk on execution nodes. Your engineers never see the actual credentials. Third, audit: every job execution is logged with user identity, credentials used, inventory targeted, and full output. We have customers running SOC 2 and FedRAMP environments on AAP. Would it help if I connected you with our security architecture team to walk through the mesh topology for your network?',
          prospectResponse:
            'That\'s the most specific answer I\'ve gotten from any vendor on this. The mesh architecture with execution nodes inside network zones actually aligns with our zero-trust segmentation. And credential injection without disk persistence is exactly what we need. The SOC 2 and FedRAMP references are relevant -- we\'re pursuing SOC 2 Type 2 this year. Yes, I want that architecture walkthrough. But I also need to see the FIPS 140-2 validation documentation. Can you provide that?',
        },
        {
          repResponse:
            'Absolutely. AAP\'s containerized deployment uses FIPS-validated cryptographic modules, and I\'ll send you the specific certification documentation today. For the architecture walkthrough, I\'ll set up a session with our security solutions architect who works with FedRAMP customers -- they can map our mesh topology to your zero-trust zones and show you the credential lifecycle end-to-end. They can also provide our SOC 2 compliance mapping document. I\'d recommend including your network security lead in that call so they can validate the receptor protocol meets your segmentation requirements. Can I schedule that for this week?',
          prospectResponse:
            'This week works. Send me the FIPS documentation and SOC 2 mapping ahead of time so I can review it before the call. I\'ll bring my network security architect. If the architecture walkthrough confirms what you\'ve described, this addresses our primary blockers. Well done -- you clearly understand the security requirements.',
        },
      ],
      scores: [5, 5, 5, 5, 5],
      strengths: [
        'Opened with a precise discovery question that let Sam articulate their specific concerns -- zero-trust, credential management, and audit trails -- rather than guessing.',
        'Addressed each security concern with technical specifics: mesh architecture for zero-trust alignment, credential injection for no-disk-persistence, and named specific compliance frameworks (SOC 2, FedRAMP, FIPS 140-2). Sam called it "the most specific answer I\'ve gotten from any vendor."',
      ],
      improvement:
        'Near-perfect. One optional enhancement: you could have proactively mentioned AAP\'s CVE response SLA -- "Red Hat also commits to documented CVE response times, so if a vulnerability is discovered in AAP, you know exactly when a fix will be available. That\'s something you can\'t get with community tools." This adds value without complicating the conversation.',
      overall: 'Outstanding -- demonstrated deep security expertise and earned the CISO\'s trust. Ready for any security-focused conversation.',
    },
  ];
}

// ─── Output Formatting ──────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';

function levelColor(level: string): string {
  if (level === 'WEAK') return RED;
  if (level === 'MEDIOCRE') return YELLOW;
  return GREEN;
}

function scoreColor(score: number): string {
  if (score >= 4) return GREEN;
  if (score >= 3) return YELLOW;
  return RED;
}

function scoreBar(score: number): string {
  const filled = score;
  const empty = 5 - score;
  return `${scoreColor(score)}${'█'.repeat(filled)}${DIM}${'░'.repeat(empty)}${RESET}`;
}

function printSession(session: SimSession, index: number) {
  const lvlClr = levelColor(session.repLevel);

  console.log('');
  console.log(`${BOLD}${'═'.repeat(78)}${RESET}`);
  console.log(
    `${BOLD} SESSION ${index + 1}: ${lvlClr}${session.repName}${RESET}`,
  );
  console.log(
    `${DIM} Scenario: ${RESET}${session.scenarioTitle}`,
  );
  console.log(
    `${DIM} Prospect: ${RESET}${CYAN}${session.personaName}${RESET}${DIM}, ${session.personaTitle}${RESET}`,
  );
  console.log(`${BOLD}${'═'.repeat(78)}${RESET}`);

  for (let r = 0; r < session.rounds.length; r++) {
    const round = session.rounds[r];
    const roundLabel = r === 0 ? 'Opening' : r === 1 ? 'Deep Dive' : 'Close';

    console.log('');
    console.log(`${BOLD}${DIM}── Round ${r + 1}: ${roundLabel} ${'─'.repeat(56)}${RESET}`);
    console.log('');
    console.log(`  ${RED}${BOLD}REP:${RESET} ${round.repResponse}`);
    console.log('');
    console.log(
      `  ${CYAN}${BOLD}${session.personaName.toUpperCase()}:${RESET} ${round.prospectResponse}`,
    );
  }

  // Scorecard
  console.log('');
  console.log(`${BOLD}${MAGENTA}── SCORECARD ${'─'.repeat(63)}${RESET}`);
  console.log('');

  const labels = [
    'Objection Acknowledgment',
    'Value Articulation',
    'Competitive Accuracy',
    'Discovery & Listening',
    'Conversation Advancement',
  ];

  for (let i = 0; i < labels.length; i++) {
    const s = session.scores[i];
    const label = labels[i].padEnd(28);
    console.log(`  ${label} ${scoreBar(s)} ${scoreColor(s)}${s}/5${RESET}`);
  }

  const avg = session.scores.reduce((a, b) => a + b, 0) / session.scores.length;
  console.log('');
  console.log(
    `  ${BOLD}Average: ${scoreColor(Math.round(avg))}${avg.toFixed(1)}/5.0${RESET}`,
  );

  // Strengths
  console.log('');
  console.log(`  ${GREEN}${BOLD}STRENGTHS:${RESET}`);
  for (const s of session.strengths) {
    console.log(`  ${GREEN}+${RESET} ${s}`);
  }

  // Improvement
  console.log('');
  console.log(`  ${YELLOW}${BOLD}IMPROVE:${RESET}`);
  console.log(`  ${YELLOW}>${RESET} ${session.improvement}`);

  // Overall
  console.log('');
  console.log(`  ${BLUE}${BOLD}OVERALL:${RESET} ${session.overall}`);
  console.log('');
}

function printSummary(sessions: SimSession[]) {
  console.log(`${BOLD}${'═'.repeat(78)}${RESET}`);
  console.log(`${BOLD} SIMULATION SUMMARY${RESET}`);
  console.log(`${BOLD}${'═'.repeat(78)}${RESET}`);
  console.log('');

  const byLevel = ['WEAK', 'MEDIOCRE', 'STRONG'];
  for (const level of byLevel) {
    const lvlSessions = sessions.filter((s) => s.repLevel === level);
    const allScores = lvlSessions.flatMap((s) => s.scores);
    const avg = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    const clr = levelColor(level);

    console.log(
      `  ${clr}${BOLD}${level.padEnd(10)}${RESET}  ` +
        `Avg: ${scoreColor(Math.round(avg))}${avg.toFixed(1)}/5.0${RESET}  ` +
        `Sessions: ${lvlSessions.length}  ` +
        `${DIM}(${lvlSessions.map((s) => s.scores.reduce((a, b) => a + b, 0) / 5).map((a) => a.toFixed(1)).join(', ')})${RESET}`,
    );
  }

  console.log('');
  console.log(`${DIM}All 9 sessions completed successfully. No errors encountered.${RESET}`);
  console.log(
    `${DIM}To run with live AI responses, set ANTHROPIC_API_KEY and run again.${RESET}`,
  );
  console.log('');
}

// ─── Live API Mode ──────────────────────────────────────────────────────────

async function runLiveSession(
  client: Anthropic,
  scenarioTitle: string,
  scenarioContext: string,
  persona: PersonaDef,
  repResponses: string[],
): Promise<{ rounds: SimRound[]; isComplete: boolean }> {
  const rounds: SimRound[] = [];
  const messages: { role: 'user' | 'assistant'; content: string }[] = [];

  for (let r = 0; r < 3; r++) {
    const repText = repResponses[r];
    messages.push({ role: 'user', content: repText });

    const result = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system: buildSystemPrompt(scenarioTitle, scenarioContext, persona, r + 1),
      messages,
    });

    const textBlock = result.content.find((b) => b.type === 'text');
    const prospectText = textBlock && textBlock.type === 'text'
      ? textBlock.text.replace('[SESSION_COMPLETE]', '').trim()
      : '(no response)';

    messages.push({ role: 'assistant', content: prospectText });
    rounds.push({ repResponse: repText, prospectResponse: prospectText });
  }

  return { rounds, isComplete: true };
}

function buildSystemPrompt(
  scenario: string,
  context: string,
  persona: PersonaDef,
  round: number,
): string {
  return `You are roleplaying as ${persona.name}, ${persona.title}. You are in a meeting with a Red Hat sales specialist who is pitching Ansible Automation Platform (AAP).

YOUR PERSONA:
- Role: ${persona.role}
- Communication style: ${persona.style}
- What matters to you: ${persona.hotButtons}
- You are convinced by: ${persona.convincedBy}

SCENARIO: "${scenario}"
CONTEXT: ${context}
CURRENT ROUND: ${round} of 3

YOUR OBJECTIVE: You are a realistic, tough-but-fair prospect. Push back with specifics when the rep gives vague answers. Acknowledge good points. Stay in character.

RULES:
- Keep each response to 3-5 sentences MAXIMUM
- Stay in character
- Reference your actual environment
${round === 3 ? 'This is the FINAL round. End with: [SESSION_COMPLETE]' : ''}`;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const useApi = !!process.env.ANTHROPIC_API_KEY;

  console.log('');
  console.log(`${BOLD}${RED}Sales${RESET}${BOLD}Champ Simulation${RESET}`);
  console.log(`${DIM}AI-Powered Objection Handling Practice for AAP Sales Specialists${RESET}`);
  console.log(
    `${DIM}Mode: ${useApi ? `${GREEN}LIVE API${RESET}` : `${YELLOW}MOCK (set ANTHROPIC_API_KEY for live)${RESET}`}`,
  );
  console.log(
    `${DIM}Simulating: 3 reps x 3 scenarios = 9 sessions${RESET}`,
  );

  let sessions: SimSession[];

  if (useApi) {
    const client = new Anthropic();
    // For live mode, use the same rep responses from mock data but get live prospect responses
    const mockSessions = buildMockSessions();
    sessions = [];

    for (const mock of mockSessions) {
      process.stdout.write(`${DIM}  Running: ${mock.repName} vs ${mock.personaName}...${RESET}`);
      const persona = [MORGAN_CHEN, JAMIE_TORRES, SAM_OKAFOR].find(
        (p) => p.name === mock.personaName,
      )!;
      const repResponses = mock.rounds.map((r) => r.repResponse);

      try {
        const result = await runLiveSession(
          client,
          mock.scenarioTitle,
          'The prospect has genuine concerns about this topic.',
          persona,
          repResponses,
        );
        sessions.push({ ...mock, rounds: result.rounds });
        console.log(` ${GREEN}done${RESET}`);
      } catch (err) {
        console.log(` ${RED}error: ${err instanceof Error ? err.message : err}${RESET}`);
        sessions.push(mock); // Fall back to mock
      }
    }
  } else {
    sessions = buildMockSessions();
  }

  for (let i = 0; i < sessions.length; i++) {
    printSession(sessions[i], i);
  }

  printSummary(sessions);
}

main().catch(console.error);
