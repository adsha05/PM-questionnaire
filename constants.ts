
import { Question } from './types';

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'choice',
    scenario: "Scenario: You're PM at a B2B SaaS tool. Last 30 days of user feedback:\n- 12 customers: \"Onboarding is confusing, took 3 hours to get started\"\n- 8 customers: \"Missing Salesforce integration\"\n- 6 customers: \"Dashboard is slow sometimes\"\n- 5 customers: \"Your pricing is expensive vs competitor\"\n- 3 customers: \"Love the product but wish I could export reports easier\"\nYour engineering capacity: 2 weeks for next sprint.",
    question: "What's your top priority to build?",
    options: [
      { id: 'a', text: "Fix onboarding (most complaints, first impression)" },
      { id: 'b', text: "Add Salesforce integration (feature gap)" },
      { id: 'c', text: "Improve dashboard speed (performance issue)" },
      { id: 'd', text: "Add export feature (customer request)" },
      { id: 'e', text: "None of above / need more data" }
    ]
  },
  {
    id: 2,
    type: 'choice',
    scenario: "Scenario: You're PM at a productivity tool. Customers keep asking for: \"Dark mode\". 7 customers mentioned it, it comes up in surveys, and it's a \"nice to have\". Meanwhile, data shows: 40% of users don't return after day 7, session length is declining, and users struggle to find key features.",
    question: "What does this signal mean?",
    options: [
      { id: 'a', text: "Build dark mode (customers are asking for it)" },
      { id: 'b', text: "Ignore dark mode, fix onboarding (real problem is engagement)" },
      { id: 'c', text: "Build dark mode AND fix onboarding (can't prioritize)" },
      { id: 'd', text: "A/B test dark mode (validate demand first)" },
      { id: 'e', text: "Not enough information to decide" }
    ]
  },
  {
    id: 3,
    type: 'choice',
    scenario: "Scenario: You're PM at an analytics platform. Your team has 1 engineer for 6 weeks. Options: 1. Report export (4 customers, 30% impact, 2-wk build); 2. Slack alerts (6 customers, high engagement, 1-wk build); 3. Dashboard dataset filtering performance (20% impact, 3-wk build); 4. Team permissions ($500k enterprise deal potential, 4-wk build); 5. Mobile app (10 customers, 8-wk build).",
    question: "What's your strategy?",
    options: [
      { id: 'a', text: "Build Slack alerts (fastest win, high impact)" },
      { id: 'b', text: "Fix dashboard performance (core product issue)" },
      { id: 'c', text: "Build report export (broad user base)" },
      { id: 'd', text: "Go after enterprise (Slack alerts + start permissions work)" },
      { id: 'e', text: "Do nothing this sprint (none of these are critical)" }
    ]
  },
  {
    id: 4,
    type: 'choice',
    scenario: "Scenario: You're PM at a SaaS tool. Month 16: $45k MRR, 1.2% churn. Month 17: $48k MRR, 1.8% churn. Month 18: $51k MRR, 2.4% churn. No major bugs, no pricing complaints, engagement flat. Churned users say: \"It's become too complicated for our use case.\"",
    question: "What's really happening?",
    options: [
      { id: 'a', text: "Normal variation (churn goes up and down)" },
      { id: 'b', text: "Feature creep is making product worse (optimizing for enterprise, losing SMB)" },
      { id: 'c', text: "We're acquiring worse-fit customers (lower quality cohorts)" },
      { id: 'd', text: "Product quality is declining (need to focus on fundamentals)" },
      { id: 'e', text: "Just need better customer success / support" }
    ]
  },
  {
    id: 5,
    type: 'choice',
    scenario: "Scenario: PM at \"DocFlow\" (SMB document collaboration). 2.5% churn, NPS 42. Most users use 2-3 features. 5% of customers use ADVANCED features (permissions/workflows), have 0% churn, and pay 2x more. CEO asks: \"Should we focus on power users?\"",
    question: "What's your recommendation?",
    options: [
      { id: 'a', text: "Yes, focus on power users (higher engagement, less churn)" },
      { id: 'b', text: "No, focus on SMB core (bigger market, easier to acquire)" },
      { id: 'c', text: "Both (build for power users AND keep SMB happy)" },
      { id: 'd', text: "It's a false choice (both can coexist if you design right)" },
      { id: 'e', text: "Need to understand power users better before deciding" }
    ]
  },
  {
    id: 6,
    type: 'choice',
    scenario: "Scenario: PM at a content creation tool. DAU growing 15% MoM, MAU 8% MoM. Retention (Day 30) declining from 40% to 35%. 80% of users use only 1 feature. Churn stable at 2%. Pattern: More users coming in, but fewer staying.",
    question: "What does this pattern tell you?",
    options: [
      { id: 'a', text: "Product is working (growing DAU/MAU is positive)" },
      { id: 'b', text: "Acquisition quality declining (new users are worse fit)" },
      { id: 'c', text: "Product isn't sticky enough (users come back less)" },
      { id: 'd', text: "Feature concentration is problem (need to expand feature set)" },
      { id: 'e', text: "All of above (multiple issues)" }
    ]
  },
  {
    id: 7,
    type: 'choice',
    scenario: "Scenario: You want to improve onboarding. 1. Talk to power users (1 week, shows what works, biased sample); 2. Talk to users who quit (2 weeks, shows what's broken, small sample); 3. Quantitative analysis (3 days, shows where people drop, doesn't explain why).",
    question: "Which is your top priority?",
    options: [
      { id: 'a', text: "Research power users (understand what works)" },
      { id: 'b', text: "Research people who quit (understand what breaks)" },
      { id: 'c', text: "Quantitative funnel analysis (find drop-off points)" },
      { id: 'd', text: "All three (do them all, take your time)" },
      { id: 'e', text: "Run quick experiments (faster than research)" }
    ]
  },
  {
    id: 8,
    type: 'choice',
    scenario: "Scenario: Building \"team collaboration\". Original scope: comments, mentions, permissions (4 weeks). Feedback during build: threads, notifications, resolve, export (each adds 1 week). Now an 8-week project. Board presentation is in 5 weeks. CEO wants it shipped.",
    question: "What's your move?",
    options: [
      { id: 'a', text: "Ship basic version in 4 weeks (comments + mentions + permissions, iterate later)" },
      { id: 'b', text: "Prioritize top 2 requests (push to 6 weeks, get 80% of value)" },
      { id: 'c', text: "Push presentation (tell CEO you need 8 weeks for full feature)" },
      { id: 'd', text: "Cut less important features elsewhere (make room for this)" },
      { id: 'e', text: "This is fine, just work harder (ship in 5 weeks)" }
    ]
  },
  {
    id: 9,
    type: 'choice',
    scenario: "Scenario: Year-end planning. $500k investment choice. Option A: Improve retention (30% churn reduction, benefits 50k existing users, long-term value). Option B: Improve onboarding (40% activation improvement, acquire users faster, growth momentum). CFO wants ROI on one.",
    question: "How do you think about this?",
    options: [
      { id: 'a', text: "Retention (keep what you have, build moat)" },
      { id: 'b', text: "Acquisition (grow faster, momentum matters)" },
      { id: 'c', text: "Depends on current metrics (show me the math)" },
      { id: 'd', text: "Both simultaneously (find different budget)" },
      { id: 'e', text: "Neither (focus on product quality instead)" }
    ]
  },
  {
    id: 10,
    type: 'choice',
    scenario: "Scenario: Monitoring dashboards. Week 1: 90% retention. Week 2: 60%. Week 3: 35%. Week 4: 20%. Deep dive: Day 2 retention is 85% if they come back, but biggest drop is Day 1 to Day 2 (90% to 60%). No bugs. Onboarding completion is 80%.",
    question: "What's the real problem?",
    options: [
      { id: 'a', text: "Onboarding is broken (users completing but not understanding value)" },
      { id: 'b', text: "First-day experience is wrong (users don't see value quickly enough)" },
      { id: 'c', text: "Post-signup email is broken (not reminding users to come back)" },
      { id: 'd', text: "Product has a specific bug (not showing in reports)" },
      { id: 'e', text: "Users are low-intent (wrong targeting)" }
    ]
  },
  {
    id: 11,
    type: 'choice',
    scenario: "Scenario: Design tool PM. Top enterprise customer ($50k/yr) asks for \"Custom color picker to match brand\" for the 3rd time. Feature is 2-week build. Only 1 customer wants it. Roadmap has Performance, API, and Integrations. They hint at renewal risk.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Build it immediately (biggest customer, at risk)" },
      { id: 'b', text: "Schedule it for next quarter (acknowledge, but don't prioritize)" },
      { id: 'c', text: "Offer custom solution (professional services engagement)" },
      { id: 'd', text: "Say no, but invest in what they really need (understand deeper issue)" },
      { id: 'e', text: "Build it, even if it delays other work (customer is paying for it)" }
    ]
  },
  {
    id: 12,
    type: 'choice',
    scenario: "Scenario: Analytics tool. Marketing analytics (60% users, 2% churn, 15% growth, high engagement). Sales analytics (40% users, 4% churn, 3% growth, low engagement). Team capacity: 1 major feature set. Option: Focus on marketing OR try to fix sales.",
    question: "What's your strategy?",
    options: [
      { id: 'a', text: "Double down on marketing (maximize strength, let sales atrophy)" },
      { id: 'b', text: "Fix sales (serve all customers well)" },
      { id: 'c', text: "Separate products (marketing product, sales product)" },
      { id: 'd', text: "Depends on revenue split (which segment pays more)" },
      { id: 'e', text: "Keep both, improve slowly (both deserve attention)" }
    ]
  },
  {
    id: 13,
    type: 'text',
    question: "Question 13 (OPTIONAL - Personal Reflection): Think about a product decision you made that you'd reverse if you could. What was it? What would you do differently?",
  }
];

export const ARCHETYPES_PREVIEW = [
  { name: "Strategic Thinker", description: "Prioritizes long-term product health and business viability.", icon: "🎯" },
  { name: "Data-Driven PM", description: "Reliant on metrics and experimentation to guide decisions.", icon: "📊" },
  { name: "Customer Advocate", description: "Focused deeply on solving user pain points above all else.", icon: "👥" },
  { name: "Execution Specialist", description: "Excels at shipping features and managing scope under pressure.", icon: "⚙️" }
];
