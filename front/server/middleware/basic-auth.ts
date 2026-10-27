// Acceso restringido TEMPORAL mientras el sitio no sea público: HTTP Basic Auth
// con un único usuario/contraseña definidos por entorno (ver .env.example).
// Para quitarlo, borrar este fichero y `runtimeConfig.basicAuth` en
// nuxt.config.ts; para desactivarlo sin tocar código, vaciar las variables.
//
// Lo que sirve directamente el CDN de Netlify (/_nuxt/*, /_fonts/*) no pasa
// por aquí: JS, CSS y fuentes quedan públicos, pero no llevan contenido.

// Cookie que pone /preview/enable de @nuxtjs/sanity. Su valor es un id
// aleatorio por build que solo conoce el servidor, así que si coincide la
// petición viene del Presentation del Studio y no se le pide contraseña: el
// navegador no siempre muestra el diálogo dentro del iframe.
const PREVIEW_COOKIE = 'sanity-preview-id'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  // Nuxt pasa las variables NUXT_* por `destr`: una contraseña como "1234"
  // llega como número y no casaría nunca con el string de la cabecera.
  const user = String(config.basicAuth.user ?? '')
  const password = String(config.basicAuth.password ?? '')

  if (!user || !password) return

  setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow')

  // /preview/enable valida su propio secreto contra Sanity antes de poner la cookie.
  if (event.path.startsWith('/preview/')) return

  const previewId = config.sanity?.visualEditing?.previewModeId
  if (previewId && getCookie(event, PREVIEW_COOKIE) === previewId) return

  const header = getRequestHeader(event, 'authorization') ?? ''
  if (header.startsWith('Basic ')) {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8')
    const separator = decoded.indexOf(':')
    if (decoded.slice(0, separator) === user && decoded.slice(separator + 1) === password) return
  }

  setResponseHeader(event, 'WWW-Authenticate', 'Basic realm="Etorkizuneko Foroa", charset="UTF-8"')
  throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
})
