// axe-core on each view, theme and language. Serious and critical issues fail; others are listed in the report.
// A passing scan is not proof of accessibility: keyboard, VoiceOver and zoom are still checked by hand (QUALITY.md).
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const views = [
  { name: 'index', path: './' },
  { name: 'case', path: './#alice' },
  { name: '404', path: './does-not-exist' },
];

for (const view of views) {
  for (const scheme of ['light', 'dark']) {
    test(`axe: ${view.name}, ${scheme}`, async ({ page, browserName }, info) => {
      test.skip(browserName !== 'chromium', 'one engine is enough for the rule scan');
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });   // every element in its final state
      await page.goto(view.path);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      await info.attach('axe.json', { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });
      const blocking = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
      expect(blocking.map((v) => `${v.id}: ${v.help} (${v.nodes.length}) ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
    });
  }
}

test('axe: index in Catalan and English', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'one engine is enough for the rule scan');
  for (const lang of ['ca', 'en']) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`./${lang}/`);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
    const blocking = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    expect(blocking.map((v) => `${lang} ${v.id}: ${v.help} ${v.nodes.slice(0, 3).map((n) => n.target.join(" ") + " " + (n.any[0] && n.any[0].message)).join(" | ")}`)).toEqual([]);
  }
});
