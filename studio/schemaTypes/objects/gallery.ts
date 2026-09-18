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
/**
 * Cuenta las imágenes de la galería para el pie de la previsualización.
 *
 * `images` no siempre llega como array. El resolutor de previsualizaciones del
 * Studio agrupa los caminos de `select` por su primer segmento: al pedir a la
 * vez `images` (para contar) y `images.0` (para la miniatura), recorre el array
 * para sacar el elemento 0 y lo que devuelve es un objeto indexado por
 * posición — `{0: …, 1: …}` —, así que `images.length` es `undefined` y el pie
 * decía siempre "0 imágenes". Con un único camino no pasa, y por eso el
 * desglose de datos, que solo selecciona `rows`, sí cuenta bien.
 */
function countImages(images: unknown): number {
  if (Array.isArray(images)) return images.length
  if (images && typeof images === 'object') {
    return Object.keys(images).filter((key) => /^\d+$/.test(key)).length
  }
  return 0
}

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
      const count = countImages(images)
      return {
        title: 'Galería',
        subtitle: `${count} ${count === 1 ? 'imagen' : 'imágenes'}`,
        media,
      }
    },
  },
})
