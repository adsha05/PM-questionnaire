
import { GoogleGenAI, Type } from "@google/genai";
import { UserResponse, QuizResults } from "./types";
import { QUIZ_QUESTIONS } from "./constants";

export const analyzePMInstincts = async (responses: UserResponse[], userName?: string): Promise<QuizResults> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const responseSummary = responses.map(res => {
    const question = QUIZ_QUESTIONS.find(q => q.id === res.questionId);
    const option = question?.options?.find(o => o.id === res.selectedOptionId);
    const textVal = res.textValue || res.followUpValue || '';
    return `Q${res.questionId}: [${question?.question}] -> Answer: ${option?.text || 'N/A'} ${textVal ? `(Nuance: ${textVal})` : ''}`;
  }).join("\n");

  const prompt = `
    Analyze the following 12 responses from a Product Manager named ${userName || 'Anonymous'} going through "The PM Instincts Gauntlet". 
    This is a professional but fun assessment of their intuition, pattern recognition, and risk appetite.

    User Responses:
    ${responseSummary}
    
    Categorize them into a distinct PM Archetype and determine their key stats.
    
    Required JSON Structure:
    1. archetype: A short, high-impact name (e.g., "The Scale Realist", "The Burn-Safe Optimizer").
    2. description: A single pithy quote or sentence summarizing their worldview.
    3. traits: Exactly 3 high-level signature traits (e.g., "Revenue-centric mindset").
    4. contextWhyItMatters: A paragraph explaining why this archetype is valuable and where they thrive (e.g., "Thrives in 'Big Deal' cultures like Salesforce").
    5. stats:
       - growthFocus: A number (0-100)
       - riskTolerance: Must be exactly "Low", "Medium", or "High"
       - dataDrivenScore: A number (1.0 to 10.0)
    6. similarityPercentage: A number (10-40)
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
              riskTolerance: { type: Type.STRING }, // "Low", "Medium", "High"
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
