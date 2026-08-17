import {defineType, defineArrayMember, defineField} from 'sanity'

/**
 * Cuerpo largo de ejes y procesos.
 *
 * Es una única corriente de contenido: párrafos, subtítulos y bloques de dato
 * intercalados. El diseño lo confirma — en móvil los datos destacados fluyen
 * entre los párrafos, y en escritorio el front los saca a la columna derecha.
 * Por eso los datos, la galería y el testimonio son bloques de aquí dentro y
 * no campos sueltos del documento: su posición en el texto es contenido.
 *
 * Se envuelve con el plugin de i18n (`internationalizedArrayBlockContent`), así
 * que todo lo que hay dentro ya es de un idioma concreto.
 */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Contenido',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      // El diseño solo usa párrafo y un nivel de subtítulo dentro del cuerpo
      // (el H1 es el título del documento).
      styles: [
        {title: 'Párrafo', value: 'normal'},
        {title: 'Subtítulo', value: 'h2'},
      ],
      lists: [{title: 'Lista', value: 'bullet'}],
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

    // Bloques incrustados
    defineArrayMember({type: 'statHighlight'}),
    defineArrayMember({type: 'dataBreakdown'}),
    defineArrayMember({type: 'gallery'}),
    defineArrayMember({type: 'testimonial'}),
  ],
})
