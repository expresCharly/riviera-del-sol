import { SITE } from '@/config'

export function Footer() {
  return (
    <footer className="bg-azul-hondo text-papel/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2.5 font-display text-xl font-semibold text-papel">
            <span aria-hidden className="size-3 rotate-45 bg-estaca" />
            {SITE.nombre}
          </p>
          <p className="mt-2 text-sm">{SITE.lema}</p>
        </div>
        <div className="text-sm md:text-right">
          <p>
            <a href={`mailto:${SITE.correo}`} className="underline-offset-4 hover:underline">
              {SITE.correo}
            </a>
          </p>
          <p className="mt-3 max-w-md text-papel/60">
            Imágenes y plano ilustrativos. Precios y disponibilidad sujetos a cambio sin previo aviso.
          </p>
        </div>
      </div>
    </footer>
  )
}
