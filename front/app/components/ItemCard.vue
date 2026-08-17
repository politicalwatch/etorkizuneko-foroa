<script setup lang="ts">
import type { RelatedItem } from '~/composables/useItemMeta'

// Tarjeta de proceso o evento. La misma pieza sirve para un proceso (foto de
// fondo) y para un evento (fondo coral, sin foto), porque en el diseño solo
// cambian el fondo y la marca de estado.
//
// `meta` elige qué se lee en la cabecera:
//  - 'status' (por defecto) → marca de estado + fecha. Agenda y rejillas de
//    "Procesos relacionados".
//  - 'vision' → nombre del eje, sin icono ni fecha. Listado de finalizados,
//    donde el estado es siempre el mismo y no aporta nada.
//
// La proporción no la fija la tarjeta sino la rejilla, vía `--card-aspect`:
// el diseño usa una distinta en cada listado.
const props = withDefaults(defineProps<{
  item: RelatedItem
  meta?: 'status' | 'vision'
  visionLabel?: string | null
}>(), {
  meta: 'status',
  visionLabel: null
})

const item = computed(() => props.item)
const { isEvent, statusLabel, dateLabel, ctaLabel, ctaHref, ctaIsExternal } = useItemMeta(item)

const variant = computed(() => {
  if (isEvent.value) return 'event' as const
  const status = props.item.status
  return (status === 'in-progress' || status === 'finished' ? status : 'upcoming') as
    'upcoming' | 'in-progress' | 'finished'
})

const assetId = computed(
  () => (props.item.mainImage as { asset?: { _ref?: string } } | undefined)?.asset?._ref
)
</script>

<template>
  <article
    class="item-card"
    :class="{ 'item-card--event': isEvent }"
  >
    <SanityImage
      v-if="!isEvent && assetId"
      class="item-card__image"
      :asset-id="assetId"
      auto="format"
      :w="560"
      alt=""
    />

    <div class="item-card__body">
      <header class="item-card__meta">
        <template v-if="meta === 'vision'">
          <span class="item-card__vision">{{ visionLabel }}</span>
        </template>

        <template v-else>
          <UiStatusTag
            :label="statusLabel"
            :variant="variant"
          />
          <span
            v-if="dateLabel"
            class="item-card__date"
          >{{ dateLabel }}</span>
        </template>
      </header>

      <div class="item-card__text">
        <h3 class="item-card__title">
          {{ item.title }}
        </h3>
        <p
          v-if="item.subtitle"
          class="item-card__subtitle"
        >
          {{ item.subtitle }}
        </p>

        <!-- Los eventos aún no tienen página propia: su único destino es la
             inscripción externa, así que aquí no hay enlace envolvente. -->
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
.item-card {
  // Las píldoras de dentro se invierten contra el fondo de la tarjeta,
  // no contra el de la página.
  --pill-fill: #{$paper};
  --pill-ink: #{$ink};

  position: relative;
  display: flex;
  flex-direction: column;
  // La rejilla decide la proporción; 3/4 es la de "Procesos relacionados".
  aspect-ratio: var(--card-aspect, 3 / 4);
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

.item-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.item-card__body {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: $space-lg;
  padding: $space-md;
}

// Sobre foto hace falta velo; sobre el coral del evento no.
.item-card:not(.item-card--event) .item-card__body {
  background-image: linear-gradient(
    to bottom,
    rgb(0 0 0 / 50%) 0%,
    rgb(0 0 0 / 10%) 30%,
    rgb(0 0 0 / 45%) 100%
  );
}

.item-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-sm;
}

.item-card__date {
  font-size: $text-caption;
  line-height: 16px;
}

.item-card__vision {
  font-size: $text-caption;
  line-height: 16px;
}

.item-card__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-xs;
}

.item-card__title {
  font-size: $text-title;
  line-height: 24px;
  font-weight: 700;
  text-transform: uppercase;
}

.item-card__subtitle {
  font-size: $text-body;
  line-height: 19px;
}

.item-card__text :deep(.ui-pill) {
  margin-top: $space-xs;
}
</style>
