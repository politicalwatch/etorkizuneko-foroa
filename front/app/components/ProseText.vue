<script setup lang="ts">
import type { PortableTextComponents } from '@portabletext/vue'
import ProseLink from './ProseLink.vue'
import { toBlocks } from '~/types/portable-text'

// Texto enriquecido simple: entradillas y pies de dato. A diferencia de
// ProseBody no monta la rejilla de dos columnas — es texto corrido y debe
// ocupar todo el ancho que le dé su contenedor.
const props = defineProps<{ value?: unknown }>()

const blocks = computed(() => toBlocks(props.value))

const components = { marks: { link: ProseLink } } as PortableTextComponents
</script>

<template>
  <div
    v-if="blocks.length"
    class="prose-text"
  >
    <SanityContent
      :value="blocks"
      :components="components"
    />
  </div>
</template>

<style lang="scss" scoped>
.prose-text {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  font-size: $text-body;
  line-height: 19px;

  :deep(p) {
    margin: 0;
  }

  :deep(strong) {
    font-weight: 700;
  }

  :deep(a) {
    color: $brand;
    text-decoration: underline;
  }
}
</style>
