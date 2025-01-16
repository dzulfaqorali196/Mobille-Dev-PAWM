export interface Quiz {
  id: string;
  course_code: string;
  section_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
} 