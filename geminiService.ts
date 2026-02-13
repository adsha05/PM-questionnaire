
import { GoogleGenAI, Type } from "@google/genai";
import { UserResponse, QuizResults } from "./types";
import { QUIZ_QUESTIONS } from "./constants";

export const analyzePMInstincts = async (responses: UserResponse[], userName?: string): Promise<QuizResults> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const responseSummary = responses.map(res => {
    const question = QUIZ_QUESTIONS.find(q => q.id === res.questionId);
    const option = question?.options?.find(o => o.id === res.selectedOptionId);
    const textVal = res.textValue || res.followUpValue || '';
    return `Q${res.questionId}: [${question?.question}] -> Answer: ${option?.id.toUpperCase()} (${option?.text || 'N/A'}) ${textVal ? `(Nuance: ${textVal})` : ''}`;
  }).join("\n");

  const prompt = `
    Analyze these 12 responses from a PM named ${userName || 'Anonymous'}. Use this scoring rubric to determine their archetype:

    RUBRIC:
    - Q1: B is Financial/Business (Sees cash as master metric). A is Product-focused. C is Growth-obsessed.
    - Q2: C is defensive/risk-mitigation (Correct move). A/B are offensive.
    - Q3: E is high diagnostic ability (Cohort/CAC drift).
    - Q4: C is balanced/mature (Spreading risk).
    - Q5: B/D show integrity and negotiating skill. A is desperate.
    - Q6: A is metrics-driven (onboarding funnel impact). B is reactive.
    - Q8: E/B are first-principles thinkers. A/D are surface-fixers.
    - Q9: D is foundational/platform thinking. A is hype-following.
    - Q10: C is strategic/collaborative (Speaks truth to power).
    - Q11: B is realistic (Spotting structural failure).
    - Q12: D/C show healthy engineering-product negotiation.

    Evaluate the user across three axes: Growth Focus (0-100), Risk Tolerance (Low/Medium/High), and Data-Driven Score (1-10).

    User Responses:
    ${responseSummary}
    
    Required JSON Structure:
    {
      "archetype": "High-impact name",
      "description": "Pithy one-sentence summary",
      "traits": ["Trait 1", "Trait 2", "Trait 3"],
      "contextWhyItMatters": "Deep insight into why this PM style is valuable and where they fit best (e.g. Early stage vs Scale up).",
      "stats": {
        "growthFocus": number,
        "riskTolerance": "Low" | "Medium" | "High",
        "dataDrivenScore": number
      },
      "similarityPercentage": number (10-45)
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          archetype: { type: Type.STRING },
          description: { type: Type.STRING },
          traits: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          contextWhyItMatters: { type: Type.STRING },
          stats: {
            type: Type.OBJECT,
            properties: {
              growthFocus: { type: Type.NUMBER },
              riskTolerance: { type: Type.STRING },
              dataDrivenScore: { type: Type.NUMBER }
            }
          },
          similarityPercentage: { type: Type.NUMBER }
        },
        required: ["archetype", "description", "traits", "contextWhyItMatters", "stats", "similarityPercentage"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  
  return JSON.parse(text) as QuizResults;
};
