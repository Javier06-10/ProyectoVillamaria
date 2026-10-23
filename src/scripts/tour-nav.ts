/**
 * Resalta en la barra el ambiente visible y oculta el botón fijo
 * cuando la sección de consulta ya está en pantalla.
 * Sin JS, la barra sigue funcionando como enlaces de ancla.
 */
export function initTourNav(): void {
  if (!('IntersectionObserver' in window)) return;

  const links = new Map<string, HTMLAnchorElement>();
  document.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach((a) => {
    if (a.dataset.nav) links.set(a.dataset.nav, a);
  });
  const nav = document.querySelector<HTMLElement>('.tour-nav ul');

  let current = '';
  const setActive = (id: string): void => {
    if (id === current) return;
    current = id;
    links.forEach((a, key) => {
      if (key === id) {
        a.setAttribute('aria-current', 'location');
        // Mantiene visible el ambiente activo en la barra deslizable del móvil.
        if (nav && nav.scrollWidth > nav.clientWidth) {
          const left = a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2;
          nav.scrollTo({ left, behavior: 'smooth' });
        }
      } else {
        a.removeAttribute('aria-current');
      }
    });
  };

  const sections = document.querySelectorAll<HTMLElement>('[data-station]');
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(entry.target.id);
      }
    },
    // Una franja en el tercio superior de la pantalla define el ambiente "actual".
    { rootMargin: '-30% 0px -60% 0px' },
  );
  sections.forEach((s) => observer.observe(s));

  const sticky = document.querySelector<HTMLElement>('[data-sticky]');
  const contact = document.getElementById('consultar');
  const hero = document.getElementById('inicio');
  if (sticky && contact && hero) {
    const visible = { hero: true, contact: false };
    const update = (): void => {
      sticky.toggleAttribute('data-hidden', visible.hero || visible.contact);
    };
    new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) visible.hero = e.isIntersecting;
        if (e.target === contact) visible.contact = e.isIntersecting;
      }
      update();
    }).observe(hero);
    const contactObserver = new IntersectionObserver((entries) => {
      for (const e of entries) visible.contact = e.isIntersecting;
      update();
    });
    contactObserver.observe(contact);
    update();
  }
}
