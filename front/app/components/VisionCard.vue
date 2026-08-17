<script setup lang="ts">
// Tarjeta de un eje en el listado /ejes: la imagen ocupa toda la tarjeta, el
// título y el resumen van arriba sobre un velo oscuro y el botón abajo.
const props = defineProps<{
  slug?: string | null
  title?: string | null
  excerpt?: string | null
  image?: unknown
}>()

const { t } = useI18n()
const to = computed(() => (props.slug ? `/ejes/${props.slug}` : undefined))
</script>

<template>
  <article class="vision-card">
    <NuxtLinkLocale
      v-if="to"
      :to="to"
      class="vision-card__hit"
      :aria-label="title ?? undefined"
    />

    <SanityImage
      v-if="image"
      class="vision-card__image"
      v-bind="{ assetId: (image as { asset?: { _ref?: string } })?.asset?._ref }"
      auto="format"
      :w="720"
      alt=""
    />

    <div class="vision-card__body">
      <div class="vision-card__text">
        <h3 class="vision-card__title">
          {{ title }}
        </h3>
        <p
          v-if="excerpt"
          class="vision-card__excerpt"
        >
          {{ excerpt }}
        </p>
      </div>

      <UiPill
        v-if="to"
        :to="to"
        tabindex="-1"
        aria-hidden="true"
      >
        {{ t('common.readMore') }}
      </UiPill>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.vision-card {
  --pill-fill: #{$paper};
  --pill-ink: #{$ink};

  position: relative;
  display: flex;
  flex-direction: column;
  aspect-ratio: 4 / 3;
  border: 1px solid var(--surface-line, rgb(255 255 255 / 35%));
  border-radius: $radius-card;
  overflow: hidden;
  color: $paper;
  transition: border-color 0.2s ease;
  isolation: isolate;

  &:hover,
  &:focus-within {
    border-color: $brand;
  }
}

// Un único enlace que cubre la tarjeta: mantiene un solo destino en el orden
// de tabulación (el botón "Leer más" es decorativo, con aria-hidden).
.vision-card__hit {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.vision-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.vision-card__body {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: $space-lg;
  padding: $space-md;

  // Velo para que el texto se lea sobre cualquier foto.
  background-image: linear-gradient(
    to bottom,
    rgb(0 0 0 / 55%) 0%,
    rgb(0 0 0 / 15%) 45%,
    rgb(0 0 0 / 0%) 100%
  );
}

.vision-card__text {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}

.vision-card__title {
  font-size: $text-title;
  line-height: 24px;
  font-weight: 700;
}

.vision-card__excerpt {
  font-size: $text-body;
  line-height: 19px;
}

.vision-card__body :deep(.ui-pill) {
  align-self: flex-start;
}
</style>
