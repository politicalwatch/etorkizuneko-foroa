// Objetos reutilizables
import {richText} from './objects/richText'
import {statHighlight} from './objects/statHighlight'
import {dataBreakdown} from './objects/dataBreakdown'
import {gallery} from './objects/gallery'
import {testimonial} from './objects/testimonial'
import {blockContent} from './objects/blockContent'
import {homeBlock} from './objects/homeBlock'
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
import {visionsPage} from './singletons/visionsPage'
import {agendaPage} from './singletons/agendaPage'
import {processesPage} from './singletons/processesPage'

export const schemaTypes = [
  // Objetos primero (referenciados por los documentos).
  // richText y los bloques van antes de blockContent, que los compone.
  richText,
  statHighlight,
  dataBreakdown,
  gallery,
  testimonial,
  blockContent,
  homeBlock,
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
  visionsPage,
  agendaPage,
  processesPage,
]

// Tipos que el plugin de i18n envuelve en `internationalizedArray<Nombre>`.
// Se comparte entre `sanity.config.ts` y `typegen.ts` para que el Studio y los
// tipos generados para el front no se desincronicen.
export const INTERNATIONALIZED_FIELD_TYPES = ['string', 'text', 'richText', 'blockContent']
