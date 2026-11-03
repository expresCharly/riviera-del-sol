import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// Renderiza la página completa en ambos idiomas sin depender de un navegador.
let preferencia = null
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { languages: ['es-MX'], language: 'es-MX' } })
globalThis.localStorage = { getItem: () => preferencia }
globalThis.document = { hidden: false }
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  const { IdiomaProvider } = await server.ssrLoadModule('/src/lib/Idioma.tsx')
  const render = () => renderToStaticMarkup(createElement(IdiomaProvider, null, createElement(App)))
  const spanish = render()
  for (const text of ['Espacio para construir tu próximo hogar.', 'Tu terreno, paso a paso', 'Aeropuerto', 'Información de ventas', 'Datos para depósito', 'Activar guía de voz']) assert.ok(spanish.includes(text), text)
  preferencia = 'en'
  const english = render()
  for (const text of ['Room to build your next home.', 'Your lot, step by step', 'Airport', 'Sales information', 'Deposit details', 'Enable audio guide', 'Mobile navigation', 'Previous image', 'Routing number', 'hl=en']) assert.ok(english.includes(text), text)
  for (const text of ['Información de ventas', 'Pausar', 'Ubicación', 'Números por lote', 'Número de ruta', 'Residencial privado']) assert.ok(!english.includes(text), `Untranslated: ${text}`)
  for (const text of ['4027 6600 7393 9318', '156141278499', '031101279', '3175587054', '083000108', '9369669202', '$800,000', '500 m²']) {
    assert.ok(spanish.includes(text) && english.includes(text), `Changed value: ${text}`)
  }
  preferencia = 'es'
  assert.equal(render(), spanish, 'Switching back restores Spanish')
  console.log('Spanish/English page rendering, saved preference, labels and unchanged numeric values verified.')
} finally {
  await server.close()
}
