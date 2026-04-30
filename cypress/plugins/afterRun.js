const http = require('http')

module.exports = function afterRun(results) {
  const EMAIL_SERVER = 'http://localhost:3025/run-cypress-report'
  const fecha = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })

  // Construir payload limpio para el email-server
  const runs = (results.runs || []).map(run => {
    const specFile = (run.spec?.relative || 'unknown').split('/').pop().split('\\').pop()
    return {
      file:  specFile,
      stats: run.stats || {},
      tests: (run.tests || []).map(t => ({
        title:    t.title ? (Array.isArray(t.title) ? t.title[t.title.length - 1] : t.title) : '',
        state:    t.state    || '',
        duration: t.duration || 0,
        err:      t.displayError ? String(t.displayError).substring(0, 150) : null,
      })),
    }
  })

  const totalPasses   = runs.reduce((a, r) => a + (r.stats.passes   || 0), 0)
  const totalFailures = runs.reduce((a, r) => a + (r.stats.failures || 0), 0)

  console.log(`\n[afterRun] ${runs.length} spec(s) — ✅ ${totalPasses} ❌ ${totalFailures}`)

  const payload = JSON.stringify({
    suite:   `${runs.length} spec(s)`,
    stats:   {
      tests:    results.totalTests    || 0,
      passes:   results.totalPassed   || totalPasses,
      failures: results.totalFailed   || totalFailures,
      pending:  results.totalPending  || 0,
      duration: results.totalDuration || 0,
    },
    results: runs,
    fecha,
  })

  return new Promise((resolve) => {
    const req = http.request(EMAIL_SERVER, {
      method:  'POST',
      headers: {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, res => {
      let body = ''
      res.on('data', c => body += c)
      res.on('end', () => {
        console.log(`[afterRun] Email-server respondió: ${body}`)
        resolve()
      })
    })

    req.on('error', e => {
      console.error(`[afterRun] Error al contactar email-server: ${e.message}`)
      resolve()
    })

    req.write(payload)
    req.end()
  })
}
