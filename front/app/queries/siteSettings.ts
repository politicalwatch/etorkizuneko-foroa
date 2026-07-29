import { defineQuery } from 'groq'

// Ajustes globales del sitio (singleton). siteTitle y logo NO son campos
// internacionalizados, así que no necesitan $lang.
export const SITE_SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]{
  siteTitle,
  "logoUrl": logo.asset->url
}`)
