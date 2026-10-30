import type { Lote, Tipo } from '@/lib/lotes'
import type { Filtros } from '@/lib/filtros'
import { Masterplan } from '@/components/Masterplan'
import { LotePanel } from '@/components/LotePanel'
import { TituloSeccion } from '@/components/TituloSeccion'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface Props {
  lotes: Lote[]
  seleccionadoId: number | null
  onSeleccionar: (id: number) => void
  filtros: Filtros
  onFiltros: (f: Filtros) => void
  onPedirInfo: (numero: string) => void
}

const claseGrupo = 'bg-white/10'
const claseItem = 'text-white/75 hover:text-white data-[state=on]:bg-white data-[state=on]:text-azul'

export function Plano({ lotes, seleccionadoId, onSeleccionar, filtros, onFiltros, onPedirInfo }: Props) {
  const conteo = {
    disponible: lotes.filter((l) => l.estado === 'disponible').length,
    apartado: lotes.filter((l) => l.estado === 'apartado').length,
    vendido: lotes.filter((l) => l.estado === 'vendido').length,
  }
  const lote = lotes.find((l) => l.id === seleccionadoId) ?? null

  return (
    <section
      id="plano"
      className="relative overflow-hidden bg-azul-hondo text-white"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 80% 20%, rgba(58,75,153,0.55), transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(40,54,122,0.5), transparent 50%)',
      }}
    >
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <TituloSeccion claro>Tu terreno</TituloSeccion>
        <p className="mx-auto mt-8 max-w-2xl text-center text-lg font-light text-white/80">
          Elige un lote en el plano para ver su superficie, sus medidas y su precio.
        </p>

        <div className="mt-14 grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-12">
          <div className="lg:col-start-1 lg:row-start-1">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Leyenda del plano">
              <li className="flex items-center gap-2">
                <span className="size-3.5 rounded-[3px] bg-azul-claro ring-1 ring-white/50" /> Disponible (
                {conteo.disponible})
              </li>
              <li className="flex items-center gap-2">
                <span className="size-3.5 rounded-[3px] bg-estaca" /> Apartado ({conteo.apartado})
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="size-3.5 rounded-[3px] ring-1 ring-white/40"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, #e6eaf3 0 3px, #aeb7cc 3px 4.5px)',
                  }}
                />
                Vendido ({conteo.vendido})
              </li>
            </ul>
            <div className="mt-5 space-y-2.5">
              <ToggleGroup
                type="single"
                value={filtros.estado}
                onValueChange={(v) => v && onFiltros({ ...filtros, estado: v as Filtros['estado'] })}
                aria-label="Filtrar por estado"
                className={claseGrupo}
              >
                <ToggleGroupItem value="todos" className={claseItem}>
                  Todos
                </ToggleGroupItem>
                <ToggleGroupItem value="disponible" className={claseItem}>
                  Disponibles
                </ToggleGroupItem>
              </ToggleGroup>
              <br />
              <ToggleGroup
                type="single"
                value={filtros.tipo}
                onValueChange={(v) => v && onFiltros({ ...filtros, tipo: v as 'todos' | Tipo })}
                aria-label="Filtrar por ubicación"
                className={claseGrupo}
              >
                <ToggleGroupItem value="todos" className={claseItem}>
                  Cualquiera
                </ToggleGroupItem>
                <ToggleGroupItem value="Esquina" className={claseItem}>
                  Esquina
                </ToggleGroupItem>
                <ToggleGroupItem value="Frente al parque" className={claseItem}>
                  Frente al parque
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="rounded-control bg-white/[0.07] p-2 ring-1 ring-white/15 sm:p-3">
              <Masterplan
                lotes={lotes}
                seleccionadoId={seleccionadoId}
                filtros={filtros}
                onSeleccionar={onSeleccionar}
              />
            </div>
            <p className="mt-3 text-sm text-white/60">
              Plano ilustrativo. Medidas y superficies sujetas a escrituración.
            </p>
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <LotePanel lote={lote} onPedirInfo={onPedirInfo} />
          </div>
        </div>
      </div>
    </section>
  )
}
