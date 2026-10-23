# Villa María: landing de alquiler

Sitio estático de una página, en español (`/`) e inglés (`/en/`), que recorre la villa por ambientes y termina en una consulta por WhatsApp.

## Stack

- **Astro 5** (salida estática, sin framework de UI). TypeScript estricto.
- Imágenes optimizadas en el build con `astro:assets` + sharp: AVIF y WebP en varios anchos, sin metadatos EXIF.
- JavaScript propio solo para la galería, la barra de ambientes y el formulario (unos 5,5 KB gzip). Sin JS, todo el contenido y los enlaces siguen funcionando.
- Fuente: Bricolage Grotesque (licencia SIL OFL), recortada a los caracteres de español e inglés y alojada en `public/fonts` (25 KB).

## Comandos

```bash
npm install
npm run dev          # desarrollo en http://localhost:4321
npm run build        # genera dist/ (la primera vez tarda unos minutos por las imágenes)
npm run budget       # falla si se supera el presupuesto de peso
npm test             # pruebas unitarias (Vitest)
npm run test:e2e     # pruebas en navegador móvil y escritorio + accesibilidad (Playwright + axe)
npm run check        # chequeo de tipos de Astro/TypeScript
```

Para Playwright, la primera vez: `npx playwright install chromium`.

## Dónde se cambia cada cosa

| Qué | Archivo |
| --- | --- |
| Número de WhatsApp, nombre, zona, enlace a Google Maps | `src/data/villa.ts` → `VILLA` |
| Ambientes del recorrido, sus textos y el orden de las fotos | `src/data/villa.ts` → `STATIONS` |
| Lo que incluye la casa | `src/data/villa.ts` → `AMENITIES` |
| Distancias a playas, pueblos y aeropuerto | `src/data/villa.ts` → `PLACES` |
| Textos de la interfaz en los dos idiomas | `src/i18n/strings.ts` |
| Fotos | `src/assets/fotos/<ambiente>/` (la primera de cada ambiente es la principal) |
| Validación y mensaje de WhatsApp | `src/lib/inquiry.ts` (con pruebas en `tests/unit`) |
| Colores, tipografía y espaciado | `src/styles/global.css` (variables en `:root`) |

Para agregar una foto: cópiala en la carpeta del ambiente y agrega una entrada en `STATIONS` con su texto alternativo en español e inglés. El build falla si una foto declarada no existe.

## Despliegue

Pensado para **Cloudflare Pages** o **Netlify** (plan gratuito):

- Comando de build: `npm run build`. Carpeta publicada: `dist`.
- Variable de entorno `SITE_URL` con el dominio final (por ejemplo `https://villamaria.com.do`). Activa la URL canónica, `hreflang` y la imagen absoluta para compartir en WhatsApp y redes.
- `public/_headers` aplica la política de seguridad (CSP estricta sin scripts de terceros, HSTS, nosniff, etc.) y la caché larga de recursos con hash.

## Decisiones

- **Sitio estático sin backend.** No hay datos personales almacenados ni servidor que mantener; la consulta se arma en el navegador y se envía por WhatsApp.
- **La dirección exacta no se publica.** Las fotos se publican sin EXIF (algunas cámaras guardan el GPS) y el mapa apunta solo al pueblo.
- **Precio a consultar.** El mensaje de WhatsApp ya pide disponibilidad y precio para las fechas elegidas.

## Pendiente antes de lanzar

- Confirmar las distancias de `PLACES` (son estimaciones).
- Normas de la casa, capacidad máxima y horario de entrada y salida.
- Fotos de la sala, el baño, la segunda habitación y el interior de las cabañas.
- Comprar el dominio y definir `SITE_URL`.
