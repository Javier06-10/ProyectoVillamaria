/** ¿La persona pidió reducir el movimiento en su sistema? */
export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Aparición de secciones al hacer scroll.
 * Sin JS o con movimiento reducido, todo queda visible desde el principio:
 * el estado oculto solo existe bajo html.motion.
 */
export function initReveal(): void {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  const items = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
  // Escalonado dentro de cada grupo (p. ej. las tarjetas de "Lo que incluye").
  const groups = new Map<Element, number>();
  for (const el of items) {
    const parent = el.parentElement;
    if (!parent) continue;
    const i = groups.get(parent) ?? 0;
    groups.set(parent, i + 1);
    el.style.setProperty('--d', `${Math.min(i, 6) * 80}ms`);
  }

  // Lo que ya está en pantalla al cargar no se oculta: evita parpadeos.
  const vh = window.innerHeight;
  for (const el of items) {
    if (el.getBoundingClientRect().top < vh * 0.9) el.classList.add('is-in');
  }
  document.documentElement.classList.add('motion');

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
  );
  items.filter((el) => !el.classList.contains('is-in')).forEach((el) => io.observe(el));
}

/** Barras de distancia proporcionales a los km (el ancho viene de data-ratio). */
export function initDistanceBars(): void {
  document.querySelectorAll<HTMLElement>('.bar[data-ratio]').forEach((bar) => {
    bar.style.setProperty('--w', bar.dataset.ratio ?? '0');
  });
}
