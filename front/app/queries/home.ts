import { defineQuery } from 'groq'

// Home: singleton homePage + los 9 ejes (para el grid). El idioma se resuelve
// en la propia query con $lang y fallback a español.
export const HOME_QUERY = defineQuery(`{
  "home": *[_id == "homePage"][0]{
    mainImage,
    "projectTitle": coalesce(projectTitle[language == $lang][0].value, projectTitle[language == "es"][0].value),
    "projectDescription": coalesce(projectDescription[language == $lang][0].value, projectDescription[language == "es"][0].value)
  },
  "visions": *[_type == "vision" && defined(slug.current)]{
    _id,
    "slug": slug.current,
    "title": coalesce(title[language == $lang][0].value, title[language == "es"][0].value),
    mainImage
  }
}`)
