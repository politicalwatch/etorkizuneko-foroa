import {defineType, defineField} from 'sanity'
import {EyeOpenIcon} from '@sanity/icons/EyeOpen'
import {localeValue, localizedValidation, localizedSlugSource} from '../../lib/i18n'

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
      description: 'Título completo. Encabeza la página del eje y su tarjeta en el listado.',
      validation: localizedValidation({required: true, max: 100}),
    }),
    defineField({
      name: 'shortTitle',
      title: 'Título corto',
      type: 'internationalizedArrayString',
      description:
        'Opcional. Para las etiquetas de "Visiones de futuro" al pie de las páginas, ' +
        'donde no cabe el título completo. Ej: "Fortalecimiento democrático" en vez de ' +
        '"Fortalecimiento democrático y sentido comunitario". Si se deja vacío se usa el título.',
      validation: localizedValidation({max: 40}),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Identificador para la URL. Se genera desde el título en español.',
      options: {source: localizedSlugSource('title'), maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Orden',
      type: 'number',
      description: 'Posición del eje en el listado de "Visiones de futuro". Menor va primero.',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumen corto',
      type: 'internationalizedArrayText',
      description:
        'Una o dos frases. Es lo que se lee en la tarjeta del eje dentro del listado, ' +
        'no en la página del eje. Suele ser la primera frase del resumen largo.',
      validation: localizedValidation({required: true, max: 200}),
    }),
    defineField({
      name: 'summary',
      title: 'Resumen largo',
      type: 'internationalizedArrayText',
      description:
        'Un párrafo. Es lo que se lee en la ficha que se abre al pulsar el punto de este ' +
        'eje en el mapa de la portada, donde cabe bastante más que en la tarjeta. Suele ser ' +
        'el párrafo con el que arranca el cuerpo. Si se deja vacío se usa el resumen corto.',
      validation: localizedValidation({max: 600}),
    }),
    defineField({
      name: 'lede',
      title: 'Entradilla',
      type: 'internationalizedArrayRichText',
      description: 'Párrafo de entrada, justo debajo del título. Admite negrita y enlaces.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Cuerpo',
      type: 'internationalizedArrayBlockContent',
      description:
        'Texto largo del eje. Además de párrafos y subtítulos admite datos destacados, ' +
        'desgloses, galerías y testimonios intercalados donde toque.',
    }),
  ],
  orderings: [
    {
      title: 'Orden del listado',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order',
      media: 'mainImage',
    },
    prepare({title, order, media}) {
      return {
        title: localeValue(title) ?? 'Sin título',
        subtitle: typeof order === 'number' ? `#${order}` : 'Sin orden',
        media,
      }
    },
  },
})
