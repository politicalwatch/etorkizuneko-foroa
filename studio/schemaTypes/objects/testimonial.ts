import {defineType, defineField} from 'sanity'
import {CommentIcon} from '@sanity/icons/Comment'
import {localeValue, localizedValidation} from '../../lib/i18n'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Texto',
      type: 'internationalizedArrayString',
      validation: localizedValidation({required: true, max: 240}),
    }),
    defineField({
      name: 'person',
      title: 'Persona',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .max(100)
          .warning('Recomendado mantenerlo por debajo de 100 caracteres'),
    }),
  ],
  preview: {
    select: {
      person: 'person',
      text: 'text',
    },
    prepare({person, text}) {
      return {
        title: person || 'Sin persona',
        subtitle: localeValue(text),
      }
    },
  },
})
