#!/usr/bin/env node
// One-shot codemod: rewrite DESAFIO_ANSWERS + DESAFIO_LEVEL_SIZES + corrida guard
// in supabase/functions/verify-answer/index.ts to support C2 and C3.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGET = path.join(ROOT, 'supabase/functions/verify-answer/index.ts');
const NEW_ANSWERS = JSON.parse(fs.readFileSync('/tmp/desafio-answers.json', 'utf8'));

let src = fs.readFileSync(TARGET, 'utf8');

// 1) Replace DESAFIO_ANSWERS literal
const ansRe = /const DESAFIO_ANSWERS:\s*Record<string,\s*number>\s*=\s*\{[^;]+\};/;
const newAnsLine = 'const DESAFIO_ANSWERS: Record<string, number> = ' + JSON.stringify(NEW_ANSWERS) + ';';
if (!ansRe.test(src)) { console.error('DESAFIO_ANSWERS literal not found'); process.exit(1); }
src = src.replace(ansRe, newAnsLine);

// 2) Replace DESAFIO_LEVEL_SIZES with per-corrida structure
const sizesOld = "const DESAFIO_LEVEL_SIZES: Record<number, number> = { 1: 50, 2: 100, 3: 150, 4: 200, 5: 250 };";
const sizesNew = "const DESAFIO_LEVEL_SIZES: Record<number, Record<number, number>> = {\n" +
                 "  1: { 1: 50, 2: 100, 3: 150, 4: 200, 5: 250 },\n" +
                 "  2: { 1: 50, 2: 100, 3: 150, 4: 200, 5: 250 },\n" +
                 "  3: { 1: 50, 2: 100, 3: 150, 4: 200, 5: 100 },\n" +
                 "};";
if (!src.includes(sizesOld)) { console.error('DESAFIO_LEVEL_SIZES line not found'); process.exit(1); }
src = src.replace(sizesOld, sizesNew);

// 3) Replace corrida guard: corrida !== 1 -> corrida > 3
const guardOld = "  // Only corrida 1 is available for now\n" +
                 "  if (corrida !== 1) {\n" +
                 "    return jsonResponse({ error: 'Corrida ' + corrida + ' not available yet' }, 400);\n" +
                 "  }";
const guardNew = "  // Corridas 1-3 are populated; 4-5 reserved for future question banks\n" +
                 "  if (corrida > 3) {\n" +
                 "    return jsonResponse({ error: 'Corrida ' + corrida + ' not available yet' }, 400);\n" +
                 "  }";
if (!src.includes(guardOld)) { console.error('corrida guard block not found'); process.exit(1); }
src = src.replace(guardOld, guardNew);

// 4) Update maxIndex lookup to be per-corrida
const maxOld = "  const maxIndex = DESAFIO_LEVEL_SIZES[nivel];\n" +
               "  if (!maxIndex || questionIndex >= maxIndex) {\n" +
               "    return jsonResponse({ error: 'questionIndex out of range for nivel ' + nivel + ' (max: ' + ((maxIndex || 0) - 1) + ')' }, 400);\n" +
               "  }";
const maxNew = "  const maxIndex = DESAFIO_LEVEL_SIZES[corrida]?.[nivel];\n" +
               "  if (!maxIndex || questionIndex >= maxIndex) {\n" +
               "    return jsonResponse({ error: 'questionIndex out of range for c' + corrida + 'n' + nivel + ' (max: ' + ((maxIndex || 0) - 1) + ')' }, 400);\n" +
               "  }";
if (!src.includes(maxOld)) { console.error('maxIndex lookup block not found'); process.exit(1); }
src = src.replace(maxOld, maxNew);

fs.writeFileSync(TARGET, src);
console.log('Patched verify-answer/index.ts successfully');
console.log('  DESAFIO_ANSWERS keys:', Object.keys(NEW_ANSWERS).length);
console.log('  Corridas allowed: 1, 2, 3');
