
import { Question } from './types';

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'choice',
    scenario: "18-month-old B2B SaaS. MRR: $68K, Monthly Burn: $195K, 12-mo Retention: 72%, Growth: 7% MoM, NPS: 44. Team: 21.",
    question: "What stands out as the BIGGEST issue?",
    options: [
      { id: 'a', text: "Retention is too low (72% is concerning for SaaS)" },
      { id: 'b', text: "Burn rate is catastrophic (2.9x revenue)" },
      { id: 'c', text: "Growth is slowing (7% is below Series A expectations)" },
      { id: 'd', text: "NPS is mediocre (should be 50+)" },
      { id: 'e', text: "No major issue; metrics are reasonable" }
    ]
  },
  {
    id: 2,
    type: 'choice',
    scenario: "CloudSync (Enterprise file sync). Dropbox launches a free enterprise tier. Your churn jumps 2% → 3.5%. Runway: 14 months.",
    question: "What is your strategic priority for next quarter?",
    options: [
      { id: 'a', text: "Double down on differentiation (unique features)" },
      { id: 'b', text: "Accelerate land-and-expand (upsell existing)" },
      { id: 'c', text: "Reduce burn rate (extend runway, buy time)" },
      { id: 'd', text: "Raise Series B ASAP (outspend the competition)" },
      { id: 'e', text: "Explore acquisition/partnership opportunities" }
    ]
  },
  {
    id: 3,
    type: 'choice',
    scenario: "DataFlow (data analytics). MRR is growing, but churn is trending: 1.2% → 1.8% → 2.4% over 90 days.",
    question: "What does this rising churn trend likely signal?",
    options: [
      { id: 'a', text: "Normal variation (noise in the data)" },
      { id: 'b', text: "Product quality issues or bugs" },
      { id: 'c', text: "Market saturation in your segment" },
      { id: 'd', text: "A recent pricing increase backfired" },
      { id: 'e', text: "CAC quality decreasing (acquiring wrong-fit customers)" }
    ]
  },
  {
    id: 4,
    type: 'choice',
    scenario: "SwiftCode. Just raised $6M Series A. MRR: $42K, Burn: $185K/mo, LTV:CAC: 12:1 (stellar).",
    question: "Which growth strategy for the next 6 months?",
    options: [
      { id: 'a', text: "PLG only (content + virality)" },
      { id: 'b', text: "Enterprise sales only (bigger deals)" },
      { id: 'c', text: "Hybrid (split resources between both)" },
      { id: 'd', text: "Stay lean (reduce burn, ignore growth for now)" }
    ]
  },
  {
    id: 5,
    type: 'choice',
    scenario: "NexGen AI. Runway: 8 months, weak unit economics. Investor offers $12M at $40M valuation, demanding $200K MRR (from $38K) in 10 months.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Take the money immediately (runway is critical)" },
      { id: 'b', text: "Renegotiate for lower valuation and safer targets" },
      { id: 'c', text: "Turn it down (fix fundamentals first)" },
      { id: 'd', text: "Take it but be transparent about risks" }
    ]
  },
  {
    id: 6,
    type: 'choice',
    scenario: "MetricsPro. 5 engineers, 14-month runway. Users complain: 60% onboarding drop-off, missing integrations, and a competitor with better UX.",
    question: "One 4-week sprint. What do you prioritize?",
    options: [
      { id: 'a', text: "Fix onboarding (reduce drop-off, direct revenue impact)" },
      { id: 'b', text: "Add 3 requested integrations (feature requests)" },
      { id: 'c', text: "Full UX/Design overhaul (long-term advantage)" },
      { id: 'd', text: "Hire more engineers (solve capacity problem)" }
    ]
  },
  {
    id: 7,
    type: 'choice',
    scenario: "You have 20K users. You need to decide if 'dark mode' is worth the engineering effort.",
    question: "What's your primary research approach?",
    options: [
      { id: 'a', text: "Send a survey to all 20K users asking 'Do you want it?'" },
      { id: 'b', text: "Interview 15 power users deeply about workflow pain" },
      { id: 'c', text: "Launch a lightweight in-app poll with email capture" },
      { id: 'd', text: "Check analytics for night-time churn patterns" },
      { id: 'e', text: "Ask sales what customers are asking for" }
    ]
  },
  {
    id: 8,
    type: 'choice',
    scenario: "Your onboarding shows: 100 signups -> 40% Step 1 -> 20% Step 2 -> 10% Step 3 -> 8% Active. Drop-off is between Steps 2 and 3.",
    question: "What is your first diagnostic move?",
    options: [
      { id: 'a', text: "Add tooltips to Step 3 (UX improvement)" },
      { id: 'b', text: "Interview 20 users who dropped at the boundary" },
      { id: 'c', text: "A/B test removing Step 3 entirely" },
      { id: 'd', text: "Build more in-app help documentation" },
      { id: 'e', text: "Investigate: Is Step 3 actually necessary for value?" }
    ]
  },
  {
    id: 9,
    type: 'choice',
    scenario: "Note-taking for engineers. Built: snippets, syntax. Asking for: AI Summary (12), GitHub (8), Collab (5), Search (3), Offline (2).",
    question: "You can pick ONE to build next. Which one?",
    options: [
      { id: 'a', text: "AI summarization (most requested, trendy)" },
      { id: 'b', text: "GitHub integration (enterprise revenue signal)" },
      { id: 'c', text: "Collaboration (TAM expansion)" },
      { id: 'd', text: "Better search (foundational utility)" },
      { id: 'e', text: "Offline mode (strategic moat)" }
    ]
  },
  {
    id: 10,
    type: 'choice',
    scenario: "Your CEO tells VCs: 'We'll hit $2M ARR in 12 months.' Current: $300K ARR, 8% MoM growth. Math requires 25% MoM.",
    question: "What's your internal move?",
    options: [
      { id: 'a', text: "Support the narrative (CEO's vision)" },
      { id: 'b', text: "Privately tell CEO the math doesn't work" },
      { id: 'c', text: "Present 'Base Case' vs 'Moonshot' to the board" },
      { id: 'd', text: "Say nothing; let the market decide" }
    ]
  },
  {
    id: 11,
    type: 'choice',
    scenario: "SuccessIO Interview: CEO claims 5x growth in 6mo, high burn ($250k), $300k CEO salary, 2 PMs just left.",
    question: "What's your assessment?",
    options: [
      { id: 'a', text: "Great opportunity (high growth potential)" },
      { id: 'b', text: "Major red flags; walk away immediately" },
      { id: 'c', text: "Conditional yes (if burn is reduced)" },
      { id: 'd', text: "Wait and see (need more data)" }
    ]
  },
  {
    id: 12,
    type: 'hybrid',
    scenario: "Codebase is a mess. 40% of capacity is bug fixes. Team asks for 4-sprint refactor. Runway is 14 months.",
    question: "How do you respond?",
    options: [
      { id: 'a', text: "Approve the full refactor (long-term health)" },
      { id: 'b', text: "Reject it (focus exclusively on growth)" },
      { id: 'c', text: "Negotiate: 2-sprint refactor + 2-sprint features" },
      { id: 'd', text: "Verify: Quantify the slowdown and bug data first" }
    ],
    followUpPrompt: "In one sentence, why did you choose that trade-off?"
  }
];

export const ARCHETYPES_PREVIEW = [
  { name: "The Growth Hacker", description: "Moves fast, breaks things, worships the funnel.", icon: "⚡" },
  { name: "The Visionary Architect", description: "Builds for the world as it should be, not as it is.", icon: "🏛️" },
  { name: "The Analytical Pragmatist", description: "Data is the only source of truth. Slow is smooth, smooth is fast.", icon: "📊" },
  { name: "The User Empath", description: "If the user isn't crying with joy, the job isn't done.", icon: "❤️" }
];
