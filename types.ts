
export interface Option {
  id: string;
  text: string;
  weight?: Record<string, number>; 
}

export interface Question {
  id: number;
  scenario?: string;
  question: string;
  options?: Option[];
  type: 'choice' | 'text' | 'hybrid';
  followUpPrompt?: string;
}

export interface UserInfo {
  name: string;
  email: string;
  company?: string;
  website?: string;
}

export interface UserResponse {
  questionId: number;
  selectedOptionId?: string;
  textValue?: string;
  followUpValue?: string;
}

export interface QuizResults {
  archetype: string;
  description: string;
  traits: string[];
  contextWhyItMatters: string;
  stats: {
    growthFocus: number;
    riskTolerance: 'Low' | 'Medium' | 'High';
    dataDrivenScore: number; // 1-10
  };
  similarityPercentage: number;
}

export enum AppState {
  WELCOME = 'WELCOME',
  DETAILS = 'DETAILS',
  QUIZ = 'QUIZ',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS'
}
