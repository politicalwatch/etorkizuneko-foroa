import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes} from './schemaTypes'
import {structure, SINGLETONS} from './structure'
import {LANGUAGES, BASE_LANGUAGE} from './lib/languages'

// Tipos con campos internacionalizados (muestran el filtro de idiomas)
const LOCALIZED_TYPES = ['vision', 'process', 'event', 'homePage', 'siteSettings']

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
  },
})
