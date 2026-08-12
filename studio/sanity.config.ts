import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes} from './schemaTypes'
import {structure, SINGLETONS} from './structure'
import {locations, mainDocuments} from './presentation/resolve'
import {LANGUAGES, BASE_LANGUAGE} from './lib/languages'

// Tipos con campos internacionalizados (muestran el filtro de idiomas)
const LOCALIZED_TYPES = ['vision', 'process', 'event', 'homePage', 'siteSettings']

// Origen del front para la previsualización. En local, el `nuxt dev` por
// defecto; el prefijo /es porque i18n usa strategy: 'prefix' y no hay ruta sin él.
const PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000/es'

// Por defecto production; SANITY_STUDIO_DATASET=dev para el sandbox local.
// Debe coincidir con NUXT_PUBLIC_SANITY_DATASET del front, o la
// previsualización mostrará un dataset distinto al que se está editando.
const DATASET = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Etorkizuneko Foroa',

  projectId: 'gm41vkqd',
  dataset: DATASET,

  plugins: [
    structureTool({structure}),

    // Previsualización de borradores: renderiza el front en un iframe con la
    // perspectiva `drafts`. Las rutas /preview/* son las que registra
    // @nuxtjs/sanity (la doc de Sanity usa /api/draft-mode/*, convención de Next).
    presentationTool({
      title: 'Previsualizar',
      previewUrl: {
        initial: PREVIEW_URL,
        previewMode: {
          enable: '/preview/enable',
          disable: '/preview/disable',
        },
      },
      resolve: {locations, mainDocuments},
    }),

    internationalizedArray({
      languages: LANGUAGES,
      // Solo el idioma base se crea/muestra por defecto; el resto se añaden a demanda
      defaultLanguages: [BASE_LANGUAGE],
      fieldTypes: ['string', 'text'],
      // Integración incorporada con @sanity/language-filter (mostrar/ocultar idiomas)
      languageFilter: {
        documentTypes: LOCALIZED_TYPES,
        defaultLanguages: [BASE_LANGUAGE],
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Evita crear duplicados o borrar los singletons desde la UI
    actions: (prev, {schemaType}) =>
      SINGLETONS.includes(schemaType)
        ? prev.filter(({action}) => !['duplicate', 'delete', 'unpublish'].includes(action as string))
        : prev,

    // `actions` no cubre el botón global de "＋ Crear" ni el Cmd+K: sin esto se
    // pueden crear singletons huérfanos, con un _id aleatorio, que nunca
    // aparecen en `structure/` (allí se abren por documentId fijo).
    newDocumentOptions: (prev) =>
      prev.filter((item) => !SINGLETONS.includes(item.templateId as string)),
  },
})
