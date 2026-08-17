<script setup lang="ts">
import type { PortableTextComponents } from '@portabletext/vue'
import ProseLink from './ProseLink.vue'
import ProseStat from './ProseStat.vue'
import ProseBreakdown from './ProseBreakdown.vue'
import ProseGallery from './ProseGallery.vue'
import ProseTestimonial from './ProseTestimonial.vue'
import { toBlocks } from '~/types/portable-text'

// Cuerpo largo de un eje o un proceso.
//
// El contenido es una única corriente (párrafos, subtítulos y bloques de dato
// intercalados). En móvil se lee tal cual; en escritorio el diseño manda el
// texto a la columna izquierda y los datos a la derecha. Eso se resuelve con
// una rejilla y `grid-column` por tipo de bloque: la colocación automática de
// CSS Grid deja cada dato a la altura del párrafo junto al que se escribió,
// que es justo lo que hace el diseño.
// El tipo que genera TypeGen para el cuerpo es específico de cada query, así
// que se recibe suelto y se normaliza aquí.
const props = defineProps<{ value?: unknown }>()

const blocks = computed(() => toBlocks(props.value))

// Los componentes declaran solo la prop `value`; Portable Text les pasa además
// `index`, `isInline` y `renderNode`, que no se usan. El aserto evita tener que
// declarar esas props en cada bloque solo para contentar al tipo.
const components = {
  marks: { link: ProseLink },
  types: {
    statHighlight: ProseStat,
    dataBreakdown: ProseBreakdown,
    gallery: ProseGallery,
    testimonial: ProseTestimonial
  }
} as PortableTextComponents
</script>

<template>
  <div
    v-if="blocks.length"
    class="prose"
  >
    <SanityContent
      :value="blocks"
      :components="components"
    />
  </div>
</template>

<style lang="scss" scoped>
.prose {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-md;

  @media (width >= 1024px) {
    grid-template-columns: 1fr 1fr;
    column-gap: $space-xl;
    row-gap: $space-lg;
  }
}

// Los hijos los pinta SanityContent, así que hay que atravesar el scope.
.prose :deep(> *) {
  grid-column: 1;
  margin: 0;
  font-size: $text-body;
  line-height: 19px;
}

.prose :deep(> h2) {
  font-size: $text-title;
  line-height: 24px;
  font-weight: 700;
  margin-top: $space-lg;
}

.prose :deep(> h2:first-child) {
  margin-top: 0;
}

.prose :deep(strong) {
  font-weight: 700;
}

.prose :deep(a) {
  color: $brand;
  text-decoration: underline;
}

.prose :deep(> ul) {
  padding-left: 1.2em;
  list-style: disc;
}

// Columna derecha en escritorio: los datos.
@media (width >= 1024px) {
  .prose :deep(> .prose-stat),
  .prose :deep(> .breakdown) {
    grid-column: 2;
  }

  // Un dato escrito justo después de un subtítulo comparte fila con él. Como el
  // subtítulo lleva margen superior para separar secciones y el dato no, el dato
  // quedaría 30px más arriba; se le da el mismo margen para que ambos empiecen
  // a la misma altura, como en el diseño.
  .prose :deep(> h2 + .prose-stat),
  .prose :deep(> h2 + .breakdown) {
    margin-top: $space-lg;
  }

  // A todo lo ancho: galería y testimonio.
  .prose :deep(> .gallery),
  .prose :deep(> .testimonial) {
    grid-column: 1 / -1;
    margin-block: $space-lg;
  }
}
</style>
