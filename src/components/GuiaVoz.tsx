import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, RotateCcw } from 'lucide-react'
import guiones from '../../public/audio/guia/guiones.json'
import guionesEn from '../../public/audio/guia/guiones.en.json'
import { idiomaGuia } from '@/lib/idiomaGuia'

const textos = {
  es: { nombre: 'Guía de voz', activar: 'Activar guía de voz', silenciar: 'Silenciar guía', repetir: 'Escuchar sección', cargando: 'Cargando explicación…', escuchando: 'Escuchando explicación', error: 'No se pudo reproducir. Pulsa Escuchar sección para reintentar.', terminada: 'Explicación terminada', ayuda: 'La guía te acompaña al cambiar de sección.' },
  en: { nombre: 'Audio guide', activar: 'Enable audio guide', silenciar: 'Mute guide', repetir: 'Listen to section', cargando: 'Loading narration…', escuchando: 'Playing narration', error: 'Unable to play. Press Listen to section to try again.', terminada: 'Narration finished', ayuda: 'The guide follows you as you explore each section.' },
}

export function GuiaVoz() {
  const [idioma] = useState(() => idiomaGuia(navigator.languages?.length ? navigator.languages : [navigator.language]))
  const texto = textos[idioma]
  const audio = useRef<HTMLAudioElement>(null)
  const habilitada = useRef(false)
  const escuchadas = useRef(new Set<string>())
  const actual = useRef('top')
  const version = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [activa, setActiva] = useState(false)
  const [seccion, setSeccion] = useState('top')
  const [estado, setEstado] = useState('')

  function detener() {
    clearTimeout(timer.current)
    version.current++
    audio.current?.pause()
  }

  function reproducir(repetir = false) {
    const player = audio.current
    const id = actual.current
    if (!player || !habilitada.current || document.hidden || (!repetir && escuchadas.current.has(id))) return
    if (!repetir && !player.paused && player.getAttribute('src')?.endsWith(`/${id}.mp3`)) return
    detener()
    const intento = version.current
    player.src = `${import.meta.env.BASE_URL}audio/guia/${idioma === 'en' ? 'en/' : ''}${id}.mp3`
    setEstado(texto.cargando)
    player.play().then(() => {
      if (version.current === intento) setEstado(texto.escuchando)
    }).catch(() => {
      if (version.current === intento) setEstado(texto.error)
    })
  }

  // La misma referencia visual que la navegación, incluso en secciones muy altas.
  useEffect(() => {
    const secciones = guiones.map(({ id }) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    const actualizar = () => {
      const cabecera = document.querySelector('.header-inner')?.getBoundingClientRect().bottom ?? 90
      const referencia = cabecera + (window.innerHeight - cabecera) * 0.25
      let id = 'top'
      for (const elemento of secciones) {
        if (elemento.getBoundingClientRect().top <= referencia) id = elemento.id
      }
      if (id !== actual.current) {
        detener()
        actual.current = id
        setSeccion(id)
        setEstado('')
      }
      clearTimeout(timer.current)
      if (habilitada.current && !document.hidden) timer.current = setTimeout(() => reproducir(), 650)
    }
    const visibilidad = () => {
      detener()
      setEstado('')
      if (!document.hidden) actualizar()
    }
    actualizar()
    window.addEventListener('scroll', actualizar, { passive: true })
    window.addEventListener('resize', actualizar)
    document.addEventListener('visibilitychange', visibilidad)
    return () => {
      detener()
      window.removeEventListener('scroll', actualizar)
      window.removeEventListener('resize', actualizar)
      document.removeEventListener('visibilitychange', visibilidad)
    }
  }, [])

  function alternar() {
    habilitada.current = !habilitada.current
    setActiva(habilitada.current)
    if (habilitada.current) reproducir(true)
    else { detener(); setEstado('') }
  }

  const guion = (idioma === 'en' ? guionesEn : guiones).find(({ id }) => id === seccion)!
  return <aside className="voice-guide" aria-label={texto.nombre} lang={idioma}>
    <audio ref={audio} preload="none" onEnded={() => {
      escuchadas.current.add(actual.current)
      setEstado(texto.terminada)
    }} />
    {activa && <div className="voice-guide-detail">
      <strong>{guion.titulo}</strong>
      <p>{guion.texto}</p>
      <span role="status">{estado || texto.ayuda}</span>
      <button type="button" className="voice-guide-replay" onClick={() => reproducir(true)}><RotateCcw size={14} aria-hidden="true" /> {texto.repetir}</button>
    </div>}
    <button type="button" className="voice-guide-toggle" aria-pressed={activa} onClick={alternar}>
      {activa ? <VolumeX size={19} aria-hidden="true" /> : <Volume2 size={19} aria-hidden="true" />}
      {activa ? texto.silenciar : texto.activar}
    </button>
  </aside>
}
