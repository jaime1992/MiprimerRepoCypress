const http       = require('http')
const nodemailer = require('nodemailer')
const XLSX       = require('xlsx')
const fs         = require('fs')
const path       = require('path')

const PORT       = 3025
const SMTP_USER  = 'jaimeqv.2609@gmail.com'
const SMTP_PASS  = 'fsvcqjwerkiumnjz'
const EMAIL_TO   = 'jaimeqv.2609@gmail.com,javi.gajardo26@gmail.com'
const REPORTS_DIR = 'C:\\QA\\Reports'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', port: 465, secure: true,
  auth: { user: SMTP_USER, pass: SMTP_PASS }
})

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)))
    req.on('end',  () => resolve(Buffer.concat(chunks).toString('utf-8')))
    req.on('error', reject)
  })
}

// ── Excel Cypress ─────────────────────────────────────────────────────────────
function generateCypressExcel(results, stats, suite, fecha) {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true })

  const wb   = XLSX.utils.book_new()
  const today = new Date().toISOString().split('T')[0]

  // Hoja 1: Resumen de specs
  const summaryHeaders = ['Spec', 'Estado', 'Pasados', 'Fallados', 'Pendientes', 'Duracion', 'Fecha']
  const summaryRows = results.map(r => {
    const s = r.stats || {}
    return [
      r.file || r.title || 'spec',
      s.failures > 0 ? 'FAILED' : 'PASSED',
      s.passes   || 0,
      s.failures || 0,
      s.pending  || 0,
      s.duration  ? Math.round(s.duration / 1000) + 's' : 'N/A',
      today,
    ]
  })
  const wsResumen = XLSX.utils.aoa_to_sheet([summaryHeaders, ...summaryRows])
  wsResumen['!cols'] = [{ wch:50 },{ wch:10 },{ wch:10 },{ wch:10 },{ wch:12 },{ wch:10 },{ wch:12 }]
  XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen')

  // Hoja 2: Detalle de tests
  const detailHeaders = ['Spec', 'Test', 'Estado', 'Duracion (ms)', 'Error']
  const detailRows = []
  results.forEach(r => {
    const specName = r.file || r.title || 'spec'
    ;(r.tests || []).forEach(t => {
      detailRows.push([
        specName,
        t.title      || '',
        t.state      || '',
        t.duration   || 0,
        t.err        ? t.err.substring(0, 200) : '',
      ])
    })
  })
  if (detailRows.length > 0) {
    const wsDetalle = XLSX.utils.aoa_to_sheet([detailHeaders, ...detailRows])
    wsDetalle['!cols'] = [{ wch:40 },{ wch:50 },{ wch:10 },{ wch:15 },{ wch:60 }]
    XLSX.utils.book_append_sheet(wb, wsDetalle, 'Detalle Tests')
  }

  const excelPath = path.join(REPORTS_DIR, `cypress_report_${today}.xlsx`)
  XLSX.writeFile(wb, excelPath)
  console.log(`[email-server] Excel guardado: ${excelPath}`)
  return excelPath
}

// ── HTML Cypress ──────────────────────────────────────────────────────────────
function buildCypressHtml(results, stats, suite, fecha) {
  const passes   = stats.passes   || 0
  const failures = stats.failures || 0
  const pending  = stats.pending  || 0
  const duration = stats.duration ? Math.round(stats.duration / 1000) + 's' : 'N/A'
  const status   = failures > 0 ? 'FAILED' : 'PASSED'
  const headerBg = failures > 0 ? '#15803d' : '#15803d'

  const specRows = results.map(r => {
    const s       = r.stats || {}
    const passed  = s.passes   || 0
    const failed  = s.failures || 0
    const specFile = (r.file || r.title || 'spec').split('/').pop().split('\\').pop()
    const rowBg   = failed > 0 ? '#fee2e2' : '#dcfce7'
    const icon    = failed > 0 ? '🔴' : '🟢'

    const testRows = (r.tests || []).map(t => {
      const tBg   = t.state === 'failed'  ? '#fef2f2'
                  : t.state === 'pending' ? '#fefce8'
                  : '#f0fdf4'
      const tIcon = t.state === 'failed'  ? '🔴'
                  : t.state === 'pending' ? '🟡'
                  : '🟢'
      const errMsg = t.err ? `<br><small style="color:#b91c1c;font-size:11px">${String(t.err).substring(0,100)}</small>` : ''
      return `<tr style="background:${tBg}">
        <td style="border:1px solid #bbf7d0;padding:5px 12px;font-size:12px">&nbsp;&nbsp;${tIcon} ${t.title||''}</td>
        <td style="border:1px solid #bbf7d0;padding:5px 10px;text-align:center;font-size:11px">${t.state||''}${errMsg}</td>
        <td style="border:1px solid #bbf7d0;padding:5px 10px;text-align:center;font-size:11px">${t.duration||0}ms</td>
      </tr>`
    }).join('')

    return `
    <tr style="background:${rowBg}">
      <td colspan="3" style="padding:9px 14px;font-weight:700;font-size:13px;border:1px solid #bbf7d0">
        ${icon} ${specFile} &nbsp;
        <span style="font-weight:400;font-size:12px;color:#374151">Pasados: ${passed} | Fallados: ${failed}</span>
      </td>
    </tr>
    ${testRows}`
  }).join('')

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:Arial,sans-serif">
<div style="max-width:700px;margin:0 auto;padding:24px 16px">
  <div style="background:#15803d;color:#fff;padding:20px 24px;border-radius:10px 10px 0 0">
    <h2 style="margin:0;font-size:18px">🧪 Cypress Regression — ${status === 'PASSED' ? '✅ TODO PASO' : '❌ HAY FALLOS'}</h2>
    <p style="margin:6px 0 0;font-size:13px;opacity:.85">Suite: ${suite} &nbsp;|&nbsp; ${fecha}</p>
  </div>
  <div style="background:#fff;border:1px solid #bbf7d0;border-top:none;padding:24px;border-radius:0 0 10px 10px">

    <!-- Resumen cuadros verdes -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:22px">
      <div style="background:#dcfce7;border-radius:8px;padding:14px;text-align:center">
        <div style="font-size:26px;font-weight:700;color:#15803d">${passes}</div>
        <div style="font-size:11px;color:#166534;margin-top:3px">✅ PASADOS</div>
      </div>
      <div style="background:${failures>0?'#fee2e2':'#dcfce7'};border-radius:8px;padding:14px;text-align:center">
        <div style="font-size:26px;font-weight:700;color:${failures>0?'#b91c1c':'#15803d'}">${failures}</div>
        <div style="font-size:11px;color:${failures>0?'#991b1b':'#166534'};margin-top:3px">${failures>0?'❌ FALLADOS':'✅ SIN FALLOS'}</div>
      </div>
      <div style="background:#fef9c3;border-radius:8px;padding:14px;text-align:center">
        <div style="font-size:26px;font-weight:700;color:#854d0e">${pending}</div>
        <div style="font-size:11px;color:#713f12;margin-top:3px">⏭ PENDIENTES</div>
      </div>
      <div style="background:#e0f2fe;border-radius:8px;padding:14px;text-align:center">
        <div style="font-size:26px;font-weight:700;color:#0369a1">${duration}</div>
        <div style="font-size:11px;color:#075985;margin-top:3px">⏱ DURACION</div>
      </div>
    </div>

    <!-- Tabla de specs -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
      <tr style="background:#15803d;color:#fff">
        <th style="padding:9px 14px;border:1px solid #bbf7d0;text-align:left;font-size:12px">Test / Spec</th>
        <th style="padding:9px 10px;border:1px solid #bbf7d0;text-align:center;font-size:12px">Estado</th>
        <th style="padding:9px 10px;border:1px solid #bbf7d0;text-align:center;font-size:12px">Duracion</th>
      </tr>
      ${specRows}
    </table>
    <p style="margin-top:16px;font-size:12px;color:#6b7280">📎 Excel adjunto guardado en C:\\QA\\Reports\\</p>
  </div>
</div></body></html>`
}

// ── HTML Bugs Jira ────────────────────────────────────────────────────────────
function buildBugsHtml(bugs, total, date) {
  const ps = { Highest:{bg:'#fee2e2',color:'#b91c1c',icon:'🔴'}, High:{bg:'#fee2e2',color:'#b91c1c',icon:'🔴'}, Medium:{bg:'#fef9c3',color:'#854d0e',icon:'🟡'}, Low:{bg:'#dcfce7',color:'#166534',icon:'🟢'}, Lowest:{bg:'#dcfce7',color:'#166534',icon:'🟢'} }
  const high   = bugs.filter(b => ['Highest','High'].includes(b.priority)).length
  const medium = bugs.filter(b => b.priority === 'Medium').length
  const low    = bugs.length - high - medium
  const rows   = bugs.map(b => {
    const p = ps[b.priority] || { bg:'#f4f5f7', color:'#42526e', icon:'⚪' }
    return `<tr style="background:${p.bg}">
      <td style="border:1px solid #fecaca;padding:8px 10px;font-weight:700"><a href="${b.url}" style="color:#b91c1c;text-decoration:none">${b.key}</a></td>
      <td style="border:1px solid #fecaca;padding:8px 10px;font-size:13px">${b.summary}</td>
      <td style="border:1px solid #fecaca;padding:8px 10px;text-align:center;font-size:12px">${b.status}</td>
      <td style="border:1px solid #fecaca;padding:8px 10px;text-align:center;font-size:12px"><span style="color:${p.color};font-weight:700">${p.icon} ${b.priority}</span></td>
      <td style="border:1px solid #fecaca;padding:8px 10px;font-size:12px">${b.assignee}</td>
      <td style="border:1px solid #fecaca;padding:8px 10px;font-size:12px;text-align:center">${b.created}</td>
    </tr>`
  }).join('')
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#fef2f2;font-family:Arial,sans-serif">
<div style="max-width:720px;margin:0 auto;padding:24px 16px">
  <div style="background:linear-gradient(135deg,#b91c1c,#dc2626);color:#fff;padding:20px 24px;border-radius:10px 10px 0 0">
    <h2 style="margin:0;font-size:18px">🐛 Bugs Abiertos Jira — Proyecto KAN</h2>
    <p style="margin:6px 0 0;font-size:13px;opacity:.85">${date} | Total: ${total} bugs activos</p>
  </div>
  <div style="background:#fff;border:1px solid #fecaca;border-top:none;padding:24px;border-radius:0 0 10px 10px">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
      <div style="background:#fee2e2;border-radius:8px;padding:14px;text-align:center"><div style="font-size:28px;font-weight:700;color:#b91c1c">${high}</div><div style="font-size:11px;color:#991b1b;margin-top:4px">🔴 ALTA</div></div>
      <div style="background:#fef9c3;border-radius:8px;padding:14px;text-align:center"><div style="font-size:28px;font-weight:700;color:#854d0e">${medium}</div><div style="font-size:11px;color:#713f12;margin-top:4px">🟡 MEDIA</div></div>
      <div style="background:#dcfce7;border-radius:8px;padding:14px;text-align:center"><div style="font-size:28px;font-weight:700;color:#166534">${low}</div><div style="font-size:11px;color:#14532d;margin-top:4px">🟢 BAJA</div></div>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
      <tr style="background:#b91c1c;color:#fff">
        <th style="padding:10px 12px;border:1px solid #fecaca;text-align:left;font-size:12px">Issue</th>
        <th style="padding:10px 12px;border:1px solid #fecaca;text-align:left;font-size:12px">Titulo</th>
        <th style="padding:10px 12px;border:1px solid #fecaca;text-align:center;font-size:12px">Estado</th>
        <th style="padding:10px 12px;border:1px solid #fecaca;text-align:center;font-size:12px">Prioridad</th>
        <th style="padding:10px 12px;border:1px solid #fecaca;text-align:left;font-size:12px">Asignado</th>
        <th style="padding:10px 12px;border:1px solid #fecaca;text-align:center;font-size:12px">Creado</th>
      </tr>${rows}
    </table>
    <p style="margin-top:16px;font-size:12px;color:#6b7280">Excel adjunto con detalle completo.</p>
  </div>
</div></body></html>`
}

function buildBugsCsv(bugs) {
  const esc = v => `"${String(v||'').replace(/"/g,'""')}"`
  const head = ['Issue','Titulo','Estado','Prioridad','Asignado','Reportado','Creado','Actualizado','Link']
  const rows = bugs.map(b => [b.key,b.summary,b.status,b.priority,b.assignee,b.reporter,b.created,b.updated,b.url].map(esc).join(','))
  return '﻿' + head.map(esc).join(',') + '\n' + rows.join('\n')
}

// ── Servidor ──────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST') { res.writeHead(405).end(); return }
  const body = await readBody(req)
  console.log(`[email-server] ${req.url} | ${body.length} bytes`)

  try {
    const data = body.trim() ? JSON.parse(body) : {}

    // POST /send-email — genérico
    if (req.url === '/send-email') {
      const { to, subject, html, fileName, fileBase64 } = data
      await transporter.sendMail({ from:SMTP_USER, to, subject, html,
        attachments: fileBase64 ? [{ filename:fileName||'file.csv', content:Buffer.from(fileBase64,'base64'), contentType:'text/csv' }] : []
      })
      console.log(`[email-server] Enviado: ${subject}`)
      res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({ ok:true }))
      return
    }

    // POST /run-cypress-report — genera Excel + email con cuadros verdes
    if (req.url === '/run-cypress-report') {
      const results  = data.results || []
      const stats    = data.stats   || {}
      const suite    = data.suite   || 'Cypress Suite'
      const fecha    = data.fecha   || new Date().toLocaleString('es-CL')
      const failures = stats.failures || 0
      const status   = failures > 0 ? 'FAILED' : 'PASSED'

      const excelPath = generateCypressExcel(results, stats, suite, fecha)
      const html      = buildCypressHtml(results, stats, suite, fecha)
      const subject   = `🧪 Cypress ${status} — ${stats.passes||0}✅ ${failures}❌ | ${fecha}`

      await transporter.sendMail({
        from: SMTP_USER, to: EMAIL_TO, subject, html,
        attachments: [{ filename: path.basename(excelPath), path: excelPath }]
      })
      console.log(`[email-server] Cypress report enviado | Excel: ${excelPath}`)
      res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({ ok:true, excelPath }))
      return
    }

    // POST /run-bugs-report — genera Excel Jira + email con cuadros rojos
    if (req.url === '/run-bugs-report') {
      const bugs  = data.bugs  || []
      const total = data.total || bugs.length
      const date  = data.date  || new Date().toISOString().split('T')[0]
      const html  = buildBugsHtml(bugs, total, date)
      const csv   = buildBugsCsv(bugs)
      const subject = `🐛 Bugs Abiertos Jira KAN — ${total} activos | ${date}`

      await transporter.sendMail({
        from: SMTP_USER, to: EMAIL_TO, subject, html,
        attachments: [{ filename:`Bugs-KAN-${date}.csv`, content:Buffer.from(csv,'utf-8'), contentType:'text/csv' }]
      })
      console.log(`[email-server] Bugs report enviado: ${bugs.length} bugs`)
      res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({ ok:true, bugs:bugs.length }))
      return
    }

    // POST /run-jira-tasks-report — Tasks nuevas Jira → Excel + Email azul
    if (req.url === '/run-jira-tasks-report') {
      const tasks   = data.tasks || []
      const date    = data.date  || new Date().toISOString().split('T')[0]
      const fecha   = data.fecha || new Date().toLocaleString('es-CL')
      const total   = tasks.length

      if (!tasks.length) {
        res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({ ok:true, skipped:true }))
        return
      }

      // Excel
      if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true })
      const wb  = XLSX.utils.book_new()
      const hdr = ['Issue','Titulo','Tipo','Prioridad','Estado','Asignado','Reportado','Creado','Link']
      const rows = tasks.map(t => [t.key,t.summary,t.type,t.priority,t.status,t.assignee,t.reporter,t.created,t.url])
      const ws  = XLSX.utils.aoa_to_sheet([hdr, ...rows])
      ws['!cols'] = [{wch:10},{wch:50},{wch:10},{wch:10},{wch:12},{wch:20},{wch:20},{wch:12},{wch:50}]
      XLSX.utils.book_append_sheet(wb, ws, 'Tasks Jira')
      const excelPath = path.join(REPORTS_DIR, `tasks_jira_KAN_${date}.xlsx`)
      XLSX.writeFile(wb, excelPath)

      // HTML email azul
      const taskRows = tasks.map(t => {
        const pColors = {Highest:'#fee2e2',High:'#fee2e2',Medium:'#fef9c3',Low:'#dcfce7',Lowest:'#dcfce7'}
        const bg = pColors[t.priority] || '#f0f4ff'
        return `<tr style="background:${bg}">
          <td style="border:1px solid #bfdbfe;padding:8px 10px;font-weight:700">
            <a href="${t.url}" style="color:#1d4ed8;text-decoration:none">${t.key}</a>
          </td>
          <td style="border:1px solid #bfdbfe;padding:8px 10px;font-size:13px">${t.summary}</td>
          <td style="border:1px solid #bfdbfe;padding:8px 10px;text-align:center;font-size:12px">${t.priority}</td>
          <td style="border:1px solid #bfdbfe;padding:8px 10px;font-size:12px">${t.assignee}</td>
          <td style="border:1px solid #bfdbfe;padding:8px 10px;font-size:12px;text-align:center">${t.created}</td>
        </tr>`
      }).join('')

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#eff6ff;font-family:Arial,sans-serif">
<div style="max-width:720px;margin:0 auto;padding:24px 16px">
  <div style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;padding:20px 24px;border-radius:10px 10px 0 0">
    <h2 style="margin:0;font-size:18px">📋 Nueva Task Jira — Proyecto KAN</h2>
    <p style="margin:6px 0 0;font-size:13px;opacity:.85">${fecha} | ${total} task(s) nueva(s)</p>
  </div>
  <div style="background:#fff;border:1px solid #bfdbfe;border-top:none;padding:24px;border-radius:0 0 10px 10px">
    <div style="background:#dbeafe;border-radius:8px;padding:14px;text-align:center;margin-bottom:20px">
      <div style="font-size:32px;font-weight:700;color:#1d4ed8">${total}</div>
      <div style="font-size:12px;color:#1e40af;margin-top:4px">📋 TASKS NUEVAS DETECTADAS</div>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
      <tr style="background:#1d4ed8;color:#fff">
        <th style="padding:10px 12px;border:1px solid #bfdbfe;text-align:left;font-size:12px">Issue</th>
        <th style="padding:10px 12px;border:1px solid #bfdbfe;text-align:left;font-size:12px">Titulo</th>
        <th style="padding:10px 12px;border:1px solid #bfdbfe;text-align:center;font-size:12px">Prioridad</th>
        <th style="padding:10px 12px;border:1px solid #bfdbfe;text-align:left;font-size:12px">Asignado</th>
        <th style="padding:10px 12px;border:1px solid #bfdbfe;text-align:center;font-size:12px">Creado</th>
      </tr>${taskRows}
    </table>
    <p style="margin-top:16px;font-size:12px;color:#6b7280">📎 Excel adjunto guardado en C:\\QA\\Reports\\</p>
  </div>
</div></body></html>`

      const subject = `📋 Nueva Task Jira KAN — ${total} detectada(s) | ${fecha}`
      await transporter.sendMail({
        from: SMTP_USER, to: EMAIL_TO, subject, html,
        attachments: [{ filename: path.basename(excelPath), path: excelPath }]
      })
      console.log(`[email-server] Tasks report enviado: ${total} tasks | Excel: ${excelPath}`)
      res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({ ok:true, tasks:total, excelPath }))
      return
    }

    res.writeHead(404).end('Not found')
  } catch (err) {
    console.error('[email-server] Error:', err.message)
    res.writeHead(500,{'Content-Type':'application/json'}).end(JSON.stringify({ ok:false, error:err.message }))
  }
})

server.listen(PORT, () => console.log(`[email-server] Listo en http://localhost:${PORT}`))
