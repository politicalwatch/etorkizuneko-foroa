import {defineType, defineField} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

/**
 * Portada (/). Todo lo que se lee en ella y es prosa vive aquí; lo que es
 * etiqueta fija —los textos de los botones y los dos rótulos del diagrama de
 * la introducción— está en los ficheros de idioma del front.
 *
 * Las tres rejillas (lo que está pasando, los procesos finalizados y los nueve
 * ejes del mapa) NO se listan aquí: se resuelven con consultas GROQ sobre los
 * documentos, igual que en el resto de listados del sitio.
 */
export const homePage = defineType({
  name: 'homePage',
  title: 'Página de inicio',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'banner', title: 'Banner', default: true},
    {name: 'intro', title: 'Introducción'},
    {name: 'sections', title: 'Secciones'},
  ],
  fields: [
    defineField({
      name: 'mainImage',
      title: 'Imagen principal',
      type: 'image',
      group: 'banner',
      description: 'Foto a toda pantalla de la cabecera. Preferiblemente en formato JPG.',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'claim',
      title: 'Claim',
      type: 'internationalizedArrayRichText',
      group: 'banner',
      description:
        'La frase que se lee sobre la foto. En el diseño lleva un fragmento en negrita: ' +
        'márcalo con negrita y saldrá así.',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'intro',
      title: 'Introducción',
      type: 'array',
      group: 'intro',
      of: [{type: 'homeBlock'}],
      description:
        'Las dos columnas que explican el proyecto ("¿Cuál es nuestro objetivo?" y ' +
        '"¿Cómo lo hacemos?"). En escritorio van una al lado de la otra; en móvil, una ' +
        'debajo de la otra.',
      validation: (rule) => rule.required().min(1).max(2),
    }),

    defineField({
      name: 'agendaSection',
      title: 'Está pasando',
      type: 'homeBlock',
      group: 'sections',
      description: 'Encabeza las tarjetas de lo que está en marcha. El botón lleva a la agenda.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'processesSection',
      title: 'Procesos finalizados',
      type: 'homeBlock',
      group: 'sections',
      description: 'Encabeza el carrusel de conclusiones. El botón lleva al listado completo.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'visionsSection',
      title: 'Visiones de futuro',
      type: 'homeBlock',
      group: 'sections',
      description: 'Encabeza el mapa de los nueve ejes. El botón lleva al listado de ejes.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {media: 'mainImage'},
    prepare({media}) {
      return {title: 'Página de inicio', media}
    },
  },
})
