import {defineType, defineField} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'
import {localeValue, localizedValidation} from '../../lib/i18n'

export const homePage = defineType({
  name: 'homePage',
  title: 'Página de inicio',
  type: 'document',
  icon: HomeIcon,
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
      name: 'projectTitle',
      title: 'Título del proyecto',
      type: 'internationalizedArrayString',
      validation: localizedValidation({required: true, max: 200}),
    }),
    defineField({
      name: 'projectDescription',
      title: 'Descripción del proyecto',
      type: 'internationalizedArrayText',
      validation: localizedValidation({required: true, max: 1000}),
    }),
  ],
  preview: {
    select: {
      title: 'projectTitle',
      media: 'mainImage',
    },
    prepare({title, media}) {
      return {
        title: localeValue(title) || 'Página de inicio',
        media,
      }
    },
  },
})
