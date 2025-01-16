export type QuestionType = 'multiple-choice' | 'code-completion' | 'drag-drop';

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  code?: string;
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  total_points: number;
  passing_score: number;
  time_limit?: number;
  created_at?: string;
  updated_at?: string;
}

export interface QuizProgress {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  answers: Record<number, string | string[]>;
  completed_at: string;
  created_at: string;
  updated_at: string;
} 