import { motion, type Variants } from 'motion/react'
import { SITE } from '@/config'
import { HeroFondo } from '@/components/HeroFondo'
import { Button } from '@/components/ui/button'

interface Props {
  superficieMinima: number
}

const contenedor: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const elemento: Variants = {
  oculto: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export function Hero({ superficieMinima }: Props) {
  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden bg-azul-hondo text-white">
      <HeroFondo />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-azul-hondo/85 via-azul-hondo/45 to-azul-hondo/5"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-azul-hondo/50 to-transparent" />

      <motion.div
        variants={contenedor}
        initial="oculto"
        animate="visible"
        className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-16 pt-32 sm:px-8 lg:pl-28"
      >
        <motion.svg
          variants={elemento}
          aria-hidden
          viewBox="0 0 120 56"
          className="h-12 w-28 text-estaca"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <path d="M2 14 C30 -2 52 30 78 14 S104 0 118 10" />
          <path d="M2 28 C30 12 52 44 78 28 S104 14 118 24" />
          <path d="M2 42 C30 26 52 58 78 42 S104 28 118 38" />
        </motion.svg>

        <motion.p
          variants={elemento}
          className="mt-5 font-display text-[clamp(3.6rem,10vw,7.5rem)] font-extralight uppercase leading-none tracking-[0.1em]"
        >
          {SITE.marca}
        </motion.p>
        <motion.p variants={elemento} className="mt-3 text-lg font-semibold uppercase tracking-[0.12em]">
          {SITE.lema}
        </motion.p>

        <motion.h1
          variants={elemento}
          className="mt-9 max-w-3xl font-display text-[clamp(1.9rem,3.8vw,3.3rem)] font-bold uppercase leading-[1.08] tracking-normal"
        >
          Elige el terreno donde vas a construir tu casa
        </motion.h1>
        <motion.p
          variants={elemento}
          className="mt-6 max-w-xl text-[15px] font-semibold uppercase italic leading-relaxed tracking-[0.12em] text-white/90"
        >
          Terrenos desde {superficieMinima} m² en una privada con vigilancia, parque central y cancha de
          pádel.
        </motion.p>
        <motion.div variants={elemento} className="mt-9">
          <Button asChild size="lg" className="bg-azul-claro px-8 uppercase tracking-wide hover:bg-azul">
            <a href="#plano">Ver el plano de lotes</a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
