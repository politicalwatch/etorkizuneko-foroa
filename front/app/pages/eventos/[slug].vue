<script setup lang="ts">
import { EVENT_BY_SLUG_QUERY } from '~/queries/event'

const route = useRoute()
const { locale } = useI18n()

const { data: event } = await useSanityQuery(EVENT_BY_SLUG_QUERY, {
  slug: route.params.slug as string,
  lang: locale.value
})

if (!event.value) {
  throw createError({ statusCode: 404, statusMessage: 'Evento no encontrado' })
}
</script>

<template>
  <UContainer class="py-12 space-y-6">
    <h1 class="text-3xl font-bold text-highlighted">
      {{ event?.title }}
    </h1>
    <p class="text-muted whitespace-pre-line">
      {{ event?.description }}
    </p>

    <p class="text-xs text-dimmed">
      Vista placeholder — lugar: {{ event?.place?.virtual ? $t('event.virtual') : event?.place?.city }},
      eje: {{ event?.vision?.title }}. Diseño pendiente.
    </p>
  </UContainer>
</template>
