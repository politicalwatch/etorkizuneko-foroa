import { defineQuery } from 'groq'

// Portada (/): el singleton con la prosa, más las tres rejillas que se resuelven
// sobre los documentos (lo que está pasando, los finalizados y los nueve ejes).
//
// Proyecciones escritas enteras, sin fragmentos interpolados: el TypeGen de
// Sanity salta las queries con `${...}` y las deja sin tipo (ver la nota al
// principio de queries/vision.ts).
//
// `$today` llega como fecha pelada (AAAA-MM-DD, UTC) y no como instante: la
// clave de caché de useAsyncData sale de la query y sus parámetros, así que con
// la hora dentro servidor y cliente no coincidirían al hidratar y el navegador
// repetiría la petición. Está explicado con detalle en queries/agenda.ts.
export const HOME_QUERY = defineQuery(`{
  "page": *[_id == "homePage"][0]{
    mainImage,
    "claim": coalesce(claim[language == $lang][0].value, claim[language == "es"][0].value),
    intro[]{
      "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
      "body": coalesce(body[language == $lang][0].value, body[language == "es"][0].value)
    },
    agendaSection{
      "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
      "body": coalesce(body[language == $lang][0].value, body[language == "es"][0].value)
    },
    processesSection{
      "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
      "body": coalesce(body[language == $lang][0].value, body[language == "es"][0].value)
    },
    visionsSection{
      "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
      "body": coalesce(body[language == $lang][0].value, body[language == "es"][0].value)
    }
  },

  "happening": *[
    defined(slug.current)
    && (
      (_type == "process" && status in ["upcoming", "in-progress"])
      || (_type == "event" && datetime >= $today)
    )
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
  } | order(date asc)[0...3],

  "finished": *[
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
    "visionLabel": coalesce(
      vision->shortTitle[language == $lang][0].value,
      vision->shortTitle[language == "es"][0].value,
      vision->title[language == $lang][0].value,
      vision->title[language == "es"][0].value
    ),
    "date": coalesce(endDate, startDate, _createdAt)
  } | order(date desc)[0...8],

  "visions": *[_type == "vision" && defined(slug.current)] | order(order asc){
    _id,
    "slug": slug.current,
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
    "summary": coalesce(
      summary[language == $lang][0].value,
      summary[language == "es"][0].value,
      excerpt[language == $lang][0].value,
      excerpt[language == "es"][0].value
    )
  }
}`)
