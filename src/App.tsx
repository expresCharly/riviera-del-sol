import { useEffect, useRef, useState } from 'react'
import { useSlowAnchors } from '@/lib/useSlowAnchors'
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react'
import { Header } from '@/sections/Header'

const suave = [0.22, 1, 0.36, 1] as const
const imagenesRifa = ['/imgs/lotes-rifa.png', '/imgs/lotes-rifa-2.png', '/imgs/lotes-rifa-3.png']

const imagenes = [
  { src: '/imgs/entrada.png', titulo: 'Propuesta de acceso principal', detalle: 'Render conceptual del acceso con caseta y carriles de entrada y salida.' },
  { src: '/imgs/vista-area-de-riviera-del-sol.png', titulo: 'Vista aérea de Riviera del Sol', detalle: 'Perspectiva general del proyecto.' },
  { src: '/imgs/vista-area-de-riviera-del-sol-2.png', titulo: 'Vista aérea de Riviera del Sol 2', detalle: 'Perspectiva general del proyecto.' }, 
  { src: '/imgs/vista-area-de-riviera-del-sol-3.png', titulo: 'Vista aérea de Riviera del Sol 3', detalle: 'Perspectiva general del proyecto.' },
    { src: '/imgs/vista-area-de-riviera-del-sol-4.png', titulo: 'Vista aérea de Riviera del Sol 4', detalle: 'Perspectiva general del proyecto.' },



]

export default function App() {
  useSlowAnchors()
  const reducirMovimiento = useReducedMotion()
  const entrada = { initial: { opacity: 0, y: reducirMovimiento ? 0 : 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: reducirMovimiento ? 0 : 1.4, ease: suave } }
  const [actual, setActual] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [inicioActual, setInicioActual] = useState(0)
  const [inicioPausado, setInicioPausado] = useState(false)
  const [inicioEnfocado, setInicioEnfocado] = useState(false)
  const [imagenAmpliada, setImagenAmpliada] = useState<number | null>(null)
  const visorRifa = useRef<HTMLDialogElement>(null)
  const visorAbierto = imagenAmpliada !== null
  const cambiarImagenAmpliada = (paso: number) => setImagenAmpliada((i) => i === null ? null : (i + paso + imagenesRifa.length) % imagenesRifa.length)
  useEffect(() => {
    if (!visorAbierto) return
    const dialog = visorRifa.current
    const overflowAnterior = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = overflowAnterior
    }
  }, [visorAbierto])


  const [enfocado, setEnfocado] = useState(false)
  const [visible, setVisible] = useState(!document.hidden)
  const reproduciendo = !pausado && !enfocado && visible && !reducirMovimiento
  const inicioReproduciendo = !inicioPausado && !inicioEnfocado && visible && !reducirMovimiento
  useEffect(() => {
    if (!inicioReproduciendo) return
    const timer = window.setTimeout(() => setInicioActual((i) => (i + 1) % imagenes.length), 6500)
    return () => window.clearTimeout(timer)
  }, [inicioActual, inicioReproduciendo])
  const imagenInicio = imagenes[inicioActual]
  const cambiarInicio = (paso: number) => setInicioActual((i) => (i + paso + imagenes.length) % imagenes.length)
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
    <dialog ref={visorRifa} className="raffle-lightbox" aria-label="Imagen ampliada de los lotes de la rifa" onCancel={() => setImagenAmpliada(null)} onClose={() => setImagenAmpliada(null)} onClick={(e) => { if (e.target === e.currentTarget) setImagenAmpliada(null) }} onKeyDown={(e) => { if (e.key === 'ArrowLeft') { e.preventDefault(); cambiarImagenAmpliada(-1) } if (e.key === 'ArrowRight') { e.preventDefault(); cambiarImagenAmpliada(1) } }}>
      <button type="button" className="raffle-lightbox-close" onClick={() => setImagenAmpliada(null)} autoFocus aria-label="Cerrar imagen ampliada">Cerrar ×</button>
      <button type="button" className="raffle-lightbox-arrow raffle-lightbox-prev" aria-label="Imagen anterior" onClick={() => cambiarImagenAmpliada(-1)}>←</button>
      <AnimatePresence mode="wait">
        {imagenAmpliada !== null && <motion.img
          key={imagenesRifa[imagenAmpliada]}
          src={imagenesRifa[imagenAmpliada]}
          alt={`Lotes que participan en la rifa de Riviera del Sol, imagen ${imagenAmpliada + 1} ampliada`}
          initial={{ opacity: 0, scale: reducirMovimiento ? 1 : 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: reducirMovimiento ? 1 : 0.98 }}
          transition={{ duration: reducirMovimiento ? 0 : 0.25, ease: 'easeInOut' }}
        />}
      </AnimatePresence>
      <button type="button" className="raffle-lightbox-arrow raffle-lightbox-next" aria-label="Imagen siguiente" onClick={() => cambiarImagenAmpliada(1)}>→</button>
      <span className="raffle-lightbox-count" aria-live="polite">{imagenAmpliada !== null ? `${imagenAmpliada + 1} / ${imagenesRifa.length}` : ''}</span>
    </dialog>
    <main>
      <section id="top" className="hero-split">
        <div className="hero-grid">
          <motion.div {...entrada} className="hero-copy">
            <p className="hero-eyebrow"><span /> Aguascalientes · Residencial privado</p>
            <motion.h1 initial={{ opacity: 0, y: reducirMovimiento ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducirMovimiento ? 0 : 1.6, delay: reducirMovimiento ? 0 : 0.2, ease: suave }} className="hero-title">Riviera del <span>Sol.</span></motion.h1>
            <p className="hero-intro">Espacio para construir tu próximo hogar.</p>
            <p className="hero-description">Una propuesta residencial con terrenos de aproximadamente 500 m², áreas ajardinadas y un solo acceso controlado.</p>
            <div className="hero-actions"><a href="#plano" className="hero-primary inline-block">Explora el proyecto <span aria-hidden="true">↗</span></a><a href="#ubicacion" className="hero-secondary">Conoce la ubicación <span aria-hidden="true">→</span></a></div>
            <div className="hero-facts"><div><strong>500 <small>m²</small></strong><span>Superficie aproximada</span></div><div><strong>01</strong><span>Acceso controlado</span></div></div>
          </motion.div>
          <motion.figure {...entrada} transition={{ duration: reducirMovimiento ? 0 : 1.8, delay: reducirMovimiento ? 0 : 0.25, ease: suave }} className="hero-figure">
            <div role="region" aria-roledescription="carrusel" aria-label="Imágenes de inicio" onFocusCapture={() => setInicioEnfocado(true)} onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setInicioEnfocado(false) }} onKeyDown={(e) => { if (e.key === 'ArrowLeft') { e.preventDefault(); cambiarInicio(-1) } if (e.key === 'ArrowRight') { e.preventDefault(); cambiarInicio(1) } }}>
              <div className="hero-image-wrap hero-carousel-stage">
                <AnimatePresence initial={false}>
                  <motion.img key={imagenInicio.src} src={imagenInicio.src} alt={imagenInicio.titulo} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducirMovimiento ? 0 : 1.8, ease: 'easeInOut' }} className="hero-image" />
                </AnimatePresence>
                <button type="button" className="hero-carousel-arrow hero-carousel-prev" aria-label="Imagen anterior" onClick={() => cambiarInicio(-1)}>←</button>
                <button type="button" className="hero-carousel-arrow hero-carousel-next" aria-label="Imagen siguiente" onClick={() => cambiarInicio(1)}>→</button>
              </div>
              <div className="hero-carousel-controls">
                <div className="hero-carousel-dots">{imagenes.map((item, i) => <button type="button" key={item.src} aria-label={`Ver ${item.titulo}`} aria-pressed={i === inicioActual} onClick={() => setInicioActual(i)} />)}</div>
                {!reducirMovimiento && <button type="button" className="hero-carousel-pause" aria-pressed={inicioPausado} onClick={() => setInicioPausado((valor) => !valor)}>{inicioPausado ? 'Reanudar' : 'Pausar'}</button>}
              </div>
            </div>
            <figcaption><span aria-live={inicioReproduciendo ? 'off' : 'polite'}>{inicioActual + 1} / {imagenes.length} · {imagenInicio.titulo}</span><span>Imagen conceptual · Ilustrativa</span></figcaption>
          </motion.figure>
        </div>
        <div className="hero-bottom"><span>Un proyecto para imaginar lo que viene.</span><a href="#plano">Descubre Riviera del Sol <span aria-hidden="true">↓</span></a></div>
      </section>
      <motion.section {...entrada} id="plano" className="editorial-section project-section">
        <div className="project-split">
          <div className="project-visual">
            <figure className="hero-figure">
              <div role="region" aria-roledescription="carrusel" aria-label="Imágenes del proyecto" onFocusCapture={() => setEnfocado(true)} onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setEnfocado(false) }} onKeyDown={(e) => { if (e.key === 'ArrowLeft') { e.preventDefault(); cambiar(-1) } if (e.key === 'ArrowRight') { e.preventDefault(); cambiar(1) } }}>
                <div className="hero-image-wrap hero-carousel-stage">
                  <AnimatePresence initial={false}>
                    <motion.img key={imagen.src} src={imagen.src} alt={imagen.titulo} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducirMovimiento ? 0 : 1.8, ease: 'easeInOut' }} className="hero-image" />
                  </AnimatePresence>
                  <button type="button" className="hero-carousel-arrow hero-carousel-prev" aria-label="Imagen anterior" onClick={() => cambiar(-1)}>←</button>
                  <button type="button" className="hero-carousel-arrow hero-carousel-next" aria-label="Imagen siguiente" onClick={() => cambiar(1)}>→</button>
                </div>
                <div className="hero-carousel-controls">
                  <div className="hero-carousel-dots">{imagenes.map((item, i) => <button type="button" key={item.src} aria-label={`Ver ${item.titulo}`} aria-pressed={i === actual} onClick={() => setActual(i)} />)}</div>
                  {!reducirMovimiento && <button type="button" className="hero-carousel-pause" aria-pressed={pausado} onClick={() => setPausado((valor) => !valor)}>{pausado ? 'Reanudar' : 'Pausar'}</button>}
                </div>
              </div>
              <figcaption><span aria-live={reproduciendo ? 'off' : 'polite'}>{actual + 1} / {imagenes.length} · {imagen.titulo}</span><span>Imagen conceptual · Ilustrativa</span></figcaption>
            </figure>
            <p className="mt-4 text-sm text-piedra">Los rótulos de los renders son ilustrativos; las condiciones escritas de preventa se muestran abajo.</p>
          </div>
          <div className="project-copy">
            <p className="section-eyebrow">01 / El proyecto</p>
            <h2 className="mt-3 text-4xl font-semibold">Un lugar para imaginar tu futuro</h2>
            <p className="mt-5 max-w-3xl">La propuesta contempla aproximadamente 34 lotes de 500 m², calles internas y viviendas de una o dos plantas. La cantidad de lotes y sus superficies están sujetas al levantamiento topográfico y a la lotificación definitiva.</p>
            <div className="project-details">{[
              ['Todos los servicios', 'El desarrollo cuenta con todos los servicios.'],
              ['Un solo acceso controlado', 'Entrada única con portón y caseta, conforme al proyecto definitivo.'],
              ['Cerca perimetral', 'Zócalo bajo de mampostería clara, pilastras y paños de malla metálica electrosoldada verde oscuro.'],
              ['Viviendas propuestas', 'Una o dos plantas, patio trasero, frente ajardinado y espacio para uno o dos autos, sujeto a dimensiones y reglamentos.'],
            ].map(([titulo, texto], i) => <motion.article {...entrada} transition={{ duration: reducirMovimiento ? 0 : 1.25, delay: reducirMovimiento ? 0 : i * 0.16, ease: suave }} key={titulo} className="project-card"><span className="detail-number">0{i + 1}</span><h3 className="text-2xl font-semibold">{titulo}</h3><p className="mt-4">{texto}</p></motion.article>)}</div>
          </div>
        </div>
      </motion.section>
      <motion.section {...entrada} id="financiamiento" className="finance-section">
        <div className="mx-auto max-w-7xl"><p className="section-eyebrow">02 / Condiciones de preventa</p><h2 className="mt-3 text-4xl font-semibold">Tu terreno, paso a paso</h2><p className="mt-4">Los 6 primeros lotes participan en la rifa; los demás están disponibles en preventa. Precio por lote de aproximadamente 500 m². Sin intereses, sujeto a contrato.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[['$800,000', 'MXN · precio de preventa'], ['$240,000', 'MXN · enganche del 30%'], ['$560,000', 'MXN · saldo restante'], ['$10,000', 'MXN · 56 mensualidades']].map(([valor, etiqueta], i) => <motion.div {...entrada} transition={{ duration: reducirMovimiento ? 0 : 1.25, delay: reducirMovimiento ? 0 : i * 0.16, ease: suave }} key={valor} className="finance-card"><p className="text-3xl font-semibold text-azul">{valor}</p><p className="mt-2">{etiqueta}</p></motion.div>)}</div>
          <p className="mt-8">Precio fuera de preventa: <strong>$1,000,000 MXN por lote.</strong></p><p className="mt-3 max-w-4xl text-sm text-white/70">Este precio futuro no representa una garantía de plusvalía. Vigencia, disponibilidad, escrituración, impuestos, fechas y términos contractuales pendientes de definición. Referencia documental: proyecto revisado del 23 de octubre de 2026.</p>
        </div>
      </motion.section>
      <motion.section {...entrada} id="rifa" className="editorial-section raffle-section" aria-labelledby="rifa-titulo">
        <div className="raffle-inner">
          <div className="raffle-info">
          <div className="raffle-copy">
            <p className="section-eyebrow">03 / Rifa Riviera del Sol</p>
            <h2 id="rifa-titulo">Tu próximo terreno podría estar en un número.</h2>
            <p className="raffle-intro">Los primeros <strong>6 lotes</strong> de Riviera del Sol serán parte de una rifa, con <strong>500 números por lote.</strong></p>
            <div className="raffle-stats"><div><strong>06</strong><span>Lotes en la rifa</span></div><div><strong>500</strong><span>Números por lote</span></div></div>
          </div>
          <div className="raffle-ticket">
            <p className="section-eyebrow">Valor por número</p>
            <p className="raffle-price">$200 <span>USD</span></p>
            <div className="raffle-divider"><span>o</span></div>
            <p className="raffle-price">$4,000 <span>MXN</span></p>
            <p className="raffle-ticket-note">Un número para participar en la rifa de un lote.</p>
          </div>
          <p className="raffle-note">La fecha, las bases y la forma de adquirir los números se anunciarán próximamente.</p>
          </div>
          <div className="raffle-gallery">
            <h3 className="raffle-gallery-title">Conoce los lotes de la rifa</h3>
            <div className="raffle-images-grid">
              {imagenesRifa.map((src, i) => <motion.figure
                key={src}
                className="raffle-image-card"
                initial={{ opacity: 0, y: reducirMovimiento ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: reducirMovimiento ? 0 : 0.8, delay: reducirMovimiento ? 0 : i * 0.15, ease: suave }}
              >
                <button type="button" className="raffle-image-button" aria-label={`Ampliar imagen ${i + 1} de los lotes de la rifa`} aria-haspopup="dialog" onClick={() => setImagenAmpliada(i)}>
                  <img src={src} alt={`Lotes que participan en la rifa de Riviera del Sol, imagen ${i + 1}`} loading="lazy" />
                </button>
              </motion.figure>)}
            </div>
          </div>
        </div>
      </motion.section>
      <motion.section {...entrada} id="ubicacion" className="editorial-section location-section">
        <div className="location-split">
          <div className="location-copy">
            <p className="section-eyebrow">04 / Ubicación de referencia</p>
            <h2>Aguascalientes</h2>
            <p className="location-intro">Junto a la carretera estatal 108.</p>
            <p className="location-description">La propuesta de acceso sitúa el desarrollo junto a esta vía. El predio corresponde al polígono señalado en la documentación del proyecto; sus linderos y medidas exactas están pendientes de levantamiento topográfico.</p>
            <ul className="mt-6 space-y-3 text-base">
              <li><strong>Walmart</strong> a 10 minutos.</li>
              <li><strong>Centros comerciales</strong> cercanos.</li>
              <li><strong>Agencias de autos</strong> como BMW en la zona.</li>
            </ul>
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
      <motion.section {...entrada} id="contacto" className="contact-section"><div className="contact-inner"><div><p className="section-eyebrow">05 / El siguiente paso</p><h2 className="text-3xl font-semibold">Información de ventas</h2><p className="mt-4 max-w-2xl">Contáctanos para consultar disponibilidad y conocer los términos de preventa.</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a href="tel:+523922158412" className="contact-link">México: +52 392 215 8412 <span aria-hidden="true">↗</span></a>
              <a href="tel:+19369669202" className="contact-link">USA: +1 936 966 9202 <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="deposit-card min-w-0 rounded border border-[#b99d7040] bg-[#fffdf780] p-6">
            <h3 className="text-xl font-semibold">Datos para depósito</h3>
            <h4 className="mt-4 font-semibold">México</h4>
            <p className="mt-3">Banco Azteca</p>
            <p className="mt-2 break-words text-xl font-semibold tabular-nums" aria-label="Número para depósitos">4027 6600 7393 9318</p>
            <div className="mt-6 border-t border-[#b99d7040] pt-4">
              <h4 className="font-semibold">USA</h4>
              <p className="mt-3">Responsable: Lic. Carlos Zúñiga Hernández</p>
              <dl className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <dt>Chime Bank</dt>
                  <dd className="mt-1 break-words text-xl font-semibold tabular-nums">156141278499</dd>
                </div>
                <div>
                  <dt>PNC Bank</dt>
                  <dd className="mt-1 break-words text-xl font-semibold tabular-nums">3175587054</dd>
                </div>
                <div>
                  <dt>Zelle</dt>
                  <dd className="mt-1 break-words text-xl font-semibold tabular-nums">9369669202</dd>
                </div>
              </dl>
            </div>
          </div></div></motion.section>
    </main>
    <footer className="site-footer"><div className="footer-inner"><div><a href="#top" className="footer-brand">Riviera del Sol<span>RESIDENCIAL PRIVADO · AGUASCALIENTES</span></a><p className="footer-note">Propuesta conceptual. Las imágenes no sustituyen planos aprobados. Lotificación, acceso, vialidades y permisos pendientes de validación.</p></div><nav aria-label="Navegación del pie de página"><a href="#plano">El proyecto ↗</a><a href="#ubicacion">Ubicación ↗</a><a href="#top">Volver al inicio ↑</a></nav></div><div className="footer-bottom"><span>Un espacio para tu próximo hogar.</span><span>Proyecto conceptual · Riviera del Sol</span></div></footer>
  </MotionConfig>
}













