import { defineQuery } from 'groq'

// Proceso por slug, con su eje, testimonio, galería y eventos ligados.
export const PROCESS_BY_SLUG_QUERY = defineQuery(`*[_type == "process" && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
  "description": coalesce(description[language == $lang][0].value, description[language == "es"][0].value),
  mainImage,
  registrationLink,
  startDate,
  endDate,
  status,
  processInPictures,
  data[]{
    "name": coalesce(name[language == $lang][0].value, name[language == "es"][0].value),
    value
  },
  testimonial{
    "text": coalesce(text[language == $lang][0].value, text[language == "es"][0].value),
    person
  },
  "vision": vision->{
    _id,
    "slug": slug.current,
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value)
  },
  "events": *[_type == "event" && references(^._id) && defined(slug.current)] | order(datetime desc){
    _id,
    "slug": slug.current,
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
    datetime
  }
}`)
