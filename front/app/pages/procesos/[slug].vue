<script setup lang="ts">
import type { Crumb } from '~/components/AppBreadcrumbs.vue'
import { PROCESS_BY_SLUG_QUERY } from '~/queries/process'

const route = useRoute()
const { locale, t } = useI18n()

const { data: process } = await useSanityQuery(PROCESS_BY_SLUG_QUERY, {
  slug: route.params.slug as string,
  lang: locale.value
})

if (!process.value) {
  throw createError({ statusCode: 404, statusMessage: 'Proceso no encontrado' })
}

const crumbs = computed<Crumb[]>(() => {
  const items: Crumb[] = [{ label: t('nav.visions'), to: '/ejes' }]
  const vision = process.value?.vision
  if (vision?.title) {
    items.push({ label: vision.title, to: vision.slug ? `/ejes/${vision.slug}` : undefined })
  }
  return items
})

// El evento asociado solo encabeza la página cuando el proceso ya terminó: en
// los demás estados la cabecera la ocupa la banda de convocatoria.
const showFeaturedEvent = computed(
  () => process.value?.status === 'finished' && Boolean(process.value?.featuredEvent)
)

const assetId = computed(
  () => (process.value?.mainImage as { asset?: { _ref?: string } } | undefined)?.asset?._ref
)

useSeoMeta({
  title: () => process.value?.title ?? '',
  description: () => process.value?.subtitle ?? ''
})
</script>

<template>
  <div class="process">
    <header class="process__header">
      <AppBreadcrumbs :items="crumbs" />
      <h1 class="process__title">
        {{ process?.title }}
      </h1>
      <p
        v-if="process?.subtitle"
        class="process__subtitle"
      >
        {{ process.subtitle }}
      </p>
    </header>

    <FeaturedCard
      v-if="showFeaturedEvent && process?.featuredEvent"
      :item="process.featuredEvent"
    />
    <ProcessStatusBand
      v-else
      :status="process?.status"
      :start-date="process?.startDate"
      :end-date="process?.endDate"
      :place="process?.place"
      :registration-link="process?.registrationLink"
    />

    <SanityImage
      v-if="assetId"
      class="process__image"
      :asset-id="assetId"
      auto="format"
      :w="1920"
      alt=""
    />

    <ProseBody
      v-if="process?.body"
      :value="process.body"
    />

    <RelatedGrid :items="process?.related ?? []" />

    <VisionChips
      :visions="process?.visions ?? []"
      :current-slug="process?.vision?.slug"
    />
  </div>
</template>

<style lang="scss" scoped>
.process {
  display: flex;
  flex-direction: column;
  // Ritmo de dos niveles, medido sobre el diseño: 30px entre bloques que van
  // juntos (tarjeta ↔ imagen, destacado ↔ rejilla) y ~90px donde empieza una
  // sección nueva. Antes eran 60px para todo: demasiado entre los primeros y
  // demasiado poco entre las segundas.
  gap: $space-lg;
  padding: 90px $space-md $space-xl;
}

.process__header {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  // 30 de base + 60 = los ~90px de aire que el diseño deja bajo la cabecera.
  margin-bottom: $space-xl;
  max-width: 70ch;
}

.process__title {
  font-size: 32px;
  line-height: 36px;
  font-weight: 900;
  letter-spacing: -0.02em;
  text-transform: uppercase;

  @media (width >= 768px) {
    font-size: 44px;
    line-height: 48px;
  }
}

.process__subtitle {
  font-size: $text-title;
  line-height: 24px;
}

.process__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: $radius-panel;
}

// Saltos de sección: el cuerpo y los bloques de cierre abren capítulo.
.process :deep(.prose),
.process :deep(.related),
.process :deep(.chips) {
  margin-top: $space-xl;
}
</style>
