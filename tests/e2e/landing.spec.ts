import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SHOTS = process.env.SHOTS_DIR;

test.describe('recorrido', () => {
  test('muestra portada, barra de ambientes y las seis estaciones', async ({ page }, info) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Villa María/);
    await expect(page.getByRole('heading', { level: 1, name: 'Villa María' })).toBeVisible();
    const nav = page.getByRole('navigation', { name: 'Recorrido por la villa' });
    await expect(nav.getByRole('link')).toHaveCount(info.project.name === 'desktop' ? 8 : 7);
    for (const name of ['La llegada', 'La casa', 'Adentro', 'La vista', 'La piscina', 'Patio y cabañas']) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeAttached();
    }
    if (SHOTS) {
      await page.evaluate(async () => {
        // Fuerza la carga de las imágenes diferidas antes de la captura completa.
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${SHOTS}/${info.project.name}-top.png` });
      await page.screenshot({ path: `${SHOTS}/${info.project.name}-full.png`, fullPage: true });
    }
  });

  test('no hay desplazamiento horizontal en la página', async ({ page }) => {
    for (const path of ['/', '/en/']) {
      await page.goto(path);
      const [scroll, client] = await page.evaluate(() => [
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth,
      ]);
      expect(scroll, path).toBeLessThanOrEqual(client);
    }
  });

  test('la barra marca el ambiente visible', async ({ page }) => {
    await page.goto('/');
    await page.locator('#piscina').scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 200);
    await expect(page.locator('[data-nav="piscina"]')).toHaveAttribute('aria-current', 'location');
  });

  test('sin JavaScript todo el contenido y los enlaces siguen disponibles', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('#casa a[data-gallery]').first()).toHaveAttribute('href', /\.webp$/);
    await expect(page.locator('a[href^="https://wa.me/18094999398"]')).toHaveCount(1);
    await expect(page.locator('form#inquiry')).toHaveAttribute('action', 'https://wa.me/18094999398');
    await ctx.close();
  });
});

test.describe('galería', () => {
  test('abre, navega con teclado, cierra con Esc y devuelve el foco', async ({ page }, info) => {
    await page.goto('/');
    const thumb = page.locator('#casa .carousel__track a').nth(1);
    await thumb.scrollIntoViewIfNeeded();
    await thumb.click();
    const dialog = page.locator('dialog[data-gallery-dialog]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('[data-gallery-counter]')).toHaveText('2 de 11');
    await expect(page).toHaveURL(/#foto-casa-2$/);
    await expect(dialog.locator('img')).toHaveJSProperty('complete', true);
    await page.keyboard.press('ArrowRight');
    await expect(dialog.locator('[data-gallery-counter]')).toHaveText('3 de 11');
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${info.project.name}-gallery.png` });
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(page).not.toHaveURL(/#foto-/);
    await expect(thumb).toBeFocused();
  });

  test('el botón Atrás del navegador cierra la galería', async ({ page }) => {
    await page.goto('/');
    await page.locator('#piscina .carousel__track a').first().click();
    const dialog = page.locator('dialog[data-gallery-dialog]');
    await expect(dialog).toBeVisible();
    await page.goBack();
    await expect(dialog).toBeHidden();
  });

  test('un enlace compartido abre la foto indicada', async ({ page }) => {
    await page.goto('/#foto-patio-3');
    const dialog = page.locator('dialog[data-gallery-dialog]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('[data-gallery-counter]')).toHaveText('3 de 11');
    await expect(dialog.locator('img')).toHaveAttribute('alt', 'Columpios en el patio entre árboles');
  });
});

test.describe('carruseles y animaciones', () => {
  test('el carrusel avanza con las flechas y actualiza el contador', async ({ page }) => {
    await page.goto('/');
    const carousel = page.locator('#casa [data-carousel]');
    await carousel.scrollIntoViewIfNeeded();
    const prev = carousel.getByRole('button', { name: 'Foto anterior' });
    const next = carousel.getByRole('button', { name: 'Foto siguiente' });
    await expect(prev).toBeDisabled();
    await next.click();
    await expect(carousel.locator('[data-carousel-current]')).toHaveText('2');
    await next.click();
    await expect(carousel.locator('[data-carousel-current]')).toHaveText('3');
    await expect(prev).toBeEnabled();
    await prev.click();
    await expect(carousel.locator('[data-carousel-current]')).toHaveText('2');
  });

  test('el pase de fotos de la portada se puede pausar', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Pausar fotos' });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.getByRole('button', { name: 'Reanudar fotos' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-hero]')).toHaveAttribute('data-paused', '');
  });

  test('con movimiento reducido todo queda visible y sin pase automático', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/motion/);
    await expect(page.locator('[data-hero-toggle]')).toBeHidden();
    await page.locator('#incluye').scrollIntoViewIfNeeded();
    await expect(page.locator('.amenity').first()).toHaveCSS('opacity', '1');
    await ctx.close();
  });

  test('las secciones aparecen al hacer scroll', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('#incluye .amenity').first();
    await expect(page.locator('html')).toHaveClass(/motion/);
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveClass(/is-in/);
    await expect(card).toHaveCSS('opacity', '1');
  });
});

test.describe('consulta por WhatsApp', () => {
  test('muestra errores claros y no envía si faltan datos', async ({ page }) => {
    await page.goto('/#consultar');
    await page.getByRole('button', { name: 'Abrir WhatsApp con mi consulta' }).click();
    await expect(page.getByRole('alert')).toHaveText('Revisa los campos marcados.');
    await expect(page.getByLabel('Tu nombre')).toBeFocused();
    await expect(page.getByLabel('Tu nombre')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#f-name-error')).toHaveText('Este dato es necesario.');
    await page.getByLabel('Tu nombre').fill('Ana');
    await expect(page.locator('#f-name-error')).toBeHidden();
  });

  test('rechaza una salida anterior a la llegada', async ({ page }) => {
    await page.goto('/#consultar');
    await page.getByLabel('Tu nombre').fill('Ana');
    await page.getByLabel('Llegada', { exact: true }).fill('2027-03-10');
    await page.getByLabel('Salida', { exact: true }).fill('2027-03-08');
    await page.getByLabel('Personas').fill('4');
    await page.getByRole('button', { name: 'Abrir WhatsApp con mi consulta' }).click();
    await expect(page.locator('#f-out-error')).toHaveText('La salida debe ser después de la llegada.');
  });

  test('abre WhatsApp con el mensaje armado y conserva los datos', async ({ page }) => {
    let opened = '';
    await page.route('https://wa.me/**', async (route) => {
      opened = route.request().url();
      await route.fulfill({ status: 200, contentType: 'text/html', body: '<p>wa</p>' });
    });
    await page.goto('/#consultar');
    await page.getByLabel('Tu nombre').fill('Ana Pérez');
    await page.getByLabel('Llegada', { exact: true }).fill('2027-03-10');
    await page.getByLabel('Salida', { exact: true }).fill('2027-03-13');
    await page.getByLabel('Personas').fill('5');
    await page.getByRole('button', { name: 'Abrir WhatsApp con mi consulta' }).click();
    await expect.poll(() => opened).toContain('https://wa.me/18094999398?text=');
    const text = new URL(opened).searchParams.get('text') ?? '';
    expect(text).toContain('Hola, soy Ana Pérez. Me interesa alquilar Villa María.');
    expect(text).toContain('Salida: 13 mar 2027 (3 noches)');
    expect(text).toContain('Personas: 5');
    await page.goBack();
    await expect(page.getByLabel('Tu nombre')).toHaveValue('Ana Pérez');
  });

  test('si la redirección falla, queda un enlace directo con el mensaje', async ({ page }) => {
    await page.route('https://wa.me/**', (route) => route.fulfill({ status: 204 }));
    await page.goto('/#consultar');
    await page.getByLabel('Tu nombre').fill('Ana');
    await page.getByLabel('Llegada', { exact: true }).fill('2027-03-10');
    await page.getByLabel('Salida', { exact: true }).fill('2027-03-12');
    await page.getByLabel('Personas').fill('2');
    await page.getByRole('button', { name: 'Abrir WhatsApp con mi consulta' }).click();
    const link = page.getByRole('status').getByRole('link', { name: 'Abrir WhatsApp con mi consulta' });
    await expect(link).toHaveAttribute('href', /^https:\/\/wa\.me\/18094999398\?text=Hola%2C%20soy%20Ana/);
    await expect(page.getByLabel('Tu nombre')).toHaveValue('Ana');
    await expect(page.getByRole('button', { name: 'Abrir WhatsApp con mi consulta' })).toBeEnabled();
  });
});

test.describe('idiomas y accesibilidad', () => {
  test('la versión en inglés usa sus propios textos y mensaje', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 2, name: 'Yard and cabins' })).toBeAttached();
    await page.getByRole('link', { name: 'Español' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es-DO');
  });

  for (const path of ['/', '/en/']) {
    test(`sin violaciones WCAG 2.2 AA detectables en ${path}`, async ({ browser }) => {
      // Con movimiento reducido el contenido está en su estado final (sin animaciones a medias).
      const ctx = await browser.newContext({ reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
      await ctx.close();
    });
  }

  test('sin errores en la consola', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');
    await page.locator('#patio').scrollIntoViewIfNeeded();
    expect(errors).toEqual([]);
  });
});
