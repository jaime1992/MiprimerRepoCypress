const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const SPEC       = 'cypress/e2e/Cypress-Course/fixtures.spec.cy.js';
const WEBHOOK    = 'http://localhost:5678/webhook/cypress-results';
const REPORT_DIR = 'C:\\QA\\Reports';

if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

console.log('Corriendo Cypress...\n');

// Capturar stdout directamente como string
let raw = '';
try {
  raw = execSync(`npx cypress run --spec "${SPEC}" --reporter json`, {
    cwd: __dirname,
    shell: true,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });
} catch (e) {
  // Cypress sale con exit code != 0 cuando hay tests fallados
  // El output igual está en e.stdout
  raw = (e.stdout || '') + (e.stderr || '');
}

// Mostrar output de Cypress
console.log(raw.slice(0, 3000)); // primeras 3000 chars para no saturar

// Intentar extraer JSON
let stats = {};
let suite = SPEC.split('/').pop();
let metodo = '';

try {
  const idx = raw.indexOf('{"stats"');
  if (idx === -1) throw new Error('no JSON');
  let depth = 0, end = idx;
  for (let i = idx; i < raw.length; i++) {
    if (raw[i] === '{') depth++;
    else if (raw[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  const data = JSON.parse(raw.substring(idx, end + 1));
  stats = data.stats || {};
  suite = data.suites?.[0]?.title || suite;
  metodo = 'JSON directo';
} catch (_) {
  // Fallback texto
  const passing = (raw.match(/(\d+) passing/) || [])[1] || '0';
  const failing  = (raw.match(/(\d+) failing/)  || [])[1] || '0';
  const pending  = (raw.match(/(\d+) pending/)  || [])[1] || '0';
  const ms       = (raw.match(/(\d+)ms/)         || [])[1] || '0';
  stats  = { passes: +passing, failures: +failing, pending: +pending, duration: +ms };
  metodo = `texto (passing=${passing} failing=${failing})`;
}

console.log(`\nMetodo: ${metodo}`);
console.log('Resultados:');
console.log(`  Pasados:  ${stats.passes   || 0}`);
console.log(`  Fallados: ${stats.failures || 0}`);
console.log(`  Duracion: ${stats.duration ? Math.round(stats.duration / 1000) + 's' : 'N/A'}`);
console.log('\nEnviando a n8n...');

// Guardar Excel localmente en C:\QA\Reports
const fecha = new Date().toISOString().split('T')[0];
const excelPath = path.join(REPORT_DIR, `cypress_report_${fecha}.xlsx`);
const wsData = [
  ['Suite', 'Status', 'Pasados', 'Fallados', 'Pendientes', 'Duración', 'Fecha'],
  [
    suite,
    (stats.failures || 0) > 0 ? 'FAILED' : 'PASSED',
    stats.passes    || 0,
    stats.failures  || 0,
    stats.pending   || 0,
    stats.duration  ? Math.round(stats.duration / 1000) + 's' : 'N/A',
    fecha
  ]
];
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(wsData);
ws['!cols'] = [{ wch: 45 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 12 }];
XLSX.utils.book_append_sheet(wb, ws, 'Resultados');
XLSX.writeFile(wb, excelPath);
console.log(`Excel guardado en: ${excelPath}`);

// Enviar a n8n
fetch(WEBHOOK, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ suite, stats })
})
  .then(() => console.log('Email enviado por n8n — revisa tu bandeja'))
  .catch(err => console.error('Error n8n:', err.message));
