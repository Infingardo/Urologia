// Test del motore decisionale: estrae <script id="uro-engine"> da index.html e lo esegue in Node.
// Uso: node tests/run.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, '..', 'urotelio', 'index.html'), 'utf8');

function extractScript(id) {
  const m = html.match(new RegExp(`<script id="${id}">([\\s\\S]*?)</script>`));
  if (!m) throw new Error(`script #${id} non trovato`);
  return m[1];
}

const ctx = { module: { exports: {} } };
vm.createContext(ctx);
vm.runInContext(extractScript('uro-engine'), ctx);
const { evaluateDiagnosis, normalizeCase } = ctx.module.exports;

// Catalogo matrice (dalla pagina) per i test di regressione
const mainScript = html.match(/<script>\s*\/\* =+\s*DATA CATALOGS[\s\S]*?<\/script>/)[0]
  .replace(/^<script>/, '').replace(/<\/script>$/, '');
const catCtx = {};
vm.createContext(catCtx);
vm.runInContext(mainScript.slice(0, mainScript.indexOf('var PITFALLS_DATA')), catCtx);
vm.runInContext(mainScript.slice(mainScript.indexOf('    var REFERENCE_PRESETS'), mainScript.indexOf('    function applyPreset')), catCtx);
const ENTITIES = vm.runInContext('ENTITIES_MATRIX', catCtx);
const PRESETS = vm.runInContext('REFERENCE_PRESETS', catCtx);

let passed = 0;
const failures = [];
function test(name, fn) {
  try { fn(); passed++; } catch (e) { failures.push(`${name}\n    ${e.message.split('\n')[0]}`); }
}

const base = { inflammation: 'assente', tangential: 'assente', blandSubtype: 'assente' };
const ev = (o) => evaluateDiagnosis({ ...base, ...o });
const issued = (r) => assert.equal(r.verdictState, 'issued', `atteso verdetto emesso, ottenuto ${r.verdictState}: ${r.criteria.join(' | ')}`);
const conflict = (r) => assert.equal(r.verdictState, 'conflict', `atteso conflitto, ottenuto ${r.verdictState}: ${r.title}`);
const incomplete = (r) => assert.equal(r.verdictState, 'incomplete', `atteso incompleto, ottenuto ${r.verdictState}: ${r.title}`);
const report = (r) => r.reportLines.join('\n');

/* ---------- Stato vuoto e campi mancanti ---------- */
test('stato vuoto: nessun verdetto, 4 passi mancanti', () => {
  const r = evaluateDiagnosis({});
  incomplete(r);
  assert.equal(r.missing.length, 4);
  assert.equal(r.stage, '—');
  assert.match(report(r), /VERDETTO NON EMESSO/);
});
test('passo 2 mancante blocca il verdetto', () => incomplete(ev({ arch: 'piatta', grade: 'alto', invasion: 'integra' })));
test('polarità non coerente con l’architettura = non valutata', () => {
  assert.equal(normalizeCase({ arch: 'piatta', polarity: 'hg_disordine' }).polarity, null);
});
test('papillare LG senza quota HG: incompleto (non si assume 0%)', () => {
  const r = ev({ arch: 'papillare', polarity: 'lg_lieve_disordine', grade: 'lieve', invasion: 'integra' });
  incomplete(r);
  assert.match(r.missing.join(' '), /Quota della componente di alto grado/);
});
test('piatta atipia lieve senza stato della flogosi: incompleto', () => {
  incomplete(evaluateDiagnosis({ arch: 'piatta', polarity: 'perdita_polarita', grade: 'lieve', invasion: 'integra' }));
});

/* ---------- Contraddizioni (difetti del file originale) ---------- */
test('invasiva + membrana basale integra: conflitto (prima: verdetto vuoto)', () =>
  conflict(ev({ arch: 'invasiva', polarity: 'fronte_irregolare', grade: 'alto', invasion: 'integra' })));
test('piatta, citologia normale, polarità persa: conflitto (prima: "Urotelio normale")', () =>
  conflict(ev({ arch: 'piatta', polarity: 'perdita_polarita', grade: 'assente', invasion: 'integra' })));
test('piatta, citologia normale, flogosi al passo 2: conflitto', () =>
  conflict(ev({ arch: 'piatta', polarity: 'flogosi_attiva', grade: 'assente', invasion: 'integra' })));
test('passo 2 flogosi ma flogosi dichiarata assente: conflitto', () =>
  conflict(ev({ arch: 'piatta', polarity: 'flogosi_attiva', grade: 'reattivo', invasion: 'integra', inflammation: 'assente' })));
test('pT1 con grado assente: conflitto (prima: "Alto grado")', () =>
  conflict(ev({ arch: 'papillare', polarity: 'hg_disordine', grade: 'assente', invasion: 'lamina_propria' })));
test('pT1 con grado reattivo: conflitto', () =>
  conflict(ev({ arch: 'invasiva', polarity: 'fronte_irregolare', grade: 'reattivo', invasion: 'lamina_propria' })));
test('indeterminato con grado assente: conflitto (prima: "Basso grado")', () =>
  conflict(ev({ arch: 'papillare', polarity: 'papille_normali', grade: 'assente', invasion: 'indeterminato' })));
test('pT2 con muscolare propria assente: conflitto', () =>
  conflict(ev({ arch: 'invasiva', polarity: 'fronte_irregolare', grade: 'alto', invasion: 'detrusore', mp: 'assente' })));
test('papillare grado reattivo: conflitto (prima: "Papilloma")', () =>
  conflict(ev({ arch: 'papillare', polarity: 'papille_normali', grade: 'reattivo', invasion: 'integra' })));
test('papillare disordine HG con citologia normale: conflitto (prima: "Papilloma")', () =>
  conflict(ev({ arch: 'papillare', polarity: 'hg_disordine', grade: 'assente', invasion: 'integra', hgPct: 0 })));
test('papille normali con atipia: conflitto', () =>
  conflict(ev({ arch: 'papillare', polarity: 'papille_normali', grade: 'lieve', invasion: 'integra', hgPct: 0 })));
test('PUNLMP ordinato con alto grado: conflitto', () =>
  conflict(ev({ arch: 'papillare', polarity: 'punlmp_ordinato', grade: 'alto', invasion: 'integra' })));
test('grado alto con quota HG < 5%: conflitto', () =>
  conflict(ev({ arch: 'papillare', polarity: 'hg_disordine', grade: 'alto', invasion: 'integra', hgPct: 3 })));
test('citologia normale con quota HG > 0: conflitto', () =>
  conflict(ev({ arch: 'papillare', polarity: 'punlmp_ordinato', grade: 'assente', invasion: 'integra', hgPct: 2 })));

/* ---------- Ogni ramo diagnostico ---------- */
const cases = [
  ['urotelio normale', { arch: 'piatta', polarity: 'normale_piatta', grade: 'assente', invasion: 'integra' }, 'Urotelio normale', 'Normale'],
  ['iperplasia piatta', { arch: 'piatta', polarity: 'ispessita_ordinata', grade: 'assente', invasion: 'integra' }, 'Iperplasia uroteliale piatta (senza atipia)', 'Non neoplastico'],
  ['atipia reattiva', { arch: 'piatta', polarity: 'flogosi_attiva', grade: 'reattivo', invasion: 'integra', inflammation: 'presente' }, 'Atipia uroteliale reattiva', 'Non neoplastico'],
  ['displasia', { arch: 'piatta', polarity: 'perdita_polarita', grade: 'lieve', invasion: 'integra' }, 'Displasia uroteliale', 'Preneoplastico'],
  ['atipia signif. indeterminato', { arch: 'piatta', polarity: 'perdita_polarita', grade: 'lieve', invasion: 'integra', inflammation: 'presente' }, 'Atipia uroteliale di significato indeterminato (CIS non escludibile)', 'Indeterminato'],
  ['CIS', { arch: 'piatta', polarity: 'perdita_polarita', grade: 'alto', invasion: 'integra' }, 'Carcinoma uroteliale in situ (CIS / pTis)', 'pTis'],
  ['papilloma', { arch: 'papillare', polarity: 'papille_normali', grade: 'assente', invasion: 'integra' }, 'Papilloma uroteliale (esofitico o invertito)', 'Benigno'],
  ['PUNLMP', { arch: 'papillare', polarity: 'punlmp_ordinato', grade: 'assente', invasion: 'integra' }, 'Neoplasia uroteliale papillare a basso potenziale di malignità (PUNLMP)', 'PUNLMP'],
  ['pTa LG 0%', { arch: 'papillare', polarity: 'lg_lieve_disordine', grade: 'lieve', invasion: 'integra', hgPct: 0 }, 'Carcinoma uroteliale papillare non invasivo di basso grado (pTa LG)', 'pTa LG'],
  ['pTa LG + HG 4%', { arch: 'papillare', polarity: 'lg_lieve_disordine', grade: 'lieve', invasion: 'integra', hgPct: 4 }, 'Carcinoma uroteliale papillare non invasivo di basso grado con componente HG < 5%', 'pTa LG'],
  ['pTa HG per soglia 5%', { arch: 'papillare', polarity: 'lg_lieve_disordine', grade: 'lieve', invasion: 'integra', hgPct: 5 }, 'Carcinoma uroteliale papillare non invasivo di alto grado (pTa HG)', 'pTa HG'],
  ['pTa HG grado alto, quota non quantificata', { arch: 'papillare', polarity: 'hg_disordine', grade: 'alto', invasion: 'integra' }, 'Carcinoma uroteliale papillare non invasivo di alto grado (pTa HG)', 'pTa HG'],
  ['pT1 misurato', { arch: 'invasiva', polarity: 'fronte_irregolare', grade: 'alto', invasion: 'lamina_propria', pt1Mm: 1.0, pt1Anat: 'oltre_mm' }, 'Carcinoma uroteliale invasivo della lamina propria (pT1)', 'pT1 (ROL2)'],
  ['pT1 non misurato', { arch: 'papillare', polarity: 'hg_disordine', grade: 'alto', invasion: 'lamina_propria' }, 'Carcinoma uroteliale invasivo della lamina propria (pT1)', 'pT1'],
  ['CIS + pT1', { arch: 'piatta', polarity: 'perdita_polarita', grade: 'alto', invasion: 'lamina_propria', pt1Mm: 0.4 }, 'CIS uroteliale con microinvasione / invasione lamina propria (pT1)', 'pT1 (ROL1)'],
  ['pT2', { arch: 'invasiva', polarity: 'fronte_irregolare', grade: 'alto', invasion: 'detrusore', mp: 'presente' }, 'Carcinoma uroteliale invasivo della muscolare propria (pT2)', 'pT2'],
  ['pT2 sottotipo blando', { arch: 'invasiva', polarity: 'pattern_blando', grade: 'lieve', invasion: 'detrusore', blandSubtype: 'presente' }, 'Carcinoma uroteliale muscolo-invasivo (sottotipo a citologia blanda)', 'pT2'],
  ['indeterminato', { arch: 'invasiva', polarity: 'tangenziale_sospetto', grade: 'lieve', invasion: 'indeterminato' }, 'Proliferazione uroteliale con invasione stromale indeterminata', 'Indeterminato (pTa vs pT1)'],
];
for (const [name, input, title, stage] of cases) {
  test(`ramo: ${name}`, () => {
    const r = ev(input);
    issued(r);
    assert.equal(r.title, title);
    assert.equal(r.stage, stage);
  });
}

/* ---------- Grado: nessuna etichetta inventata ---------- */
test('pT1 grado lieve = LG, grado alto = HG', () => {
  const p = { arch: 'invasiva', polarity: 'fronte_irregolare', invasion: 'lamina_propria' };
  assert.equal(ev({ ...p, grade: 'lieve' }).gradeLabel, 'Basso grado (LG)');
  assert.equal(ev({ ...p, grade: 'alto' }).gradeLabel, 'Alto grado (HG)');
});
test('indeterminato papillare LG con HG 8%: alto grado (regola 5%)', () => {
  const r = ev({ arch: 'papillare', polarity: 'lg_lieve_disordine', grade: 'lieve', invasion: 'indeterminato', hgPct: 8 });
  issued(r);
  assert.equal(r.gradeLabel, 'Alto grado (HG)');
});
test('pTa HG senza quota: nessun "100%" inventato', () => {
  const r = ev({ arch: 'papillare', polarity: 'hg_disordine', grade: 'alto', invasion: 'integra' });
  assert.equal(r.chip, 'pTa HG');
  assert.doesNotMatch(r.criteria.join(' '), /100%/);
  assert.match(report(r), /Quota componente ad alto grado: non quantificata/);
});

/* ---------- Referto ---------- */
test('substaging: mai "pT1b/c"; livello descrittivo', () => {
  for (const anat of ['sopra_mm', 'entro_mm', 'oltre_mm', 'non_valutabile', null]) {
    const r = ev({ arch: 'invasiva', polarity: 'fronte_irregolare', grade: 'alto', invasion: 'lamina_propria', pt1Mm: 0.8, pt1Anat: anat });
    assert.doesNotMatch(report(r), /pT1b\/c|pT1a|pT1b|pT1c/);
    assert.match(report(r), /Livello istoanatomico: /);
  }
});
test('pT1 non misurato: nessuna classe ROL / T1m-T1e', () => {
  const r = ev({ arch: 'invasiva', polarity: 'fronte_irregolare', grade: 'alto', invasion: 'lamina_propria' });
  assert.doesNotMatch(report(r) + r.chip, /ROL[12]|T1[me]\b/);
  assert.match(report(r), /estensione non misurata/);
});
test('soglie ROL e van Rhijn invariate', () => {
  const at = (mm) => report(ev({ arch: 'invasiva', polarity: 'fronte_irregolare', grade: 'alto', invasion: 'lamina_propria', pt1Mm: mm }));
  assert.match(at(0.4), /ROL1 .* T1m/);
  assert.match(at(0.5), /ROL1 .* T1e/);
  assert.match(at(1.0), /ROL2 .* T1e/);
});
test('invasivo: righe LVI, CIS associato, muscolare propria (anche se non valutate)', () => {
  const t = report(ev({ arch: 'invasiva', polarity: 'fronte_irregolare', grade: 'alto', invasion: 'lamina_propria' }));
  assert.match(t, /Invasione linfovascolare: non valutata/);
  assert.match(t, /CIS associato: non valutato/);
  assert.match(t, /Muscolare propria \(detrusore\) nel campione: non valutata/);
});
test('valori compilati compaiono nel referto', () => {
  const t = report(ev({ arch: 'invasiva', polarity: 'fronte_irregolare', grade: 'alto', invasion: 'detrusore', lvi: 'presente', cisAssoc: 'assente', mp: 'presente' }));
  assert.match(t, /Invasione linfovascolare: presente/);
  assert.match(t, /CIS associato: assente/);
  assert.match(t, /Muscolare propria \(detrusore\) nel campione: presente/);
});
test('lesione piatta non invasiva: niente righe LVI / CIS associato', () => {
  const t = report(ev({ arch: 'piatta', polarity: 'perdita_polarita', grade: 'alto', invasion: 'integra' }));
  assert.doesNotMatch(t, /linfovascolare|CIS associato/);
});
test('sottotipo con nome e %', () => {
  const t = report(ev({ arch: 'invasiva', polarity: 'pattern_blando', grade: 'lieve', invasion: 'detrusore', blandSubtype: 'presente', subtypeName: 'large_nested', subtypePct: 40 }));
  assert.match(t, /Sottotipo istologico: large nested \(40%\)/);
});
test('sottotipo presente ma non specificato: richiesta esplicita', () => {
  const t = report(ev({ arch: 'invasiva', polarity: 'pattern_blando', grade: 'lieve', invasion: 'detrusore', blandSubtype: 'presente' }));
  assert.match(t, /specificare sottotipo/);
});

/* ---------- Avvisi ---------- */
test('CIS con flogosi non valutata: avviso', () => {
  const r = evaluateDiagnosis({ arch: 'piatta', polarity: 'perdita_polarita', grade: 'alto', invasion: 'integra' });
  issued(r);
  assert.ok(r.alerts.some((a) => /non valutata/.test(a)));
});
test('IHC CIS con citologia reattiva: avviso "IHC non comanda"', () => {
  const r = ev({ arch: 'piatta', polarity: 'flogosi_attiva', grade: 'reattivo', invasion: 'integra', inflammation: 'presente', ihcSummary: 'cis' });
  assert.ok(r.alerts.some((a) => /non comanda/.test(a)));
});
test('nidi lisci al passo 2 ma invasione accertata: avviso', () => {
  const r = ev({ arch: 'invasiva', polarity: 'tangenziale_sospetto', grade: 'alto', invasion: 'lamina_propria' });
  issued(r);
  assert.ok(r.alerts.some((a) => /verificare prima di stadiare/.test(a)));
});

test('pT1 papillare LG con HG >= 5%: avviso, grado non cambiato in silenzio', () => {
  const r = ev({ arch: 'papillare', polarity: 'lg_lieve_disordine', grade: 'lieve', invasion: 'lamina_propria', hgPct: 7 });
  issued(r);
  assert.equal(r.gradeLabel, 'Basso grado (LG)');
  assert.ok(r.alerts.some((a) => /solo ai papillari non invasivi/.test(a)));
});

/* ---------- Soglie sul valore inserito, senza arrotondamenti (v2.0.1) ---------- */
const pt1 = (mm) => ev({ arch: 'invasiva', polarity: 'fronte_irregolare', grade: 'alto', invasion: 'lamina_propria', pt1Mm: mm });
test('pT1 0,45 mm: T1m e ROL1 (prima arrotondato a 0,5 → T1e)', () => {
  const t = report(pt1(0.45));
  assert.match(t, /0\.45 mm → ROL1 .* T1m/);
});
test('pT1 0,49 mm: T1m; 0,5 mm: T1e', () => {
  assert.match(report(pt1(0.49)), /T1m/);
  assert.match(report(pt1(0.5)), /T1e/);
});
test('pT1 0,95 e 0,99 mm: ROL1 (prima arrotondati a 1,0 → ROL2); 1,0 mm: ROL2', () => {
  assert.equal(pt1(0.95).stage, 'pT1 (ROL1)');
  assert.equal(pt1(0.99).stage, 'pT1 (ROL1)');
  assert.equal(pt1(1.0).stage, 'pT1 (ROL2)');
});
test('quota HG 4,5% e 4,99%: basso grado (prima 4,5 arrotondato a 5 → alto grado)', () => {
  const p = { arch: 'papillare', polarity: 'lg_lieve_disordine', grade: 'lieve', invasion: 'integra' };
  assert.equal(ev({ ...p, hgPct: 4.5 }).stage, 'pTa LG');
  assert.equal(ev({ ...p, hgPct: 4.99 }).stage, 'pTa LG');
  assert.equal(ev({ ...p, hgPct: 5 }).stage, 'pTa HG');
});

test('misura nel referto mostrata come inserita, coerente con la classe (0,499 e 0,999 mm)', () => {
  const a = report(pt1(0.499));
  assert.match(a, /0\.499 mm → ROL1 .* T1m/);
  assert.doesNotMatch(a, /0\.5 mm/);
  const b = pt1(0.999);
  assert.match(report(b), /0\.999 mm → ROL1/);
  assert.match(b.chip, /0\.999 mm/);
  assert.match(b.schematicCaption, /0\.999 mm/);
});

/* ---------- Migrazione dei casi salvati dalla v1 ---------- */
const { migrateV1Snapshot } = ctx.module.exports;
test('v1: casella non spuntata = non valutato, spuntata = presente', () => {
  const m = migrateV1Snapshot({ arch: 'piatta', inflammation: false, tangential: true, blandSubtype: false, hgPct: 0, pt1Mm: 0.6, pt1Anat: 'sopra_mm', invasion: 'integra' });
  const c = normalizeCase(m);
  assert.equal(c.inflammation, null);
  assert.equal(c.tangential, 'presente');
  assert.equal(c.blandSubtype, null);
  assert.equal(c.hgPct, null, '% HG non mostrata nella v1 per lesioni piatte');
  assert.equal(c.pt1Mm, null, 'mm pT1 non mostrati nella v1 se non pT1');
  assert.equal(c.pt1Anat, null);
});
test('v1: piatta, lieve, flogosi non spuntata → incompleto (non più "Displasia")', () => {
  const v1 = { arch: 'piatta', polarity: 'perdita_polarita', grade: 'lieve', hgPct: 0, invasion: 'integra', pt1Mm: 0.6, pt1Anat: 'sopra_mm', inflammation: false, tangential: false, blandSubtype: false, ihcSummary: 'none' };
  incomplete(evaluateDiagnosis(migrateV1Snapshot(v1)));
});
test('v1: papillare conserva la % HG; pT1 conserva mm e livello', () => {
  const a = normalizeCase(migrateV1Snapshot({ arch: 'papillare', hgPct: 3, invasion: 'integra', inflammation: false }));
  assert.equal(a.hgPct, 3);
  const b = normalizeCase(migrateV1Snapshot({ arch: 'invasiva', invasion: 'lamina_propria', pt1Mm: 1.4, pt1Anat: 'oltre_mm', inflammation: false }));
  assert.equal(b.pt1Mm, 1.4);
  assert.equal(b.pt1Anat, 'oltre_mm');
});
test('salvataggi v2 (tre stati) non toccati dalla migrazione', () => {
  const v2 = { arch: 'piatta', inflammation: 'assente', hgPct: 7 };
  assert.deepEqual(migrateV1Snapshot(v2), v2);
});

/* ---------- Compatibilità e regressione ---------- */
test('salvataggi della versione precedente (booleani) normalizzati', () => {
  const c = normalizeCase({ inflammation: true, tangential: false, blandSubtype: false, arch: 'xx' });
  assert.equal(c.inflammation, 'presente');
  assert.equal(c.tangential, 'assente');
  assert.equal(c.arch, null);
});

// Titoli prodotti dal motore originale per gli stessi input (verificati eseguendo il file originale)
const ORIGINAL_PRESET_TITLES = {
  pTa_LG: 'Carcinoma uroteliale papillare non invasivo di basso grado (pTa LG)',
  pTa_HG_5: 'Carcinoma uroteliale papillare non invasivo di alto grado (pTa HG)',
  pTa_LG_minorHG: 'Carcinoma uroteliale papillare non invasivo di basso grado con componente HG < 5%',
  CIS_denudato: 'Carcinoma uroteliale in situ (CIS / pTis)',
  reattiva_BCG: 'Atipia uroteliale reattiva',
  pT1_ROL2: 'Carcinoma uroteliale invasivo della lamina propria (pT1)',
  tangenziale: 'Proliferazione uroteliale con invasione stromale indeterminata',
};
for (const [key, title] of Object.entries(ORIGINAL_PRESET_TITLES)) {
  test(`regressione scenario ${key}`, () => {
    const r = evaluateDiagnosis(PRESETS[key]);
    issued(r);
    assert.equal(r.title, title);
  });
}
const ORIGINAL_ENTITY_TITLES = {
  normale: 'Urotelio normale',
  iperplasia_piatta: 'Iperplasia uroteliale piatta (senza atipia)',
  atipia_reattiva: 'Atipia uroteliale reattiva',
  displasia: 'Displasia uroteliale',
  cis: 'Carcinoma uroteliale in situ (CIS / pTis)',
  papilloma: 'Papilloma uroteliale (esofitico o invertito)',
  punlmp: 'Neoplasia uroteliale papillare a basso potenziale di malignità (PUNLMP)',
  pta_lg: 'Carcinoma uroteliale papillare non invasivo di basso grado (pTa LG)',
  pta_hg: 'Carcinoma uroteliale papillare non invasivo di alto grado (pTa HG)',
  invasivo: 'Carcinoma uroteliale invasivo della lamina propria (pT1)',
};
test('la matrice ha 10 righe', () => assert.equal(ENTITIES.length, 10));
for (const e of ENTITIES) {
  test(`regressione matrice "${e.id}"`, () => {
    const r = evaluateDiagnosis(e.preset);
    issued(r);
    assert.equal(r.title, ORIGINAL_ENTITY_TITLES[e.id]);
  });
}

/* ---------- Esito ---------- */
if (failures.length) {
  console.error(`\n${failures.length} test falliti, ${passed} superati:\n`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`${passed} test superati.`);
