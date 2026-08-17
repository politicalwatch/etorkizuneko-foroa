import {defineType, defineField} from 'sanity'
import {RocketIcon} from '@sanity/icons/Rocket'
import {localeValue, localizedValidation} from '../../lib/i18n'

/**
 * Cabecera del listado de procesos finalizados (/procesos). Las tarjetas salen
 * de los procesos con estado "Finalizado" y las etiquetas de filtro de los
 * ejes; aquí solo vive el texto de entrada.
 */
export const processesPage = defineType({
  name: 'processesPage',
  title: 'Página de procesos finalizados',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'internationalizedArrayString',
      initialValue: [{_key: 'es', language: 'es', value: 'Procesos finalizados'}],
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
      return {title: localeValue(title) || 'Página de procesos finalizados'}
    },
  },
})
