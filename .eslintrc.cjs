// ACVOLT School — ESLint baseline
//
// 🔴 ESTE ARCHIVO NO EXISTÍA (9-sep-2026). `npm run lint` y `npx eslint` reventaban
// en seco con "ESLint couldn't find a configuration file" — no en un archivo, en
// TODOS. O sea: el repo tenía un script de lint en package.json, CLAUDE.md pedía
// correrlo antes de empujar, y el gate llevaba meses sin revisar ni una línea.
// Un lint que siempre truena es un lint que nadie corre.
//
// Copiado del app grande (~/Developer/clon-ios-googleplay/.eslintrc.cjs), que ya
// había pasado por exactamente esta misma falla.
//
// Alcance: js/*.js, js/admin/*.js, js/crm/*.js (lo que dice package.json).
// Estilo: base pragmática que NO pelea con el código existente. Los errores
// reales (undef, unused) salen como WARNING, no como error: así el gate arranca
// en 0 errores hoy y se puede ir apretando archivo por archivo, en vez de
// bloquear todo de golpe y que alguien lo vuelva a apagar.

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'script' // scripts de ámbito global, sin ESM en el frontend
  },
  // Globales que los scripts se comparten entre sí por la carga en tiers
  globals: {
    // Supabase + auth
    SB: 'readonly',
    SUPABASE_URL: 'readonly',
    SUPABASE_KEY: 'readonly',
    SUPABASE_ANON_KEY: 'readonly',
    supabaseClient: 'writable',   // supabase-init.js lo asigna
    // 🪤 `currentUser` y `showScreen` SÍ se reasignan en este repo (auth.js,
    // navigation.js y ~10 más). Marcarlos 'readonly' inventaba 12 errores
    // falsos de no-global-assign y tapaba los de verdad.
    currentUser: 'writable',

    // Traducción + UI
    _t: 'readonly',
    _addTranslations: 'readonly',
    _lang: 'readonly',
    showScreen: 'writable',
    showToast: 'writable',
    MaestroDialog: 'readonly',

    // Estado de la app + utilidades
    APP_VERSION: 'readonly',
    MaestroLoader: 'readonly',
    MaestroVideoFirma: 'readonly',
    MaestroIdentity: 'readonly',
    Gamification: 'readonly',

    // Librerías de terceros
    Hls: 'readonly',              // hls.js
    Stream: 'readonly',           // SDK de Cloudflare Stream (embed.cloudflarestream.com)
    HMSReactiveStore: 'readonly', // live-streaming (100ms)
    bootstrap: 'readonly'
  },
  rules: {
    // Errores reales → warn (se van escalando a error por archivo cuando limpie)
    'no-unused-vars': ['warn', {
      args: 'none',
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_'
    }],
    'no-undef': 'warn',
    'no-redeclare': 'warn',
    'no-empty': ['warn', { allowEmptyCatch: true }],
    'no-useless-escape': 'off',     // demasiado ruido en código lleno de regex
    'no-prototype-builtins': 'off', // el código usa .hasOwnProperty a propósito
    'no-cond-assign': ['error', 'except-parens'],
    'no-constant-condition': ['warn', { checkLoops: false }],
    'no-irregular-whitespace': 'warn',
    'no-control-regex': 'off',
    // 🪤 Puro estilo en este código: declarar funciones dentro de un `if` o un
    // bloque funciona igual. Como error solo hace ruido y esconde los de verdad.
    'no-inner-declarations': 'warn',
    // Estos SÍ son bugs de verdad y se quedan en error:
    //   no-dupe-keys      → la segunda clave gana en silencio (traducciones que nunca salen)
    //   no-self-assign    → una línea que no hace nada donde alguien creyó que hacía algo
    //   no-func-assign    → se pisa una función con un valor
    //   no-unreachable    → código que nunca corre (zona muerta)
    'no-dupe-keys': 'error',
    'no-self-assign': 'error',
    'no-func-assign': 'error',
    'no-unreachable': 'error'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    // 🪤 Salida del build commiteada dentro de js/: minificada, no es fuente.
    // Sin esto el lint reporta cientos de "errores" de código que nadie escribió.
    'js/*.bundle.js',
    'js/vendor/',
    // 🔴 `js/push-notifications.js` está COMMITEADO MINIFICADO (1 sola línea) y no
    // hay fuente legible en este repo — la versión legible de 1070 líneas vive en
    // el app grande. Linteralo solo reporta "errores" del minificador. Se ignora,
    // pero eso NO arregla el problema de fondo: ese archivo aquí no se puede editar.
    'js/push-notifications.js'
  ],
  overrides: [
    {
      // 🔴 Las pruebas son ESM (`import ... from 'vitest'`) y el parser global del
      // proyecto es `sourceType: 'script'`: sin esto revientan en la línea del import.
      files: ['tests/**/*.js'],
      parserOptions: { sourceType: 'module' },
      env: { browser: true, es2021: true, node: true },
      globals: {
        describe: 'readonly', it: 'readonly', test: 'readonly', expect: 'readonly',
        beforeEach: 'readonly', afterEach: 'readonly', beforeAll: 'readonly',
        afterAll: 'readonly', vi: 'readonly'
      }
    },
    {
      // El código de admin es interno: menos estricto
      files: ['js/admin/**/*.js'],
      rules: {
        'no-unused-vars': 'off'
      }
    },
    {
      // scripts/ y *.config.js corren en Node, no en el navegador
      files: ['scripts/**/*.js', '*.config.js'],
      env: { node: true, browser: false }
    }
  ]
};
