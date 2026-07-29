// Punto de entrada EXCLUSIVO para el TypeGen del frontend (@nuxtjs/sanity).
//
// El extractor de tipos del módulo compila estáticamente el array de tipos, pero los
// tipos `internationalizedArrayString` / `internationalizedArrayText` (y sus *Value)
// los inyecta el plugin en runtime desde `sanity.config.ts`, así que no aparecen en
// `schemaTypes`. Aquí los recuperamos desde el propio plugin y los añadimos al array,
// sin registrarlos dos veces en el Studio (este fichero NO se importa en el config).
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes} from './index'
import {LANGUAGES} from '../lib/languages'

const internationalizedTypes =
  internationalizedArray({languages: LANGUAGES, fieldTypes: ['string', 'text']}).schema?.types ?? []

export default [...schemaTypes, ...internationalizedTypes]
