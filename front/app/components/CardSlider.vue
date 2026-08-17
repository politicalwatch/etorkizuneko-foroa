<script setup lang="ts">
import type { RelatedItem } from '~/composables/useItemMeta'

// Carrusel de tarjetas con botones de avance, tal y como sale en la portada
// (nodos 3160:397 en escritorio y 3017:75 en móvil).
//
// No sirve `RelatedGrid`: allí el escritorio es una rejilla fija de cuatro sin
// controles. Aquí se cargan más tarjetas de las que caben y el diseño pone un
// par de botones para recorrerlas, así que sigue siendo una lista desplazable
// también en pantalla grande.
//
// Los botones se ocultan cuando no hay nada que desplazar: un control que no
// hace nada confunde, y en el teclado sigue funcionando el desplazamiento con
// las flechas sobre la propia lista.
defineProps<{ items: RelatedItem[] }>()

const { t } = useI18n()

const list = useTemplateRef<HTMLUListElement>('list')
const canPrev = ref(false)
const canNext = ref(false)

function update() {
  const el = list.value
  if (!el) return
  // 1px de margen: los navegadores devuelven scrollLeft fraccionario y el
  // extremo derecho nunca cuadra exacto.
  canPrev.value = el.scrollLeft > 1
  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

function page(direction: 1 | -1) {
  const el = list.value
  if (!el) return
  el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' })
}

onMounted(() => {
  update()
  window.addEventListener('resize', update)
})

onBeforeUnmount(() => window.removeEventListener('resize', update))
</script>

<template>
  <div
    v-if="items.length"
    class="slider"
  >
    <ul
      ref="list"
      class="slider__list"
      @scroll.passive="update"
    >
      <li
        v-for="item in items"
        :key="item._id"
        class="slider__item"
      >
        <ItemCard :item="item" />
      </li>
    </ul>

    <div
      v-if="canPrev || canNext"
      class="slider__controls"
    >
      <UiPill
        button
        :aria-label="t('home.prev')"
        :disabled="!canPrev"
        @click="page(-1)"
      >
        <span aria-hidden="true">←</span>
      </UiPill>

      <UiPill
        button
        :aria-label="t('home.next')"
        :disabled="!canNext"
        @click="page(1)"
      >
        <span aria-hidden="true">→</span>
      </UiPill>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.slider {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
}

.slider__list {
  display: grid;
  grid-auto-flow: column;
  // Anchos del diseño: 300 de 440 en móvil, 450 de 1860 (cuatro a la vista) en
  // escritorio.
  grid-auto-columns: 68%;
  gap: $space-md;
  list-style: none;
  padding: 0 0 $space-xs;
  margin: 0;

  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;

  @media (width >= 640px) {
    grid-auto-columns: 42%;
  }

  @media (width >= 1024px) {
    grid-auto-columns: calc((100% - 3 * #{$space-md}) / 4);
    gap: $space-md;
  }
}

.slider__item {
  scroll-snap-align: start;
}

.slider__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// Un extremo del carrusel deja su botón sin recorrido: se mantiene visible para
// que la pareja no baile, pero apagado.
.slider__controls :deep(.ui-pill[disabled]) {
  opacity: 0.35;
  cursor: default;
  pointer-events: none;
}
</style>
