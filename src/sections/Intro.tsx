import { SITE } from '@/config'
import { TituloSeccion } from '@/components/TituloSeccion'

interface Props {
  totalLotes: number
}

export function Intro({ totalLotes }: Props) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-24 text-center sm:px-8 sm:py-28">
      <TituloSeccion>Un lugar para quedarte</TituloSeccion>
      <p className="mx-auto mt-12 max-w-3xl text-xl font-light leading-9 text-foreground sm:text-2xl sm:leading-10">
        {SITE.nombre} es un fraccionamiento cerrado de {totalLotes} lotes que conserva la seguridad y
        la tranquilidad de sus vecinos. Un parque central ordena el acceso y la circulación, y tú
        decides cómo y cuándo construir tu casa.
      </p>
    </section>
  )
}
