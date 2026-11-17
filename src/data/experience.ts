// Línea de tiempo: experiencia y formación, de lo más reciente a lo más antiguo (tomado del CV).
export interface TimelineEntry {
  kind: 'Experiencia' | 'Educación';
  period: string;
  title: string; // Empresa, cliente o título académico
  subtitle: string; // Rol y empleador, o institución
  summary: string;
  highlights?: string[];
  stack?: string[];
}

export const timeline: TimelineEntry[] = [
  {
    kind: 'Experiencia', period: 'Feb 2025 – May 2026',
    title: 'Innovatech Global Solutions', subtitle: 'Full Stack Developer',
    summary: 'Digitalización del proceso de asignación, gestión y visualización de turnos mediante una solución web, móvil y audiovisual integrada.',
    highlights: [
      'Sistema de gestión de turnos para la Empresa Eléctrica de Quetzaltenango.',
      'Aplicación móvil con React Native para generar y administrar turnos desde tablets.',
      'Aplicaciones para pantallas y televisores con visualización de turnos en tiempo real.',
      'REST APIs documentadas con Swagger/OpenAPI y despliegue en ambientes productivos.',
    ],
    stack: ['React.js', 'Redux', 'Node.js', 'MySQL', 'Sequelize', 'React Native'],
  },
  {
    kind: 'Experiencia', period: 'Feb 2025 – Ene 2026',
    title: 'Cemaco', subtitle: 'Full Stack Developer / Technical Lead · WotDev / BDG',
    summary: 'Participación en la construcción de una plataforma integral para gestión y distribución de pedidos provenientes de compras en línea.',
    highlights: [
      'Backend con .NET, Azure Functions y SQL Server para procesos empresariales y logísticos.',
      'Frontend de plataformas administrativas con React.js.',
      'Integraciones con VTEX, OMS y sistemas externos mediante REST APIs y BAPIs.',
      'Code reviews, revisión de vulnerabilidades y acompañamiento técnico al equipo.',
    ],
    stack: ['.NET', 'Azure Functions', 'SQL Server', 'React.js', 'VTEX', 'Application Insights'],
  },
  {
    kind: 'Experiencia', period: 'Feb 2025 – Jul 2025',
    title: 'PBS', subtitle: 'Full Stack Developer · WotDev / BDG',
    summary: 'Optimización de procesos de soporte técnico mediante módulos para gestión de tickets, técnicos, inventario, repuestos y seguimiento de casos.',
    highlights: [
      'Interfaces con React.js y TailwindCSS para gestión de tickets de soporte.',
      'Interfaces responsivas para operaciones en Latinoamérica.',
    ],
    stack: ['React.js', 'TailwindCSS', 'Node.js', 'Express', 'Sequelize', 'MySQL', 'React Native'],
  },
  {
    kind: 'Experiencia', period: 'Oct 2023 – Feb 2025',
    title: 'Walmart CAM', subtitle: 'Full Stack Developer / Technical Lead · WotDev / BDG',
    summary: 'Participación en una arquitectura modular que permitió gestionar y desplegar microfrontends de manera independiente.',
    highlights: [
      'Sistema empresarial RECALL para procesos administrativos y operativos de Walmart Centroamérica.',
      'Arquitectura de microfrontends con Single-SPA.',
      'Mensajería entre sistemas con Kafka e integración con Azure Storage.',
      'Módulo de Tráfico para control y distribución de contenedores en Centroamérica.',
    ],
    stack: ['React.js', 'Redux', 'Node.js', 'Sequelize', 'SQL Server', 'Single-SPA', 'Kafka'],
  },
  {
    kind: 'Educación', period: 'Colegiado No. 20011',
    title: 'Ingeniería en Sistemas, Informática y Ciencias de la Computación', subtitle: 'Universidad Mesoamericana, Quetzaltenango',
    summary: 'Ingeniero en Sistemas colegiado.',
  },
];
