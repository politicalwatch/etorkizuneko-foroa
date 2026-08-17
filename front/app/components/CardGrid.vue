<script setup lang="ts">
import type { RelatedItem } from '~/composables/useItemMeta'

// Rejilla llana de tarjetas para las páginas de listado (agenda y finalizados).
//
// No sirve `RelatedGrid`: allí el móvil es un carrusel con anclaje, y en estas
// dos páginas el diseño apila las tarjetas a lo largo. Tampoco lleva título
// propio: el H1 de la página ya cumple esa función.
//
// La proporción de tarjeta la fija la rejilla (ver `--card-aspect` en ItemCard)
// porque el diseño usa una distinta según cuántas columnas haya.
interface GridItem extends RelatedItem {
  visionLabel?: string | null
}

withDefaults(defineProps<{
  items: GridItem[]
  columns?: 2 | 3 | 4
  meta?: 'status' | 'vision'
}>(), {
  columns: 3,
  meta: 'status'
})
</script>

<template>
  <ul
    v-if="items.length"
    class="card-grid"
    :class="`card-grid--${columns}`"
  >
    <li
      v-for="item in items"
      :key="item._id"
    >
      <ItemCard
        :item="item"
        :meta="meta"
        :vision-label="item.visionLabel"
      />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-md;
  list-style: none;
  padding: 0;
  margin: 0;

  // Apiladas mientras haya una sola columna.
  --card-aspect: 16 / 9;
}

// Las tarjetas de finalizados llevan más texto encima (eje + título +
// descripción + botón), así que en móvil el diseño las hace casi cuadradas.
.card-grid--2 {
  --card-aspect: 1 / 1;
}

@media (width >= 640px) {
  .card-grid--3,
  .card-grid--4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width >= 1024px) {
  .card-grid--2 {
    grid-template-columns: repeat(2, 1fr);
    --card-aspect: 3 / 2;
  }

  .card-grid--3 {
    grid-template-columns: repeat(3, 1fr);
    --card-aspect: 4 / 3;
  }

  .card-grid--4 {
    grid-template-columns: repeat(4, 1fr);
    --card-aspect: 3 / 4;
  }
}
</style>
