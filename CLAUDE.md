# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Maestro ACVOLT — a Spanish-language PWA for HVAC certification training (EPA 608, NATE, OSHA 30). Pure vanilla JavaScript frontend with Supabase backend, deployed on Netlify.

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

- **Supabase**: Auth, PostgreSQL database, 38+ Edge Functions in `supabase/functions/`
- **Stripe**: Payment processing via Edge Functions (`create-checkout-session`)
- **100ms Live**: Video conferencing (`live-streaming.js`, `hms-token` edge function)
- **Service Worker** (`sw.js`): Offline caching with versioned cache (`CACHE_VERSION`)

### Build & Deploy

- **Build**: esbuild minifies and bundles tiers, updates `index.html` script tags with content-hashed URLs
- **Output**: `dist/` directory
- **Deploy**: Netlify (`netlify.toml`), Node 20
- **CI**: Two GitHub Actions workflows — `build.yml` (validation/audit/minification) and `ci.yml` (Vitest + Playwright)

### CI Budget Enforcement

The `build.yml` workflow enforces size budgets and will fail the build if exceeded:
- `index.html`: 500 KB max
- Tier 0+1 JS combined: 600 KB max
- CSS total: 300 KB (warning only)
- Also checks: `console.log` count, CSP headers (no `unsafe-eval`), hardcoded secrets, critical file existence

### Testing

- **Unit tests** (Vitest + jsdom): `tests/*.test.js`. Global mocks for Supabase client and auth are in `tests/setup.js`. Use `loadScript()`/`loadScripts()` to load source files into the test global scope.
- **E2E tests** (Playwright): `tests/e2e/`. Uses `npx serve . -l 3333 -s` as the dev server.

## Code Patterns

- UI is entirely in Spanish
- All JS files are global-scope scripts (no ESM imports/exports in frontend code)
- New features follow the lazy-loading pattern: create `js/feature.js`, add it to `LAZY_JS_ROOT` in `scripts/build.js`, load it via `MaestroLoader` from `index.html` or navigation
- Database migrations are in `supabase/migrations/` (sequential numbered SQL files)
- Edge Functions are in `supabase/functions/<name>/index.ts` (TypeScript, Deno runtime)
