import { useState, type FormEvent } from 'react'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { SITE } from '@/config'
import { supabase } from '@/lib/supabase'
import type { Lote } from '@/lib/lotes'
import { whatsappUrl } from '@/components/LotePanel'
import { TituloSeccion } from '@/components/TituloSeccion'
import { Button } from '@/components/ui/button'
import { Input, Label, Select, Textarea } from '@/components/ui/input'

interface Props {
  lotes: Lote[]
  loteInteres: string
  onLoteInteres: (numero: string) => void
}

type Estado = 'editando' | 'enviando' | 'enviado' | 'error'

function Obligatorio() {
  return (
    <span aria-hidden className="ml-1 text-[#ff8a8a]">
      *
    </span>
  )
}

export function Contacto({ lotes, loteInteres, onLoteInteres }: Props) {
  const [estado, setEstado] = useState<Estado>('editando')
  const disponibles = lotes.filter((l) => l.estado !== 'vendido')

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const datos = new FormData(e.currentTarget)
    const nombre = `${String(datos.get('nombre') ?? '').trim()} ${String(datos.get('apellidos') ?? '').trim()}`.trim()
    const telefono = String(datos.get('telefono') ?? '').trim()
    const correo = String(datos.get('correo') ?? '').trim()
    const mensaje = String(datos.get('mensaje') ?? '').trim()

    // Sin Supabase configurado, la solicitud sale por WhatsApp.
    if (!supabase) {
      const lote = loteInteres ? ` Me interesa el lote ${loteInteres}.` : ''
      const texto = `Hola, soy ${nombre}.${lote} ${mensaje} Mi teléfono: ${telefono}. Mi correo: ${correo}`.trim()
      window.open(whatsappUrl(texto), '_blank', 'noreferrer')
      setEstado('enviado')
      return
    }

    setEstado('enviando')
    const { error } = await supabase.from('prospectos').insert({
      nombre,
      telefono,
      correo: correo || null,
      lote: loteInteres || null,
      mensaje: mensaje || null,
    })
    setEstado(error ? 'error' : 'enviado')
  }

  const filas = [
    { icono: Mail, titulo: 'Correo', texto: SITE.correo, href: `mailto:${SITE.correo}` },
    {
      icono: Phone,
      titulo: 'Teléfono',
      texto: SITE.telefono,
      href: `tel:${SITE.telefono.replace(/\s/g, '')}`,
    },
    { icono: MapPin, titulo: 'Oficinas', texto: SITE.oficinas },
    {
      icono: MessageCircle,
      titulo: 'WhatsApp',
      texto: SITE.whatsappVisible,
      href: whatsappUrl(`Hola, quiero información de ${SITE.nombre}.`),
    },
  ]

  return (
    <section id="contacto" className="bg-azul text-white">
      <div className="mx-auto grid max-w-6xl gap-16 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:gap-24">
        <div>
          <TituloSeccion claro izquierda>
            Contáctanos
          </TituloSeccion>
          <ul className="mt-14 space-y-8">
            {filas.map(({ icono: Icono, titulo, texto, href }) => (
              <li key={titulo} className="flex gap-5">
                <Icono className="mt-1 size-7 shrink-0" strokeWidth={1.5} aria-hidden />
                <div>
                  <p className="text-xl font-bold">{titulo}</p>
                  {href ? (
                    <a
                      href={href}
                      {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="text-lg font-light underline-offset-4 hover:underline"
                    >
                      {texto}
                    </a>
                  ) : (
                    <p className="text-lg font-light">{texto}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {estado === 'enviado' ? (
          <div className="self-start border-t-2 border-estaca pt-6" role="status">
            <h3 className="text-3xl font-bold">Recibimos tu solicitud</h3>
            <p className="mt-3 max-w-md text-lg font-light text-white/85">
              Te contactaremos pronto. Si quieres adelantar la plática, escríbenos por WhatsApp.
            </p>
            <Button variant="accent" className="mt-6" onClick={() => setEstado('editando')}>
              Enviar otra solicitud
            </Button>
          </div>
        ) : (
          <form onSubmit={enviar} className="space-y-5">
            <h3 className="font-display text-4xl font-bold">Déjanos tus datos</h3>
            <p className="text-sm text-white/65">
              Los campos marcados con <span className="text-[#ff8a8a]">*</span> son obligatorios
            </p>
            <div>
              <Label htmlFor="nombre" className="font-bold">
                Nombre
                <Obligatorio />
              </Label>
              <Input id="nombre" name="nombre" required autoComplete="given-name" className="h-12 border-transparent" />
            </div>
            <div>
              <Label htmlFor="apellidos" className="font-bold">
                Apellidos
                <Obligatorio />
              </Label>
              <Input id="apellidos" name="apellidos" required autoComplete="family-name" className="h-12 border-transparent" />
            </div>
            <div>
              <Label htmlFor="telefono" className="font-bold">
                Teléfono
                <Obligatorio />
              </Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                className="h-12 border-transparent"
              />
            </div>
            <div>
              <Label htmlFor="correo" className="font-bold">
                Correo electrónico
                <Obligatorio />
              </Label>
              <Input id="correo" name="correo" type="email" required autoComplete="email" className="h-12 border-transparent" />
            </div>
            <div>
              <Label htmlFor="lote" className="font-bold">
                Lote de interés
              </Label>
              <Select
                id="lote"
                value={loteInteres}
                onChange={(e) => onLoteInteres(e.target.value)}
                className="h-12 border-transparent text-tinta"
              >
                <option value="">Aún no lo decido</option>
                {disponibles.map((l) => (
                  <option key={l.id} value={l.numero}>
                    Lote {l.numero} ({l.area} m²{l.estado === 'apartado' ? ', apartado' : ''})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="mensaje" className="font-bold">
                Comentarios
              </Label>
              <Textarea id="mensaje" name="mensaje" className="border-transparent" />
            </div>
            <Button type="submit" variant="accent" size="lg" disabled={estado === 'enviando'} className="px-10 uppercase tracking-wide">
              {estado === 'enviando' ? 'Enviando…' : 'Enviar'}
            </Button>
            {estado === 'error' && (
              <p role="alert" className="text-sm text-[#ffb3b3]">
                No pudimos enviar tu solicitud. Inténtalo otra vez o escríbenos por WhatsApp.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
