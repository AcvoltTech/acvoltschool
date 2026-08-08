# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Maestro ACVOLT — a Spanish-language PWA for HVAC certification training (EPA 608, NATE, OSHA 30). Pure vanilla JavaScript frontend with Supabase backend, served at **acvoltschool.com** on **Cloudflare Pages**.

## Commands

```bash
npm run build             # esbuild pipeline → dist/
npm run build:clean       # build with clean dist/ first
npm test                  # Vitest unit tests (jsdom)
npm run test:watch        # Vitest in watch mode
npm run test:e2e          # Playwright E2E (Chromium, serves on :3333)
npm run lint              # ESLint: js/*.js, js/admin/*.js, js/crm/*.js
npm run lint:errors       # ESLint errors only
npx vitest run tests/auth.test.js  # Run a single test file
```

## Architecture

**No framework.** All frontend code is vanilla ES6+ JavaScript using global variables and script-tag loading (no import/export modules). Scripts declare globals that other scripts consume.

### Tiered Script Loading

The build system (`scripts/build.js`) uses a 3-tier strategy that controls load order:

- **Tier 0** (synchronous, blocks render): `error-tracking`, `logger`, `utils`, `config`, `lazy-loader`, `supabase-init` → bundled into `tier0.bundle.js`
- **Tier 1** (deferred, after HTML parse): `auth-manager`, `navigation`, `quiz`, `certificates`, and ~17 more core modules → bundled into `tier1.bundle.js`
- **Lazy** (on-demand via `MaestroLoader`): admin/, crm/, large features like `desafio`, `live-streaming`, `unified-payments` → individually minified

Scripts within a tier are concatenated (not ESM-bundled), so global `var`/`function` declarations are shared across files. The test setup (`tests/setup.js`) uses `loadScript()` to simulate this by rewriting `const`/`let` to `var` and eval-ing into global scope.

### Key Integrations

- **Supabase**: Auth, PostgreSQL database, 64 Edge Functions in `supabase/functions/`
- **Stripe**: Payment processing via Edge Functions (`create-checkout-session`)
- **100ms Live**: Video conferencing (`live-streaming.js`, `hms-token` edge function)
- **Service Worker** (`sw.js`): Offline caching with versioned cache (`CACHE_VERSION`)

### Build & Deploy

> ⚠️ **Lo más importante de este archivo: producción sirve la RAÍZ del repo, NO `dist/`.**
> Verificado 2026-07-20 contra el sitio vivo y contra `.github/workflows/deploy.yml`.

- **Deploy**: GitHub Actions (`.github/workflows/deploy.yml`) en cada push a `main` →
  `wrangler pages deploy . --project-name=acvoltschool --branch=main`.
  Fíjate en el `.` — publica el **repo entero tal cual**. Cloudflare Pages, no Netlify
  (no existe `netlify.toml`).
- **`npm run build` NO forma parte del deploy.** Nadie lo corre en CI. `dist/` se genera
  solo en local y **no se sirve nunca**.
- **Consecuencia práctica (la trampa):** para que un JS nuevo llegue a producción tiene que
  (1) estar **commiteado en la raíz** y (2) tener su `<script src>` en `index.html`.
  Agregarlo solo a las listas de `scripts/build.js` **no hace nada en producción** — solo
  afecta a `dist/`, que nadie sirve. Mantén las dos cosas de todos modos: `dist/` roto es
  bomba de tiempo si algún día el deploy se alinea con el build.
- **Al depurar, mide contra la superficie real:** `curl https://acvoltschool.com/js/<archivo>.js`
  y confirma `content-type: application/javascript`. Probar contra `dist/` servido en
  localhost produce **falsos positivos** (un archivo puede faltar en `dist/` y estar
  perfectamente bien en producción).
- **Build local** (útil para revisar bundles, no para desplegar): esbuild minifica y agrupa
  los tiers y reescribe los `<script>` de `index.html` con URLs content-hashed → `dist/`.
- **CI**: un solo workflow, `deploy.yml` (deploy). No hay gate de tests ni de budgets en CI —
  corre `npm test` / `npm run lint` en local antes de empujar.

### Size budgets — NO se aplican automáticamente

Este archivo describía antes un workflow `build.yml` que hacía cumplir budgets de tamaño.
**Ese workflow no existe** (el único es `deploy.yml`), y `scripts/build.js` tampoco tiene
lógica de budgets. Verificado 2026-07-20. Nada bloquea un push por tamaño.

Como referencia histórica, los límites que se buscaban eran: `index.html` ≤ 500 KB,
Tier 0+1 JS ≤ 600 KB, CSS ≤ 300 KB. Hoy `index.html` ya pasa de 670 KB — si te importan,
hay que medirlos a mano o volver a montar el gate en CI.

### Testing

- **Unit tests** (Vitest + jsdom): `tests/*.test.js`. Global mocks for Supabase client and auth are in `tests/setup.js`. Use `loadScript()`/`loadScripts()` to load source files into the test global scope.
- **E2E tests** (Playwright): `tests/e2e/`. Uses `npx serve . -l 3333 -s` — sirve la **raíz**, igual que producción. Es la superficie correcta para probar; NO pruebes contra `dist/`.

## Code Patterns

- UI is entirely in Spanish
- All JS files are global-scope scripts (no ESM imports/exports in frontend code)
- New features: crea `js/feature.js` y **commitéalo** (producción sirve la raíz). Cárgalo con
  `MaestroLoader` desde `index.html`/navigation, o con un `<script src="js/feature.js?v=N">` si
  debe cargar temprano. Agrégalo **además** a `scripts/build.js` (`LAZY_JS_ROOT` para lazy,
  `TIER1_SCRIPTS` para core, `STANDALONE_JS` para `<script src>` sin defer) — eso mantiene
  `dist/` sano, pero **por sí solo no lo publica**: lo que llega a producción es el archivo
  commiteado en la raíz + su referencia en `index.html`. Ver "Build & Deploy" arriba.
- Database migrations are in `supabase/migrations/` (sequential numbered SQL files)
- Edge Functions are in `supabase/functions/<name>/index.ts` (TypeScript, Deno runtime)
