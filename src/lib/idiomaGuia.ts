/** Usa el primer idioma compatible en el orden de preferencia del navegador. */
export function idiomaGuia(preferencias: readonly string[]): 'es' | 'en' {
  for (const preferencia of preferencias) {
    const idioma = preferencia.toLowerCase().split(/[-_]/)[0]
    if (idioma === 'es' || idioma === 'en') return idioma
  }
  return 'en'
}
