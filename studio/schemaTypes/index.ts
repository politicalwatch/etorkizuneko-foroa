// Objetos reutilizables
import {data} from './objects/data'
import {testimonial} from './objects/testimonial'
import {place} from './objects/place'
import {seo} from './objects/seo'
import {socialLink} from './objects/socialLink'

// Documentos
import {vision} from './documents/vision'
import {process} from './documents/process'
import {event} from './documents/event'

// Singletons (documento único, listados a mano en `structure/`)
import {siteSettings} from './singletons/siteSettings'
import {homePage} from './singletons/homePage'

export const schemaTypes = [
  // Objetos primero (referenciados por los documentos)
  data,
  testimonial,
  place,
  seo,
  socialLink,
  // Documentos
  vision,
  process,
  event,
  // Singletons
  siteSettings,
  homePage,
]
