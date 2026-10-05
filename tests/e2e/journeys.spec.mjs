// The journeys a visitor takes: open the case and come back, deep links, keyboard, language, theme,
// reduced motion, narrow screens, and a check that nothing is requested from other sites.
import { test, expect } from '@playwright/test';

const scrollY = (page) => page.evaluate(() => Math.round(window.scrollY));
const focused = (page) => page.evaluate(() => {
  const a = document.activeElement;
  return a ? (a.id || a.getAttribute('href') || a.tagName.toLowerCase() + (a.className ? '.' + a.className.split(' ')[0] : '')) : '';
});

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (e) => { throw e; });
});

test('opening the case and going back returns to the same place and focus', async ({ page }) => {
  await page.goto('./');
  const card = page.locator('a.project.feature');
  await card.scrollIntoViewIfNeeded();
  const before = await scrollY(page);
  await card.click();
  await expect(page).toHaveURL(/#alice$/);
  await expect(page.locator('#case')).toBeVisible();
  await expect(page).toHaveTitle('Alice — Marc Freixanet');
  await expect(page.locator('#case h1')).toBeFocused();
  await page.goBack();
  await expect(page.locator('#home')).toBeVisible();
  await expect.poll(() => scrollY(page)).toBe(before);
  await expect(card).toBeFocused();
  await page.goForward();
  await expect(page.locator('#case')).toBeVisible();
});

for (const id of ['historia', 'como']) {
  test(`a link to #${id} opens the case at that section, also after a reload`, async ({ page }) => {
    await page.goto(`./#${id}`);
    await expect(page.locator('#case')).toBeVisible();
    await expect(page.locator('#home')).toBeHidden();
    await expect(page.locator(`#${id}`)).toBeInViewport();
    await page.reload();
    await expect(page.locator('#case')).toBeVisible();
    await expect(page.locator(`#${id}`)).toBeInViewport();
  });
}

test('the section indicator moves within the case without leaving it', async ({ page }) => {
  await page.goto('./#alice');
  await page.locator('#chapterDots a[href="#historia"]').click();
  await expect(page.locator('#case')).toBeVisible();
  await expect(page).toHaveURL(/#historia$/);
  await expect(page.locator('#historia')).toBeInViewport();
  await expect(page.locator('#chapterDots a[href="#historia"]')).toHaveAttribute('aria-current', 'location');
});

test('a shared link to Contact shows the whole contact footer; a reload opens at the top', async ({ page }) => {
  await page.goto('./#contacto');
  await expect(page.locator('.contact footer')).toBeInViewport({ ratio: 1 });
  await page.reload();
  await expect.poll(() => scrollY(page)).toBe(0);
  await expect(page).not.toHaveURL(/#/);
});

test('Get in touch brings the contact footer on screen', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.locator('a.cta').click();
  await expect(page.locator('.contact footer')).toBeInViewport({ ratio: 1 });
});

test('keyboard: the skip link is the first stop and moves focus to the content', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Safari only tabs to links when "Press Tab to highlight each item" is on');
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.locator('a.skip')).toBeFocused();
  await expect(page.locator('a.skip')).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect.poll(() => focused(page)).toBe('trabajo');
  await page.keyboard.press('Tab');
  const inside = await page.evaluate(() => document.getElementById('trabajo').contains(document.activeElement));
  expect(inside).toBe(true);
});

test('language: each one has its own page, the choice is remembered, old ?lang= links still work', async ({ page }) => {
  await page.goto('./');
  await page.locator('a[data-lang="en"]').click();
  await expect(page).toHaveURL(/\/portfolio\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#intro h1')).toHaveText('I build complete products.');
  await expect(page.locator('a[data-lang="en"]')).toHaveAttribute('aria-current', 'page');
  await page.goto('./');                                              // the home address remembers the choice
  await expect(page).toHaveURL(/\/en\/$/);
  await page.locator('a[data-lang="es"]').click();
  await expect(page).toHaveURL(/\/portfolio\/$/);
  await expect(page.locator('#intro h1')).toHaveText('Construyo productos completos.');
  await page.goto('./?lang=ca');
  await expect(page).toHaveURL(/\/ca\/$/);
  await expect(page.locator('#intro h1')).toHaveText('Construeixo productes complets.');
});

test('language pages work without JavaScript, translated in the HTML itself', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('./en/');
  await expect(page.locator('#intro h1')).toHaveText('I build complete products.');
  await page.locator('a[data-lang="ca"]').click();
  await expect(page.locator('#intro h1')).toHaveText('Construeixo productes complets.');
  await context.close();
});

test('theme: follows the system, can be overridden, and is remembered', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./');
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(await bg()).toBe('rgb(0, 0, 0)');
  await page.locator('[data-theme-set="light"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await bg()).toBe('rgb(242, 242, 242)');
  await page.reload();
  expect(await bg()).toBe('rgb(242, 242, 242)');
  await page.locator('[data-theme-set="dark"]').click();               // the system's own mode: back to automatic
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /./);
});

test('reduced motion: no moving effects, and every text is visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('html')).not.toHaveClass(/\bmotion\b/);
  const hidden = await page.evaluate(() => [...document.querySelectorAll('#home h2, #home h3, #home p')]
    .filter((e) => parseFloat(getComputedStyle(e).opacity) < 1).length);
  expect(hidden).toBe(0);
});

for (const width of [320, 375]) {
  test(`no sideways scrolling at ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('./');
    for (const hash of ['', '#alice']) {
      if (hash) await page.goto('./' + hash);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(over, `page ${hash || 'index'}`).toBeLessThanOrEqual(0);
    }
  });
}

test('text at 200% on a phone and a laptop: nothing pushes the page sideways (WCAG 1.4.4, 1.4.10)', async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    for (const path of ['./', './ca/', './en/', './#alice']) {
      await page.goto(path);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(over, `${width}px ${path}`).toBeLessThanOrEqual(0);
    }
  }
});

test('nothing is requested from other sites', async ({ page }) => {
  const outside = [];
  page.on('request', (r) => { if (!r.url().startsWith('http://127.0.0.1:4173/')) outside.push(r.url()); });
  await page.goto('./');
  await page.locator('a.project.feature').click();
  await expect(page.locator('#case')).toBeVisible();
  expect(outside).toEqual([]);
});

test('a missing page shows the site’s own 404 with a way home', async ({ page }) => {
  const res = await page.goto('./does-not-exist');
  expect(res.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Esta página no existe.');
  await page.getByRole('link', { name: 'Ir al inicio' }).click();
  await expect(page.locator('#intro h1')).toBeVisible();
});
