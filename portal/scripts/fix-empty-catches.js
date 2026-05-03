const fs = require('fs');
const path = require('path');

// Map file paths to module names for logging
function getModuleName(filePath) {
  const base = path.basename(filePath, '.js');
  const parts = base.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1));
  return parts.join('');
}

// Find all JS files (skip vendor)
function getAllJsFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name === 'vendor' || item.name === 'node_modules' || item.name === 'dist') continue;
      results = results.concat(getAllJsFiles(full));
    } else if (item.name.endsWith('.js')) {
      results.push(full);
    }
  }
  return results;
}

const jsDir = path.join(__dirname, '..', 'js');
const files = getAllJsFiles(jsDir);

let totalFixed = 0;
let filesFixed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const moduleName = getModuleName(file);
  
  // Pattern: catch(anyVar) { } with optional whitespace
  // Handles: catch(e) {}, catch(e) { }, catch(err) {  }, catch(_e) {}
  const pattern = /catch\s*\((\w+)\)\s*\{\s*\}/g;
  
  let count = 0;
  const newContent = content.replace(pattern, (match, varName) => {
    count++;
    return `catch(${varName}) { console.warn('[${moduleName}]', ${varName}.message || ${varName}); }`;
  });
  
  if (count > 0) {
    fs.writeFileSync(file, newContent, 'utf8');
    totalFixed += count;
    filesFixed++;
    console.log(`  ${path.relative(jsDir, file)}: ${count} empty catches fixed`);
  }
}

console.log(`\nTotal: ${totalFixed} empty catches fixed across ${filesFixed} files`);
