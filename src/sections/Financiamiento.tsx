import { useState } from 'react'
import { SITE } from '@/config'
import type { Lote } from '@/lib/lotes'
import { formatoMXN } from '@/lib/utils'
import { Label, Select } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '@/components/ui/button'
import { TituloSeccion } from '@/components/TituloSeccion'

interface Props {
  lotes: Lote[]
  onPedirInfo: (numero: string) => void
}

export function Financiamiento({ lotes, onPedirInfo }: Props) {
  const disponibles = lotes.filter((l) => l.estado === 'disponible')
  const [numero, setNumero] = useState(disponibles[0]?.numero ?? '')
  const [enganche, setEnganche] = useState<number>(SITE.financiamiento.engancheMin + 10)
  const [plazo, setPlazo] = useState<string>('36')

  const lote = disponibles.find((l) => l.numero === numero) ?? disponibles[0]
  if (!lote) return null

  const montoEnganche = Math.round((lote.precio * enganche) / 100)
  const mensualidad = Math.round((lote.precio - montoEnganche) / Number(plazo))

  return (
    <section id="financiamiento" className="bg-azul-hondo text-papel">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:gap-24">
        <div>
          <TituloSeccion claro izquierda>
            Calcula tu mensualidad
          </TituloSeccion>
          <p className="mt-8 max-w-md text-papel/75">
            Elige un lote, cuánto das de enganche y en cuántos meses quieres pagar. Es una
            simulación sin intereses para darte una idea; las condiciones finales se confirman con
            ventas.
          </p>

          <div className="mt-10 space-y-8">
            <div>
              <Label htmlFor="sim-lote" className="text-papel">
                Lote
              </Label>
              <Select
                id="sim-lote"
                value={lote.numero}
                onChange={(e) => setNumero(e.target.value)}
                className="border-papel/30 bg-azul-claro/40 text-papel"
              >
                {disponibles.map((l) => (
                  <option key={l.id} value={l.numero} className="text-tinta">
                    Lote {l.numero}: {l.area} m², {formatoMXN(l.precio)}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <Label htmlFor="sim-enganche" className="text-papel">
                  Enganche
                </Label>
                <span className="text-sm text-papel/75">
                  {enganche} % · {formatoMXN(montoEnganche)}
                </span>
              </div>
              <Slider
                id="sim-enganche"
                min={SITE.financiamiento.engancheMin}
                max={SITE.financiamiento.engancheMax}
                step={5}
                value={[enganche]}
                onValueChange={([v]) => setEnganche(v)}
                aria-label="Porcentaje de enganche"
              />
            </div>

            <div>
              <Label className="text-papel">Plazo</Label>
              <ToggleGroup
                type="single"
                value={plazo}
                onValueChange={(v) => v && setPlazo(v)}
                aria-label="Plazo en meses"
                className="bg-papel/10"
              >
                {SITE.financiamiento.plazos.map((p) => (
                  <ToggleGroupItem
                    key={p}
                    value={String(p)}
                    className="text-papel/75 hover:text-papel data-[state=on]:bg-papel data-[state=on]:text-tinta"
                  >
                    {p} meses
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end border-t-2 border-estaca pt-6" aria-live="polite">
          <p className="text-papel/75">Pagarías al mes</p>
          <p className="mt-2 font-display text-[clamp(3.2rem,8vw,6rem)] font-semibold leading-none tracking-tight tabular-nums">
            {formatoMXN(mensualidad)}
          </p>
          <p className="mt-5 max-w-sm text-papel/75">
            Durante {plazo} meses, después de un enganche de {formatoMXN(montoEnganche)} por el lote{' '}
            {lote.numero} ({lote.area} m²).
          </p>
          <Button variant="accent" size="lg" className="mt-8 self-start" onClick={() => onPedirInfo(lote.numero)}>
            Quiero esta opción
          </Button>
        </div>
      </div>
    </section>
  )
}
