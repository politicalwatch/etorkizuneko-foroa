<script setup lang="ts">
import { VISION_BY_SLUG_QUERY } from '~/queries/vision'

const route = useRoute()
const { locale } = useI18n()

const { data: vision } = await useSanityQuery(VISION_BY_SLUG_QUERY, {
  slug: route.params.slug as string,
  lang: locale.value
})

if (!vision.value) {
  throw createError({ statusCode: 404, statusMessage: 'Eje no encontrado' })
}
</script>

<template>
  <UContainer class="py-12 space-y-6">
    <h1 class="text-3xl font-bold text-highlighted">
      {{ vision?.title }}
    </h1>
    <p class="text-muted whitespace-pre-line">
      {{ vision?.description }}
    </p>

    <p class="text-xs text-dimmed">
      Vista placeholder — {{ vision?.data?.length ?? 0 }} datos,
      {{ vision?.processes?.length ?? 0 }} procesos,
      {{ vision?.events?.length ?? 0 }} eventos cargados. Diseño pendiente.
    </p>
  </UContainer>
</template>
