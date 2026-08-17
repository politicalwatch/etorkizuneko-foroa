import {defineType, defineField} from 'sanity'
import {CommentIcon} from '@sanity/icons/Comment'

/**
 * Testimonio de una persona participante. En el diseño aparece al final del
 * cuerpo de un proceso finalizado: cita en coral, atribución debajo
 * ("A. A. — Participante en The Future Game") y una foto al lado.
 *
 * Es un bloque de `blockContent`, que ya está traducido, así que sus campos
 * NO se envuelven con el plugin de i18n.
 */
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Cita',
      type: 'text',
      rows: 4,
      validation: (rule) =>
        rule.required().max(400).warning('Recomendado mantenerla por debajo de 400 caracteres'),
    }),
    defineField({
      name: 'person',
      title: 'Persona',
      type: 'string',
      description: 'Nombre o iniciales de quien habla.',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'role',
      title: 'Rol',
      type: 'string',
      description: 'Cómo participó. Ej: "Participante en The Future Game".',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      description: 'Opcional. Acompaña a la cita en escritorio.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      person: 'person',
      role: 'role',
      quote: 'quote',
      media: 'image',
    },
    prepare({person, role, quote, media}) {
      return {
        title: [person, role].filter(Boolean).join(' — ') || 'Sin persona',
        subtitle: quote,
        media,
      }
    },
  },
})
