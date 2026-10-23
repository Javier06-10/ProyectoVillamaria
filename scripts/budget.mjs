// Presupuesto de rendimiento: falla (exit 1) si el build lo supera.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = process.argv[2] ?? 'dist';
const KB = 1024;
const BUDGET = {
  jsGzip: 15 * KB,
  cssGzip: 15 * KB,
  font: 30 * KB,
  heroMobile: 120 * KB,
  firstViewMobile: 350 * KB,
};

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const files = walk(DIST);
const gz = (p) => gzipSync(readFileSync(p)).length;
const sum = (arr) => arr.reduce((a, b) => a + b, 0);

const js = files.filter((f) => f.endsWith('.js'));
const css = files.filter((f) => f.endsWith('.css'));
const font = files.filter((f) => f.endsWith('.woff2'));
const html = join(DIST, 'index.html');
const page = readFileSync(html, 'utf8');

// Foto de portada que descarga un móvil típico (~400 px CSS a 2x ≈ 768 w, AVIF).
const heroSrcset = page.match(/<source[^>]*srcset="([^"]+)"[^>]*type="image\/avif"/)?.[1] ?? '';
const hero768 = heroSrcset.split(',').map((s) => s.trim().split(' ')).find(([, w]) => w === '768w')?.[0];
const heroBytes = hero768 ? statSync(join(DIST, decodeURI(hero768))).size : 0;

const result = {
  jsGzip: sum(js.map(gz)),
  cssGzip: sum(css.map(gz)),
  font: sum(font.map((f) => statSync(f).size)),
  heroMobile: heroBytes,
};
result.firstViewMobile = gz(html) + result.jsGzip + result.cssGzip + result.font + result.heroMobile;

let failed = false;
for (const [k, v] of Object.entries(result)) {
  const ok = v <= BUDGET[k];
  if (!ok) failed = true;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${k.padEnd(16)} ${(v / KB).toFixed(1).padStart(7)} KB  (límite ${BUDGET[k] / KB} KB)`);
}
const totalImages = sum(files.filter((f) => /\.(avif|webp|jpe?g)$/.test(f)).map((f) => statSync(f).size));
console.log(`info total de imágenes generadas (todas las variantes): ${(totalImages / KB / KB).toFixed(1)} MB`);
if (!hero768) { console.log('FAIL no se encontró la variante 768w de la portada'); failed = true; }
process.exit(failed ? 1 : 0);
