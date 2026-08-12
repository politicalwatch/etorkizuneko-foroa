import {defineType, defineField, defineArrayMember} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'
import {localizedValidation} from '../../lib/i18n'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Ajustes del sitio',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Título del sitio',
      type: 'string',
      description: 'Nombre del sitio, usado en <title> por defecto',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Eslogan',
      type: 'internationalizedArrayString',
      validation: localizedValidation({max: 160}),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'SVG o PNG con fondo transparente',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Recomendado 512x512',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'SEO por defecto',
      type: 'seo',
      description: 'Valores SEO por defecto si una página no los define',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Redes sociales',
      type: 'array',
      of: [defineArrayMember({type: 'socialLink'})],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email de contacto',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'footerText',
      title: 'Texto del pie de página',
      type: 'internationalizedArrayText',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Ajustes del sitio'}
    },
  },
})
