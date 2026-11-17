export interface Project {
  id: string;
  title: string;
  category: string;
  status: string;
  description: string;
  detail: string;
  theme: 'peach' | 'mint' | 'lavender' | 'blue';
  // Opcionales: se muestran solo cuando existen.
  filters?: string[];
  features?: string[];
  challenge?: string;
  solution?: string;
  year?: string;
  role?: string; // Qué hiciste tú, ej.: 'Diseño y desarrollo completo'
  stack?: string[]; // Tecnologías usadas
  image?: string; // Captura real dentro de /public, ej.: '/images/barberia.png'
  url?: string; // Sitio en producción
  repo?: string; // Repositorio
}

// Información confirmada por el propietario. Añadir enlaces cuando estén disponibles.
export const projects: Project[] = [
{
  "id": "cemaco",
  "title": "BDG / Cemaco · LOM / OMS",
  "category": "Full Stack",
  "status": "Sistema empresarial",
  "theme": "peach",
  "role": "Líder técnico / Desarrollador Full Stack",
  "stack": [
    ".NET 8",
    "Azure Functions",
    "React",
    "SQL Server",
    "Microsoft Azure",
    "VTEX"
  ],
  "filters": [
    "Full Stack",
    "Backend",
    "Cloud",
    "Frontend"
  ],
  "description": "Gestión de pedidos e integraciones para operaciones de comercio electrónico.",
  "detail": "Plataforma empresarial para coordinar pedidos, auditorías y procesos logísticos.",
  "features": [
    "Gestión y distribución de pedidos en línea.",
    "Integraciones con VTEX, OMS y sistemas externos."
  ],
  "challenge": "Conectar plataformas de comercio y operación mediante APIs y servicios cloud.",
  "solution": "Backend con .NET y Azure Functions, interfaces React y datos en SQL Server. Revisión de código y acompañamiento técnico al equipo."
},
{
  "id": "walmart",
  "title": "Walmart CAM · RECALL",
  "category": "Frontend",
  "status": "Sistema empresarial",
  "theme": "blue",
  "role": "Desarrollador Frontend",
  "stack": [
    "React",
    "Redux",
    "Single-SPA",
    "Module Federation",
    "Kafka"
  ],
  "filters": [
    "Frontend"
  ],
  "description": "Módulos empresariales para procesos administrativos y operativos de Centroamérica.",
  "detail": "Desarrollo de interfaces dentro de una arquitectura de microfrontends.",
  "features": [
    "Módulos de la plataforma RECALL.",
    "Interfaces modulares con React y Redux."
  ],
  "challenge": "Mantener una experiencia coherente entre módulos independientes.",
  "solution": "Microfrontends con Single-SPA y Module Federation, junto con integración de mensajería mediante Kafka."
},
{
  "id": "pbs",
  "title": "PBS · Gestión empresarial",
  "category": "Full Stack",
  "status": "Sistema empresarial",
  "theme": "mint",
  "role": "Desarrollador Full Stack",
  "stack": [
    "React",
    "Node.js",
    "Express",
    "Sequelize",
    "MySQL",
    "React Native"
  ],
  "filters": [
    "Full Stack",
    "Frontend",
    "Backend",
    "Mobile"
  ],
  "description": "Herramientas para gestionar inventarios, técnicos, repuestos y soporte.",
  "detail": "Solución web y móvil orientada a los procesos de gestión empresarial.",
  "features": [
    "Gestión de inventarios, técnicos y repuestos.",
    "Aplicaciones para dispositivos móviles."
  ],
  "challenge": "Conectar las interfaces web y móviles con los procesos operativos.",
  "solution": "Interfaces React y React Native conectadas a servicios Node.js, Express y Sequelize sobre MySQL."
},
  {
    filters: ['Frontend'], id: 'barberia', title: 'Stylefy', category: 'Web', status: 'Proyecto', theme: 'peach',
    description: 'Plataforma web para barberías y salones de belleza.',
    url: 'https://stylefy.app/',
    detail: 'Stylefy reúne mi trabajo para el sector de barberías y salones de belleza. Puedes conocer el proyecto en su sitio web.',
  },
  {
    features: ['Administración de clínicas.', 'Gestión de pacientes.', 'Citas médicas y especialidades.'], role: 'Desarrollador Full Stack', filters: ['Full Stack'], id: 'clinicas', title: 'Clínicas', category: 'Web', status: 'Próximamente', theme: 'mint',
    description: 'SaaS para la administración de clínicas médicas, en preparación para su lanzamiento.',
    detail: 'Funciones implementadas: administración de clínicas, pacientes, citas médicas y especialidades. Acceso público pendiente de publicación.',
  },
  {
    filters: ['Full Stack', 'Frontend', 'Backend', 'Mobile'], features: ['Administración de turnos y atención al cliente.', 'Pantallas informativas con actualizaciones en tiempo real.'], challenge: 'Sincronizar la atención y la visualización de turnos.', solution: 'APIs y WebSockets conectan las interfaces de atención con las pantallas informativas.', id: 'eemq', title: 'EEMQ', category: 'Sistemas', status: 'Sistema de tickets', theme: 'lavender',
    description: 'Un sistema de tickets desarrollado para EEMQ. Software enfocado en un contexto real.',
    detail: 'Digitalización del proceso de asignación, gestión y visualización de turnos mediante una solución web, móvil y audiovisual integrada.',
    role: 'Full Stack Developer en Innovatech Global Solutions',
    stack: ['React.js', 'Redux', 'Node.js', 'Express', 'MySQL', 'Sequelize', 'WebSockets', 'React Native', 'Swagger/OpenAPI'],
  },
  {
    filters: ['Frontend'], id: 'arrsuc', title: 'ARRSUC', category: 'Proyectos', status: 'Proyecto', theme: 'blue',
    description: 'Página web para contadores y auditores.',
    url: 'https://www.arrsuc.com/',
    detail: 'Sitio web de ARRSUC orientado a la presentación de servicios de contabilidad y auditoría.',
  },
];

