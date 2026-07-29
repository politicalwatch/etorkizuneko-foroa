import { SITE_SETTINGS_QUERY } from '~/queries/siteSettings'

// Ajustes globales del sitio. useSanityQuery cachea por clave, así que se puede
// llamar desde varios componentes (header, footer…) sin refetch.
export function useSiteSettings() {
  return useSanityQuery(SITE_SETTINGS_QUERY)
}
