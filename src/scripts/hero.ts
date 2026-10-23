import { prefersReducedMotion } from './motion';

const INTERVAL_MS = 6500;

/**
 * Pase de fotos de la portada con fundido y zoom lento.
 * Solo la primera foto se descarga al inicio; el resto se activa tras la carga
 * completa de la página para no competir con lo importante.
 * Tiene botón de pausa (WCAG 2.2.2) y se detiene fuera de pantalla.
 */
export function initHero(): void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const slides = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-slide]'));
  const dots = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-dot]'));
  const toggle = hero.querySelector<HTMLButtonElement>('[data-hero-toggle]');
  dots[0]?.setAttribute('data-active', '');
  if (slides.length < 2 || prefersReducedMotion()) return;

  let current = 0;
  let timer: number | undefined;
  let paused = false;
  let visible = true;

  const ready = (slide: HTMLElement): Promise<void> => {
    slide.hidden = false;
    const img = slide.querySelector('img');
    if (!img) return Promise.resolve();
    img.loading = 'eager';
    return img.decode().catch(() => undefined);
  };

  const show = async (next: number): Promise<void> => {
    const slide = slides.at(next);
    if (!slide) return;
    await ready(slide);
    slides.at(current)?.removeAttribute('data-active');
    dots.at(current)?.removeAttribute('data-active');
    slide.setAttribute('data-active', '');
    dots.at(next)?.setAttribute('data-active', '');
    current = next;
    // Precarga la siguiente mientras se ve esta.
    const after = slides.at((next + 1) % slides.length);
    if (after) void ready(after);
  };

  const schedule = (): void => {
    window.clearTimeout(timer);
    if (paused || !visible || document.hidden) return;
    timer = window.setTimeout(async () => {
      await show((current + 1) % slides.length);
      schedule();
    }, INTERVAL_MS);
  };

  const setPaused = (value: boolean): void => {
    paused = value;
    hero.toggleAttribute('data-paused', value);
    if (toggle) {
      toggle.setAttribute('aria-label', (value ? toggle.dataset.play : toggle.dataset.pause) ?? '');
      toggle.setAttribute('aria-pressed', String(value));
    }
    schedule();
  };

  toggle?.addEventListener('click', () => setPaused(!paused));
  document.addEventListener('visibilitychange', schedule);
  new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
    schedule();
  }).observe(hero);

  const start = (): void => {
    if (toggle) toggle.hidden = false;
    const second = slides.at(1);
    if (second) void ready(second);
    schedule();
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
