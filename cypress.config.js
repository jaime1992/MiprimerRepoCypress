const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'k93ovz',
  env: {
    apiBaseUrl: 'http://localhost:3000',
  },
  downloadsFolder: 'cypress/downloads',
  video: true,

  e2e: {
    supportFile: 'cypress/support/e2e.js',  // Archivo de soporte (opcional)
    specPattern: 'cypress/e2e/**/*.cy.js',  // Patrón de búsqueda de tus tests
    allowCypressEnv: false,                 // Desactiva el warning inseguro de Cypress.env()

    // Aquí puedes definir eventos y plugins
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        launchOptions.args.push('--disable-gpu');
        launchOptions.args.push('--disable-software-rasterizer');
        launchOptions.args.push('--no-sandbox');
        launchOptions.args.push('--disable-dev-shm-usage');
        return launchOptions;
      });

      on('after:run', (results) => {
        const fs         = require('fs');
        const path       = require('path');
        const XLSX       = require('xlsx');
        const nodemailer = require('nodemailer');
        const http       = require('http');

        const REPORT_DIR = 'C:\\QA\\Reports';
        const SMTP_USER  = 'jaimeqv.2609@gmail.com';
        const SMTP_PASS  = 'fsvcqjwerkiumnjz';
        const EMAIL_TO   = 'javi.gajardo26@gmail.com,jaimeqv.2609@gmail.com';

        const fecha  = new Date().toISOString().split('T')[0];

        // Construir una fila por cada spec corrida
        const rows = (results.runs || []).map(run => {
          const s = run.stats || {};
          const st = s.failures > 0 ? 'FAILED' : 'PASSED';
          return {
            suite:    run.spec?.relative || 'unknown',
            status:   st,
            passes:   s.passes   || 0,
            failures: s.failures || 0,
            pending:  s.pending  || 0,
            duracion: s.duration ? Math.round(s.duration / 1000) + 's' : 'N/A',
            fecha
          };
        });

        const totalPasses   = rows.reduce((a, r) => a + r.passes,   0);
        const totalFailures = rows.reduce((a, r) => a + r.failures, 0);
        const globalStatus  = totalFailures > 0 ? 'FAILED' : 'PASSED';

        console.log(`\n[Cypress] ${rows.length} spec(s) — Pasados:${totalPasses} Fallados:${totalFailures}`);

        // 1 — Generar y guardar Excel localmente (una fila por spec)
        if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
        const excelPath = path.join(REPORT_DIR, `cypress_report_${fecha}.xlsx`);
        const headers = ['Spec', 'Status', 'Pasados', 'Fallados', 'Pendientes', 'Duración', 'Fecha'];
        const dataRows = rows.map(r => [r.suite, r.status, r.passes, r.failures, r.pending, r.duracion, r.fecha]);
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
        ws['!cols'] = [{wch:50},{wch:10},{wch:10},{wch:10},{wch:12},{wch:10},{wch:12}];
        XLSX.utils.book_append_sheet(wb, ws, 'Resultados');
        XLSX.writeFile(wb, excelPath);
        console.log(`[Excel] Guardado en: ${excelPath} (${rows.length} filas)`);

        // 2 — Construir tabla HTML con todas las specs
        const filas = rows.map(r => `
      <tr style="text-align:center;background:${r.status === 'PASSED' ? '#d1fae5' : '#fee2e2'}">
        <td style="border:1px solid #ccc">${r.suite.split('\\').pop()}</td>
        <td style="border:1px solid #ccc"><b>${r.status}</b></td>
        <td style="border:1px solid #ccc">${r.passes}</td>
        <td style="border:1px solid #ccc">${r.failures}</td>
        <td style="border:1px solid #ccc">${r.pending}</td>
        <td style="border:1px solid #ccc">${r.duracion}</td>
      </tr>`).join('');

        const htmlBody = `
<div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto">
  <h2 style="background:#1b4332;color:white;padding:12px 20px;border-radius:6px 6px 0 0;margin:0">
    🧪 Reporte Cypress Regression
  </h2>
  <div style="border:1px solid #ddd;border-top:none;padding:20px;border-radius:0 0 6px 6px">
    <p><b>Fecha:</b> ${new Date().toLocaleString('es-CL')}</p>
    <p><b>Specs corridas:</b> ${rows.length} &nbsp;|&nbsp; <b>Total Pasados:</b> ${totalPasses} &nbsp;|&nbsp; <b>Total Fallados:</b> ${totalFailures}</p>
    <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse;margin-top:16px">
      <tr style="background:#1b4332;color:white;text-align:center">
        <th style="border:1px solid #ccc">Spec</th>
        <th style="border:1px solid #ccc">Status</th>
        <th style="border:1px solid #ccc">✅ Pasados</th>
        <th style="border:1px solid #ccc">❌ Fallados</th>
        <th style="border:1px solid #ccc">⏭ Pendientes</th>
        <th style="border:1px solid #ccc">⏱ Duración</th>
      </tr>
      ${filas}
    </table>
    <p style="margin-top:16px;color:#555;font-size:13px">📎 Excel con resultados adjunto.</p>
  </div>
</div>`;

        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com', port: 465, secure: true,
          auth: { user: SMTP_USER, pass: SMTP_PASS }
        });

        return transporter.sendMail({
          from: SMTP_USER,
          to: EMAIL_TO,
          subject: `🧪 Reporte Cypress — ${fecha} | ${globalStatus} (${rows.length} specs)`,
          html: htmlBody,
          attachments: [{ filename: `cypress_report_${fecha}.xlsx`, path: excelPath }]
        }).then(() => {
          console.log(`[Email] Enviado a: ${EMAIL_TO}`);
          // 3 — Enviar resultados completos a n8n (por spec + por test)
          const n8nResults = (results.runs || []).map(run => {
            const specFile = (run.spec?.relative || 'unknown').split('/').pop().split('\\').pop();
            return {
              file:  specFile,
              title: specFile,
              stats: run.stats || {},
              tests: (run.tests || []).map(t => ({
                fullTitle: t.title ? t.title.join(' > ') : '',
                title:     t.title ? t.title[t.title.length - 1] : '',
                state:     t.state,
                duration:  t.duration || 0,
                err:       t.displayError || null
              }))
            };
          });
          const payload = JSON.stringify({
            suite: `${rows.length} specs — retry.ability`,
            stats: {
              tests:    results.totalTests    || 0,
              passes:   results.totalPassed   || totalPasses,
              failures: results.totalFailed   || totalFailures,
              pending:  results.totalPending  || 0,
              duration: results.totalDuration || 0
            },
            results: n8nResults
          });
          const req = http.request('http://localhost:5678/webhook/cypress-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
          }, (r) => console.log('[n8n] Notificado — status:', r.statusCode));
          req.on('error', (e) => console.error('[n8n] Error:', e.message));
          req.write(payload);
          req.end();
        }).catch(err => console.error('[Email] Error:', err.message));
      });
    },
  },
});
