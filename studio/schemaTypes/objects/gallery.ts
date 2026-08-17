import {defineType, defineField, defineArrayMember} from 'sanity'
import {ImagesIcon} from '@sanity/icons/Images'

/**
 * Galería de fotos del proceso ("el proceso en imágenes"). En el diseño se
 * intercala en mitad del cuerpo, por eso es un bloque de `blockContent` y no
 * un campo suelto del documento.
 *
 * OJO: al vivir dentro de un campo traducido, la galería se define una vez por
 * idioma. Las imágenes son las mismas en los tres, así que conviene copiar el
 * bloque al traducir en lugar de volver a subirlas.
 */
export const gallery = defineType({
  name: 'gallery',
  title: 'Galería',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Imágenes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
              description: 'Describe la imagen para lectores de pantalla.',
            }),
          ],
        }),
      ],
      description: 'Preferiblemente en formato JPG, máximo 8 fotos',
      validation: (rule) => rule.required().min(1).max(8),
    }),
  ],
  preview: {
    select: {
      images: 'images',
      media: 'images.0',
    },
    prepare({images, media}) {
      const count = Array.isArray(images) ? images.length : 0
      return {
        title: 'Galería',
        subtitle: `${count} ${count === 1 ? 'imagen' : 'imágenes'}`,
        media,
      }
    },
  },
})
