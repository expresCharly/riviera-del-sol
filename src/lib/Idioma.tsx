import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { idiomaGuia } from './idiomaGuia'
import ingles from './traducciones.en.json'

type Idioma = 'es' | 'en'
const Contexto = createContext<{ idioma: Idioma; setIdioma: (idioma: Idioma) => void; t: (texto: string) => string } | null>(null)

export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [idioma, guardarIdioma] = useState<Idioma>(() => {
    try {
      const guardado = localStorage.getItem('riviera-guia-idioma')
      if (guardado === 'es' || guardado === 'en') return guardado
    } catch { /* La selección funciona sin almacenamiento. */ }
    return idiomaGuia(navigator.languages?.length ? navigator.languages : [navigator.language])
  })
  const setIdioma = (nuevo: Idioma) => {
    guardarIdioma(nuevo)
    try { localStorage.setItem('riviera-guia-idioma', nuevo) } catch { /* Solo esta visita. */ }
  }
  const t = (texto: string) => {
    const traduccion = (ingles as Record<string, string>)[texto.trim()]
    return idioma === 'en' && traduccion ? texto.replace(texto.trim(), traduccion) : texto
  }
  useEffect(() => {
    document.documentElement.lang = idioma
    document.title = idioma === 'en' ? 'Riviera del Sol | Residential lots' : 'Riviera del Sol | Terrenos residenciales'
    document.querySelector('meta[name="description"]')?.setAttribute('content', idioma === 'en'
      ? 'Discover Riviera del Sol in Aguascalientes: explore the residential proposal, presale terms, location and contact information.'
      : 'Descubre Riviera del Sol en Aguascalientes: conoce la propuesta residencial, las condiciones de preventa, la ubicación y los datos de contacto.')
  }, [idioma])
  return <Contexto.Provider value={{ idioma, setIdioma, t }}>{children}</Contexto.Provider>
}

export function useIdioma() {
  const contexto = useContext(Contexto)
  if (!contexto) throw new Error('Falta IdiomaProvider')
  return contexto
}
