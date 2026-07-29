import { defineQuery } from 'groq'

// Eje (vision) por slug, con sus procesos y eventos resueltos por referencia inversa.
export const VISION_BY_SLUG_QUERY = defineQuery(`*[_type == "vision" && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
  "description": coalesce(description[language == $lang][0].value, description[language == "es"][0].value),
  mainImage,
  data[]{
    "name": coalesce(name[language == $lang][0].value, name[language == "es"][0].value),
    value
  },
  "processes": *[_type == "process" && references(^._id) && defined(slug.current)] | order(startDate desc){
    _id,
    "slug": slug.current,
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
    status,
    mainImage
  },
  "events": *[_type == "event" && references(^._id) && defined(slug.current)] | order(datetime desc){
    _id,
    "slug": slug.current,
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
    datetime
  }
}`)
