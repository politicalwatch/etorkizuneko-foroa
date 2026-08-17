import { defineQuery } from 'groq'

// Procesos finalizados (/procesos): las conclusiones. La tarjeta no muestra
// estado ni fecha —todos están finalizados— sino el eje al que pertenece, que
// es además el criterio de filtrado de la página.
//
// El filtro por eje se resuelve en el cliente sobre este resultado: son pocos
// documentos y así un clic en una etiqueta no dispara otra petición.
//
// Proyecciones escritas enteras, sin `${...}` (ver la nota en queries/vision.ts).
export const PROCESSES_PAGE_QUERY = defineQuery(`{
  "page": *[_id == "processesPage"][0]{
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
    "lede": coalesce(lede[language == $lang][0].value, lede[language == "es"][0].value)
  },

  "processes": *[
    _type == "process"
    && status == "finished"
    && defined(slug.current)
  ]{
    _id,
    _type,
    "slug": slug.current,
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
    "subtitle": coalesce(subtitle[language == $lang][0].value, subtitle[language == "es"][0].value),
    mainImage,
    status,
    "visionSlug": vision->slug.current,
    "visionLabel": coalesce(
      vision->shortTitle[language == $lang][0].value,
      vision->shortTitle[language == "es"][0].value,
      vision->title[language == $lang][0].value,
      vision->title[language == "es"][0].value
    ),
    "date": coalesce(endDate, startDate, _createdAt)
  } | order(date desc),

  "visions": *[_type == "vision" && defined(slug.current)] | order(order asc){
    _id,
    "slug": slug.current,
    "label": coalesce(
      shortTitle[language == $lang][0].value,
      shortTitle[language == "es"][0].value,
      title[language == $lang][0].value,
      title[language == "es"][0].value
    )
  }
}`)
