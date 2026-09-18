<script setup lang="ts">
import type { PortableTextComponents } from '@portabletext/vue'
import ProseLink from './ProseLink.vue'
import ProseStat from './ProseStat.vue'
import ProseBreakdown from './ProseBreakdown.vue'
import ProseGallery from './ProseGallery.vue'
import ProseImage from './ProseImage.vue'
import ProseTestimonial from './ProseTestimonial.vue'
import { toBlocks, type PortableBlock } from '~/types/portable-text'

// Cuerpo largo de un eje o un proceso.
//
// El contenido llega como una única corriente (párrafos, subtítulos y bloques
// de dato intercalados), pero el diseño lo ordena en secciones: el subtítulo
// abre una banda propia y debajo va una fila de dos columnas — el texto a la
// izquierda, los datos a la derecha — que arrancan a la misma altura.
//
// Antes esto se dejaba en manos de la colocación automática de CSS Grid sobre
// la corriente plana. Esa colocación depende del ORDEN en que se escriban los
// bloques: un dato escrito antes que su párrafo se quedaba en una fila para él
// solo y abría un hueco a la izquierda. Por eso la corriente se agrupa aquí en
// secciones y cada columna se monta como una pila independiente.
//
// El tipo que genera TypeGen para el cuerpo es específico de cada query, así
// que se recibe suelto y se normaliza aquí.
const props = defineProps<{ value?: unknown }>()

// Bloques que van a la columna derecha…
const DATA_TYPES = new Set(['statHighlight', 'dataBreakdown'])
// …y bloques que ocupan todo el ancho, así que cierran la sección en curso.
const FULL_TYPES = new Set(['gallery', 'testimonial'])

// La imagen suelta es el único bloque que elige su ancho: el editor decide si
// ocupa la fila entera o si se queda en la columna de texto, fluyendo entre los
// párrafos como uno más. `wide` es el valor por defecto en el Studio, así que
// solo `narrow` la devuelve a la columna.
const isFullWidth = (block: PortableBlock) =>
  FULL_TYPES.has(block._type)
  || (block._type === 'contentImage' && block.layout !== 'narrow')

interface Section {
  heading: PortableBlock | null
  text: PortableBlock[]
  data: PortableBlock[]
  full: PortableBlock | null
}

const isHeading = (block: PortableBlock) => block._type === 'block' && block.style === 'h2'

const sections = computed<Section[]>(() => {
  const out: Section[] = []
  const blank = (heading: PortableBlock | null = null): Section => ({
    heading,
    text: [],
    data: [],
    full: null
  })

  let current = blank()
  const flush = () => {
    if (current.heading || current.text.length || current.data.length) out.push(current)
  }

  for (const block of toBlocks(props.value)) {
    if (isFullWidth(block)) {
      flush()
      out.push({ ...blank(), full: block })
      current = blank()
    }
    else if (isHeading(block)) {
      flush()
      current = blank(block)
    }
    else if (DATA_TYPES.has(block._type)) {
      current.data.push(block)
    }
    else {
      current.text.push(block)
    }
  }
  flush()

  return out
})

// Los componentes declaran solo la prop `value`; Portable Text les pasa además
// `index`, `isInline` y `renderNode`, que no se usan. El aserto evita tener que
// declarar esas props en cada bloque solo para contentar al tipo.
const components = {
  marks: { link: ProseLink },
  types: {
    statHighlight: ProseStat,
    dataBreakdown: ProseBreakdown,
    gallery: ProseGallery,
    contentImage: ProseImage,
    testimonial: ProseTestimonial
  }
} as PortableTextComponents
</script>

<template>
  <div
    v-if="sections.length"
    class="prose"
  >
    <template
      v-for="(section, index) in sections"
      :key="index"
    >
      <div
        v-if="section.full"
        class="prose__full"
      >
        <SanityContent
          :value="[section.full]"
          :components="components"
        />
      </div>

      <div
        v-else
        class="prose__section"
      >
        <SanityContent
          v-if="section.heading"
          :value="[section.heading]"
          :components="components"
        />

        <div class="prose__cols">
          <div
            v-if="section.text.length"
            class="prose__col prose__col--text"
          >
            <SanityContent
              :value="section.text"
              :components="components"
            />
          </div>
          <div
            v-if="section.data.length"
            class="prose__col prose__col--data"
          >
            <SanityContent
              :value="section.data"
              :components="components"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.prose,
.prose__section,
.prose__col {
  display: flex;
  flex-direction: column;
  gap: $space-md;

  @media (width >= 1024px) {
    gap: $space-lg;
  }
}

.prose__col {
  // Sin esto una barra o una palabra larga ensancharían la columna.
  min-width: 0;
}

// La fila de dos columnas del diseño. En móvil se apila: primero el texto de la
// sección y después sus datos.
.prose__cols {
  display: flex;
  flex-direction: column;
  gap: $space-md;

  @media (width >= 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: $space-xl;
    // Cada columna mide lo que su contenido; si no, la corta se estiraría.
    align-items: start;
  }
}

@media (width >= 1024px) {
  // Explícito: una sección con datos pero sin texto deja la izquierda vacía en
  // vez de subir los datos a la primera columna.
  .prose__col--text {
    grid-column: 1;
  }

  .prose__col--data {
    grid-column: 2;
  }

  // A todo lo ancho: galería, imagen ancha y testimonio.
  .prose__full {
    margin-block: $space-lg;
  }
}

// Los bloques los pinta SanityContent, así que hay que atravesar el scope. Solo
// se tocan los HIJOS DIRECTOS de cada columna: dentro de un bloque de dato
// manda su propio componente, que trae sus tamaños del diseño.
.prose__col :deep(> p),
.prose__col :deep(> ul),
.prose__col :deep(> ol) {
  margin: 0;
  font-size: $text-body;
  line-height: 19px;
}

.prose__section :deep(> h2) {
  margin: 0;
  margin-top: $space-lg;
  font-size: $text-title;
  line-height: 24px;
  font-weight: 700;

  // El subtítulo abre su propia banda, pero el texto sigue midiendo lo que la
  // columna izquierda para que rompa igual que en el diseño.
  @media (width >= 1024px) {
    max-width: calc((100% - #{$space-xl}) / 2);
  }
}

.prose__section:first-child :deep(> h2) {
  margin-top: 0;
}

.prose :deep(strong) {
  font-weight: 700;
}

.prose :deep(a) {
  color: $brand;
  text-decoration: underline;
}

.prose__col :deep(> ul) {
  padding-left: 1.2em;
  list-style: disc;
}
</style>
