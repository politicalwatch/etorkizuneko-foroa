import {defineType, defineArrayMember, defineField} from 'sanity'

/**
 * Texto enriquecido "ligero": solo párrafos con negrita, cursiva y enlaces.
 *
 * Se usa en los sitios donde el diseño muestra una entradilla o un pie de dato
 * con algunas palabras en negrita, pero NO admite titulares ni bloques
 * incrustados (para eso está `blockContent`).
 *
 * Se usa de dos formas:
 *  - envuelto por el plugin de i18n (`internationalizedArrayRichText`) cuando es
 *    un campo de primer nivel del documento (entradillas);
 *  - tal cual, sin envolver, cuando vive dentro de un `blockContent` que ya
 *    está traducido (por ejemplo el pie de un `statHighlight`).
 */
export const richText = defineType({
  name: 'richText',
  title: 'Texto enriquecido',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      // Sin titulares ni listas: es texto corrido.
      styles: [{title: 'Párrafo', value: 'normal'}],
      lists: [],
      marks: {
        decorators: [
          {title: 'Negrita', value: 'strong'},
          {title: 'Cursiva', value: 'em'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Enlace',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) =>
                  rule.required().uri({scheme: ['http', 'https', 'mailto', 'tel']}),
              }),
              defineField({
                name: 'blank',
                title: 'Abrir en una pestaña nueva',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          }),
        ],
      },
    }),
  ],
})
