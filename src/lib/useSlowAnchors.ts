import { useEffect } from 'react'

/** Consistent anchor timing, with cancellation when the visitor takes control. */
export function useSlowAnchors() {
  useEffect(() => {
    let frame = 0
    let headerHeight = 90
    const headerBar = document.querySelector<HTMLElement>('.header-inner')
    const measureHeader = () => {
      headerHeight = headerBar ? Math.ceil(headerBar.getBoundingClientRect().bottom) + 1 : 90
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`)
    }
    measureHeader()
    const observer = new ResizeObserver(measureHeader)
    if (headerBar) observer.observe(headerBar)
    window.addEventListener('resize', measureHeader)
    const cancel = () => cancelAnimationFrame(frame)
    const onKey = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) cancel()
    }
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!link || link.target === '_blank') return
      const hash = link.getAttribute('href')!
      const target = document.getElementById(hash.slice(1))
      if (!target) return
      event.preventDefault()
      cancel()
      const start = window.scrollY
      const end = Math.max(0, Math.min(target.getBoundingClientRect().top + start - headerHeight, document.documentElement.scrollHeight - window.innerHeight))
      const finish = () => {
        history.pushState(null, '', hash)
        const previous = target.getAttribute('tabindex')
        target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
        if (previous === null) target.removeAttribute('tabindex')
        else target.setAttribute('tabindex', previous)
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo({ top: end, behavior: 'instant' })
        finish()
        return
      }
      const duration = Math.min(2400, Math.max(1400, Math.abs(end - start) * 0.65))
      const began = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - began) / duration)
        const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
        window.scrollTo({ top: start + (end - start) * eased, behavior: 'instant' })
        if (progress < 1) frame = requestAnimationFrame(tick)
        else finish()
      }
      frame = requestAnimationFrame(tick)
    }
    document.addEventListener('click', onClick)
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('touchstart', cancel, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measureHeader)
      cancel()
      document.removeEventListener('click', onClick)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.removeEventListener('keydown', onKey)
    }
  }, [])
}


