<script setup lang="ts">
import type { RelatedItem } from '~/composables/useItemMeta'

// "Procesos relacionados". En escritorio es una rejilla de cuatro; en móvil el
// diseño lo resuelve como carrusel, así que se deja desplazable con anclaje
// (scroll-snap) en vez de duplicar el marcado.
defineProps<{
  items: RelatedItem[]
  title?: string
}>()

const { t } = useI18n()
</script>

<template>
  <section
    v-if="items.length"
    class="related"
  >
    <h2 class="related__title">
      {{ title ?? t('vision.relatedProcesses') }}
    </h2>

    <ul class="related__list">
      <li
        v-for="item in items"
        :key="item._id"
        class="related__item"
      >
        <ItemCard :item="item" />
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.related {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.related__title {
  font-size: $text-title;
  line-height: 24px;
  font-weight: 700;
}

.related__list {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 78%;
  gap: $space-md;
  list-style: none;
  padding: 0 0 $space-sm;
  margin: 0;

  // Carrusel en móvil
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;

  @media (width >= 640px) {
    grid-auto-columns: 42%;
  }

  // A partir de aquí caben las cuatro: rejilla estática, sin desplazamiento.
  @media (width >= 1024px) {
    grid-auto-flow: row;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-columns: auto;
    overflow-x: visible;
  }
}

.related__item {
  scroll-snap-align: start;
}
</style>
