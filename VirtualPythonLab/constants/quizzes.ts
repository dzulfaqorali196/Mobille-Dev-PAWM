export interface Quiz {
  id: string;
  course_code: string;
  section_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export const QUIZZES: Quiz[] = [
  // Python Basics (PY001) Quiz
  {
    id: "quiz-py001-1",
    course_code: "PY001",
    section_id: "PY001_03",
    question: "Manakah yang merupakan tipe data di Python?",
    options: [
      "str",
      "string", 
      "text",
      "chars"
    ],
    correct_answer: 0,
    explanation: "str adalah tipe data bawaan Python untuk string/teks"
  },
  {
    id: "quiz-py001-2",
    course_code: "PY001",
    section_id: "PY001_03",
    question: "Bagaimana cara membuat variabel dengan nilai desimal di Python?",
    options: [
      "angka = 3.14",
      "float angka = 3.14",
      "decimal angka = 3.14",
      "var angka = 3.14"
    ],
    correct_answer: 0,
    explanation: "Python menggunakan type inference, jadi kita tidak perlu mendeklarasikan tipe data"
  },
  {
    id: "quiz-py001-3",
    course_code: "PY001",
    section_id: "PY001_03",
    question: "Manakah yang merupakan nama variabel yang valid di Python?",
    options: [
      "_nama",
      "2nama",
      "nama-saya",
      "class"
    ],
    correct_answer: 0,
    explanation: "Variabel dapat dimulai dengan underscore, tapi tidak dengan angka atau menggunakan kata kunci Python"
  }
]; 