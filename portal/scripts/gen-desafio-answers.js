#!/usr/bin/env node
// Generate DESAFIO_ANSWERS map for verify-answer edge function.
// Loads questions.js + desafio-questions-c1.js as text, evals into a sandbox,
// replicates _dsGetLevelQuestions logic, emits c{corrida}_n{nivel}_{origIdx}: correct.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const QUESTIONS_JS = fs.readFileSync(path.join(ROOT, 'questions.js'), 'utf8');
const C1_JS = fs.readFileSync(path.join(ROOT, 'js/desafio-questions-c1.js'), 'utf8');

// Sandbox: provide `questions` and `DESAFIO_C1` as globals after eval.
const sandbox = { questions: undefined, DESAFIO_C1: undefined, console };
vm.createContext(sandbox);
vm.runInContext(QUESTIONS_JS, sandbox);
vm.runInContext(C1_JS, sandbox);

if (!sandbox.questions || !sandbox.DESAFIO_C1) {
  console.error('Failed to load globals: questions=' + !!sandbox.questions + ' DESAFIO_C1=' + !!sandbox.DESAFIO_C1);
  process.exit(1);
}

// Mirror desafio.js constants
const LEVEL_SIZES = [50, 100, 150, 200, 250];
const CATEGORY_TIERS = {
  'Herramientas': 1, 'Seguridad': 1, 'Instalación': 1,
  'Herramientas Experto': 1, 'Seguridad Completa': 1,
  'Electricidad': 2, 'Tubería': 2, 'Soldadura': 2,
  'Principios Refrigeración': 2, 'Refrigeración': 2, 'Calefacción': 2,
  'Motores Eléctricos': 2, 'Ductos y Flujo de Aire': 2,
  'Tubería y Soldadura': 2, 'Refrigerantes': 2,
  'Mantenimiento': 3, 'Controles': 3, 'Controles y Componentes': 3,
  'Vacío': 3, 'Compresores': 3, 'Bombas de Calor': 3,
  'Mini-Split/Ductless': 3, 'Válvulas y Accesorios': 3,
  'Manejo de Refrigerantes': 3, 'Eficiencia': 3, 'Eficiencia Energética': 3,
  'Tablas PT y Presiones': 3, 'Sistemas': 3,
  'Diagnóstico': 4, 'Troubleshooting': 4, 'Recovery': 4,
  'Fórmulas y Cálculos': 4, 'Psicrometría': 4,
  'Electricidad Avanzada': 4, 'Diagnóstico Avanzado': 4,
  'Diagnóstico con Instrumentos': 4, 'Controles Experto': 4,
  'Sistemas Comerciales': 4, 'Residencial Avanzado': 4,
  'Comercial Avanzado': 4, 'Diseño de Sistemas': 4,
  'EPA 608': 5, 'OSHA': 5, 'OSHA 30': 5, 'Códigos y Seguridad': 5,
  'Técnico Avanzado': 5, 'Escenario Integrado': 5,
  'Industrial': 5, 'Equipos Específicos': 5, 'Códigos y Permisos': 5,
  'Mantenimiento Comercial': 5, 'Códigos': 5
};
const tier = (c) => CATEGORY_TIERS[c] || 3;

function getAllLegacy() {
  const keys = ['principiante', 'intermedio', 'avanzado', 'elite', 'platino'];
  let all = [];
  for (const k of keys) if (sandbox.questions[k]) all = all.concat(sandbox.questions[k]);
  return all;
}

function getCorridaPool(corrida) {
  if (corrida === 1) {
    let pool = [];
    for (let n = 1; n <= 5; n++) {
      const key = 'nivel' + n;
      if (sandbox.DESAFIO_C1[key]) pool = pool.concat(sandbox.DESAFIO_C1[key]);
    }
    return pool;
  }
  const all = getAllLegacy();
  let pool;
  if (corrida === 2) pool = all.slice(750, 1500);
  else if (corrida === 3) pool = all.slice(1500);
  else return [];
  // Stable sort by tier — Array.prototype.sort is stable in V8/SpiderMonkey/JSC since 2019
  pool.sort((a, b) => tier(a.category) - tier(b.category));
  return pool;
}

function getLevelQuestions(corrida, nivel) {
  if (corrida === 1) {
    const key = 'nivel' + nivel;
    return (sandbox.DESAFIO_C1[key] || []).slice();
  }
  const pool = getCorridaPool(corrida);
  let offset = 0;
  for (let i = 0; i < nivel - 1; i++) offset += Math.min(LEVEL_SIZES[i], pool.length - offset);
  const count = Math.min(LEVEL_SIZES[nivel - 1], pool.length - offset);
  return pool.slice(offset, offset + count);
}

const out = {};
const sizes = {};
for (const corrida of [1, 2, 3]) {
  for (let nivel = 1; nivel <= 5; nivel++) {
    const qs = getLevelQuestions(corrida, nivel);
    sizes[`c${corrida}_n${nivel}`] = qs.length;
    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3) {
        console.error(`BAD correct at c${corrida}_n${nivel}_${i}: ${JSON.stringify(q.correct)} — q="${(q.q || '').slice(0,60)}"`);
        continue;
      }
      out[`c${corrida}_n${nivel}_${i}`] = q.correct;
    }
  }
}

console.error('SIZES:', JSON.stringify(sizes));
console.error('TOTAL KEYS:', Object.keys(out).length);
process.stdout.write(JSON.stringify(out));
