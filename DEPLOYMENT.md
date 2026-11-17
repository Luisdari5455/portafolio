# Guía de Deployment - INNOVATECH Portfolio

## 🚀 Opciones de Deployment

### 1. Vercel (Recomendado)

#### Desde GitHub
1. Sube tu proyecto a GitHub
2. Visita [vercel.com](https://vercel.com)
3. Click en "New Project"
4. Importa tu repositorio
5. Vercel detectará automáticamente Astro
6. Click en "Deploy"

#### Desde CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Configuración automática** ✅ Vercel detecta Astro automáticamente

---

### 2. Netlify

#### Desde GitHub
1. Sube tu proyecto a GitHub
2. Visita [netlify.com](https://netlify.com)
3. Click en "Add new site"
4. Conecta tu repositorio
5. Configuración de build:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click en "Deploy"

#### Desde CLI
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

#### netlify.toml (Opcional)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. GitHub Pages

#### 1. Configurar astro.config.mjs
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tu-usuario.github.io',
  base: '/nombre-repositorio', // Si no es la página principal
  output: 'static',
});
```

#### 2. Crear workflow (.github/workflows/deploy.yml)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

#### 3. Configurar GitHub Pages
1. Ve a Settings > Pages
2. Source: GitHub Actions
3. Push a main para desplegar

---

### 4. Cloudflare Pages

```bash
# Instalar Wrangler
npm i -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy dist
```

**Configuración:**
- Build command: `npm run build`
- Build output directory: `dist`

---

### 5. AWS Amplify

1. Conecta tu repositorio Git
2. Configuración de build:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

---

### 6. Firebase Hosting

```bash
# Instalar Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Inicializar
firebase init hosting

# Configurar:
# - Public directory: dist
# - Single-page app: No
# - GitHub Actions: Optional

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

---

### 7. Render

1. Conecta tu repositorio
2. Configuración:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. Deploy automático en cada push

---

## 🔧 Variables de Entorno

Si tu proyecto usa variables de entorno, configúralas en tu plataforma:

### Vercel
Settings > Environment Variables

### Netlify
Site settings > Environment variables

### GitHub Pages
Settings > Secrets and variables > Actions

---

## ✅ Checklist Pre-Deployment

- [ ] Construir proyecto localmente: `npm run build`
- [ ] Verificar que no hay errores
- [ ] Probar build: `npm run preview`
- [ ] Revisar responsive en diferentes dispositivos
- [ ] Configurar dominio personalizado (opcional)
- [ ] Configurar SSL/HTTPS (automático en la mayoría)
- [ ] Configurar analytics (Google Analytics, etc.)
- [ ] Probar formulario de contacto
- [ ] Verificar SEO meta tags
- [ ] Optimizar imágenes

---

## 🌐 Dominio Personalizado

### En Vercel
1. Domains > Add
2. Ingresa tu dominio
3. Configura DNS según instrucciones

### En Netlify
1. Domain settings > Add custom domain
2. Configura DNS records

### DNS Records (ejemplo)
```
Type: CNAME
Name: www
Value: tu-proyecto.netlify.app
```

---

## 📊 Performance Tips

1. **Imágenes**: Usa WebP y comprime las imágenes
2. **Fonts**: Usa `font-display: swap`
3. **CSS**: Purge CSS no utilizado
4. **Cache**: Configura headers de cache apropiados
5. **CDN**: Usa CDN para assets estáticos

---

## 🔍 Monitoreo Post-Deployment

### Analytics
- Google Analytics 4
- Plausible Analytics
- Fathom Analytics

### Performance
- Google PageSpeed Insights
- Lighthouse CI
- WebPageTest

### Uptime
- UptimeRobot
- Pingdom
- StatusCake

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Limpiar cache
rm -rf node_modules
npm install

# Limpiar Astro cache
rm -rf .astro
npm run build
```

### 404 Errors
- Verifica que `base` esté configurado correctamente
- Revisa que las rutas sean relativas

### Estilos no cargan
- Verifica que las rutas CSS sean correctas
- Revisa que el build incluya los CSS

---

## 📝 Actualizaciones

Para actualizar el sitio después del deployment:
1. Haz tus cambios localmente
2. Prueba con `npm run dev`
3. Commit y push a tu repositorio
4. El deployment se actualizará automáticamente

---

## 🎯 Recomendaciones

**Para producción pequeña/mediana:**
- ✅ Vercel (simplicidad + performance)
- ✅ Netlify (buenas características gratis)

**Para proyectos empresariales:**
- ✅ AWS Amplify
- ✅ Cloudflare Pages

**Para proyectos personales/demo:**
- ✅ GitHub Pages (gratis)
- ✅ Netlify (gratis tier generoso)

---

© 2026 INNOVATECH GLOBAL SOLUTIONS
