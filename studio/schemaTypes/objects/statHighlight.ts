import {defineType, defineField} from 'sanity'
import {TrendUpwardIcon} from '@sanity/icons/TrendUpward'

/**
 * Dato destacado: una cifra grande en coral con un pie explicativo.
 * En el diseño aparece intercalado en el cuerpo de texto (ver `blockContent`):
 * en escritorio flota en la columna derecha, en móvil fluye con el texto.
 *
 * `value` es texto, no número, porque el diseño muestra unidades y formatos
 * distintos que forman parte del dato: "41%", "63,3%", "1.564€".
 *
 * Vive dentro de un `blockContent` que ya está traducido, así que sus campos
 * NO se envuelven con el plugin de i18n.
 */
export const statHighlight = defineType({
  name: 'statHighlight',
  title: 'Dato destacado',
  type: 'object',
  icon: TrendUpwardIcon,
  fields: [
    defineField({
      name: 'value',
      title: 'Cifra',
      type: 'string',
      description: 'Con su unidad y formato tal como debe leerse: 41%, 63,3%, 1.564€…',
      validation: (rule) => rule.required().max(12),
    }),
    defineField({
      name: 'caption',
      title: 'Pie',
      type: 'richText',
      description: 'Frase que acompaña a la cifra. Admite negrita y enlaces.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      value: 'value',
      caption: 'caption',
    },
    prepare({value, caption}) {
      // El pie es Portable Text: se aplana al primer párrafo para el preview.
      const text = Array.isArray(caption)
        ? caption
            .filter((block) => block?._type === 'block')
            .map((block) =>
              (block.children ?? []).map((child: {text?: string}) => child.text ?? '').join(''),
            )
            .join(' ')
        : undefined

      return {
        title: value || 'Sin cifra',
        subtitle: text,
      }
    },
  },
})
