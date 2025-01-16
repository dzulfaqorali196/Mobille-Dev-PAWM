import { IconSymbolName } from '@/components/ui/IconSymbol';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type SectionType = 'text' | 'quiz' | 'code';

export interface CourseSection {
  id: string;
  title: string;
  type: SectionType;
  content: string;
  quiz?: Quiz[];
  order_number: number;
}

export interface Quiz {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
}

export interface Course {
  code: string;
  title: string;
  description: string;
  level: CourseLevel;
  duration: string;
  sections: CourseSection[];
  thumbnail_url?: string;
  estimated_time?: string;
  order_number?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Tipe data untuk tracking di Supabase
export interface CourseProgress {
  id: number;
  user_id: string;
  course_code: string;
  progress_percentage: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SectionProgress {
  id: number;
  user_id: string;
  course_code: string;
  section_id: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
} 