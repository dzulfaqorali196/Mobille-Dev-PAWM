import { IconSymbolName } from '@/components/ui/IconSymbol';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type SectionType = 'text' | 'quiz' | 'code';

export interface CourseSection {
  id: string;
  title: string;
  type: SectionType;
  content: string;
  description?: string;
  order_number: number;
  // Fields untuk quiz
  questions?: {
    id: number;
    question: string;
    options?: string[];
    correctAnswer: string | string[];
    explanation: string;
  }[];
  // Fields untuk code practice
  initial_code?: string;
  test_cases?: {
    input: string;
    expected: string;
  }[];
}

export interface Course {
  code: string;
  title: string;
  description: string;
  thumbnail_url: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimated_time: string;
  order_number: number;
  sections: CourseSection[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Tipe data untuk tracking di Supabase
export interface CourseProgress {
  id: string;
  user_id: string;
  course_code: string;
  last_section_id: string;
  progress_percentage: number;
  is_completed: boolean;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
}

export interface SectionProgress {
  id: string;
  user_id: string;
  course_code: string;
  section_id: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
} 