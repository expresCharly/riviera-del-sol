import type { Lote } from '@/lib/lotes'
import { cumpleFiltros, type Filtros } from '@/lib/filtros'
import { formatoMXN } from '@/lib/utils'
import { TituloSeccion } from '@/components/TituloSeccion'

interface Props {
  lotes: Lote[]
  filtros: Filtros
  seleccionadoId: number | null
  onSeleccionar: (id: number) => void
}

const PUNTO: Record<Lote['estado'], string> = {
  disponible: 'bg-azul',
  apartado: 'bg-estaca',
  vendido: 'bg-piedra',
}

export function ListaLotes({ lotes, filtros, seleccionadoId, onSeleccionar }: Props) {
  const visibles = lotes.filter((l) => cumpleFiltros(l, filtros))

  return (
    <section id="lotes" className="bg-papel">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <TituloSeccion>Todos los lotes</TituloSeccion>
        <p className="mt-6 text-center text-muted-foreground">
          {visibles.length} {visibles.length === 1 ? 'lote' : 'lotes'} con los filtros actuales
        </p>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-[15px]">
            <caption className="sr-only">Lotes con superficie, medidas, ubicación, precio y estado</caption>
            <thead>
              <tr className="border-b-2 border-tinta text-sm text-muted-foreground">
                <th scope="col" className="py-3 pr-4 font-medium">Lote</th>
                <th scope="col" className="py-3 pr-4 font-medium">Superficie</th>
                <th scope="col" className="py-3 pr-4 font-medium">Frente × fondo</th>
                <th scope="col" className="py-3 pr-4 font-medium">Ubicación</th>
                <th scope="col" className="py-3 pr-4 text-right font-medium">Precio</th>
                <th scope="col" className="py-3 pl-6 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((l) => (
                <tr
                  key={l.id}
                  className={`cursor-pointer border-b border-border transition-colors hover:bg-hielo ${
                    l.id === seleccionadoId ? 'bg-hielo' : ''
                  }`}
                  onClick={() => {
                    onSeleccionar(l.id)
                    document.getElementById('plano')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <th scope="row" className="py-3 pr-4 font-semibold">
                    <button
                      type="button"
                      className="underline-offset-4 hover:underline"
                      aria-label={`Ver lote ${l.numero} en el plano`}
                    >
                      {l.numero}
                    </button>
                  </th>
                  <td className="py-3 pr-4">{l.area} m²</td>
                  <td className="py-3 pr-4">
                    {l.frente} × {l.fondo} m
                  </td>
                  <td className="py-3 pr-4">{l.tipo}</td>
                  <td className="py-3 pr-4 text-right font-medium tabular-nums">{formatoMXN(l.precio)}</td>
                  <td className="py-3 pl-6">
                    <span className="inline-flex items-center gap-2 capitalize">
                      <span className={`size-2.5 rounded-full ${PUNTO[l.estado]}`} />
                      {l.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibles.length === 0 && (
            <p className="py-10 text-muted-foreground">
              Ningún lote coincide con estos filtros. Prueba con “Todos” o “Cualquiera”.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
