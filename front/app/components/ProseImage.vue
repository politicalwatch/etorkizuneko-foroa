<script setup lang="ts">
// Imagen suelta del cuerpo, con su pie. A diferencia de la galería, que recorta
// las fotos a una rejilla, aquí se respeta la proporción original.
//
// El ancho lo decide `layout`, pero no lo aplica este componente: quien coloca
// el bloque en la fila entera o en la columna de texto es ProseBody. Aquí la
// imagen simplemente llena el hueco que le toque.
const props = defineProps<{
  value: {
    alt?: string
    caption?: string
    layout?: 'wide' | 'narrow'
    asset?: { _ref?: string }
  }
}>()

const assetId = computed(() => props.value?.asset?._ref)

const isNarrow = computed(() => props.value?.layout === 'narrow')

// Cuánto de ancha se ve la imagen, para que el navegador elija del srcset.
//
// El cuerpo no vive dentro de un contenedor con ancho máximo: se estira con la
// ventana. Así que el hueco no se puede dar en píxeles fijos — en un monitor
// grande una imagen ancha pasa de 1.500 px, y pedir menos es justo lo que se
// veía pixelado. Declarándolo en vw, @nuxt/image reparte las variantes por
// pantalla y densidad y el navegador elige.
//
// `narrow` baja a media fila en `lg`, que es el 1024px donde ProseBody abre
// las dos columnas.
//
// OJO con el formato: hay que nombrar TODAS las pantallas. Una medida suelta
// («100vw») no es el valor por defecto que parece — @nuxt/image la registra
// bajo la clave "1px" y acaba generando una variante de 1 píxel de ancho. Y
// una pantalla que no exista en la configuración («xs») se descarta sin avisar.
const sizes = computed(() =>
  isNarrow.value
    ? 'sm:100vw md:100vw lg:50vw xl:50vw 2xl:50vw'
    : 'sm:100vw md:100vw lg:100vw xl:100vw 2xl:100vw'
)

// Medidas de referencia para los atributos width/height del <img>: no fijan el
// tamaño (manda el CSS), pero le dan al navegador la proporción con la que
// reservar el hueco antes de descargar nada, así la página no da el salto.
// Se toman del id del asset, que las lleva dentro.
const ratio = computed(() => {
  const match = assetId.value?.match(/-(\d+)x(\d+)-[a-z]+$/)
  if (!match) return null

  const width = Number(match[1])
  const height = Number(match[2])
  // Un ancho de referencia cualquiera vale mientras la proporción sea la del
  // original; se acota para no escribir un atributo de 4.000 px.
  const boxWidth = Math.min(width, 1600)
  return { width: boxWidth, height: Math.round((boxWidth * height) / width) }
})
</script>

<template>
  <figure
    v-if="assetId"
    class="prose-image"
  >
    <SanityImage
      class="prose-image__image"
      :asset-id="assetId"
      auto="format"
      :sizes="sizes"
      :width="ratio?.width"
      :height="ratio?.height"
      :alt="value.alt ?? ''"
    />
    <figcaption
      v-if="value.caption"
      class="prose-image__caption"
    >
      {{ value.caption }}
    </figcaption>
  </figure>
</template>

<style lang="scss" scoped>
.prose-image {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  margin: 0;
}

.prose-image__image {
  display: block;
  width: 100%;
  // Con los atributos width/height del <img>, `auto` mantiene la proporción
  // en vez de estirar la imagen al alto que se haya servido.
  height: auto;
  border-radius: $radius-card;
}

.prose-image__caption {
  font-size: $text-caption;
  line-height: 16px;
}
</style>
