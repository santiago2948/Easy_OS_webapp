/**
 * Prerenderizado estático posterior al build.
 *
 * Una SPA sirve un <div id="root"> vacío. Google puede ejecutar JavaScript,
 * pero los rastreadores de los motores generativos (GPTBot, ClaudeBot,
 * PerplexityBot…) en general no: sin esto, para ellos la web no tiene
 * contenido. Aquí se abre cada ruta en un navegador real y se guarda el HTML
 * ya renderizado sobre el propio dist/.
 *
 * Se navega con `reducedMotion: 'reduce'` a propósito: con esa preferencia el
 * código salta las animaciones de GSAP, así que el HTML queda completo y
 * visible en vez de congelado en opacity:0.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const PORT = 4179

const ROUTES = [
  '/',
  '/en',
  '/app/cotizacion',
  '/en/app/cotizacion',
  '/legal/tratamiento-de-datos',
  '/legal/cookies',
]

/** Selector que confirma que la ruta terminó de montar. */
const READY = {
  '/': '#preguntas .lp-faq__item',
  '/en': '#preguntas .lp-faq__item',
  '/app/cotizacion': '.quote-shell__cta',
  '/en/app/cotizacion': '.quote-shell__cta',
  '/legal/tratamiento-de-datos': '.legal-page h1',
  '/legal/cookies': '.legal-page h1',
}

function outputPath(route) {
  return route === '/'
    ? join(DIST, 'index.html')
    : join(DIST, route.replace(/^\//, ''), 'index.html')
}

async function launchBrowser(chromium) {
  // Primero el Chrome del sistema: evita tener que descargar el navegador.
  try {
    return await chromium.launch({ channel: 'chrome' })
  } catch {
    return chromium.launch()
  }
}

async function main() {
  let chromium
  try {
    ({ chromium } = await import('playwright'))
  } catch {
    console.warn(
      '\n[prerender] Playwright no está instalado: se omite el prerenderizado.\n' +
        '            El sitio funciona, pero los rastreadores de IA verán una página vacía.\n' +
        '            Instale con: npm install && npx playwright install chromium\n',
    )
    return
  }

  let browser
  try {
    browser = await launchBrowser(chromium)
  } catch (error) {
    console.warn(
      `\n[prerender] No se pudo abrir un navegador (${error.message}).\n` +
        '            Se omite el prerenderizado; el build sigue siendo válido.\n' +
        '            Instale el navegador con: npx playwright install chromium\n',
    )
    return
  }

  const server = await preview({
    root: ROOT,
    preview: { port: PORT, strictPort: true, open: false },
    logLevel: 'silent',
  })

  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const rendered = []

  try {
    for (const route of ROUTES) {
      const page = await context.newPage()
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' })

      const selector = READY[route]
      if (selector) {
        await page.waitForSelector(selector, { timeout: 15000 })
      }
      // margen para los efectos que escriben en <head> (metadatos y JSON-LD)
      await page.waitForTimeout(400)

      // El navegador resuelve a absolutas las preargas de módulos que inyecta
      // Vite. Sin esto quedarían apuntando al servidor de prerenderizado.
      const html = (await page.content()).replaceAll(`http://localhost:${PORT}`, '')
      rendered.push({ route, html })
      console.log(`[prerender] ${route.padEnd(32)} ${html.length.toLocaleString()} bytes`)
      await page.close()
    }
  } finally {
    await context.close()
    await browser.close()
    await server.close()
  }

  for (const { route, html } of rendered) {
    const file = outputPath(route)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, `<!doctype html>\n${html}\n`, 'utf-8')
  }

  console.log(`[prerender] ${rendered.length} rutas escritas en dist/`)
}

main().catch((error) => {
  console.error('[prerender] Falló:', error)
  process.exit(1)
})
