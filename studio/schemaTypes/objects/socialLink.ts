import {defineType, defineField} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Red social',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'platform',
      title: 'Plataforma',
      type: 'string',
      options: {
        list: [
          {title: 'Instagram', value: 'instagram'},
          {title: 'TikTok', value: 'tiktok'},
          {title: 'LinkedIn', value: 'linkedin'},
          {title: 'YouTube', value: 'youtube'},
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {
      title: 'platform',
      subtitle: 'url',
    },
  },
})
