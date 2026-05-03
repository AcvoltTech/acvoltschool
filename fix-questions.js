#!/usr/bin/env node
// ============================================================
// fix-questions.js — Make quiz options idiot-proof
// ============================================================
// Processes all 2,350 questions through Claude API to equalize
// option lengths so students can't guess by picking the longest.
//
// USAGE:
//   set ANTHROPIC_API_KEY=sk-ant-your-key-here
//   node fix-questions.js
//
// Or on one line (bash):
//   ANTHROPIC_API_KEY=sk-ant-... node fix-questions.js
//
// FEATURES:
//   - Saves progress after each batch (can resume if interrupted)
//   - Validates output before writing
//   - Creates backup of original questions.js
//   - Shows before/after stats
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ===== CONFIG =====
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-20250514';
const BATCH_SIZE = 15;          // questions per API call
const MAX_RETRIES = 3;          // retries per batch on failure
const DELAY_MS = 1500;          // delay between API calls (rate limit)
const PROGRESS_FILE = 'fix-questions-progress.json';
const INPUT_FILE = 'questions.js';
const OUTPUT_FILE = 'questions.js';
const BACKUP_FILE = 'questions-BACKUP-original.js';

if (!API_KEY) {
  console.error('\n❌ ERROR: Set your Anthropic API key first!\n');
  console.error('  Windows CMD:   set ANTHROPIC_API_KEY=sk-ant-your-key-here');
  console.error('  Windows PS:    $env:ANTHROPIC_API_KEY="sk-ant-your-key-here"');
  console.error('  Bash/Mac:      export ANTHROPIC_API_KEY=sk-ant-your-key-here');
  console.error('\nThen run: node fix-questions.js\n');
  process.exit(1);
}

// ===== LOAD QUESTIONS =====
console.log('\n📂 Loading questions...');
const rawContent = fs.readFileSync(INPUT_FILE, 'utf8');
const sandbox = {};
vm.runInNewContext(rawContent, sandbox); // safely executes "questions = {...}" inside sandbox
const questions = sandbox.questions;

const levels = Object.keys(questions);
const totalQuestions = levels.reduce((sum, l) => sum + questions[l].length, 0);
console.log(`   Found ${totalQuestions} questions across ${levels.length} levels`);

// ===== BACKUP =====
if (!fs.existsSync(BACKUP_FILE)) {
  fs.copyFileSync(INPUT_FILE, BACKUP_FILE);
  console.log(`💾 Backup saved to ${BACKUP_FILE}`);
} else {
  console.log(`💾 Backup already exists: ${BACKUP_FILE}`);
}

// ===== LOAD PROGRESS =====
let progress = {};
if (fs.existsSync(PROGRESS_FILE)) {
  progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  const done = Object.values(progress).reduce((s, p) => s + Object.keys(p).length, 0);
  console.log(`🔄 Resuming from progress file (${done} batches completed)`);
}

// ===== API CALL =====
async function callClaude(batch) {
  const prompt = `You are an expert HVAC technician and quiz designer. Your job: rewrite the answer options so ALL 4 options are similar in length and detail level. This prevents students from guessing the correct answer just by picking the longest option.

STRICT RULES:
1. The option at the "correct" index MUST remain factually correct and technically accurate
2. The 3 wrong options MUST remain factually WRONG but sound equally plausible and detailed
3. ALL 4 options must be between 35-75 characters each (similar to each other, within 20% length variance)
4. Keep all text in Spanish
5. Add technical detail to short wrong answers (e.g., "5 años" → "5-8 años incluso con mantenimiento regular")
6. If the correct answer is too long, trim it to its essential technical content
7. DO NOT change: question text (q), category, explanation, or correct index
8. Each wrong option should sound like something a student might believe — use real HVAC terminology
9. Never add "(incorrect)" or hints about which is wrong
10. All options should have similar structure/format (if one starts with a verb, all should)

EXAMPLES of good transformations:
- BAD: ["0V", "460V", "Aproximadamente 265V (460÷√3)", "230V"]  correct=2
- GOOD: ["Cero voltios por cancelación de fases", "460V igual que entre fases sin cambio", "Aproximadamente 265V calculado con 460÷√3", "230V resultado de dividir entre dos fases"]  correct=2

- BAD: ["5 años", "15-20 años AC/heat pump, 20-30 años furnace con mantenimiento adecuado", "50+ años", "8-10 años"]  correct=1
- GOOD: ["5-8 años incluso con mantenimiento preventivo regular", "15-20 años AC/heat pump, 20-30 años furnace con mantenimiento", "50+ años si el equipo es de grado comercial industrial", "8-10 años promedio sin importar marca o mantenimiento"]  correct=1

Here are the questions to fix. Return ONLY a valid JSON array with the same objects, same order, only the "options" array changed:

${JSON.stringify(batch, null, 1)}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8192,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.content[0].text.trim();

  // Extract JSON from response (might be wrapped in ```json ... ```)
  let jsonStr = text;
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1].trim();

  // Try to find JSON array
  const arrStart = jsonStr.indexOf('[');
  const arrEnd = jsonStr.lastIndexOf(']');
  if (arrStart !== -1 && arrEnd !== -1) {
    jsonStr = jsonStr.substring(arrStart, arrEnd + 1);
  }

  const fixed = JSON.parse(jsonStr);

  // Validate
  if (fixed.length !== batch.length) {
    throw new Error(`Expected ${batch.length} questions, got ${fixed.length}`);
  }

  for (let i = 0; i < fixed.length; i++) {
    if (!fixed[i].options || fixed[i].options.length !== 4) {
      throw new Error(`Question ${i} has ${fixed[i].options?.length || 0} options, expected 4`);
    }
    // Preserve all fields from original, only take options from fixed
    if (fixed[i].correct !== batch[i].correct) {
      throw new Error(`Question ${i} correct index changed from ${batch[i].correct} to ${fixed[i].correct}`);
    }
  }

  return fixed;
}

// ===== PROCESS =====
async function processAll() {
  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const level of levels) {
    const qs = questions[level];
    if (!progress[level]) progress[level] = {};

    console.log(`\n🎮 Processing level: ${level.toUpperCase()} (${qs.length} questions)`);

    for (let batchStart = 0; batchStart < qs.length; batchStart += BATCH_SIZE) {
      const batchKey = String(batchStart);
      const batchEnd = Math.min(batchStart + BATCH_SIZE, qs.length);
      const batch = qs.slice(batchStart, batchEnd);

      // Skip if already done
      if (progress[level][batchKey]) {
        skippedCount += batch.length;
        // Apply saved progress
        const saved = progress[level][batchKey];
        for (let i = 0; i < saved.length; i++) {
          qs[batchStart + i].options = saved[i].options;
        }
        continue;
      }

      const label = `   [${level}] Q${batchStart + 1}-${batchEnd} of ${qs.length}`;
      let success = false;

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          process.stdout.write(`${label} (attempt ${attempt})... `);
          const fixed = await callClaude(batch);

          // Apply fixes — only update options
          for (let i = 0; i < fixed.length; i++) {
            qs[batchStart + i].options = fixed[i].options;
          }

          // Save progress
          progress[level][batchKey] = fixed.map(q => ({ options: q.options }));
          fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress));

          processedCount += batch.length;
          console.log('✅');
          success = true;
          break;
        } catch (err) {
          console.log(`❌ ${err.message}`);
          if (attempt < MAX_RETRIES) {
            await sleep(3000 * attempt); // exponential backoff
          }
        }
      }

      if (!success) {
        errorCount += batch.length;
        console.log(`   ⚠️  SKIPPING batch after ${MAX_RETRIES} failures`);
      }

      // Rate limit delay
      await sleep(DELAY_MS);
    }
  }

  return { processedCount, skippedCount, errorCount };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== WRITE OUTPUT =====
function writeOutput() {
  console.log('\n📝 Writing fixed questions.js...');

  let output = '// ACVOLT Quiz Questions - Externalized for performance\n';
  output += '// 2,350 questions across 4 levels\n';
  output += '// OPTIONS EQUALIZED - Students cannot guess by option length\n\n';
  output += 'questions = {\n';

  for (let li = 0; li < levels.length; li++) {
    const level = levels[li];
    const qs = questions[level];

    output += `      ${level}: [\n`;

    // Level header comment
    const headers = {
      principiante: 'NIVEL PRINCIPIANTE',
      intermedio: 'NIVEL INTERMEDIO',
      avanzado: 'NIVEL AVANZADO',
      elite: 'NIVEL ELITE',
      platino: 'NIVEL PLATINO'
    };
    output += `        // ========== ${headers[level] || level.toUpperCase()} - ${qs.length} PREGUNTAS ==========\n`;

    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      const optStr = q.options.map(o => JSON.stringify(o)).join(', ');
      output += `        { category:${JSON.stringify(q.category)}, q: ${JSON.stringify(q.q)}, options: [${optStr}], correct: ${q.correct}, explanation: ${JSON.stringify(q.explanation)} }`;
      if (i < qs.length - 1) output += ',';
      output += '\n';
    }

    output += `      ]`;
    if (li < levels.length - 1) output += ',';
    output += '\n';
  }

  output += '};\n';
  fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
  console.log(`   ✅ Written to ${OUTPUT_FILE} (${(output.length / 1024).toFixed(1)} KB)`);
}

// ===== STATS =====
function showStats(label) {
  console.log(`\n📊 ${label}:`);
  for (const level of levels) {
    const qs = questions[level];
    let longestCorrect = 0;
    let totalCorrectLen = 0, totalWrongLen = 0, wrongCount = 0;

    for (const q of qs) {
      const correctLen = q.options[q.correct].length;
      totalCorrectLen += correctLen;
      const longestIdx = q.options.reduce((maxI, opt, i, arr) => opt.length > arr[maxI].length ? i : maxI, 0);
      if (longestIdx === q.correct) longestCorrect++;
      for (let j = 0; j < q.options.length; j++) {
        if (j !== q.correct) { totalWrongLen += q.options[j].length; wrongCount++; }
      }
    }

    const pct = (longestCorrect / qs.length * 100).toFixed(1);
    const avgC = (totalCorrectLen / qs.length).toFixed(0);
    const avgW = (totalWrongLen / wrongCount).toFixed(0);
    const color = pct > 40 ? '🔴' : pct > 30 ? '🟡' : '🟢';
    console.log(`   ${color} ${level}: longest=correct ${pct}% | avg correct ${avgC} chars | avg wrong ${avgW} chars`);
  }
}

// ===== MAIN =====
async function main() {
  showStats('BEFORE (original)');

  console.log('\n🚀 Starting batch processing...');
  console.log(`   Model: ${MODEL}`);
  console.log(`   Batch size: ${BATCH_SIZE} questions per API call`);
  console.log(`   Estimated API calls: ~${Math.ceil(totalQuestions / BATCH_SIZE)}`);
  console.log(`   Estimated time: ~${Math.ceil(totalQuestions / BATCH_SIZE * (DELAY_MS + 3000) / 60000)} minutes\n`);

  const { processedCount, skippedCount, errorCount } = await processAll();

  console.log(`\n📋 Summary:`);
  console.log(`   ✅ Processed: ${processedCount} questions`);
  console.log(`   ⏭️  Resumed:   ${skippedCount} questions (from previous run)`);
  if (errorCount > 0) console.log(`   ❌ Errors:    ${errorCount} questions`);

  writeOutput();
  showStats('AFTER (fixed)');

  // Clean up progress file
  if (errorCount === 0) {
    fs.unlinkSync(PROGRESS_FILE);
    console.log('\n🧹 Cleaned up progress file');
  } else {
    console.log(`\n⚠️  ${errorCount} questions had errors. Run the script again to retry.`);
    console.log('   Progress file kept for resume.');
  }

  console.log('\n✅ DONE! Your questions are now idiot-proof. 🎯\n');
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err.message);
  console.error('   Progress saved — run again to resume.');
  process.exit(1);
});
