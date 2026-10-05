# Portfolio

Marc Freixanet's portfolio, published at https://freixanet.github.io/portfolio/.

The site is static. Its source lives in `src/` and the build writes the published files to the repository root.

| File | Role |
|---|---|
| `src/template.html` | The page: markup, styles, script and the Catalan/English translations |
| `src/ui-screens.html` | The small phone screens drawn in HTML |
| `src/build.py` | Builds `index.html`, `ca/index.html`, `en/index.html`, `styles.css`, `app.js`, `404.html`, `robots.txt`, `sitemap.xml` and `favicon.svg` |
| `src/render_images.py` | Draws `og.png` and `apple-touch-icon.png` (only when the headline or the mark change) |
| `tests/check.py` | Checks links, files, external requests, headings, translations, contrast, metadata, size budgets and vendored hashes |
| `tests/e2e/` | Playwright journeys and axe scans in Chromium, WebKit, Firefox and iPhone |
| `QUALITY.md` | Brief, support matrix, acceptance criteria, evidence, exceptions and Definition of Done |

## Change the site

```bash
python3 src/build.py
python3 tests/check.py
npm ci && npx playwright install chromium webkit firefox   # once
npm test
```

Commit the source and the built files together. Every push runs the same build and checks on GitHub (`.github/workflows/pages.yml`). A push whose built files don't match the source, or that fails a check, is not published.

Fonts (Geist, SIL Open Font License, `fonts/OFL.txt`) and Lenis (`vendor/`) are served from this site, so nothing is requested from other servers.
