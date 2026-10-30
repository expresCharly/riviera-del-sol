import { useEffect, useState } from 'react'
import { SITE } from '@/config'
import { supabase } from '@/lib/supabase'

export type Estado = 'disponible' | 'apartado' | 'vendido'
export type Tipo = 'Interior' | 'Esquina' | 'Frente al parque'

export interface Lote {
  id: number
  numero: string
  /** Geometría dentro del plano SVG (viewBox 1000 × 620). */
  x: number
  y: number
  w: number
  h: number
  /** Medidas en metros. */
  frente: number
  fondo: number
  area: number
  tipo: Tipo
  estado: Estado
  precio: number
}

interface Crudo {
  x: number
  y: number
  w: number
  h: number
  /** 'h': el frente es el lado ancho; 'v': el frente es el lado alto. */
  orient: 'h' | 'v'
  tipo: Tipo
}

const crudos: Crudo[] = []

// Fila superior (de izquierda a derecha)
for (let i = 0; i < 11; i++) {
  crudos.push({
    x: 60 + i * 80,
    y: 60,
    w: 80,
    h: 90,
    orient: 'h',
    tipo: i === 0 || i === 10 ? 'Esquina' : 'Interior',
  })
}
// Columna derecha (de arriba abajo)
for (let i = 0; i < 5; i++) {
  crudos.push({ x: 850, y: 160 + i * 60, w: 90, h: 60, orient: 'v', tipo: 'Interior' })
}
// Fila inferior (de derecha a izquierda)
for (let i = 10; i >= 0; i--) {
  crudos.push({
    x: 60 + i * 80,
    y: 470,
    w: 80,
    h: 90,
    orient: 'h',
    tipo: i === 0 || i === 10 ? 'Esquina' : 'Interior',
  })
}
// Columna izquierda (de abajo arriba)
for (let i = 4; i >= 0; i--) {
  crudos.push({ x: 60, y: 160 + i * 60, w: 90, h: 60, orient: 'v', tipo: 'Interior' })
}
// Bloque interior izquierdo
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 2; c++) {
    crudos.push({
      x: 210 + c * 85,
      y: 190 + r * 60,
      w: 85,
      h: 60,
      orient: 'v',
      tipo: c === 1 ? 'Frente al parque' : r === 0 || r === 3 ? 'Esquina' : 'Interior',
    })
  }
}
// Bloque interior derecho
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 2; c++) {
    crudos.push({
      x: 620 + c * 85,
      y: 190 + r * 60,
      w: 85,
      h: 60,
      orient: 'v',
      tipo: c === 0 ? 'Frente al parque' : r === 0 || r === 3 ? 'Esquina' : 'Interior',
    })
  }
}

// Estados de ejemplo
const vendidos = new Set([2, 3, 9, 15, 19, 22, 24, 30, 34, 38, 45])
const apartados = new Set([5, 12, 21, 27, 36, 41, 47])

const FACTOR: Record<Tipo, number> = {
  Interior: 1,
  Esquina: 1.04,
  'Frente al parque': 1.06,
}

export const LOTES_BASE: Lote[] = crudos.map((c, i) => {
  const id = i + 1
  const frente = c.orient === 'h' ? c.w / 8 : c.h / 6
  const fondo = c.orient === 'h' ? c.h / 3.75 : c.w / 3.75
  const area = Math.round(frente * fondo)
  const precio = Math.round((area * SITE.precioM2 * FACTOR[c.tipo]) / 1000) * 1000
  return {
    id,
    numero: String(id),
    x: c.x,
    y: c.y,
    w: c.w,
    h: c.h,
    frente: Math.round(frente * 10) / 10,
    fondo: Math.round(fondo * 10) / 10,
    area,
    tipo: c.tipo,
    estado: vendidos.has(id) ? 'vendido' : apartados.has(id) ? 'apartado' : 'disponible',
    precio,
  }
})

interface FilaLote {
  numero: string
  estado: Estado
  precio: number | string
  area: number | string
}

/**
 * Devuelve los lotes. Si Supabase está configurado, sobrescribe estado, precio
 * y superficie con lo que haya en la tabla `lotes`; la geometría vive aquí.
 */
export function useLotes() {
  const [lotes, setLotes] = useState<Lote[]>(LOTES_BASE)

  useEffect(() => {
    if (!supabase) return
    let activo = true
    supabase
      .from('lotes')
      .select('numero, estado, precio, area')
      .then(({ data, error }) => {
        if (!activo || error || !data) return
        const filas = data as FilaLote[]
        setLotes((prev) =>
          prev.map((l) => {
            const f = filas.find((x) => x.numero === l.numero)
            return f
              ? { ...l, estado: f.estado, precio: Number(f.precio), area: Number(f.area) }
              : l
          }),
        )
      })
    return () => {
      activo = false
    }
  }, [])

  return lotes
}
