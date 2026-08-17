<script setup lang="ts">
// Banda de estado bajo el título de un proceso. El diseño cambia de forma según
// el estado, no solo de texto:
//  - Próximamente → panel coral con fechas, ubicación y botón de inscripción
//  - En marcha    → barra fina con solo la marca de estado
//  - Finalizado   → no se muestra nada (la cabecera la ocupa el evento asociado)
const props = defineProps<{
  status?: string | null
  startDate?: string | null
  endDate?: string | null
  place?: { city?: string | null, virtual?: boolean | null } | null
  registrationLink?: string | null
}>()

const { t } = useI18n()
const { formatRange } = useDateFormat()

const dates = computed(() => formatRange(props.startDate, props.endDate))

const placeLabel = computed(() => {
  if (!props.place) return ''
  return props.place.virtual ? t('event.virtual') : (props.place.city ?? '')
})

const statusLabel = computed(() =>
  props.status ? t(`process.status.${props.status}`) : ''
)
</script>

<template>
  <!-- Convocatoria abierta: todo lo que hace falta para apuntarse. -->
  <div
    v-if="status === 'upcoming'"
    class="band band--open"
  >
    <UiStatusTag
      :label="statusLabel"
      variant="upcoming"
    />

    <p
      v-if="dates"
      class="band__line"
    >
      {{ dates }}
    </p>
    <p
      v-if="placeLabel"
      class="band__line"
    >
      {{ placeLabel }}
    </p>

    <UiPill
      v-if="registrationLink"
      :href="registrationLink"
    >
      {{ t('process.register') }}
    </UiPill>
  </div>

  <!-- En marcha: solo la señal de que está pasando. -->
  <div
    v-else-if="status === 'in-progress'"
    class="band band--live"
  >
    <UiStatusTag
      :label="statusLabel"
      variant="in-progress"
    />
  </div>
</template>

<style lang="scss" scoped>
.band {
  border-radius: $radius-card;
}

.band--open {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-sm;
  padding: $space-md;
  background-color: $brand;
  color: $paper;
}

.band__line {
  font-size: $text-body;
  line-height: 19px;
}

.band--live {
  padding: $space-sm $space-md;
  border: 1px solid $brand;
  color: $brand;
}
</style>
