export const materias = [
  {
    id: 'programacion-iii',
    name: "Programación III",
    professor: "Prof. García",
    email: "email@programacion",
    fechaInicio: "2025-03-17",
    fechaFinalizacion: "2025-06-01",
    schedule: "Lunes y Miércoles 14:00 - 16:00",
    description: "Curso avanzado de patrones de diseño y arquitectura de software",
    tasks: [
      { id: '1', title: "TP Patrón Observer", dueDate: "2024-03-28", status: "pending" },
      { id: '2', title: "Práctica Singleton", dueDate: "2024-04-02", status: "completed" }
    ],
    resources: [
      { id: '1', type: "document", title: "Apuntes Clase 1", url: "#" },
      { id: '2', type: "video", title: "Video demostración", url: "#" }
    ],
    correlatividad: [
      { id: '1', type: "fuerte", title: "Gestión de Desarrollo de Software" },
      { id: '2', type: "fuerte", title: "Programación IV" },
      { id: '3', type: "fuerte", title: "Base de Datos III" },
    ]
  },
  {
    id: 'base-de-datos-ii',
    name: "Base de Datos II",
    professor: "Prof. López",
    email: "db@programacion",
    fechaInicio: "2025-03-17",
    fechaFinalizacion: "2025-06-03",
    schedule: "Martes y Jueves 09:00 - 11:00",
    description: "Diseño avanzado de bases de datos relacionales y NoSQL",
    tasks: [
      { id: '1', title: "Modelado ER Avanzado", dueDate: "2024-04-05", status: "pending" },
      { id: '2', title: "Práctica MongoDB", dueDate: "2024-04-12", status: "in-progress" }
    ],
    resources: [
      { id: '1', type: "document", title: "Guía de Normalización", url: "#" },
      { id: '2', type: "link", title: "SQL Fiddle", url: "#" }
    ],
    correlatividad: [
      { id: '1', type: "fuerte", title: "Gestión de Desarrollo de Software" },
      { id: '2', type: "fuerte", title: "Programación IV" },
      { id: '3', type: "fuerte", title: "Base de Datos III" },
    ]
  },
  {
    id: 'ingles-ii',
    name: "Inglés II",
    professor: "Prof. Smith",
    email: "ingles@programacion",
    fechaInicio: "2025-03-17",
    fechaFinalizacion: "2025-03-04",
    schedule: "Lunes y Miércoles 16:00 - 18:00",
    description: "Inglés técnico para desarrollo de software",
    tasks: [
      { id: '1', title: "Ensayo técnico", dueDate: "2024-03-30", status: "pending" },
      { id: '2', title: "Presentación oral", dueDate: "2024-04-15", status: "pending" }
    ],
    resources: [
      { id: '1', type: "document", title: "Vocabulario técnico", url: "#" },
      { id: '2', type: "link", title: "Gramática interactiva", url: "#" }
    ],
    correlatividad: [
      { id: '1', type: "fuerte", title: "Gestión de Desarrollo de Software" },
      { id: '2', type: "fuerte", title: "Programación IV" },
      { id: '3', type: "fuerte", title: "Base de Datos III" },
    ]
  },
  {
    id: 'metodologias-sistemas-i',
    name: "Metodologías de Sistemas I",
    professor: "Prof. Martínez",
    email: "sistemas@programacion",
    fechaInicio: "2025-03-17",
    fechaFinalizacion: "2025-06-6",
    schedule: "Viernes 14:00 - 17:00",
    description: "Metodologías ágiles y tradicionales para desarrollo de sistemas",
    tasks: [
      { id: '1', title: "Caso de estudio SCRUM", dueDate: "2024-04-10", status: "in-progress" },
      { id: '2', title: "Diagrama de Gantt", dueDate: "2024-04-20", status: "pending" }
    ],
    resources: [
      { id: '1', type: "video", title: "Introducción a Agile", url: "#" },
      { id: '2', type: "document", title: "Manual PMBOK", url: "#" }
    ],
    correlatividad: [
      { id: '1', type: "fuerte", title: "Gestión de Desarrollo de Software" },
      { id: '2', type: "fuerte", title: "Programación IV" },
      { id: '3', type: "fuerte", title: "Base de Datos III" },
    ]
  }
];