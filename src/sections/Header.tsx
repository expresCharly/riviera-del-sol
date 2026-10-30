import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { SITE } from '@/config'

const ENLACES = [
  { href: '#top', texto: 'Inicio' },
  { href: '#plano', texto: 'El proyecto' },
  { href: '#financiamiento', texto: 'Financiamiento' },
  { href: '#ubicacion', texto: 'Ubicación' },
]

export function Header() {
  const reducirMovimiento = useReducedMotion()
  const transicion = { duration: reducirMovimiento ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] as const }
  const [abierto, setAbierto] = useState(false)
  const boton = useRef<HTMLButtonElement>(null)
  const [activa, setActiva] = useState('#top')
  useEffect(() => {
    if (!abierto) return
    const cerrarFuera = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest('.site-header')) setAbierto(false)
    }
    const pantalla = window.matchMedia('(min-width: 901px)')
    const cerrarEscritorio = () => { if (pantalla.matches) setAbierto(false) }
    document.addEventListener('pointerdown', cerrarFuera)
    pantalla.addEventListener('change', cerrarEscritorio)
    return () => {
      document.removeEventListener('pointerdown', cerrarFuera)
      pantalla.removeEventListener('change', cerrarEscritorio)
    }
  }, [abierto])
  useEffect(() => {
    let frame = 0
    const secciones = [...ENLACES.map((enlace) => enlace.href), '#contacto']
      .map((href) => document.getElementById(href.slice(1)))
      .filter((seccion): seccion is HTMLElement => seccion !== null)
    const actualizar = () => {
      frame = 0
      const header = document.querySelector('.header-inner')?.getBoundingClientRect().bottom ?? 90
      const referencia = header + (window.innerHeight - header) * 0.25
      let id = 'top'
      for (const seccion of secciones) {
        if (seccion.getBoundingClientRect().top <= referencia) id = seccion.id
      }
      setActiva(`#${id}`)
    }
    const programar = () => {
      if (!frame) frame = requestAnimationFrame(actualizar)
    }
    actualizar()
    window.addEventListener('scroll', programar, { passive: true })
    window.addEventListener('resize', programar)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', programar)
      window.removeEventListener('resize', programar)
    }
  }, [])
  return (
    <header className="site-header" onKeyDown={(e) => { if (e.key === 'Escape') { setAbierto(false); boton.current?.focus() } }}>
      <div className="header-inner">
        <a href="#top" className="brand" aria-label={`${SITE.nombre}, inicio`} onClick={() => setAbierto(false)}>
          <svg aria-hidden="true" viewBox="0 0 48 48" fill="none" className="brand-symbol"><path d="M12 28a12 12 0 0 1 24 0M24 4v6M7 11l5 5M41 11l-5 5M3 27h5M40 27h5M8 34c8-6 16 6 24 0s10-2 12-1M8 41c8-6 16 6 24 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          <span><span className="brand-name">Riviera del Sol</span><span className="brand-caption">RESIDENCIAL PRIVADO</span></span>
        </a>
        <nav aria-label="Principal" className="desktop-nav">{ENLACES.map((e) => <a key={e.href} href={e.href} aria-current={activa === e.href ? 'location' : undefined}>{e.texto}{activa === e.href && <motion.span aria-hidden="true" layoutId="desktop-underline" className="nav-sliding-line" transition={transicion} />}</a>)}</nav>
        <a href="#contacto" aria-current={activa === '#contacto' ? 'location' : undefined} className="header-contact">Hablemos <span aria-hidden="true">↗</span>{activa === '#contacto' && <motion.span aria-hidden="true" layoutId="desktop-underline" className="nav-sliding-line" transition={transicion} />}</a>
        <button ref={boton} type="button" className="menu-toggle" aria-expanded={abierto} aria-controls="mobile-navigation" aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setAbierto(!abierto)}><span>{abierto ? 'Cerrar' : 'Menú'}</span><svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">{abierto ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 8h16M4 16h16" />}</svg></button>
      </div>
      <motion.nav initial={false} animate={{ opacity: abierto ? 1 : 0, y: abierto || reducirMovimiento ? 0 : -8 }} transition={transicion} id="mobile-navigation" aria-label="Navegación móvil" className="mobile-nav" hidden={!abierto}>{[...ENLACES, { href: '#contacto', texto: 'Contacto' }].map((e) => <a key={e.href} href={e.href} aria-current={activa === e.href ? 'location' : undefined} onClick={() => setAbierto(false)}><span className="mobile-link-label">{e.texto}{abierto && activa === e.href && <motion.span aria-hidden="true" layoutId="mobile-underline" className="nav-sliding-line" transition={transicion} />}</span><span aria-hidden="true">↗</span></a>)}</motion.nav>
    </header>
  )
}




