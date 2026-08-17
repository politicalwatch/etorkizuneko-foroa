import {defineType, defineField} from 'sanity'
import {EyeOpenIcon} from '@sanity/icons/EyeOpen'
import {localeValue, localizedValidation} from '../../lib/i18n'

/**
 * Cabecera de la página de listado de ejes (/ejes). Las 9 tarjetas del listado
 * salen de los documentos `vision`, ordenadas por su campo `order`; aquí solo
 * vive el texto de entrada.
 */
export const visionsPage = defineType({
  name: 'visionsPage',
  title: 'Página de visiones de futuro',
  type: 'document',
  icon: EyeOpenIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'internationalizedArrayString',
      initialValue: [{_key: 'es', language: 'es', value: 'Visiones de futuro'}],
      validation: localizedValidation({required: true, max: 100}),
    }),
    defineField({
      name: 'lede',
      title: 'Entradilla',
      type: 'internationalizedArrayRichText',
      description: 'Párrafo de entrada, bajo el título. Admite negrita y enlaces.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: localeValue(title) || 'Página de visiones de futuro'}
    },
  },
})
