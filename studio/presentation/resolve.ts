import {
  defineLocations,
  defineDocuments,
  type DocumentLocationResolvers,
} from 'sanity/presentation'
import {LANGUAGES} from '../lib/languages'

// El front usa @nuxtjs/i18n con strategy: 'prefix', así que TODAS las rutas
// llevan prefijo de idioma (/es, /eu, /en). Cada documento existe por tanto en
// tantas URLs como idiomas haya.
const LOCALES = LANGUAGES.map(({id}) => id)

/** Una localización por idioma para una ruta ya construida (sin prefijo). */
function perLocale(title: string, path: string) {
  return LOCALES.map((locale) => ({
    title: `${title} · ${locale.toUpperCase()}`,
    href: `/${locale}${path}`,
  }))
}

/**
 * Localizaciones para los tipos con slug. Si aún no hay slug no hay URL válida,
 * así que se avisa en vez de enlazar a un 404.
 */
function slugLocations(segment: string, fallbackTitle: string) {
  return defineLocations({
    select: {title: 'title', slug: 'slug.current'},
    resolve: (doc) => {
      if (!doc?.slug) {
        return {
          message: 'Añade un slug para poder previsualizar este documento.',
          tone: 'caution',
        }
      }
      return {locations: perLocale(doc.title || fallbackTitle, `/${segment}/${doc.slug}`)}
    },
  })
}

export const locations: DocumentLocationResolvers = {
  homePage: defineLocations({
    select: {},
    resolve: () => ({locations: perLocale('Página de inicio', '')}),
  }),

  visionsPage: defineLocations({
    select: {},
    resolve: () => ({locations: perLocale('Visiones de futuro', '/ejes')}),
  }),

  agendaPage: defineLocations({
    select: {},
    resolve: () => ({locations: perLocale('Agenda', '/eventos')}),
  }),

  processesPage: defineLocations({
    select: {},
    resolve: () => ({locations: perLocale('Procesos finalizados', '/procesos')}),
  }),

  // siteSettings alimenta el header y el footer, presentes en todas las
  // páginas; se previsualiza sobre la home.
  siteSettings: defineLocations({
    select: {},
    resolve: () => ({
      locations: perLocale('Página de inicio', ''),
      message: 'Estos ajustes se ven en el header y el footer de todas las páginas.',
    }),
  }),

  vision: slugLocations('ejes', 'Eje'),
  process: slugLocations('procesos', 'Proceso'),
  event: slugLocations('eventos', 'Evento'),
}

/**
 * Camino inverso: al navegar por el iframe, indica qué documento corresponde a
 * la URL abierta para que el Studio lo seleccione automáticamente.
 * `:locale` absorbe el prefijo de idioma, que no distingue documento.
 */
export const mainDocuments = defineDocuments([
  {route: '/:locale', type: 'homePage'},
  {route: '/:locale/ejes', type: 'visionsPage'},
  {route: '/:locale/eventos', type: 'agendaPage'},
  {route: '/:locale/procesos', type: 'processesPage'},
  {
    route: '/:locale/ejes/:slug',
    filter: `_type == "vision" && slug.current == $slug`,
  },
  {
    route: '/:locale/procesos/:slug',
    filter: `_type == "process" && slug.current == $slug`,
  },
  {
    route: '/:locale/eventos/:slug',
    filter: `_type == "event" && slug.current == $slug`,
  },
])
