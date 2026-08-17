<script setup lang="ts">
// Cabecera de la portada: foto a toda pantalla con un velo, el resplandor coral
// encima y el claim abajo (nodos 3160:114 en escritorio, 3018:117 en móvil).
//
// El resplandor es el mismo lienzo del listado de ejes pero sin los anillos
// (ver la nota en HeroComposition).
//
// El diseño no pone ningún titular visible aquí: el claim es el texto más
// grande de la página, pero es texto enriquecido y un <p> no puede ir dentro de
// un <h1>. Así que el H1 va oculto con el nombre del sitio, para que la página
// tenga encabezado en el árbol de accesibilidad y en los buscadores.
const props = defineProps<{
  image?: unknown
  claim?: unknown
}>()

const { data: settings } = useSiteSettings()
const siteTitle = computed(() => settings.value?.siteTitle || 'Etorkizuneko Foroa')

const assetId = computed(
  () => (props.image as { asset?: { _ref?: string } } | undefined)?.asset?._ref
)
</script>

<template>
  <section class="banner">
    <SanityImage
      v-if="assetId"
      class="banner__image"
      :asset-id="assetId"
      auto="format"
      :w="1920"
      alt=""
    />

    <div class="banner__scrim" />

    <HeroComposition
      class="banner__glow"
      :rings="false"
    />

    <div class="banner__content">
      <h1 class="sr-only">
        {{ siteTitle }}
      </h1>

      <ProseText
        v-if="claim"
        class="banner__claim"
        :value="claim"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.banner {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  // Alturas del diseño (720 en móvil, 930 en escritorio), con tope en la altura
  // de la ventana para que en pantallas bajas no haya que hacer scroll solo
  // para pasar de la cabecera. `svh` evita el salto de la barra del navegador.
  height: min(720px, 88svh);
  padding: 0 $space-md $space-lg;
  border-bottom-left-radius: $radius-panel;
  border-bottom-right-radius: $radius-panel;
  overflow: hidden;
  color: $paper;
  background-color: $ink;
  isolation: isolate;

  @media (width >= 1024px) {
    height: min(930px, 90svh);
    padding-bottom: $space-xl;
  }
}

.banner__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

// Velo del diseño: negro al 25% sobre la foto.
.banner__scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-color: $scrim;
}

// Centrado en horizontal y anclado a la parte alta, como en el diseño. El ancho
// sale de la proporción del lienzo (410 de 440 en móvil, 810 de 1920 en
// escritorio); el alto lo pone su viewBox cuadrado.
.banner__glow {
  position: absolute;
  z-index: 2;
  top: 20%;
  left: 50%;
  width: 93%;
  transform: translateX(-50%);

  @media (width >= 1024px) {
    top: 6%;
    width: 42%;
  }
}

.banner__content {
  position: relative;
  z-index: 3;
}

// El tamaño se impone desde fuera porque ProseText trae el suyo (16px) y aquí
// el claim va más grande. Con `:deep` el selector gana en especificidad; si se
// pusiera la clase suelta, ambas reglas empatarían y decidiría el orden.
.banner__content :deep(.prose-text) {
  font-size: $text-title;
  line-height: 24px;

  @media (width >= 1024px) {
    font-size: 24px;
    line-height: 28px;
  }
}
</style>
