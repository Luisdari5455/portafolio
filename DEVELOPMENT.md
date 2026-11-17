# Guía de Desarrollo - INNOVATECH Portfolio

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js 18+ instalado
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
/
├── public/              # Archivos estáticos
│   ├── favicon.svg      # Favicon del sitio
│   └── images/          # Imágenes y recursos
├── src/
│   ├── components/      # Componentes Astro
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── layouts/         # Layouts de página
│   │   └── MainLayout.astro
│   ├── pages/           # Páginas (rutas automáticas)
│   │   ├── index.astro        # Página principal
│   │   ├── servicios.astro    # Página de servicios
│   │   ├── portafolio.astro   # Página de proyectos
│   │   ├── nosotros.astro     # Sobre nosotros
│   │   └── contacto.astro     # Contacto
│   ├── styles/          # Estilos globales
│   │   └── global.css
│   └── config/          # Configuraciones
│       └── site.ts
├── astro.config.mjs     # Configuración de Astro
├── package.json
└── tsconfig.json
```

## 🎨 Personalización

### Colores
Los colores principales se definen en `src/styles/global.css`:
- `--color-primary`: #0066cc (Azul principal)
- `--color-secondary`: #00c896 (Verde secundario)

### Contenido
El contenido del sitio se puede encontrar en:
- Páginas: `src/pages/*.astro`
- Componentes: `src/components/*.astro`
- Configuración: `src/config/site.ts`

### Imágenes
Coloca tus imágenes en `public/images/`:
- Logo de la empresa
- Imágenes de proyectos
- Fotos del equipo
- Íconos personalizados

## 📄 Páginas Disponibles

- **/** - Página principal con hero, servicios y estadísticas
- **/servicios** - Detalle de todos los servicios
- **/portafolio** - Galería de proyectos con filtros
- **/nosotros** - Información de la empresa, valores y equipo
- **/contacto** - Formulario de contacto e información

## 🛠️ Tecnologías

- **Astro** - Framework principal
- **TypeScript** - Type safety
- **CSS3** - Estilos modernos con variables CSS
- **Responsive Design** - Mobile-first approach

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Previsualizar build
npm run astro    # CLI de Astro
```

## 🚀 Deployment

### Netlify
```bash
npm run build
# Despliega la carpeta dist/
```

### Vercel
```bash
npm run build
# Despliega la carpeta dist/
```

### GitHub Pages
Configura `site` y `base` en `astro.config.mjs` según tu repositorio.

## 📝 Notas Importantes

1. **SEO**: Cada página tiene meta tags optimizados para SEO
2. **Responsivo**: Diseño 100% responsive para todos los dispositivos
3. **Performance**: Optimizado para carga rápida y mejor UX
4. **Accesibilidad**: Siguiendo mejores prácticas de a11y

## 🎯 Próximos Pasos

1. **Personalizar contenido**: Actualiza el texto con información real de la empresa
2. **Agregar imágenes**: Reemplaza los placeholders con imágenes reales
3. **Configurar formulario**: Conecta el formulario de contacto a un servicio (EmailJS, Formspree, etc.)
4. **Analytics**: Agrega Google Analytics o similar
5. **Testing**: Prueba en diferentes navegadores y dispositivos

## 🆘 Soporte

Si necesitas ayuda con el desarrollo:
1. Revisa la [documentación de Astro](https://docs.astro.build)
2. Consulta los comentarios en el código
3. Revisa la estructura de archivos existentes como ejemplo

## 📄 Licencia

© 2026 INNOVATECH GLOBAL SOLUTIONS. Todos los derechos reservados.
