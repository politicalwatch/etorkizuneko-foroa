<script setup lang="ts">
import type { RelatedItem } from '~/composables/useItemMeta'

// Tarjeta ancha de cabecera: el proceso que abre inscripciones en la página del
// eje, y el evento asociado en la página de un proceso finalizado. Es la misma
// pieza que ItemCard pero apaisada y con las fechas completas.
const props = defineProps<{ item: RelatedItem }>()

const item = computed(() => props.item)
const { isEvent, statusLabel, ctaLabel, ctaHref, ctaIsExternal } = useItemMeta(item)
const { formatRange, formatShort } = useDateFormat()

const variant = computed(() => {
  if (isEvent.value) return 'event' as const
  const status = props.item.status
  return (status === 'in-progress' || status === 'finished' ? status : 'upcoming') as
    'upcoming' | 'in-progress' | 'finished'
})

// El proceso muestra el rango de convocatoria; el evento, su día.
const dateLabel = computed(() =>
  isEvent.value
    ? formatShort(props.item.datetime, true)
    : formatRange(props.item.startDate, props.item.endDate)
)

const assetId = computed(
  () => (props.item.mainImage as { asset?: { _ref?: string } } | undefined)?.asset?._ref
)
</script>

<template>
  <article
    class="featured"
    :class="{ 'featured--event': isEvent }"
  >
    <SanityImage
      v-if="!isEvent && assetId"
      class="featured__image"
      :asset-id="assetId"
      auto="format"
      :w="1600"
      alt=""
    />

    <div class="featured__body">
      <header class="featured__meta">
        <UiStatusTag
          :label="statusLabel"
          :variant="variant"
        />
        <span
          v-if="dateLabel"
          class="featured__date"
        >{{ dateLabel }}</span>
      </header>

      <div class="featured__text">
        <h2 class="featured__title">
          {{ item.title }}
        </h2>
        <p
          v-if="item.subtitle"
          class="featured__subtitle"
        >
          {{ item.subtitle }}
        </p>

        <UiPill
          v-if="ctaHref && ctaIsExternal"
          :href="ctaHref"
        >
          {{ ctaLabel }}
        </UiPill>
        <UiPill
          v-else-if="ctaHref"
          :to="ctaHref"
        >
          {{ ctaLabel }}
        </UiPill>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.featured {
  --pill-fill: #{$paper};
  --pill-ink: #{$ink};

  position: relative;
  border-radius: $radius-card;
  overflow: hidden;
  color: $paper;
  background-color: $ink;
  isolation: isolate;

  &--event {
    background-color: $brand;
    --pill-ink: #{$brand};
  }
}

.featured__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.featured__body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: $space-xl;
  min-height: 260px;
  padding: $space-md;

  @media (width >= 768px) {
    min-height: 320px;
  }
}

.featured:not(.featured--event) .featured__body {
  background-image: linear-gradient(
    to bottom,
    rgb(0 0 0 / 45%) 0%,
    rgb(0 0 0 / 10%) 40%,
    rgb(0 0 0 / 50%) 100%
  );
}

.featured__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-sm;
}

.featured__date {
  font-size: $text-caption;
  line-height: 16px;
}

.featured__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-xs;
}

.featured__title {
  font-size: $text-title;
  line-height: 24px;
  font-weight: 700;
  text-transform: uppercase;
}

.featured__subtitle {
  font-size: $text-body;
  line-height: 19px;
  max-width: 46ch;
}

.featured__text :deep(.ui-pill) {
  margin-top: $space-xs;
}
</style>
