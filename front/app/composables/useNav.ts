// Navegación principal del sitio, compartida por header y footer.
// Rutas sin prefijo de idioma: NuxtLinkLocale añade /es, /eu, /en.
export interface NavItem {
  key: string
  label: string
  to: string
}

export function useNav() {
  const { t } = useI18n()

  return computed<NavItem[]>(() => [
    { key: 'home', label: t('nav.home'), to: '/' },
    { key: 'visions', label: t('nav.visions'), to: '/ejes' },
    { key: 'processes', label: t('nav.processes'), to: '/procesos' },
    { key: 'agenda', label: t('nav.agenda'), to: '/eventos' }
  ])
}
