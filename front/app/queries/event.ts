import { defineQuery } from 'groq'

// Evento por slug, con ubicación (place), eje y proceso ligado.
export const EVENT_BY_SLUG_QUERY = defineQuery(`*[_type == "event" && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
  "description": coalesce(description[language == $lang][0].value, description[language == "es"][0].value),
  mainImage,
  datetime,
  eventInPictures,
  place{
    "city": coalesce(city[language == $lang][0].value, city[language == "es"][0].value),
    virtual
  },
  "vision": vision->{
    _id,
    "slug": slug.current,
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value)
  },
  "process": process->{
    _id,
    "slug": slug.current,
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value)
  }
}`)
