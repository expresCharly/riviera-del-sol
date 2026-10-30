import { Droplets, Footprints, Lightbulb, Route, Shield, Sofa, Trees, Volleyball } from 'lucide-react'
import { SITE } from '@/config'
import { TituloSeccion } from '@/components/TituloSeccion'

const ICONOS = {
  shield: Shield,
  trees: Trees,
  racket: Volleyball,
  route: Route,
  lightbulb: Lightbulb,
  droplets: Droplets,
  footprints: Footprints,
  sofa: Sofa,
} as const

export function Amenidades() {
  return (
    <section className="bg-hielo">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <TituloSeccion>Amenidades</TituloSeccion>
        <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
          {SITE.amenidades.map((a) => {
            const Icono = ICONOS[a.icono]
            return (
              <li key={a.titulo} className="flex flex-col items-center text-center">
                <Icono className="size-14 text-azul" strokeWidth={1.1} aria-hidden />
                <span className="mt-5 text-lg font-light">{a.titulo}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
