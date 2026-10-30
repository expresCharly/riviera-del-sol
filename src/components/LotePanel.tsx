import { AnimatePresence, motion } from 'motion/react'
import { MessageCircle } from 'lucide-react'
import { SITE } from '@/config'
import { formatoMXN } from '@/lib/utils'
import type { Lote } from '@/lib/lotes'
import { Button } from '@/components/ui/button'

interface Props {
  lote: Lote | null
  onPedirInfo: (numero: string) => void
}

const TEXTO_ESTADO: Record<Lote['estado'], string> = {
  disponible: 'Disponible',
  apartado: 'Apartado',
  vendido: 'Vendido',
}

const PUNTO: Record<Lote['estado'], string> = {
  disponible: 'bg-azul',
  apartado: 'bg-estaca',
  vendido: 'bg-piedra',
}

export function whatsappUrl(texto: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(texto)}`
}

export function LotePanel({ lote, onPedirInfo }: Props) {
  return (
    <div aria-live="polite" className="min-h-[24rem] rounded-control bg-white p-6 text-foreground">
      <AnimatePresence mode="wait" initial={false}>
        {lote ? (
          <motion.div
            key={lote.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-3xl font-semibold">Lote {lote.numero}</h2>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <span className={`size-2.5 rounded-full ${PUNTO[lote.estado]}`} />
                {TEXTO_ESTADO[lote.estado]}
              </span>
            </div>

            <p className="mt-5 font-display text-6xl font-semibold leading-none tracking-tight">
              {lote.area}
              <span className="ml-1.5 text-2xl font-medium text-muted-foreground">m²</span>
            </p>

            <dl className="mt-6 divide-y divide-border border-y border-border text-[15px]">
              <div className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">Frente por fondo</dt>
                <dd className="font-medium">
                  {lote.frente} × {lote.fondo} m
                </dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">Ubicación</dt>
                <dd className="font-medium">{lote.tipo}</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">Precio por m²</dt>
                <dd className="font-medium">{formatoMXN(Math.round(lote.precio / lote.area))}</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">Precio del lote</dt>
                <dd className="text-lg font-semibold">{formatoMXN(lote.precio)}</dd>
              </div>
            </dl>

            {lote.estado === 'vendido' ? (
              <p className="mt-6 text-[15px] text-muted-foreground">
                Este lote ya se vendió. Elige uno disponible en el plano o pregúntanos por opciones
                parecidas.
              </p>
            ) : (
              <div className="mt-6 flex flex-col gap-2.5">
                <Button onClick={() => onPedirInfo(lote.numero)} className="flex-1">
                  Pedir información
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <a
                    href={whatsappUrl(`Hola, me interesa el lote ${lote.numero} de ${SITE.nombre}.`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle /> WhatsApp
                  </a>
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="vacio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-semibold">Elige un lote</h2>
            <p className="mt-3 max-w-xs text-muted-foreground">
              Toca cualquier lote del plano para ver su superficie, sus medidas y su precio.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
