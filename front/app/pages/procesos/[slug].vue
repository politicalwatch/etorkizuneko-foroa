<script setup lang="ts">
import { PROCESS_BY_SLUG_QUERY } from '~/queries/process'

const route = useRoute()
const { locale } = useI18n()

const { data: process } = await useSanityQuery(PROCESS_BY_SLUG_QUERY, {
  slug: route.params.slug as string,
  lang: locale.value
})

if (!process.value) {
  throw createError({ statusCode: 404, statusMessage: 'Proceso no encontrado' })
}
</script>

<template>
  <UContainer class="py-12 space-y-6">
    <h1 class="text-3xl font-bold text-highlighted">
      {{ process?.title }}
    </h1>
    <p class="text-muted whitespace-pre-line">
      {{ process?.description }}
    </p>

    <p class="text-xs text-dimmed">
      Vista placeholder — estado: {{ process?.status }},
      eje: {{ process?.vision?.title }},
      {{ process?.events?.length ?? 0 }} eventos ligados. Diseño pendiente.
    </p>
  </UContainer>
</template>
