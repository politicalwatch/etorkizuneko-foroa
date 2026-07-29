import {defineType, defineField, defineArrayMember} from 'sanity'
import {RocketIcon} from '@sanity/icons/Rocket'
import {localeValue, localizedValidation} from '../../lib/i18n'

const STATUS_LABELS: Record<string, string> = {
  upcoming: 'Próximamente',
  'in-progress': 'En proceso',
  finished: 'Finalizado',
}

export const process = defineType({
  name: 'process',
  title: 'Proceso',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'mainImage',
      title: 'Imagen principal',
      type: 'image',
      description: 'Preferiblemente en formato JPG',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'internationalizedArrayString',
      validation: localizedValidation({required: true, max: 100}),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'internationalizedArrayText',
      validation: localizedValidation({required: true, max: 1000}),
    }),
    defineField({
      name: 'registrationLink',
      title: 'Enlace de inscripción',
      type: 'url',
      description: 'Enlace externo (ej. Typeform)',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'startDate',
      title: 'Fecha de inicio',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Fecha de fin',
      type: 'date',
      validation: (rule) =>
        rule.required().custom((endDate, context) => {
          const startDate = context.document?.startDate
          if (startDate && endDate && endDate < startDate) {
            return 'La fecha de fin debe ser posterior a la de inicio'
          }
          return true
        }),
    }),
    defineField({
      name: 'data',
      title: 'Datos',
      type: 'array',
      of: [defineArrayMember({type: 'data'})],
      description: 'Máximo 3 datos',
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          {title: 'Próximamente', value: 'upcoming'},
          {title: 'En proceso', value: 'in-progress'},
          {title: 'Finalizado', value: 'finished'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'processInPictures',
      title: 'Proceso en imágenes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
        }),
      ],
      description: 'Preferiblemente en formato JPG, máximo 8 fotos',
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonio',
      type: 'testimonial',
    }),
    defineField({
      name: 'vision',
      title: 'Eje',
      type: 'reference',
      to: [{type: 'vision'}],
      description: 'Eje al que pertenece este proceso',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      media: 'mainImage',
    },
    prepare({title, status, media}) {
      return {
        title: localeValue(title) ?? 'Sin título',
        subtitle: status ? STATUS_LABELS[status] : undefined,
        media,
      }
    },
  },
})
