import {defineType, defineField} from 'sanity'
import {SearchIcon} from '@sanity/icons/Search'
import {localizedValidation} from '../../lib/i18n'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta título',
      type: 'internationalizedArrayString',
      validation: localizedValidation({max: 60}),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta descripción',
      type: 'internationalizedArrayText',
      validation: localizedValidation({max: 160}),
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen para redes sociales',
      type: 'image',
      description: 'Recomendado 1200x630',
      options: {hotspot: true},
    }),
  ],
})
