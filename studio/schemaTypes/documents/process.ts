import {defineType, defineField} from 'sanity'
import {RocketIcon} from '@sanity/icons/Rocket'
import {localeValue, localizedValidation, localizedSlugSource} from '../../lib/i18n'

const STATUS_LABELS: Record<string, string> = {
  upcoming: 'Próximamente',
  'in-progress': 'En marcha',
  finished: 'Finalizado',
}

export const process = defineType({
  name: 'process',
  title: 'Proceso',
  type: 'document',
  icon: RocketIcon,
  groups: [
    {name: 'content', title: 'Contenido', default: true},
    {name: 'schedule', title: 'Convocatoria'},
  ],
  fields: [
    defineField({
      name: 'mainImage',
      title: 'Imagen principal',
      type: 'image',
      group: 'content',
      description: 'Preferiblemente en formato JPG',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'internationalizedArrayString',
      group: 'content',
      validation: localizedValidation({required: true, max: 100}),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'internationalizedArrayString',
      group: 'content',
      description:
        'Una frase que resume el proceso. Se lee bajo el título y también en la tarjeta ' +
        'del proceso dentro de las rejillas de "Procesos relacionados".',
      validation: localizedValidation({required: true, max: 160}),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'content',
      description: 'Identificador para la URL. Se genera desde el título en español.',
      options: {source: localizedSlugSource('title'), maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'vision',
      title: 'Eje',
      type: 'reference',
      group: 'content',
      to: [{type: 'vision'}],
      description: 'Eje al que pertenece este proceso.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Cuerpo',
      type: 'internationalizedArrayBlockContent',
      group: 'content',
      description:
        'Texto del proceso. Admite datos destacados, desgloses, galerías y testimonios ' +
        'intercalados donde toque. Los procesos finalizados suelen llevarlos; los que ' +
        'aún no han empezado, solo texto.',
    }),

    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      group: 'schedule',
      description: 'Decide qué se muestra en la cabecera de la página del proceso.',
      options: {
        list: [
          {title: STATUS_LABELS.upcoming, value: 'upcoming'},
          {title: STATUS_LABELS['in-progress'], value: 'in-progress'},
          {title: STATUS_LABELS.finished, value: 'finished'},
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Fecha de inicio',
      type: 'date',
      group: 'schedule',
      description: 'Solo se muestra en los procesos "Próximamente".',
    }),
    defineField({
      name: 'endDate',
      title: 'Fecha de fin',
      type: 'date',
      group: 'schedule',
      description: 'Solo se muestra en los procesos "Próximamente".',
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const startDate = context.document?.startDate
          if (startDate && endDate && endDate < startDate) {
            return 'La fecha de fin debe ser posterior a la de inicio'
          }
          return true
        }),
    }),
    defineField({
      name: 'place',
      title: 'Ubicación',
      type: 'place',
      group: 'schedule',
      description: 'Dónde se celebra. Se muestra en los procesos "Próximamente".',
    }),
    defineField({
      name: 'registrationLink',
      title: 'Enlace de inscripción',
      type: 'url',
      group: 'schedule',
      description: 'Enlace externo (ej. Typeform). Sin él no aparece el botón "Inscríbete".',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      vision: 'vision.title',
      media: 'mainImage',
    },
    prepare({title, status, vision, media}) {
      const visionTitle = localeValue(vision)
      return {
        title: localeValue(title) ?? 'Sin título',
        subtitle: [status ? STATUS_LABELS[status] : undefined, visionTitle]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
