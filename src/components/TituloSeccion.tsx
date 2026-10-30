import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  /** Para fondos oscuros. */
  claro?: boolean
  /** Alineado a la izquierda en lugar de centrado. */
  izquierda?: boolean
  className?: string
}

/** Título de sección: mayúsculas ligeras con mucho espaciado y una línea fina debajo. */
export function TituloSeccion({ children, claro, izquierda, className }: Props) {
  return (
    <div className={cn(izquierda ? 'text-left' : 'text-center', className)}>
      <h2
        className={cn(
          'font-display text-3xl font-light uppercase tracking-[0.2em] sm:text-4xl',
          claro ? 'text-white' : 'text-foreground',
        )}
      >
        {children}
      </h2>
      <div
        aria-hidden
        className={cn(
          'mt-5 h-px w-56 max-w-full',
          izquierda ? '' : 'mx-auto',
          claro ? 'bg-white/45' : 'bg-tinta/35',
        )}
      />
    </div>
  )
}
