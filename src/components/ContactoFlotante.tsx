import { Mail, MessageCircle, Phone } from 'lucide-react'
import { SITE } from '@/config'
import { whatsappUrl } from '@/components/LotePanel'

const clase =
  'flex size-12 items-center justify-center rounded-full bg-azul text-white shadow-lg shadow-azul-hondo/30 ring-2 ring-white/80 transition hover:bg-azul-claro sm:size-14'

/** Botones fijos en el borde derecho, como atajo de contacto desde cualquier sección. */
export function ContactoFlotante() {
  return (
    <div className="fixed bottom-4 right-3 z-30 flex flex-col gap-3 sm:bottom-auto sm:right-4 sm:top-1/2 sm:-translate-y-1/2">
      <a
        href={whatsappUrl(`Hola, quiero información de ${SITE.nombre}.`)}
        target="_blank"
        rel="noreferrer"
        aria-label="Escribir por WhatsApp"
        className={clase}
      >
        <MessageCircle className="size-6" />
      </a>
      <a href={`tel:${SITE.telefono.replace(/\s/g, '')}`} aria-label="Llamar por teléfono" className={clase}>
        <Phone className="size-6" />
      </a>
      <a href={`mailto:${SITE.correo}`} aria-label="Enviar un correo" className={`${clase} hidden sm:flex`}>
        <Mail className="size-6" />
      </a>
    </div>
  )
}
