import {defineType, defineField} from 'sanity'
import {PinIcon} from '@sanity/icons/Pin'
import {localeValue, localizedValidation} from '../../lib/i18n'

export const place = defineType({
  name: 'place',
  title: 'Ubicación',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'city',
      title: 'Ciudad',
      type: 'internationalizedArrayString',
      validation: localizedValidation({required: true}),
    }),
    defineField({
      name: 'virtual',
      title: 'Virtual',
      type: 'boolean',
      description: 'Si está activado, se mostrará "Virtual" en lugar de la ciudad',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      city: 'city',
      virtual: 'virtual',
    },
    prepare({city, virtual}) {
      const cityName = localeValue(city)
      return {
        title: virtual ? 'Virtual' : (cityName ?? 'Sin ubicación'),
        subtitle: virtual ? cityName : undefined,
      }
    },
  },
})
