import type {Rule} from 'sanity'
import {BASE_LANGUAGE} from './languages'

// Forma de cada item de un campo internacionalizado (internationalizedArrayString/Text).
// OJO: en v5 del plugin el idioma se guarda en el campo `language`, no en `_key`
// (el `_key` pasó a ser aleatorio). Ver README "Shape of stored data".
export interface LocaleFieldValue {
  _key?: string
  _type?: string
  language?: string
  value?: string
}

// Genera el texto fuente de un `slug` a partir de un campo internacionalizado,
// usando el valor del idioma base (español). Uso: options.source de un campo slug.
export function localizedSlugSource(fieldName: string) {
  return (doc: Record<string, unknown>): string => {
    const field = doc[fieldName]
    if (!Array.isArray(field)) return ''
    const base = (field as LocaleFieldValue[]).find((item) => item.language === BASE_LANGUAGE)
    return base?.value ?? ''
  }
}

// Resuelve el valor de un campo internacionalizado para mostrarlo en un `preview`.
// Devuelve el idioma base (español) y, si falta, el primer valor no vacío disponible.
export function localeValue(
  value: LocaleFieldValue[] | undefined,
  language: string = BASE_LANGUAGE,
): string | undefined {
  if (!Array.isArray(value)) return undefined
  const preferred = value.find((item) => item.language === language && item.value)
  return (preferred ?? value.find((item) => item.value))?.value
}

// Validación reutilizable para campos internacionalizados:
// - required: exige que exista el valor en el idioma base (español) — error, bloquea.
// - max: recomienda no superar N caracteres en cada idioma — warning, no bloquea.
export function localizedValidation(options: {required?: boolean; max?: number}) {
  return (rule: Rule): Rule[] => {
    const rules: Rule[] = []

    if (options.required) {
      rules.push(
        rule.custom<LocaleFieldValue[]>((value) => {
          const base = value?.find((item) => item.language === BASE_LANGUAGE)
          return base?.value && base.value.trim().length > 0
            ? true
            : `El contenido en ${BASE_LANGUAGE.toUpperCase()} es obligatorio`
        }),
      )
    }

    if (options.max) {
      const max = options.max
      rules.push(
        rule
          .custom<LocaleFieldValue[]>((value) => {
            const tooLong = (value ?? []).filter(
              (item): item is LocaleFieldValue & {_key: string; value: string} =>
                typeof item._key === 'string' &&
                typeof item.value === 'string' &&
                item.value.length > max,
            )
            if (tooLong.length) {
              return tooLong.map((item) => ({
                message: `Recomendado no superar ${max} caracteres`,
                path: [{_key: item._key}, 'value'],
              }))
            }
            return true
          })
          .warning(),
      )
    }

    return rules
  }
}
