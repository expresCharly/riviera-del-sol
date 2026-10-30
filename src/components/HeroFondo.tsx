import { useMemo } from 'react'
import { SITE } from '@/config'

function aleatorio(semilla: number) {
  let s = semilla
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const COLORES = ['#d8c8a8', '#c4ad88', '#a4916c', '#e3d6b8']

/**
 * Fondo de la portada. Con SITE.heroImagen muestra tu foto; sin ella, una
 * ilustración de paisaje con volúmenes de casa y pastos en primer plano.
 */
export function HeroFondo() {
  const pastos = useMemo(() => {
    const r = aleatorio(7)
    return Array.from({ length: 150 }, (_, i) => {
      const x = r() * 1600
      const alto = 120 + r() * 330
      const inclina = (r() - 0.5) * 140
      return {
        i,
        d: `M ${x} 920 Q ${x + inclina * 0.25} ${920 - alto * 0.6} ${x + inclina} ${920 - alto}`,
        ancho: 1.6 + r() * 2.6,
        color: COLORES[Math.floor(r() * COLORES.length)],
        opacidad: 0.35 + r() * 0.5,
        puntaX: x + inclina,
        puntaY: 920 - alto,
        giro: inclina / 3,
      }
    })
  }, [])

  if (SITE.heroImagen) {
    return <img src={SITE.heroImagen} alt="" className="absolute inset-0 size-full object-cover" />
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
    >
      <defs>
        <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b5ca3" />
          <stop offset="0.55" stopColor="#8aa8d3" />
          <stop offset="1" stopColor="#f0cfa8" />
        </linearGradient>
        <linearGradient id="muro" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9b79a" />
          <stop offset="1" stopColor="#a99274" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#cielo)" />
      <ellipse cx="1180" cy="640" rx="520" ry="150" fill="#fff4dc" opacity="0.35" />
      <path d="M0 640 C250 590 450 650 700 610 S1200 580 1600 630 V900 H0 Z" fill="#6d7fa6" opacity="0.7" />

      {/* Volúmenes de la casa */}
      <g>
        <rect x="860" y="250" width="300" height="470" fill="url(#muro)" />
        <rect x="840" y="236" width="340" height="22" fill="#4a3a2e" />
        <rect x="1160" y="330" width="260" height="390" fill="#b9a487" />
        <rect x="1140" y="316" width="300" height="20" fill="#4a3a2e" />
        <rect x="1420" y="410" width="220" height="310" fill="#a58e70" />
        <rect x="1400" y="396" width="240" height="18" fill="#4a3a2e" />
        <rect x="930" y="470" width="190" height="250" fill="#5a7ba6" opacity="0.85" />
        <rect x="1210" y="500" width="150" height="220" fill="#5a7ba6" opacity="0.8" />
      </g>

      <rect y="700" width="1600" height="220" fill="#8e7e63" />
      <rect y="700" width="1600" height="16" fill="#6e6049" opacity="0.6" />

      {pastos.map((p) => (
        <g key={p.i} opacity={p.opacidad}>
          <path d={p.d} fill="none" stroke={p.color} strokeWidth={p.ancho} strokeLinecap="round" />
          <ellipse
            cx={p.puntaX}
            cy={p.puntaY}
            rx="3.5"
            ry="16"
            fill={p.color}
            transform={`rotate(${p.giro} ${p.puntaX} ${p.puntaY})`}
          />
        </g>
      ))}
    </svg>
  )
}
