<script setup lang="ts">
// Cabecera de sección de la portada: titular, texto y un botón que lleva al
// listado completo. Se repite tal cual en "Está pasando", "Procesos
// finalizados" y "Visiones de futuro".
//
// Ocupa media caja en escritorio (915 de 1860 en el diseño) aunque la rejilla
// que va debajo sea de ancho completo.
//
// El botón entra por slot en vez de por props: en cada sección cambia el
// destino y el texto, y así se usa `UiPill` directamente sin envolverlo.
defineProps<{
  title?: string | null
  body?: unknown
}>()
</script>

<template>
  <header class="home-section">
    <h2
      v-if="title"
      class="home-section__title"
    >
      {{ title }}
    </h2>

    <ProseText
      v-if="body"
      :value="body"
    />

    <div
      v-if="$slots.cta"
      class="home-section__cta"
    >
      <slot name="cta" />
    </div>
  </header>
</template>

<style lang="scss" scoped>
.home-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-sm;
  max-width: 70ch;
}

.home-section__title {
  font-size: $text-title;
  line-height: 24px;
  font-weight: 900;
  letter-spacing: -0.02em;

  @media (width >= 768px) {
    font-size: 32px;
    line-height: 36px;
  }
}

// En la portada el texto va un punto más grande que en el resto del sitio
// (20px en escritorio, frente a los 16 que trae ProseText). Se impone con
// `:deep` porque si no las dos reglas empatarían en especificidad y decidiría
// el orden en que acaben en la hoja de estilos.
.home-section :deep(.prose-text) {
  @media (width >= 768px) {
    font-size: $text-title;
    line-height: 24px;
  }
}

.home-section__cta {
  margin-top: $space-xs;

  @media (width >= 768px) {
    margin-top: $space-sm;
  }
}
</style>
