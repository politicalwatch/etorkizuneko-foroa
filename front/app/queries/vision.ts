import { defineQuery } from 'groq'

// OJO: las proyecciones se escriben enteras, sin fragmentos interpolados. El
// TypeGen de Sanity analiza las queries estáticamente y salta las que llevan
// `${...}`, dejándolas sin tipo. Por eso la tarjeta de "Procesos relacionados"
// se repite aquí y en queries/process.ts en lugar de compartirse.
//
// Esa rejilla mezcla procesos y eventos, así que la proyección es común a los
// dos tipos: los campos que no existen en uno salen a null y el componente
// decide qué pinta. `rank` la ordena por urgencia (lo que aún se puede hacer,
// primero) en vez de por fecha bruta.

// Listado /ejes: cabecera (singleton) + las 9 tarjetas en su orden editorial.
export const VISIONS_PAGE_QUERY = defineQuery(`{
  "page": *[_id == "visionsPage"][0]{
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
    "lede": coalesce(lede[language == $lang][0].value, lede[language == "es"][0].value)
  },
  "visions": *[_type == "vision" && defined(slug.current)] | order(order asc){
    _id,
    "slug": slug.current,
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
    "excerpt": coalesce(excerpt[language == $lang][0].value, excerpt[language == "es"][0].value),
    "lede": coalesce(lede[language == $lang][0].value, lede[language == "es"][0].value),
    mainImage
  }
}`)

// Eje por slug. Procesos y eventos se resuelven por referencia inversa (no hay
// array que mantener en el eje), y el proceso destacado de la cabecera es el
// siguiente que abre inscripciones.
export const VISION_BY_SLUG_QUERY = defineQuery(`*[_type == "vision" && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
  "lede": coalesce(lede[language == $lang][0].value, lede[language == "es"][0].value),
  "body": coalesce(body[language == $lang][0].value, body[language == "es"][0].value),
  mainImage,

  "featured": *[
    _type == "process"
    && vision._ref == ^._id
    && status == "upcoming"
    && defined(slug.current)
  ] | order(startDate asc)[0]{
    _id,
    _type,
    "slug": slug.current,
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
    "subtitle": coalesce(subtitle[language == $lang][0].value, subtitle[language == "es"][0].value),
    mainImage,
    registrationLink,
    status,
    startDate,
    endDate,
    "datetime": null,
    "date": startDate
  },

  "related": *[
    (_type == "process" || _type == "event")
    && vision._ref == ^._id
    && defined(slug.current)
  ]{
    _id,
    _type,
    "slug": slug.current,
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
    "subtitle": coalesce(subtitle[language == $lang][0].value, subtitle[language == "es"][0].value),
    mainImage,
    registrationLink,
    "status": select(_type == "process" => status),
    "startDate": select(_type == "process" => startDate),
    "endDate": select(_type == "process" => endDate),
    "datetime": select(_type == "event" => datetime),
    "rank": select(
      _type == "process" && status == "upcoming" => 0,
      _type == "process" && status == "in-progress" => 1,
      _type == "event" => 2,
      3
    ),
    "date": select(_type == "event" => datetime, startDate)
  } | order(rank asc, date desc),

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
