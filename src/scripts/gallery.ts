import { prefersReducedMotion } from './motion';

/**
 * Galería por ambiente con <dialog> nativo.
 * Sin JS, cada miniatura es un enlace a la foto grande (mejora progresiva).
 * El hash (#foto-casa-3) permite compartir una foto y que "Atrás" cierre la galería.
 */

interface Slide {
  avif: string;
  webp: string;
  href: string;
  width: number;
  height: number;
  alt: string;
  title: string;
}

const HASH = /^#foto-([a-z]+)-(\d+)$/;

export function initGallery(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-gallery-dialog]');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const q = <T extends Element>(sel: string): T => {
    const el = dialog.querySelector<T>(sel);
    if (!el) throw new Error(`Falta ${sel} en la galería`);
    return el;
  };
  const img = q<HTMLImageElement>('[data-gallery-img]');
  const avif = q<HTMLSourceElement>('[data-gallery-avif]');
  const webp = q<HTMLSourceElement>('[data-gallery-webp]');
  const caption = q<HTMLElement>('[data-gallery-caption]');
  const title = q<HTMLElement>('[data-gallery-title]');
  const counter = q<HTMLElement>('[data-gallery-counter]');
  const prev = q<HTMLButtonElement>('[data-gallery-prev]');
  const next = q<HTMLButtonElement>('[data-gallery-next]');
  const close = q<HTMLButtonElement>('[data-gallery-close]');
  const counterTemplate = dialog.dataset.counter ?? '{i} / {n}';

  const slidesFor = (group: string): Slide[] =>
    Array.from(document.querySelectorAll<HTMLAnchorElement>(`a[data-gallery="${group}"]`))
      .sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index))
      .map((a) => ({
        avif: a.dataset.avif ?? '',
        webp: a.dataset.webp ?? '',
        href: a.href,
        width: Number(a.dataset.width),
        height: Number(a.dataset.height),
        alt: a.dataset.alt ?? '',
        title: a.dataset.title ?? '',
      }));

  let group = '';
  let slides: Slide[] = [];
  let index = 0;
  let opener: HTMLElement | null = null;
  let pushedHistory = false;

  const preload = (s: Slide | undefined): void => {
    if (!s) return;
    const pre = new Image();
    pre.sizes = '100vw';
    pre.srcset = s.webp;
  };

  const render = (): void => {
    const s = slides.at(index);
    if (!s) return;
    avif.srcset = s.avif;
    webp.srcset = s.webp;
    img.src = s.href;
    img.width = s.width;
    img.height = s.height;
    img.alt = s.alt;
    caption.textContent = s.alt;
    title.textContent = s.title;
    dialog.setAttribute('aria-label', s.title);
    counter.textContent = counterTemplate.replace('{i}', String(index + 1)).replace('{n}', String(slides.length));
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    preload(slides.at(index + 1));
    if (index > 0) preload(slides.at(index - 1));
  };

  const updateHash = (): void => {
    const hash = `#foto-${group}-${index + 1}`;
    if (pushedHistory) history.replaceState({ gallery: true }, '', hash);
    else {
      history.pushState({ gallery: true }, '', hash);
      pushedHistory = true;
    }
  };

  const open = (g: string, i: number, from: HTMLElement | null, fromHistory = false): void => {
    const list = slidesFor(g);
    if (list.length === 0) return;
    group = g;
    slides = list;
    index = Math.min(Math.max(i, 0), list.length - 1);
    opener = from;

    const reveal = (): void => {
      render();
      if (!dialog.open) dialog.showModal();
    };
    // La foto "crece" desde el carrusel hasta la galería (View Transitions, si el navegador la soporta).
    const thumb = from?.querySelector('img');
    const doc = document as Document & { startViewTransition?: (cb: () => Promise<void> | void) => { finished: Promise<void> } };
    if (thumb && !dialog.open && doc.startViewTransition && !prefersReducedMotion()) {
      thumb.style.viewTransitionName = 'gallery-photo';
      const vt = doc.startViewTransition(async () => {
        thumb.style.viewTransitionName = '';
        reveal();
        img.style.viewTransitionName = 'gallery-photo';
        // Espera (poco) a que la foto grande esté lista para que la transición no termine en blanco.
        await Promise.race([img.decode().catch(() => undefined), new Promise((r) => setTimeout(r, 350))]);
      });
      void vt.finished.finally(() => {
        img.style.viewTransitionName = '';
      });
    } else {
      reveal();
    }
    if (!fromHistory) updateHash();
    close.focus();
  };

  const go = (delta: number): void => {
    const target = index + delta;
    if (target < 0 || target >= slides.length) return;
    index = target;
    render();
    updateHash();
  };

  const shut = (): void => {
    if (pushedHistory) {
      pushedHistory = false;
      history.back(); // dispara popstate, que cierra el diálogo
      return;
    }
    if (dialog.open) dialog.close();
  };

  dialog.addEventListener('close', () => {
    if (pushedHistory) {
      pushedHistory = false;
      history.back();
    }
    opener?.focus({ preventScroll: true });
  });

  window.addEventListener('popstate', () => {
    const match = HASH.exec(location.hash);
    if (match) {
      open(match[1] ?? '', Number(match[2]) - 1, null, true);
    } else if (dialog.open) {
      pushedHistory = false;
      dialog.close();
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>('a[data-gallery], a[data-gallery-open]');
    if (!link) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    const g = link.dataset.gallery ?? link.dataset.galleryOpen ?? '';
    open(g, Number(link.dataset.index ?? 0), link);
  });

  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  close.addEventListener('click', shut);

  // Esc: el navegador cierra el diálogo; lo interceptamos para sincronizar el historial.
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    shut();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') go(-1);
    else if (event.key === 'ArrowRight') go(1);
  });

  // Clic en el fondo (fuera de la foto y de los controles) cierra.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) shut();
  });

  // Deslizamiento táctil horizontal.
  let startX = 0;
  let startY = 0;
  dialog.addEventListener(
    'touchstart',
    (e) => {
      const t = e.touches[0];
      if (!t) return;
      startX = t.clientX;
      startY = t.clientY;
    },
    { passive: true },
  );
  dialog.addEventListener(
    'touchend',
    (e) => {
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
    },
    { passive: true },
  );

  // Enlace compartido directo a una foto.
  const initial = HASH.exec(location.hash);
  if (initial) {
    history.replaceState(null, '', location.pathname + location.search);
    open(initial[1] ?? '', Number(initial[2]) - 1, null);
  }
}
