import { defineQuery } from 'groq'

// La proyección de tarjeta se repite entera (ver la nota en queries/vision.ts):
// el TypeGen de Sanity salta las queries con fragmentos interpolados.

// Proceso por slug. `related` son los hermanos del mismo eje (procesos y
// eventos), excluyendo el proceso que se está viendo.
export const PROCESS_BY_SLUG_QUERY = defineQuery(`*[_type == "process" && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
  "subtitle": coalesce(subtitle[language == $lang][0].value, subtitle[language == "es"][0].value),
  "body": coalesce(body[language == $lang][0].value, body[language == "es"][0].value),
  mainImage,
  status,
  startDate,
  endDate,
  registrationLink,
  place{
    "city": coalesce(city[language == $lang][0].value, city[language == "es"][0].value),
    virtual
  },

  "vision": vision->{
    _id,
    "slug": slug.current,
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value)
  },

  "featuredEvent": *[
    _type == "event"
    && process._ref == ^._id
    && defined(slug.current)
  ] | order(datetime desc)[0]{
    _id,
    _type,
    "slug": slug.current,
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
    "subtitle": coalesce(subtitle[language == $lang][0].value, subtitle[language == "es"][0].value),
    mainImage,
    registrationLink,
    "status": null,
    "startDate": null,
    "endDate": null,
    datetime,
    "date": datetime
  },

  "related": *[
    (_type == "process" || _type == "event")
    && vision._ref == ^.vision._ref
    && _id != ^._id
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
