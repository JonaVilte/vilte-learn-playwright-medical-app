import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    trace: 'on-first-retry',
    baseURL: 'http://localhost:3000', // útil para usar `page.goto('/')`
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], headless: true },
    },
    // WebKit deshabilitado para ahorrar recursos
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'], headless: false },
    // },
  ],

  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 120 * 1000, // Tiempo máximo de espera
    reuseExistingServer: !process.env.CI,
  },
});