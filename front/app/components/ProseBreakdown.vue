<script setup lang="ts">
// Desglose de datos: barras horizontales con su porcentaje.
// El porcentaje se escribe dentro de la barra, o justo fuera cuando la barra
// es demasiado corta para que quepa (así el 0% sigue siendo legible).
const props = defineProps<{
  value: {
    title?: string
    rows?: { _key: string, label?: string, value?: number }[]
  }
}>()

const rows = computed(() => props.value?.rows ?? [])

// Por debajo de este ancho la cifra no cabe dentro de la barra.
const INSIDE_THRESHOLD = 12
</script>

<template>
  <div class="breakdown">
    <p
      v-if="value.title"
      class="breakdown__title"
    >
      {{ value.title }}
    </p>

    <dl class="breakdown__rows">
      <template
        v-for="row in rows"
        :key="row._key"
      >
        <dt class="breakdown__label">
          {{ row.label }}
        </dt>
        <dd class="breakdown__track">
          <div
            class="breakdown__bar"
            :class="{ 'breakdown__bar--narrow': (row.value ?? 0) < INSIDE_THRESHOLD }"
            :style="{ width: `${Math.min(Math.max(row.value ?? 0, 0), 100)}%` }"
          >
            <span class="breakdown__value">{{ row.value ?? 0 }}%</span>
          </div>
        </dd>
      </template>
    </dl>
  </div>
</template>

<style lang="scss" scoped>
.breakdown {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}

.breakdown__title {
  font-size: $text-body;
  line-height: 19px;
  font-weight: 700;
}

.breakdown__rows {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  // 29px de separación + 28px de barra = los 57px de paso del diseño.
  gap: 29px $space-md;
  margin: 0;
}

.breakdown__label {
  font-size: $text-body;
  line-height: 19px;
  text-align: right;
  color: var(--surface-muted, currentcolor);
}

.breakdown__track {
  position: relative;
  height: 28px;
  margin: 0;
  border-radius: 9999px;
  background-color: var(--color-chart-track);
}

.breakdown__bar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-width: 20px;
  border-radius: 9999px;
  background-color: var(--color-chart);
  transition: width 0.4s ease;
}

.breakdown__value {
  font-size: $text-caption;
  line-height: 1;
  font-weight: 700;
  color: $paper;
}

// Barra demasiado corta: la cifra se sale a la derecha y se tiñe de magenta
// para seguir leyéndose sobre el carril gris.
.breakdown__bar--narrow {
  justify-content: flex-start;
  background-color: transparent;

  .breakdown__value {
    position: absolute;
    left: 50%;
    color: var(--color-chart);
  }
}
</style>
