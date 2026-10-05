# Quality

How this portfolio is held to the design and development constitution: what it is for, where it must work, what counts as done, and the evidence. Last reviewed 5 October 2026.

## Brief

- **For:** recruiters and teams hiring a developer who builds complete products: iPhone apps, websites, and the servers and agents behind them.
- **Main task:** in under a minute, understand what Marc builds, see one real case (Alice) in depth, and get in touch.
- **Success:** a visitor reaches Contact and has a working way to write. Not measured yet: there is no analytics, by choice (see Exceptions).
- **Out of scope:** blog, CMS, accounts, forms, tracking.
- **Data:** none collected. The browser stores only the chosen language and theme (`localStorage`). No cookies, no third-party requests.
- **Languages:** Spanish (`/`), Catalan (`/ca/`), English (`/en/`).

## Support matrix

| Where | Engines and sizes | How it is checked |
|---|---|---|
| iPhone, Safari (iOS 26) | WebKit, 393 × 659 | Playwright `iphone` project on every push; iOS Simulator by hand (`docs/qa/`) |
| Mac, Safari | WebKit, desktop | Playwright `webkit` project on every push |
| Chrome, Edge | Chromium, desktop | Playwright `chromium` project, axe scan |
| Firefox | Gecko, desktop | Playwright `firefox` project |
| Narrow and zoomed | 320 px wide (equals 400 % zoom at 1280 px), text at 200 % on 375 px and 1280 px | Playwright reflow tests |
| Preferences | light and dark, reduced motion, no JavaScript | Playwright and axe |

## Acceptance criteria and evidence

| ID | Criterion | Priority | Evidence |
|---|---|---|---|
| NAV-01 | Opening the Alice case and going Back returns to the same scroll position, with focus on the Alice card | P1 | `journeys`: opening the case and going back… |
| NAV-02 | Links to `#historia` and `#como` open the case at that section, also after a reload | P1 | `journeys`: a link to #historia / #como… |
| NAV-03 | A shared link to `#contacto` and «Get in touch» show the whole contact footer; a reload opens at the top | P1 | `journeys`: shared link to Contact; Get in touch |
| KEY-01 | The first Tab reaches «Saltar al contenido», which moves focus to the work | P1 | `journeys`: keyboard (Chromium, Firefox) |
| A11Y-01 | No serious or critical axe issues on the index, the case and the 404, light and dark, in all three languages | P1 | `a11y` spec |
| A11Y-02 | Text contrast at least 4.5:1, large text 3:1, light and dark | P1 | `tests/check.py` section 4 |
| A11Y-03 | Nothing scrolls sideways at 320 px, or with text at 200 % | P1 | `journeys`: no sideways scrolling; text at 200 % |
| A11Y-04 | With reduced motion nothing moves and every text is visible | P1 | `journeys`: reduced motion |
| I18N-01 | Each language has its own address, translated in the HTML, readable without JavaScript | P1 | `journeys`: language pages; `tests/check.py` section 5 |
| PRIV-01 | Nothing is requested from another site | P1 | `journeys`: nothing is requested…; `tests/check.py` section 1 |
| PERF-01 | First visit within budget: index ≤ 40 KB, CSS ≤ 50 KB, JS ≤ 60 KB, font ≤ 40 KB; LCP ≤ 2.5 s, CLS ≤ 0.1 | P1 | `tests/check.py` section 6; Lighthouse report in CI (measured 1.27 s LCP, CLS 0 on 5 Oct 2026, lab) |
| SEC-01 | Content-Security-Policy on every page; vendored code matches its reviewed hash | P1 | `tests/check.py` sections 1 and 7 |
| BUILD-01 | The published files are exactly what the source builds | P0 | CI step «The committed site matches its source» |

## Still checked by hand

Done on 5 October 2026:
- iOS Simulator, Safari 26.5: index, `#contacto`, `#historia`, `/en/` and the 404 (`docs/qa/ios-safari-*.png`).

Still to do, and what each one needs:
- **VoiceOver on a real iPhone (Marc):** the index and the case read in order, the mockups are skipped, and the section dots announce the current one.
- **A real iPhone (Marc):** the contact panel meets the screen's own corners, the headline settles at 56 px, and switching themes keeps the signal line visible.
- **Safari on a Mac:** keyboard navigation with «Press Tab to highlight each item» turned on. Playwright skips this one, because Safari only tabs to links with that setting.

## Exceptions

| Rule | Why | Mitigation | Review |
|---|---|---|---|
| §19 field data (real-user LCP, INP, CLS) | Measuring real users needs analytics, which would add a third party and tracking | Lab measurements and Lighthouse on every push | When a privacy-friendly, self-hosted measure is worth it |
| §17 «no scroll hijacking» | Lenis smooths the wheel on desktop with a fine pointer | Off for touch and reduced motion; native scrolling everywhere else | Open decision: soften or remove |
| Lighthouse never blocks publishing | Lab scores vary between runs on shared CI machines | Kept as a report; budgets and axe do block | — |
| Placeholders visible (email, LinkedIn, «Sobre mí», video demo) | Real content still to come from Marc | Listed here | Before sharing the link |

## Definition of Done for a change

- [ ] `python3 src/build.py`, then commit the source and the built files together.
- [ ] `python3 tests/check.py` passes.
- [ ] `npm test` passes: Playwright journeys and axe in Chromium, WebKit, Firefox and iPhone.
- [ ] A change you can see is checked at 320 px and on a desktop, in light and dark mode, and in one other language.
- [ ] A change to navigation or focus is also tried with the keyboard.
- [ ] Anything new that cannot be tested automatically is added under «Still checked by hand».
- [ ] CI is green before the change counts as published. A green build means it is published, not that it is correct: look at the live page.
