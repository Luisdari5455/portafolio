// Datos personales del portafolio (tomados del CV). Todo lo que quede vacío simplemente no se muestra.
export const profile = {
  name: 'Luis David Cotoc Rivas',
  shortName: 'Luis Cotoc', // Versión corta para el navbar
  role: 'Full Stack Developer | Software Engineer | Technical Lead',
  location: 'Quetzaltenango, Guatemala',
  available: true, // true muestra "Disponible para nuevos proyectos"
  email: 'luisdari5455@gmail.com',
  github: 'https://github.com/Luisdari5455',
  linkedin: 'https://www.linkedin.com/in/luis-david-cotoc-rivas-952511217', // Pega aquí la URL completa de tu perfil
  cv: '', // Ruta a un PDF dentro de /public, ej.: '/cv.pdf'
  photo: '', // Ruta a una foto dentro de /public, ej.: '/images/foto.jpg'
};

export const stack = [
  {
    "group": "Frontend",
    "items": [
      "React",
      "JavaScript",
      "TypeScript",
      "Redux",
      "Redux Toolkit",
      "Vite",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
      "Single-SPA",
      "Module Federation"
    ]
  },
  {
    "group": "Backend",
    "items": [
      "Node.js",
      "Express.js",
      "C#",
      ".NET 8",
      "Azure Functions",
      "APIs REST",
      "Sequelize",
      "Entity Framework Core"
    ]
  },
  {
    "group": "Bases de datos",
    "items": [
      "SQL Server",
      "MySQL"
    ]
  },
  {
    "group": "Cloud y DevOps",
    "items": [
      "Microsoft Azure",
      "Azure Blob Storage",
      "Azure Key Vault",
      "Application Insights",
      "Docker",
      "Git",
      "GitHub",
      "GitLab",
      "IIS",
      "Plesk"
    ]
  },
  {
    "group": "Otras tecnologías",
    "items": [
      "React Native",
      "WebSockets",
      "Kafka",
      "Swagger",
      "Postman",
      "Sistemas de automatización"
    ]
  }
];

export const certifications = [
  'Cisco CCNA 200-301 – Introducción a las Redes',
  'Técnico en instalación y mantenimiento de cableado estructurado y configuración de equipos activos',
];

export const languages = [
  { name: 'Español', level: 'Nativo' },
  { name: 'Inglés', level: 'B1 — Intermedio' },
];
