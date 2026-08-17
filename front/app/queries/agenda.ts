import { defineQuery } from 'groq'

// Agenda (/eventos): lo que aún se puede hacer. Procesos con convocatoria
// abierta o en marcha, más los eventos que no han pasado todavía.
//
// La proyección de tarjeta va escrita entera, sin fragmentos interpolados: el
// TypeGen de Sanity salta las queries con `${...}` y las deja sin tipo (ver la
// nota en queries/vision.ts).
//
// La fecha de corte llega como parámetro (`$today`, sólo AAAA-MM-DD en UTC) en
// vez de usar now() dentro de la query.
//
// OJO: tiene que ser sólo la fecha, no la hora. `useSanityQuery` deriva la clave
// de caché de useAsyncData de la query y sus parámetros: si el parámetro llevara
// la hora, servidor y cliente generarían valores distintos, la clave no
// coincidiría al hidratar y el navegador repetiría la petición (que además puede
// fallar por CORS si el origen no está en la lista del proyecto). Con la fecha
// pelada, ambos coinciden durante todo el día.
//
// Comparar un `datetime` completo con una fecha suelta funciona porque el orden
// lexicográfico de ISO-8601 coincide con el cronológico: los eventos de hoy
// siguen contando aunque ya hayan pasado de hora.
export const AGENDA_QUERY = defineQuery(`{
  "page": *[_id == "agendaPage"][0]{
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
    "lede": coalesce(lede[language == $lang][0].value, lede[language == "es"][0].value)
  },

  "featured": *[
    _type == "process"
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
    "datetime": null
  },

  "items": *[
    defined(slug.current)
    && (
      (_type == "process" && status in ["upcoming", "in-progress"])
      || (_type == "event" && datetime >= $today)
    )
    && _id != *[_type == "process" && status == "upcoming" && defined(slug.current)]
      | order(startDate asc)[0]._id
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
    "date": select(_type == "event" => datetime, startDate)
  } | order(date asc)
}`)
