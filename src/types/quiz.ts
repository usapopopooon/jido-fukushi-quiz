export type QuestionType = '4択' | '○×';

export type ServiceType = '児童発達支援' | '放課後等デイサービス' | '居宅訪問' | '共通';

export type Difficulty = '初級' | '中級' | '上級';

export interface Question4 {
  type: '4択';
  serviceType: ServiceType;
  category: string;
  difficulty: Difficulty;
  q: string;
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
  source?: string;
  sourceUrl?: string;
}

export interface QuestionOX {
  type: '○×';
  serviceType: ServiceType;
  category: string;
  difficulty: Difficulty;
  q: string;
  answer: boolean; // true = ○, false = ×
  explanation: string;
  source?: string;
  sourceUrl?: string;
}

export type Question = Question4 | QuestionOX;

export type Screen = 'start' | 'quiz' | 'result';

export interface AnswerResult {
  question: Question;
  correct: boolean;
}
