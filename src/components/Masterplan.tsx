import { motion, useReducedMotion } from 'motion/react'
import type { Lote } from '@/lib/lotes'
import { cumpleFiltros, type Filtros } from '@/lib/filtros'

interface Props {
  lotes: Lote[]
  seleccionadoId: number | null
  filtros: Filtros
  onSeleccionar: (id: number) => void
}

const ARBOLES: [number, number, number][] = [
  [425, 215, 13],
  [470, 232, 10],
  [520, 212, 14],
  [572, 238, 11],
  [440, 275, 12],
  [500, 285, 15],
  [560, 290, 12],
  [418, 322, 10],
  [472, 330, 13],
  [530, 322, 10],
  [580, 335, 12],
  [430, 400, 9],
  [578, 405, 10],
]

const ETIQUETA: Record<Lote['estado'], string> = {
  disponible: 'disponible',
  apartado: 'apartado',
  vendido: 'vendido',
}

export function Masterplan({ lotes, seleccionadoId, filtros, onSeleccionar }: Props) {
  const reducir = useReducedMotion()
  // El lote seleccionado se dibuja al final para que su borde quede encima.
  const ordenados = [...lotes].sort(
    (a, b) => Number(a.id === seleccionadoId) - Number(b.id === seleccionadoId),
  )

  return (
    <svg
      viewBox="0 0 1000 620"
      role="group"
      aria-label="Plano de lotes. Elige un lote para ver sus medidas y su precio."
      className="h-auto w-full"
    >
      <defs>
        <pattern id="rayas" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#e6eaf3" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#aeb7cc" strokeWidth="2.5" />
        </pattern>
      </defs>

      {/* Calles */}
      <rect x="14" y="14" width="972" height="592" rx="30" fill="var(--color-calle)" />

      {/* Parque central */}
      <rect x="400" y="190" width="200" height="240" rx="16" fill="#c4d6c0" />
      {ARBOLES.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#8fb08a" />
      ))}
      <rect x="440" y="352" width="120" height="58" rx="3" fill="#28367a" />
      <g stroke="#f7f9f5" strokeWidth="1.5" fill="none" opacity="0.9">
        <rect x="446" y="357" width="108" height="48" />
        <line x1="500" y1="357" x2="500" y2="405" />
        <line x1="446" y1="381" x2="554" y2="381" strokeDasharray="3 3" />
      </g>
      <text x="500" y="262" textAnchor="middle" fontSize="15" fontWeight="600" fill="#27513d" className="font-display">
        Parque central
      </text>
      <text x="500" y="428" textAnchor="middle" fontSize="12" fill="#27513d">
        Cancha de pádel
      </text>

      {/* Acceso */}
      <g>
        <rect x="448" y="578" width="104" height="26" rx="5" fill="#121a33" />
        <text x="500" y="596" textAnchor="middle" fontSize="13" fontWeight="600" fill="#f7f9f5">
          Acceso
        </text>
      </g>

      {/* Norte */}
      <g transform="translate(944 56)" fill="#121a33">
        <path d="M0 -20 L7 6 L0 1 L-7 6 Z" />
        <text y="22" textAnchor="middle" fontSize="12" fontWeight="600">
          N
        </text>
      </g>

      {/* Lotes */}
      {ordenados.map((l, i) => {
        const activo = cumpleFiltros(l, filtros)
        const seleccionado = l.id === seleccionadoId
        const fill =
          l.estado === 'disponible' ? '#28367a' : l.estado === 'apartado' ? '#e3a72f' : 'url(#rayas)'
        const colorTexto =
          l.estado === 'disponible' ? '#f7f9f5' : l.estado === 'apartado' ? '#121a33' : '#6b7390'
        const cx = l.x + l.w / 2
        const cy = l.y + l.h / 2
        return (
          <motion.g
            key={l.id}
            className="lote"
            role="button"
            tabIndex={0}
            aria-label={`Lote ${l.numero}, ${l.area} metros cuadrados, ${ETIQUETA[l.estado]}`}
            aria-pressed={seleccionado}
            onClick={() => onSeleccionar(l.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSeleccionar(l.id)
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reducir ? 0 : 0.45, delay: reducir ? 0 : 0.15 + i * 0.022 }}
          >
            <rect
              className="lote-forma"
              x={l.x + 2}
              y={l.y + 2}
              width={l.w - 4}
              height={l.h - 4}
              rx="3"
              fill={fill}
              stroke={l.estado === 'vendido' ? '#aeb7cc' : 'none'}
              strokeWidth="1"
              opacity={activo ? 1 : 0.18}
            />
            {seleccionado && (
              <rect
                x={l.x + 1}
                y={l.y + 1}
                width={l.w - 2}
                height={l.h - 2}
                rx="4"
                fill="none"
                stroke="#121a33"
                strokeWidth="3.5"
              />
            )}
            <rect
              className="lote-enfoque"
              x={l.x + 1}
              y={l.y + 1}
              width={l.w - 2}
              height={l.h - 2}
              rx="4"
              fill="none"
              stroke="none"
            />
            <text
              x={cx}
              y={cy + 5}
              textAnchor="middle"
              fontSize="15"
              fontWeight="600"
              fill={colorTexto}
              opacity={activo ? 1 : 0.2}
            >
              {l.numero}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )
}
