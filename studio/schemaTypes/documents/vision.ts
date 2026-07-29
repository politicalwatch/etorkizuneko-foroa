import {defineType, defineField, defineArrayMember} from 'sanity'
import {EyeOpenIcon} from '@sanity/icons/EyeOpen'
import {localeValue, localizedValidation} from '../../lib/i18n'

export const vision = defineType({
  name: 'vision',
  title: 'Eje',
  type: 'document',
  icon: EyeOpenIcon,
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
      name: 'data',
      title: 'Datos',
      type: 'array',
      of: [defineArrayMember({type: 'data'})],
      description: 'Máximo 3 datos',
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
    prepare({title, media}) {
      return {
        title: localeValue(title) ?? 'Sin título',
        media,
      }
    },
  },
})
