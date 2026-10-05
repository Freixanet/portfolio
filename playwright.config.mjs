// Browser journeys for the portfolio: Chromium, WebKit (Safari's engine) and Firefox, phone and desktop.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 2,                      // more parallel WebKit instances make its timing unreliable on a laptop
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: { baseURL: 'http://127.0.0.1:4173/portfolio/', locale: 'es-ES', trace: 'retain-on-failure' },
  webServer: { command: 'python3 tests/serve.py 4173', url: 'http://127.0.0.1:4173/portfolio/', reuseExistingServer: !process.env.CI },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'iphone', use: { ...devices['iPhone 15'] } },
  ],
});
