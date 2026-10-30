import type { Lote, Tipo } from '@/lib/lotes'

export interface Filtros {
  estado: 'todos' | 'disponible'
  tipo: 'todos' | Tipo
}

export const FILTROS_INICIALES: Filtros = { estado: 'todos', tipo: 'todos' }

export function cumpleFiltros(l: Lote, f: Filtros) {
  if (f.estado === 'disponible' && l.estado !== 'disponible') return false
  if (f.tipo !== 'todos' && l.tipo !== f.tipo) return false
  return true
}
