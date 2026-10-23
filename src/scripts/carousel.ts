import { prefersReducedMotion } from './motion';

/**
 * Carruseles de fotos sobre scroll-snap nativo: se deslizan con el dedo,
 * la rueda o el trackpad sin JS. El script añade flechas, puntos,
 * contador y arrastre con el mouse.
 */
export function initCarousels(): void {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach(setup);
}

function setup(root: HTMLElement): void {
  const track = root.querySelector<HTMLElement>('[data-carousel-track]');
  if (!track) return;
  const slides = Array.from(track.children) as HTMLElement[];
  const prev = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-carousel-next]');
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-carousel-dot]'));
  const counter = root.querySelector<HTMLElement>('[data-carousel-current]');
  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';

  const offsetOf = (i: number): number => {
    const slide = slides.at(i);
    if (!slide) return 0;
    const padding = parseFloat(getComputedStyle(track).scrollPaddingInlineStart) || 0;
    return slide.offsetLeft - track.offsetLeft - padding;
  };

  const currentIndex = (): number => {
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((_, i) => {
      const d = Math.abs(offsetOf(i) - track.scrollLeft);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  };

  const goTo = (i: number): void => {
    const target = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: offsetOf(target), behavior });
  };

  let index = -1;
  const update = (): void => {
    const i = currentIndex();
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (prev) prev.disabled = i === 0 && track.scrollLeft <= 4;
    if (next) next.disabled = atEnd;
    if (i === index) return;
    index = i;
    if (counter) counter.textContent = String(i + 1);
    dots.forEach((d, k) => (k === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    slides.forEach((s, k) => s.toggleAttribute('data-current', k === i));
  };

  let raf = 0;
  track.addEventListener(
    'scroll',
    () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    },
    { passive: true },
  );
  window.addEventListener('resize', update, { passive: true });

  prev?.addEventListener('click', () => goTo(currentIndex() - 1));
  next?.addEventListener('click', () => goTo(currentIndex() + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  // Arrastre con el mouse (en táctil el navegador ya lo hace).
  let startX = 0;
  let startScroll = 0;
  let dragging = false;
  let moved = false;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    dragging = true;
    moved = false;
    startX = e.clientX;
    startScroll = track.scrollLeft;
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 6 && !moved) {
      moved = true;
      track.setAttribute('data-dragging', '');
    }
    if (moved) track.scrollLeft = startScroll - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    if (moved) {
      track.removeAttribute('data-dragging');
      goTo(currentIndex());
    }
  });
  // Un arrastre no debe abrir la galería al soltar.
  track.addEventListener(
    'click',
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    },
    true,
  );
  track.addEventListener('dragstart', (e) => e.preventDefault());

  update();
}
