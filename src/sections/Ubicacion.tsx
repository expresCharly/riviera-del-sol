import { ArrowUpRight, MapPin } from 'lucide-react'
import { SITE } from '@/config'
import { TituloSeccion } from '@/components/TituloSeccion'
import { Button } from '@/components/ui/button'

export function Ubicacion() {
  return (
    <section id="ubicacion" className="bg-papel">
      <div className="mx-auto max-w-6xl px-5 pt-24 sm:px-8">
        <TituloSeccion>Ubícanos</TituloSeccion>
        <p className="mx-auto mt-10 flex max-w-2xl items-start justify-center gap-3 text-center text-xl font-light">
          <MapPin className="mt-1 size-5 shrink-0 text-azul" aria-hidden />
          {SITE.direccion}
        </p>
        {SITE.mapsUrl && (
          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <a href={SITE.mapsUrl} target="_blank" rel="noreferrer">
                Abrir en Google Maps <ArrowUpRight />
              </a>
            </Button>
          </div>
        )}
      </div>

      {SITE.mapaEmbed ? (
        <iframe
          title={`Mapa de ubicación de ${SITE.nombre}`}
          src={SITE.mapaEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="mt-14 h-[28rem] w-full border-0"
        />
      ) : (
        <div className="mx-auto max-w-3xl px-5 pb-24 pt-14 sm:px-8">
          <h3 className="text-center text-lg font-semibold">Tiempo en auto a</h3>
          <ul className="mt-3 divide-y divide-border border-y border-border">
            {SITE.cercanias.map((c) => (
              <li key={c.lugar} className="flex items-baseline justify-between py-4">
                <span>{c.lugar}</span>
                <span className="font-display text-2xl font-semibold tabular-nums">
                  {c.minutos}
                  <span className="ml-1 text-base font-medium text-muted-foreground">min</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
