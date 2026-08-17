import {defineType, defineField, defineArrayMember} from 'sanity'
import {BarChartIcon} from '@sanity/icons/BarChart'

/**
 * Desglose de un dato en varias categorías, que el front dibuja como barras
 * horizontales con su porcentaje (ver el diseño del proceso finalizado:
 * "Hospitales 90%, Escuelas 80%, Administraciones 60%…").
 *
 * Igual que `statHighlight`, vive dentro de un `blockContent` ya traducido,
 * así que sus campos NO se envuelven con el plugin de i18n.
 */
export const dataBreakdown = defineType({
  name: 'dataBreakdown',
  title: 'Desglose de datos',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Opcional. Encabeza el desglose si el dato lo necesita.',
    }),
    defineField({
      name: 'rows',
      title: 'Categorías',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'row',
          title: 'Categoría',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Etiqueta',
              type: 'string',
              validation: (rule) => rule.required().max(60),
            }),
            defineField({
              name: 'value',
              title: 'Porcentaje',
              type: 'number',
              description: 'De 0 a 100.',
              validation: (rule) => rule.required().min(0).max(100),
            }),
          ],
          preview: {
            select: {label: 'label', value: 'value'},
            prepare: ({label, value}) => ({
              title: label || 'Sin etiqueta',
              subtitle: typeof value === 'number' ? `${value}%` : undefined,
            }),
          },
        }),
      ],
      validation: (rule) => rule.required().min(2),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      rows: 'rows',
    },
    prepare({title, rows}) {
      const count = Array.isArray(rows) ? rows.length : 0
      return {
        title: title || 'Desglose de datos',
        subtitle: `${count} ${count === 1 ? 'categoría' : 'categorías'}`,
      }
    },
  },
})
