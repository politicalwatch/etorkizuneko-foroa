import {defineType, defineField} from 'sanity'
import {BarChartIcon} from '@sanity/icons/BarChart'
import {localeValue, localizedValidation} from '../../lib/i18n'

export const data = defineType({
  name: 'data',
  title: 'Dato',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'internationalizedArrayString',
      validation: localizedValidation({required: true}),
    }),
    defineField({
      name: 'value',
      title: 'Valor',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      value: 'value',
    },
    prepare({name, value}) {
      return {
        title: localeValue(name) ?? 'Sin nombre',
        subtitle: value === undefined || value === null ? undefined : String(value),
      }
    },
  },
})
