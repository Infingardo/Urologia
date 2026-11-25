// Verifica offline-first: nessuna pagina HTML del repo carica risorse esterne.
// Uso: node tests/offline.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skip = new Set(['.git', 'node_modules', 'vendor']);

function htmlFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

// Attributi e regole CSS che fanno caricare qualcosa al browser
const patterns = [
  /\b(?:src|href|action|poster|data)\s*=\s*["']?\s*(?:https?:)?\/\//i,
  /url\(\s*["']?\s*(?:https?:)?\/\//i,
  /@import\s+["']?\s*(?:https?:)?\/\//i,
  /\bimport\s*\(\s*["'`](?:https?:)?\/\//i,
  /\bfetch\s*\(\s*["'`](?:https?:)?\/\//i,
];

const problems = [];
for (const file of htmlFiles(root)) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    for (const re of patterns) {
      if (re.test(line)) problems.push(`${relative(root, file)}:${i + 1}: ${line.trim().slice(0, 140)}`);
    }
  });
}

if (problems.length) {
  console.error('Riferimenti a risorse esterne trovati:\n' + problems.map((p) => `  ✗ ${p}`).join('\n'));
  process.exit(1);
}
console.log('Offline: nessuna risorsa esterna.');
