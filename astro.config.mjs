import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://innovatech-global.com',
  base: '/',
  output: 'static',
  compressHTML: true,
});
