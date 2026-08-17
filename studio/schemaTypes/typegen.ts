// Punto de entrada EXCLUSIVO para el TypeGen del frontend (@nuxtjs/sanity).
//
// El extractor de tipos del módulo compila estáticamente el array de tipos, pero los
// tipos `internationalizedArrayString` / `internationalizedArrayText` (y sus *Value)
// los inyecta el plugin en runtime desde `sanity.config.ts`, así que no aparecen en
// `schemaTypes`. Aquí los recuperamos desde el propio plugin y los añadimos al array,
// sin registrarlos dos veces en el Studio (este fichero NO se importa en el config).
import type {SchemaTypeDefinition} from 'sanity'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes, INTERNATIONALIZED_FIELD_TYPES} from './index'
import {LANGUAGES} from '../lib/languages'

// `schema.types` está tipado como array O como función componible; el plugin
// siempre devuelve el array, así que se estrecha aquí para poder expandirlo.
const injected = internationalizedArray({
  languages: LANGUAGES,
  fieldTypes: INTERNATIONALIZED_FIELD_TYPES,
}).schema?.types

const internationalizedTypes: SchemaTypeDefinition[] = Array.isArray(injected) ? injected : []

export default [...schemaTypes, ...internationalizedTypes]
