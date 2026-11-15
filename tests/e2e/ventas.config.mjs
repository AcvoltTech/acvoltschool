// Prueba del Tablero de ventas en navegador (13-nov-2026). Puerto propio para no chocar con otras sesiones:
//   PUERTO=4417 zsh ~/Developer/trabajo-agentes/vr-auditoria-codex/h/con-candado.sh npx playwright test --config=tests/e2e/ventas.config.mjs
import { defineConfig } from '@playwright/test';
const P = Number(process.env.PUERTO || 4417);
export default defineConfig({
  testDir: '.', testMatch: /ventas-tablero\.spec\.js/, timeout: 60000, retries: 0,
  use: { baseURL: 'http://localhost:' + P, headless: true, screenshot: 'only-on-failure' },
  webServer: { command: 'npx serve ../.. -l ' + P, port: P, reuseExistingServer: false, timeout: 20000 },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
