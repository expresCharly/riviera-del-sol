import { useEffect, useState } from 'react'
import { useSlowAnchors } from '@/lib/useSlowAnchors'
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react'
import { Header } from '@/sections/Header'

const suave = [0.22, 1, 0.36, 1] as const

const imagenes = [
  { src: '/imgs/entrada.png', titulo: 'Propuesta de acceso principal', detalle: 'Render conceptual del acceso con caseta y carriles de entrada y salida.' },
  { src: '/imgs/plano-ia.png', titulo: 'Visión del desarrollo', detalle: 'Imagen conceptual: distribución y dimensiones ilustrativas.' },
  { src: '/imgs/plano-ia-2.png', titulo: 'Otra perspectiva de Riviera del Sol', detalle: 'Propuesta visual sujeta al proyecto técnico definitivo.' },
  { src: '/imgs/plano.png', titulo: 'Referencia de lotificación', detalle: 'Superficies, linderos y número de lotes pendientes de verificación técnica.' },
]

export default function App() {
  useSlowAnchors()
  const reducirMovimiento = useReducedMotion()
  const entrada = { initial: { opacity: 0, y: reducirMovimiento ? 0 : 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: reducirMovimiento ? 0 : 1.4, ease: suave } }
  const [actual, setActual] = useState(0)
  const [pausado, setPausado] = useState(false)

  const [enfocado, setEnfocado] = useState(false)
  const [visible, setVisible] = useState(!document.hidden)
  const reproduciendo = !pausado && !enfocado && visible && !reducirMovimiento
  useEffect(() => {
    const cambiarVisibilidad = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', cambiarVisibilidad)
    return () => document.removeEventListener('visibilitychange', cambiarVisibilidad)
  }, [])
  useEffect(() => {
    if (!reproduciendo) return
    const timer = window.setTimeout(() => setActual((i) => (i + 1) % imagenes.length), 6500)
    return () => window.clearTimeout(timer)
  }, [actual, reproduciendo])
  const imagen = imagenes[actual]
  const cambiar = (paso: number) => setActual((i) => (i + paso + imagenes.length) % imagenes.length)
  return <MotionConfig reducedMotion="user">
    <Header />
    <main>
      <section id="top" className="hero-split">
        <div className="hero-grid">
          <motion.div {...entrada} className="hero-copy">
            <p className="hero-eyebrow"><span /> Aguascalientes · Residencial privado</p>
            <motion.h1 initial={{ opacity: 0, y: reducirMovimiento ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducirMovimiento ? 0 : 1.6, delay: reducirMovimiento ? 0 : 0.2, ease: suave }} className="hero-title">Riviera del <span>Sol.</span></motion.h1>
            <p className="hero-intro">Espacio para construir tu próximo hogar.</p>
            <p className="hero-description">Una propuesta residencial con terrenos de aproximadamente 500 m², áreas ajardinadas y dos accesos controlados.</p>
            <div className="hero-actions"><a href="#plano" className="hero-primary inline-block">Explora el proyecto <span aria-hidden="true">↗</span></a><a href="#ubicacion" className="hero-secondary">Conoce la ubicación <span aria-hidden="true">→</span></a></div>
            <div className="hero-facts"><div><strong>500 <small>m²</small></strong><span>Superficie aproximada</span></div><div><strong>02</strong><span>Accesos propuestos</span></div></div>
          </motion.div>
          <motion.figure {...entrada} transition={{ duration: reducirMovimiento ? 0 : 1.8, delay: reducirMovimiento ? 0 : 0.25, ease: suave }} className="hero-figure">
            <div className="hero-image-wrap"><motion.img initial={{ scale: reducirMovimiento ? 1 : 1.06 }} animate={{ scale: 1 }} transition={{ duration: reducirMovimiento ? 0 : 3.6, ease: suave }} src="/imgs/entrada.png" alt="Propuesta conceptual del acceso principal de Riviera del Sol" className="hero-image" /><span className="hero-image-label">Una nueva perspectiva de hogar</span></div>
            <figcaption><span>01 / Acceso principal</span><span>Imagen conceptual · Ilustrativa</span></figcaption>
          </motion.figure>
        </div>
        <div className="hero-bottom"><span>Un proyecto para imaginar lo que viene.</span><a href="#plano">Descubre Riviera del Sol <span aria-hidden="true">↓</span></a></div>
      </section>
      <motion.section {...entrada} id="plano" className="editorial-section project-section">
        <div className="project-split">
          <div className="project-visual">
        <div role="region" onFocusCapture={() => setEnfocado(true)} onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setEnfocado(false) }} aria-roledescription="carrusel" aria-label="Imágenes del proyecto" className="project-gallery" onKeyDown={(e) => { if(e.key === 'ArrowLeft') cambiar(-1); if(e.key === 'ArrowRight') cambiar(1) }}>
          <div className="gallery-stage relative h-[300px] overflow-hidden sm:h-[560px]"><AnimatePresence initial={false}><motion.img key={imagen.src} src={imagen.src} alt={imagen.titulo} initial={{ opacity: 0, scale: reducirMovimiento ? 1 : 1.025 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducirMovimiento ? 0 : 1.8, ease: 'easeInOut' }} className="absolute inset-0 size-full object-contain" /></AnimatePresence><div className="gallery-dots flex flex-wrap gap-2 px-6 pb-6">{imagenes.map((item, i) => <button type="button" key={item.src} onClick={() => setActual(i)} aria-label={`Ver ${item.titulo}`} aria-pressed={i === actual} className={`h-3 w-8 rounded-full ${i === actual ? 'bg-azul' : 'bg-calle'}`} />)}</div><button type="button" onClick={() => cambiar(-1)} aria-label="Imagen anterior" className="gallery-arrow gallery-arrow-prev">←</button><button type="button" onClick={() => cambiar(1)} aria-label="Imagen siguiente" className="gallery-arrow gallery-arrow-next">→</button>{!reducirMovimiento && <button type="button" onClick={() => setPausado((valor) => !valor)} aria-pressed={pausado} className="gallery-arrow gallery-pause">{pausado ? 'Reanudar' : 'Pausar'}</button>}</div>
          <div className="gallery-caption flex flex-wrap items-center justify-between gap-5 p-6">
            <div aria-live={reproduciendo ? 'off' : 'polite'}><h3 className="text-xl font-semibold">{imagen.titulo}</h3><p className="mt-1 text-sm">{imagen.detalle}</p><p className="mt-2 text-sm text-azul">{actual + 1} / {imagenes.length}</p></div>
            
          </div>
          
        </div>
        <p className="mt-4 text-sm text-piedra">Los rótulos de los renders son ilustrativos; las condiciones escritas de preventa se muestran abajo.</p>
          </div>
          <div className="project-copy">
        <p className="section-eyebrow">01 / El proyecto</p>
        <h2 className="mt-3 text-4xl font-semibold">Un lugar para imaginar tu futuro</h2>
        <p className="mt-5 max-w-3xl">La propuesta contempla aproximadamente 34 lotes de 500 m², calles internas y viviendas de una o dos plantas. La cantidad de lotes y sus superficies están sujetas al levantamiento topográfico y a la lotificación definitiva.</p>
        <div className="project-details">{[
          ['Dos accesos controlados', 'Entrada 1 y Entrada 2 con portones y caseta, conforme al proyecto definitivo.'],
          ['Cerca perimetral', 'Zócalo bajo de mampostería clara, pilastras y paños de malla metálica electrosoldada verde oscuro.'],
          ['Viviendas propuestas', 'Una o dos plantas, patio trasero, frente ajardinado y espacio para uno o dos autos, sujeto a dimensiones y reglamentos.'],
        ].map(([titulo, texto], i) => <motion.article {...entrada} transition={{ duration: reducirMovimiento ? 0 : 1.25, delay: reducirMovimiento ? 0 : i * 0.16, ease: suave }} key={titulo} className="project-card"><span className="detail-number">0{i + 1}</span><h3 className="text-2xl font-semibold">{titulo}</h3><p className="mt-4">{texto}</p></motion.article>)}</div>
          </div>
        </div>
      </motion.section>
      <motion.section {...entrada} id="financiamiento" className="finance-section">
        <div className="mx-auto max-w-7xl"><p className="section-eyebrow">02 / Condiciones de preventa</p><h2 className="mt-3 text-4xl font-semibold">Tu terreno, paso a paso</h2><p className="mt-4">Por lote de aproximadamente 500 m². Sin intereses, sujeto a contrato.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[['$800,000', 'MXN · precio de preventa'], ['$240,000', 'MXN · enganche del 30%'], ['$560,000', 'MXN · saldo restante'], ['$10,000', 'MXN · 56 mensualidades']].map(([valor, etiqueta], i) => <motion.div {...entrada} transition={{ duration: reducirMovimiento ? 0 : 1.25, delay: reducirMovimiento ? 0 : i * 0.16, ease: suave }} key={valor} className="finance-card"><p className="text-3xl font-semibold text-estaca">{valor}</p><p className="mt-2">{etiqueta}</p></motion.div>)}</div>
          <p className="mt-8">Precio previsto al finalizar la preventa: <strong>$1,000,000 MXN por lote.</strong></p><p className="mt-3 max-w-4xl text-sm text-white/70">Este precio futuro no representa una garantía de plusvalía. Vigencia, disponibilidad, escrituración, impuestos, fechas y términos contractuales pendientes de definición. Referencia documental: proyecto revisado del 23 de octubre de 2026.</p>
        </div>
      </motion.section>
      <motion.section {...entrada} id="ubicacion" className="editorial-section location-section">
        <div className="location-split">
          <div className="location-copy">
            <p className="section-eyebrow">03 / Ubicación de referencia</p>
            <h2>Aguascalientes</h2>
            <p className="location-intro">Junto a la carretera estatal 108.</p>
            <p className="location-description">La propuesta de acceso sitúa el desarrollo junto a esta vía. El predio corresponde al polígono señalado en la documentación del proyecto; sus linderos y medidas exactas están pendientes de levantamiento topográfico.</p>
            <a href="https://maps.app.goo.gl/YD3uKocwphu4zzDb7?g_st=iw" target="_blank" rel="noreferrer" className="hero-primary inline-block location-action">Ver referencia en Google Maps <span aria-hidden="true">↗</span></a>
          </div>
          <div className="location-visual">
            <div className="location-map">
              <iframe
                title="Mapa de referencia de Riviera del Sol, Aguascalientes"
                src="https://www.google.com/maps?q=21.7231199,-102.4129499&z=16&output=embed"
                className="w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <p className="location-caption">Punto de referencia tomado de la vista de calle compartida. No representa los límites del predio.</p>
          </div>
        </div>
      </motion.section>
      <motion.section {...entrada} id="contacto" className="contact-section"><div className="contact-inner"><div><p className="section-eyebrow">04 / El siguiente paso</p><h2 className="text-3xl font-semibold">Información de ventas</h2><p className="mt-4 max-w-2xl">Próximamente compartiremos los canales de atención para consultar disponibilidad y conocer los términos de preventa.</p></div><a href="#financiamiento" className="contact-link">Conoce la preventa <span aria-hidden="true">↗</span></a></div></motion.section>
    </main>
    <footer className="site-footer"><div className="footer-inner"><div><a href="#top" className="footer-brand">Riviera del Sol<span>RESIDENCIAL PRIVADO · AGUASCALIENTES</span></a><p className="footer-note">Propuesta conceptual. Las imágenes no sustituyen planos aprobados. Lotificación, accesos, vialidades, servicios y permisos pendientes de validación.</p></div><nav aria-label="Navegación del pie de página"><a href="#plano">El proyecto ↗</a><a href="#ubicacion">Ubicación ↗</a><a href="#top">Volver al inicio ↑</a></nav></div><div className="footer-bottom"><span>Un espacio para tu próximo hogar.</span><span>Proyecto conceptual · Riviera del Sol</span></div></footer>
  </MotionConfig>
}













