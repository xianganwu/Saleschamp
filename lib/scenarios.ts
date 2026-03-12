import type { Scenario, ScenarioCategory } from '@/types/session';

export const SCENARIOS: readonly Scenario[] = [
  // --- vs. Upstream / Open Source ---
  {
    id: 'ansible-cli-free',
    title: 'Ansible CLI is free -- why would we pay for AAP?',
    description: 'Prospect uses community Ansible for ad-hoc tasks and sees no reason to pay.',
    category: 'upstream',
    context: 'The prospect runs Ansible CLI across ~200 servers for configuration management and ad-hoc tasks. A team of 3 engineers maintains playbooks in a shared Git repo. They have no centralized credential management and run playbooks from individual laptops. They have had incidents where a junior engineer ran a playbook against production by mistake.',
  },
  {
    id: 'awx-production',
    title: 'We run AWX in production and it does everything we need.',
    description: 'Prospect self-hosts AWX and considers it equivalent to AAP.',
    category: 'upstream',
    context: 'The prospect deployed AWX 18 months ago on a single VM. They use it for job scheduling and RBAC. They have 5 people using it. They have hit issues with upgrades (broke once during a minor version bump) and have no support contract. Their security team recently asked about SOC 2 compliance for their automation tooling.',
  },
  {
    id: 'no-enterprise-support',
    title: "We don't need enterprise support -- our team handles open source fine.",
    description: 'Prospect has strong internal engineering and questions subscription value.',
    category: 'upstream',
    context: 'The prospect has a 12-person platform engineering team that is highly skilled. They run multiple open source tools without vendor support. They pride themselves on self-sufficiency. However, their mean-time-to-resolve for automation platform issues is 4-6 hours, and they had a critical CVE in an upstream dependency last quarter that took 2 weeks to patch.',
  },

  // --- vs. Competitive Tooling ---
  {
    id: 'terraform-standard',
    title: 'We standardized on Terraform for all our infrastructure automation.',
    description: 'Prospect uses Terraform extensively and sees it as the single answer.',
    category: 'competitive',
    context: 'The prospect manages 3,000+ cloud resources across AWS and Azure using Terraform. They have a mature IaC pipeline. However, they struggle with Day 2 operations: patching, configuration drift remediation, application deployment, and network device management. They have separate manual processes for these tasks.',
  },
  {
    id: 'puppet-works-fine',
    title: 'We have Puppet and it works fine for configuration management.',
    description: 'Prospect has an established Puppet deployment and resists change.',
    category: 'competitive',
    context: 'The prospect has 800 nodes managed by Puppet with 5 years of accumulated modules. Two senior engineers are Puppet experts. However, they are hiring for 3 open positions and candidates do not know Puppet. Their Puppet infrastructure requires dedicated agent management and a Puppet server cluster. They are expanding into cloud and containers where Puppet has less coverage.',
  },
  {
    id: 'cloud-native-tools',
    title: "Our cloud provider's native tools handle everything.",
    description: 'Prospect is deep in a single cloud and uses native automation.',
    category: 'competitive',
    context: 'The prospect is 80% AWS, using Systems Manager, CloudFormation, and Lambda for automation. They have a small Azure footprint growing to 20% due to an acquisition. They also have 50 on-prem servers in a data center that they manage with ad-hoc scripts. Their CTO has mandated a hybrid cloud strategy.',
  },
  {
    id: 'servicenow-itsm',
    title: 'ServiceNow already handles our IT automation and ITSM workflows.',
    description: 'Prospect views ServiceNow as their automation layer.',
    category: 'competitive',
    context: 'The prospect uses ServiceNow for ticketing, change management, and basic orchestration. They have ServiceNow Orchestration but it is limited to simple API calls and VM provisioning. They want to automate network changes, OS patching, and security remediation but ServiceNow cannot reach their on-prem network devices or edge locations.',
  },

  // --- Value & Business Justification ---
  {
    id: 'cost-too-high',
    title: "The subscription cost is too high -- we can't justify the budget.",
    description: 'Classic budget objection in a cost-cutting environment.',
    category: 'value',
    context: 'The prospect is in a cost-reduction cycle. Their IT budget was cut 15% this year. They have 500 managed nodes and the AAP subscription quote is $120K/year. They currently spend approximately $180K/year in engineer time on manual processes and incident response related to automation gaps, but they have not quantified this.',
  },
  {
    id: 'not-ready-for-platform',
    title: "We're early in our automation journey -- we're not ready for a platform.",
    description: 'Prospect feels AAP is overkill for their maturity level.',
    category: 'value',
    context: 'The prospect has 3 engineers who started writing Ansible playbooks 6 months ago. They have about 20 playbooks in a Git repo. They run them manually from their laptops. They want to do more automation but feel overwhelmed by the scope of a full platform. They are interested in expanding but unsure where to start.',
  },
  {
    id: 'cant-show-roi',
    title: "We can't show ROI on automation to our leadership.",
    description: 'Prospect struggles to build an internal business case.',
    category: 'value',
    context: 'The prospect is a mid-level manager who sees the value of AAP but cannot get budget approval. Their VP wants hard numbers: cost savings, FTE equivalents, incident reduction. The prospect does not have baseline metrics for manual effort today. They need help building a business case.',
  },

  // --- Technical & Architecture Objections ---
  {
    id: 'kubernetes-native',
    title: "We're moving to Kubernetes -- shouldn't we use K8s-native tooling?",
    description: 'Prospect is deep into cloud-native transformation.',
    category: 'technical',
    context: 'The prospect is migrating applications to OpenShift/Kubernetes. They have 15 clusters across dev, staging, and production. They use Helm and ArgoCD for application deployment. However, they still need to manage the underlying infrastructure: VM provisioning, OS configuration, network setup, and storage management. They also need Day 2 cluster operations.',
  },
  {
    id: 'ansible-too-slow',
    title: "Ansible is too slow for our scale -- we've had performance issues.",
    description: 'Prospect has hit scaling walls with community Ansible.',
    category: 'technical',
    context: 'The prospect manages 5,000 nodes. Running a simple fact-gathering playbook takes 45 minutes from a single control node. They have tried increasing forks but hit memory limits. They have considered breaking their inventory into smaller chunks but this adds operational complexity. They have not used execution environments or automation mesh.',
  },
  {
    id: 'security-ssh-concerns',
    title: 'Our security team has concerns about agentless SSH-based automation.',
    description: "Prospect's security org pushes back on SSH management.",
    category: 'technical',
    context: 'The prospect CISO flagged that SSH-based automation from a single control node is a security risk: credential sprawl, lateral movement potential, no audit trail. Their security team prefers agent-based tools where credentials stay on a central server. They have a zero-trust network architecture initiative underway.',
  },
  {
    id: 'just-need-scheduler',
    title: "We just need a job scheduler, not a whole automation platform.",
    description: 'Prospect thinks cron or a simple scheduler is sufficient.',
    category: 'technical',
    context: 'The prospect runs 150 cron jobs across 30 servers for operational tasks: log rotation, backups, certificate renewal, health checks. When a cron job fails, no one knows until something downstream breaks. They have no centralized visibility, no RBAC (any admin can modify cron), and no audit trail of what ran and when.',
  },
  {
    id: 'lightspeed-unreliable',
    title: "AI-generated automation is unreliable -- we don't trust Lightspeed.",
    description: 'Prospect is skeptical of Ansible Lightspeed with IBM watsonx.',
    category: 'technical',
    context: 'The prospect tried GitHub Copilot for Ansible content and got poor results: incorrect module usage, security anti-patterns, non-idempotent tasks. They are skeptical that any AI tool can generate production-quality automation content. Their team is small and spends 60% of time writing new playbooks vs 40% maintaining existing ones.',
  },
] as const;

export const CATEGORY_LABELS: Record<ScenarioCategory, string> = {
  upstream: 'vs. Upstream / Open Source',
  competitive: 'vs. Competitive Tooling',
  value: 'Value & Business Justification',
  technical: 'Technical & Architecture',
};
