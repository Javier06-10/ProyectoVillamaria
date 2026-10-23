import { initGallery } from './gallery';
import { initTourNav } from './tour-nav';
import { initInquiryForm } from './inquiry-form';
import { initHero } from './hero';
import { initCarousels } from './carousel';
import { initDistanceBars, initReveal } from './motion';

// Cada módulo es independiente: si uno falla, el resto de la página sigue funcionando.
for (const init of [initReveal, initDistanceBars, initHero, initCarousels, initGallery, initTourNav, initInquiryForm]) {
  try {
    init();
  } catch (error) {
    console.error(`[villa] ${init.name} falló`, error);
  }
}
