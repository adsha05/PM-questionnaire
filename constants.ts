
import { Question } from './types';

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'choice',
    scenario: "You're PM at 'GrowthLabs' (B2B SaaS analytics). Month 18 snapshot: MRR $68k, Burn $195k, Runway 13m, Retention 72%, Growth 7% MoM, NPS 44, Team 21.",
    question: "What stands out as the BIGGEST issue?",
    options: [
      { id: 'a', text: "Retention is too low (72% is weak)" },
      { id: 'b', text: "Burn rate relative to revenue (burning 2.9x revenue)" },
      { id: 'c', text: "Growth is slowing (7% is below Series A expectations)" },
      { id: 'd', text: "NPS is mediocre (should be 50+)" },
      { id: 'e', text: "No major issue (metrics are reasonable)" }
    ]
  },
  {
    id: 2,
    type: 'choice',
    scenario: "You're PM at 'CloudSync' (enterprise file sync). Dropbox just launched a free enterprise competitor. Your churn increased from 2% to 3.5%. TAM is $12B (5% penetrated). 14 months runway.",
    question: "What's your strategic priority for next quarter?",
    options: [
      { id: 'a', text: "Double down on differentiation (unique features)" },
      { id: 'b', text: "Accelerate land-and-expand (upsell existing)" },
      { id: 'c', text: "Reduce burn rate (extend runway)" },
      { id: 'd', text: "Raise Series B ASAP (outspend competitors)" },
      { id: 'e', text: "Explore acquisition/partnership opportunities" }
    ]
  },
  {
    id: 3,
    type: 'choice',
    scenario: "You're PM at 'DataFlow'. Metrics over 3 months: Month 16 ($52k MRR, 1.2% churn), Month 17 ($54k MRR, 1.8% churn), Month 18 ($56k MRR, 2.4% churn).",
    question: "What does the rising churn trend signal?",
    options: [
      { id: 'a', text: "Normal variation (not concerning)" },
      { id: 'b', text: "Product quality is declining (bugs)" },
      { id: 'c', text: "Market saturation in our segment" },
      { id: 'd', text: "Pricing increase consequences" },
      { id: 'e', text: "CAC quality decreasing (acquiring worse-fit users)" }
    ]
  },
  {
    id: 4,
    type: 'choice',
    scenario: "You're PM at 'SwiftCode'. Series A closed ($6M raised), $42k MRR, $185k/mo burn, 17m runway, 8.5% MoM growth. LTV:CAC is 12:1.",
    question: "Your CEO asks for the 6-month growth strategy. What do you recommend?",
    options: [
      { id: 'a', text: "Product-Led Growth (PLG) only (go deep on free tier)" },
      { id: 'b', text: "Enterprise Sales only (bigger deals, faster revenue)" },
      { id: 'c', text: "Hybrid (diversify growth engines)" },
      { id: 'd', text: "None (reduce burn, stay lean)" },
      { id: 'e', text: "Other (non-conventional approach)" }
    ]
  },
  {
    id: 5,
    type: 'choice',
    scenario: "You're PM at 'NexGen AI'. MRR $38k, Burn $220k/mo, 8m runway. Churn is 4.5% and rising. You just got a Series B term sheet ($12M) but it requires hitting $200k MRR in 10 months.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Take the money immediately (runway is critical)" },
      { id: 'b', text: "Renegotiate terms (lower valuation, safer targets)" },
      { id: 'c', text: "Turn it down (fix fundamentals first)" },
      { id: 'd', text: "Take it but be honest about risks with the investor" },
      { id: 'e', text: "Shop for better terms with other investors" }
    ]
  },
  {
    id: 6,
    type: 'choice',
    scenario: "You're PM at 'MetricsPro'. 5 engineers, 14m runway, $45k MRR. Major issues: 60% onboarding drop-off, 3 missing key integrations, new competitor with better UX.",
    question: "You have 4 weeks for ONE sprint. What's the priority?",
    options: [
      { id: 'a', text: "Fix onboarding (reduce drop-off 60% -> 40%)" },
      { id: 'b', text: "Add 3 integrations (address requests, increase LTV)" },
      { id: 'c', text: "Improve UX/design (compete against entrant)" },
      { id: 'd', text: "Hire/Train new engineers (increase capacity)" },
      { id: 'e', text: "Focus on sales (need revenue now)" }
    ]
  },
  {
    id: 7,
    type: 'choice',
    scenario: "You're PM at 'EventFlow' ($35k MRR, 3% churn). Growth is slowing. Paths: A (Virtual events, doubles TAM, 8 weeks), B (Upmarket enterprise, 5-10x LTV, 12 weeks), C (Fix current SMB product, 4 weeks).",
    question: "Which path do you choose?",
    options: [
      { id: 'a', text: "Expand to virtual events (Path A)" },
      { id: 'b', text: "Go upmarket to enterprise (Path B)" },
      { id: 'c', text: "Improve current product (Path C)" },
      { id: 'd', text: "A + B hybrid (ambitious, risky)" },
      { id: 'e', text: "Explore a completely different market" }
    ]
  },
  {
    id: 8,
    type: 'choice',
    scenario: "You're PM at 'TalentSeek' ($52k MRR, 15m runway). CEO is pitching VCs for Series B, claiming $2M ARR by month 30. Internal math says that's 25% MoM growth (3x current).",
    question: "What's your move?",
    options: [
      { id: 'a', text: "Support the narrative (VCs love growth projections)" },
      { id: 'b', text: "Privately tell CEO the math doesn't work" },
      { id: 'c', text: "Create alternate scenarios (base vs moonshot)" },
      { id: 'd', text: "Look for a new job (this is fraud-adjacent)" },
      { id: 'e', text: "Say nothing (CEO's problem)" }
    ]
  },
  {
    id: 9,
    type: 'choice',
    scenario: "You're interviewing at 'SuccessIO'. Founded 18m ago, $150k MRR, $250k burn. CEO salary is $300k. 2 senior PMs left in 3 months. No Series B started yet.",
    question: "What's your assessment?",
    options: [
      { id: 'a', text: "Great opportunity (room to optimize)" },
      { id: 'b', text: "Red flags (concerning signals, walk away)" },
      { id: 'c', text: "Conditional yes (if burn is reduced)" },
      { id: 'd', text: "Wait and see (check back in 6 months)" },
      { id: 'e', text: "No assessment (not enough info)" }
    ]
  },
  {
    id: 10,
    type: 'choice',
    scenario: "Compare 3 companies at Month 20. A (20% growth, 0.8% churn, 25:1 LTV:CAC), B (8% growth, 1.5% churn, 8:1 LTV:CAC), C (3% growth, 3.2% churn, 2.1:1 LTV:CAC).",
    question: "Rank by 'most likely to succeed in 3 years'.",
    options: [
      { id: 'a', text: "A > B > C" },
      { id: 'b', text: "A > C > B" },
      { id: 'c', text: "B > A > C" },
      { id: 'd', text: "C > B > A" },
      { id: 'e', text: "B = A > C" }
    ]
  },
  {
    id: 11,
    type: 'text',
    question: "Think about the worst product decision you made (or saw) at a startup. What was the red flag nobody paid attention to?",
  },
  {
    id: 12,
    type: 'hybrid',
    question: "At Series A, what metric worries you most?",
    options: [
      { id: 'a', text: "Revenue growth" },
      { id: 'b', text: "Unit economics" },
      { id: 'c', text: "Team quality" },
      { id: 'd', text: "Market demand" },
      { id: 'e', text: "Competition" }
    ],
    followUpPrompt: "Briefly, why did you pick that?"
  }
];

export const ARCHETYPES_PREVIEW = [
  { name: "The Growth Hacker", description: "Moves fast, breaks things, worships the funnel.", icon: "⚡" },
  { name: "The Visionary Architect", description: "Builds for the world as it should be, not as it is.", icon: "🏛️" },
  { name: "The Analytical Pragmatist", description: "Data is the only source of truth. Slow is smooth, smooth is fast.", icon: "📊" },
  { name: "The User Empath", description: "If the user isn't crying with joy, the job isn't done.", icon: "❤️" }
];
