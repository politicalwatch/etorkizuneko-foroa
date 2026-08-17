import {defineType, defineField} from 'sanity'
import {localeValue, localizedValidation} from '../../lib/i18n'

/**
 * Un titular con su texto. Es la pieza que se repite por toda la portada:
 * las dos columnas de la introducción y las cabeceras de las tres secciones
 * ("Está pasando", "Procesos finalizados", "Visiones de futuro") tienen
 * exactamente la misma forma, así que se declara una sola vez.
 *
 * El botón que acompaña a las cabeceras NO vive aquí: su destino es una ruta
 * fija del sitio (/eventos, /procesos, /ejes) y su texto está en los ficheros
 * de idioma del front, no es algo que se edite por contenido.
 */
export const homeBlock = defineType({
  name: 'homeBlock',
  title: 'Bloque de texto',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'internationalizedArrayString',
      validation: localizedValidation({required: true, max: 100}),
    }),
    defineField({
      name: 'body',
      title: 'Texto',
      type: 'internationalizedArrayRichText',
      description: 'Admite negrita y enlaces.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: localeValue(title) || 'Bloque de texto'}
    },
  },
})
