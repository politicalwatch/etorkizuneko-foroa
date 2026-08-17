<script setup lang="ts">
// Marca de estado de la esquina superior izquierda de las tarjetas.
// El diseño distingue los tres estados por el icono, no por el color:
//  - Próximamente → círculo vacío
//  - En marcha    → círculo relleno en coral
//  - Finalizado   → círculo relleno
//  - Evento       → estrella
defineProps<{
  label: string
  variant: 'upcoming' | 'in-progress' | 'finished' | 'event'
}>()
</script>

<template>
  <span class="status">
    <svg
      class="status__icon"
      viewBox="0 0 10 10"
      aria-hidden="true"
    >
      <path
        v-if="variant === 'event'"
        d="M5 0 6.2 3.5 10 3.7 7 6 8 9.7 5 7.6 2 9.7 3 6 0 3.7 3.8 3.5Z"
        fill="currentColor"
      />
      <circle
        v-else
        cx="5"
        cy="5"
        r="4"
        :fill="variant === 'upcoming' ? 'none' : 'currentColor'"
        :stroke="variant === 'upcoming' ? 'currentColor' : 'none'"
        stroke-width="1"
      />
    </svg>
    {{ label }}
  </span>
</template>

<style lang="scss" scoped>
.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: $text-caption;
  line-height: 16px;
  color: inherit;
}

.status__icon {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
}
</style>
