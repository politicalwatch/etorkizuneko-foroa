import {defineType, defineField} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

/**
 * Imagen suelta dentro del cuerpo, con su pie. A diferencia de `gallery`, que
 * recorta las fotos a una rejilla, esta se publica tal cual: se respeta su
 * proporción original.
 *
 * El campo `layout` es lo único que decide su tamaño. El cuerpo se maqueta en
 * dos columnas (texto a la izquierda, datos a la derecha), así que una imagen
 * puede ocupar la fila entera (`wide`) o quedarse en la columna de texto
 * (`narrow`), donde fluye entre los párrafos como uno más.
 *
 * Es un bloque de `blockContent`, que ya está traducido, así que sus campos
 * NO se envuelven con el plugin de i18n. La imagen es la misma en los tres
 * idiomas: al traducir conviene copiar el bloque en lugar de volver a subirla.
 */
export const contentImage = defineType({
  name: 'contentImage',
  title: 'Imagen',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Texto alternativo',
      type: 'string',
      description: 'Describe la imagen para lectores de pantalla.',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'caption',
      title: 'Pie de foto',
      type: 'text',
      rows: 2,
      description: 'Opcional. Se muestra bajo la imagen.',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'layout',
      title: 'Ancho',
      type: 'string',
      description:
        'Ancho: ocupa las dos columnas del cuerpo. Estrecho: se queda en la columna del texto.',
      options: {
        list: [
          {title: 'Ancho (dos columnas)', value: 'wide'},
          {title: 'Estrecho (columna de texto)', value: 'narrow'},
        ],
        layout: 'radio',
      },
      initialValue: 'wide',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      alt: 'alt',
      caption: 'caption',
      layout: 'layout',
      media: 'asset',
    },
    prepare({alt, caption, layout, media}) {
      return {
        title: caption || alt || 'Imagen',
        subtitle: layout === 'narrow' ? 'Estrecha' : 'Ancha',
        media,
      }
    },
  },
})
