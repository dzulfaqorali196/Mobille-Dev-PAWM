import { Quiz } from "../types/quiz";

export const QUIZZES: Quiz[] = [
  {
    id: "quiz-python-basic-1",
    title: "Pengenalan Python",
    description: "Quiz tentang dasar-dasar Python",
    total_points: 100,
    passing_score: 70,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "Apa ekstensi file Python?",
        options: [".py", ".python", ".pyt", ".pt"],
        correctAnswer: ".py",
        explanation: "File Python menggunakan ekstensi .py",
        points: 20
      },
      {
        id: 2,
        type: "multiple-choice",
        question: "Bagaimana cara menulis komentar satu baris di Python?",
        options: ["// Komentar", "# Komentar", "/* Komentar */", "-- Komentar"],
        correctAnswer: "# Komentar",
        explanation: "Python menggunakan tanda # untuk komentar satu baris",
        points: 20
      },
      {
        id: 3,
        type: "code-completion",
        question: "Lengkapi kode berikut untuk mencetak 'Hello, World!'",
        code: "print('Hello, ')",
        correctAnswer: "print('Hello, World!')",
        explanation: "Fungsi print() digunakan untuk mencetak teks ke layar",
        points: 30
      },
      {
        id: 4,
        type: "drag-drop",
        question: "Susun kode berikut untuk membuat variabel dan mencetak nilainya",
        options: [
          "nama = 'Python'",
          "print(nama)",
          "# Membuat variabel",
          "# Mencetak nilai variabel"
        ],
        correctAnswer: [
          "# Membuat variabel",
          "nama = 'Python'",
          "# Mencetak nilai variabel",
          "print(nama)"
        ],
        explanation: "Kode Python dieksekusi secara berurutan dari atas ke bawah",
        points: 30
      }
    ]
  }
]; 