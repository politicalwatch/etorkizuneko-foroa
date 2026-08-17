import {defineType, defineField} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {localeValue, localizedValidation} from '../../lib/i18n'

/**
 * Cabecera de la Agenda (/eventos). Las tarjetas salen de los procesos con
 * convocatoria abierta o en marcha y de los eventos que aún no han pasado;
 * aquí solo vive el texto de entrada.
 */
export const agendaPage = defineType({
  name: 'agendaPage',
  title: 'Página de agenda',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'internationalizedArrayString',
      initialValue: [{_key: 'es', language: 'es', value: 'Agenda'}],
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
      return {title: localeValue(title) || 'Página de agenda'}
    },
  },
})
