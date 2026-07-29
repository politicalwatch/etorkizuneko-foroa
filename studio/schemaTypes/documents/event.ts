import {defineType, defineField, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {localeValue, localizedValidation} from '../../lib/i18n'

export const event = defineType({
  name: 'event',
  title: 'Evento',
  type: 'document',
  icon: CalendarIcon,
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
      name: 'place',
      title: 'Ubicación',
      type: 'place',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'datetime',
      title: 'Fecha y hora',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eventInPictures',
      title: 'Evento en imágenes',
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
      name: 'vision',
      title: 'Eje',
      type: 'reference',
      to: [{type: 'vision'}],
      description: 'Eje al que pertenece este evento',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'process',
      title: 'Proceso',
      type: 'reference',
      to: [{type: 'process'}],
      description: 'Proceso concreto al que está ligado el evento, si aplica',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      datetime: 'datetime',
      media: 'mainImage',
    },
    prepare({title, datetime, media}) {
      return {
        title: localeValue(title) ?? 'Sin título',
        subtitle: datetime,
        media,
      }
    },
  },
})
