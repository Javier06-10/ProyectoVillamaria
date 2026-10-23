import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/fotos/*/*.jpg', { eager: true });

/** Resuelve "casa/casa-01.jpg" al ImageMetadata importado. Falla en el build si no existe. */
export function photo(file: string): ImageMetadata {
  const mod = files[`../assets/fotos/${file}`];
  if (!mod) throw new Error(`Foto no encontrada: ${file}`);
  return mod.default;
}

/** Calidad única para AVIF y WebP: así la foto principal y la galería comparten archivos. */
export const QUALITY = 58;

/** Anchos de la foto principal y de la galería (los originales llegan a 1280 px). */
export const GALLERY_WIDTHS = [480, 768, 1024, 1280];
