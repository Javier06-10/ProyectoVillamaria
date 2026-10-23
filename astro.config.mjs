// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL se define al tener dominio (p. ej. https://villamaria.com.do).
// Sin él, las URLs de Open Graph quedan relativas.
const site = process.env.SITE_URL;

export default defineConfig({
  ...(site ? { site } : {}),
  trailingSlash: 'always',
  build: {
    // CSS como archivo externo: permite una CSP estricta (style-src 'self').
    inlineStylesheets: 'never',
    format: 'directory',
  },
  vite: {
    build: {
      // Sin scripts ni assets en línea: compatible con script-src 'self'.
      assetsInlineLimit: 0,
    },
  },
});
