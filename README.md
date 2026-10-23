# Rancho Villa María: landing de alquiler

Sitio estático de una página, en español (`/`) e inglés (`/en/`), que recorre el rancho por ambientes, muestra las tarifas (pasadía y estadía) y termina en una reserva por WhatsApp.

## Stack

- **Astro 5** (salida estática, sin framework de UI). TypeScript estricto.
- Imágenes optimizadas en el build con `astro:assets` + sharp: AVIF y WebP en varios anchos, sin metadatos EXIF.
- JavaScript propio para la galería, los carruseles, las animaciones, la barra de ambientes y el formulario (unos 8 KB gzip). Sin JS, todo el contenido y los enlaces siguen funcionando.
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
| Lo que incluye el rancho | `src/data/villa.ts` → `AMENITIES` |
| Tarifas (pasadía, estadía) | `src/data/villa.ts` → `RATES` |
| Máximo de personas por tipo de visita | `src/lib/inquiry.ts` → `LIMITS.guestsMax` |
| Fotos del pase de la portada | `src/data/villa.ts` → `HERO_SLIDES` (usar fotos horizontales) |
| Distancias a playas, pueblos y aeropuerto | `src/data/villa.ts` → `PLACES` |
| Textos de la interfaz en los dos idiomas | `src/i18n/strings.ts` |
| Fotos | `src/assets/fotos/<ambiente>/` (la primera de cada ambiente es la principal) |
| Validación y mensaje de WhatsApp | `src/lib/inquiry.ts` (con pruebas en `tests/unit`) |
| Colores, tipografía y espaciado | `src/styles/global.css` (variables en `:root`) |

Para agregar una foto: cópiala en la carpeta del ambiente y agrega una entrada en `STATIONS` con su texto alternativo en español e inglés. El build falla si una foto declarada no existe.

## Despliegue en Render

El repositorio incluye `render.yaml` (Blueprint) con todo configurado:

1. En [Render](https://dashboard.render.com): **New → Blueprint** y elegir este repositorio.
2. Render crea el sitio estático `rancho-villa-maria` y lo publica en `https://rancho-villa-maria.onrender.com`. Cada push a `main` lo vuelve a desplegar.
3. Si Render asigna otro nombre o se conecta un dominio propio, actualizar `SITE_URL` en `render.yaml` (o en *Environment* del servicio) y volver a desplegar.

Qué configura el Blueprint:

- Build `npm ci && npm run build`, carpeta publicada `dist`, Node 22 (también fijado en `.node-version`).
- Cabeceras de seguridad (CSP estricta, HSTS, nosniff, Referrer-Policy, Permissions-Policy) y caché de un año para `/_astro/*` y `/fonts/*`.
- Redirección de `/en` a `/en/`.

`public/_headers` queda como equivalente para Cloudflare Pages o Netlify; Render no lo lee.

## Decisiones

- **Sitio estático sin backend.** No hay datos personales almacenados ni servidor que mantener; la consulta se arma en el navegador y se envía por WhatsApp.
- **La dirección exacta no se publica.** Las fotos se publican sin EXIF (algunas cámaras guardan el GPS) y el mapa apunta solo al pueblo.
- **Tarifas publicadas.** El formulario distingue pasadía (una fecha, hasta 45 personas) y estadía (llegada y salida, hasta 16 personas); el mensaje de WhatsApp sale armado según el tipo.
- **Animación con respeto.** Todo el movimiento es CSS y JS propios, se apaga con "reducir movimiento" del sistema y el pase de fotos tiene botón de pausa.

## Pendiente antes de lanzar

- Confirmar las distancias de `PLACES` (son estimaciones).
- Normas de la casa y hora de entrada de la estadía.
- Confirmar el número de habitaciones (la descripción dice 6 y luego 7).
- Fotos de las habitaciones familiares, la sala, los baños, el billar, el dominó, el área de BBQ y las casas de campaña.
- Comprar el dominio, conectarlo en Render y actualizar `SITE_URL`.
