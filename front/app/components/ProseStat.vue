<script setup lang="ts">
import ProseText from './ProseText.vue'

// Dato destacado incrustado en el cuerpo: cifra grande en coral + pie.
// El pie es texto enriquecido (`richText`), así que lo pinta ProseText.
defineProps<{
  value: {
    value?: string
    caption?: unknown
  }
}>()
</script>

<template>
  <div class="prose-stat">
    <p class="prose-stat__value">
      {{ value.value }}
    </p>
    <ProseText
      class="prose-stat__caption"
      :value="value.caption"
    />
  </div>
</template>

<style lang="scss" scoped>
.prose-stat {
  display: flex;
  // Arriba, no por la línea base: en el diseño la primera línea del pie empieza
  // a la altura del borde superior de la cifra. Con `baseline` el pie caería al
  // pie de un número que mide tres veces más.
  align-items: flex-start;
  gap: $space-lg;
  color: $brand;
}

.prose-stat__value {
  flex-shrink: 0;
  font-size: 40px;
  line-height: 44px;
  font-weight: 900;
  letter-spacing: -0.02em;

  @media (width >= 768px) {
    font-size: 56px;
    line-height: 60px;
  }
}

.prose-stat__caption {
  font-size: $text-body;
  line-height: 19px;
  // Sin tope, el pie se estira hasta el borde de la columna y queda en dos
  // líneas larguísimas; en el diseño respira en tres cortas.
  max-width: 46ch;

  :deep(strong) {
    font-weight: 700;
  }

  :deep(a) {
    text-decoration: underline;
  }
}
</style>
