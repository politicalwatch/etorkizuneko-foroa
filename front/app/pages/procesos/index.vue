<script setup lang="ts">
import { PROCESSES_PAGE_QUERY } from '~/queries/processes'

// Superficie clara: es la de por defecto, no hace falta declararla.
const route = useRoute()
const { locale, t } = useI18n()

const { data } = await useSanityQuery(PROCESSES_PAGE_QUERY, { lang: locale.value })

const title = computed(() => data.value?.page?.title || t('nav.processes'))
const processes = computed(() => data.value?.processes ?? [])

// Los ejes seleccionados viven en la URL (ver VisionFilter). Aquí solo se leen
// para filtrar; el filtrado es en cliente porque son pocos documentos y así un
// clic en una etiqueta no dispara otra petición.
const selected = computed(() => {
  const raw = route.query.eje
  const list = Array.isArray(raw) ? raw : raw == null ? [] : [raw]
  return new Set(list.filter((v): v is string => typeof v === 'string' && v.length > 0))
})

const filtered = computed(() =>
  selected.value.size
    ? processes.value.filter(p => p.visionSlug && selected.value.has(p.visionSlug))
    : processes.value
)

useSeoMeta({ title })
</script>

<template>
  <div class="processes">
    <header class="processes__header">
      <h1 class="processes__title">
        {{ title }}
      </h1>
      <ProseText
        v-if="data?.page?.lede"
        :value="data.page.lede"
      />
    </header>

    <VisionFilter :visions="data?.visions ?? []" />

    <CardGrid
      :items="filtered"
      :columns="2"
      meta="vision"
    />

    <p
      v-if="!filtered.length"
      class="processes__empty"
    >
      {{ processes.length ? t('process.noResultsForFilter') : t('process.noneFinished') }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.processes {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
  padding: 90px $space-md $space-xl;
}

.processes__header {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  // Aquí el diseño aprieta más que en las páginas de detalle: 60px bajo la
  // cabecera y 90px bajo las etiquetas, antes de la rejilla.
  margin-bottom: $space-lg;
  max-width: 70ch;
}

.processes :deep(.vision-filter) {
  margin-bottom: $space-lg;
}

.processes__title {
  font-size: 32px;
  line-height: 36px;
  font-weight: 900;
  letter-spacing: -0.02em;

  @media (width >= 768px) {
    font-size: 44px;
    line-height: 48px;
  }
}

.processes__empty {
  font-size: $text-body;
  line-height: 19px;
  color: var(--surface-muted, currentcolor);
}
</style>
