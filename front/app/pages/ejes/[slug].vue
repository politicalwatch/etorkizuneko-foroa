<script setup lang="ts">
import { VISION_BY_SLUG_QUERY } from '~/queries/vision'

// Esta página va sobre negro: lo leen app.vue, el header y el footer.
definePageMeta({ surface: 'dark' })

const route = useRoute()
const { locale, t } = useI18n()

const { data: vision } = await useSanityQuery(VISION_BY_SLUG_QUERY, {
  slug: route.params.slug as string,
  lang: locale.value
})

if (!vision.value) {
  throw createError({ statusCode: 404, statusMessage: 'Eje no encontrado' })
}

const crumbs = computed(() => [{ label: t('nav.visions'), to: '/ejes' }])

const assetId = computed(
  () => (vision.value?.mainImage as { asset?: { _ref?: string } } | undefined)?.asset?._ref
)

useSeoMeta({ title: () => vision.value?.title ?? '' })
</script>

<template>
  <div class="vision">
    <header class="vision__header">
      <AppBreadcrumbs :items="crumbs" />
      <h1 class="vision__title">
        {{ vision?.title }}
      </h1>
      <ProseText
        v-if="vision?.lede"
        class="vision__lede"
        :value="vision.lede"
      />
    </header>

    <FeaturedCard
      v-if="vision?.featured"
      :item="vision.featured"
    />

    <SanityImage
      v-if="assetId"
      class="vision__image"
      :asset-id="assetId"
      auto="format"
      :w="1920"
      alt=""
    />

    <ProseBody
      v-if="vision?.body"
      :value="vision.body"
    />

    <RelatedGrid :items="vision?.related ?? []" />

    <VisionChips
      :visions="vision?.visions ?? []"
      :current-slug="vision?.slug"
    />
  </div>
</template>

<style lang="scss" scoped>
.vision {
  display: flex;
  flex-direction: column;
  // Ritmo de dos niveles, medido sobre el diseño: 30px entre bloques que van
  // juntos (tarjeta ↔ imagen, destacado ↔ rejilla) y ~90px donde empieza una
  // sección nueva. Antes eran 60px para todo: demasiado entre los primeros y
  // demasiado poco entre las segundas.
  gap: $space-lg;
  padding: 90px $space-md $space-xl;
}

.vision__header {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  // 30 de base + 60 = los ~90px de aire que el diseño deja bajo la cabecera.
  margin-bottom: $space-xl;
  max-width: 70ch;
}

.vision__title {
  font-size: 32px;
  line-height: 36px;
  font-weight: 900;
  letter-spacing: -0.02em;

  @media (width >= 768px) {
    font-size: 44px;
    line-height: 48px;
  }
}

.vision__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: $radius-panel;
}

// Saltos de sección: el cuerpo y los bloques de cierre abren capítulo.
.vision :deep(.prose),
.vision :deep(.related),
.vision :deep(.chips) {
  margin-top: $space-xl;
}
</style>
