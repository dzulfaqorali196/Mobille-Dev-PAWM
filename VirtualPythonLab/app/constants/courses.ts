import { Course } from "../../types/course";

export const COURSES: Course[] = [
  {
    code: "python-basic",
    title: "Pengenalan Python",
    description: "Pelajari dasar-dasar pemrograman Python",
    thumbnail_url: "",
    level: "beginner",
    estimated_time: "2 jam",
    order_number: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sections: [
      {
        id: "python-basic-1",
        title: "Pengenalan Python",
        type: "text",
        content: "# Pengenalan Python\n\nPython adalah bahasa pemrograman yang populer...",
        order_number: 1
      },
      {
        id: "quiz-python-basic-1",
        title: "Quiz: Pengenalan Python",
        type: "quiz",
        content: "",
        order_number: 2
      },
      {
        id: "python-basic-2",
        title: "Tipe Data Python",
        type: "text",
        content: "# Tipe Data Python\n\nPython memiliki beberapa tipe data dasar...",
        order_number: 3
      },
      {
        id: "quiz-python-basic-2",
        title: "Quiz: Tipe Data Python",
        type: "quiz",
        content: "",
        order_number: 4
      }
    ]
  }
]; 