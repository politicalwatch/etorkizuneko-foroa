<script setup lang="ts">
// Filtro por eje del listado de procesos finalizados. Multiselección: el
// diseño muestra dos etiquetas activas a la vez.
//
// La selección vive en la URL (`?eje=slug&eje=otro`) y no en un ref: así el
// filtro se puede compartir por enlace, sobrevive al botón "atrás" y llega
// resuelto desde el servidor en el primer render.
//
// Se pintan siempre los 9 ejes, tengan o no procesos finalizados: la fila no
// cambia de forma según lo que haya publicado.
const props = defineProps<{
  visions: { _id: string, slug?: string | null, label?: string | null }[]
}>()

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

/** Ejes seleccionados, leídos de la query. Vue Router da string | string[]. */
const selected = computed(() => {
  const raw = route.query.eje
  const list = Array.isArray(raw) ? raw : raw == null ? [] : [raw]
  return new Set(list.filter((v): v is string => typeof v === 'string' && v.length > 0))
})

function toggle(slug?: string | null) {
  if (!slug) return

  const next = new Set(selected.value)
  if (next.has(slug)) {
    next.delete(slug)
  } else {
    next.add(slug)
  }

  const eje = [...next]
  // `replace` y no `push`: filtrar no es navegar, no debe llenar el historial.
  router.replace({
    query: { ...route.query, eje: eje.length ? eje : undefined }
  })
}

defineExpose({ selected })

const items = computed(() => props.visions.filter(v => v.slug))
</script>

<template>
  <div
    class="vision-filter"
    role="group"
    :aria-label="t('process.filterByVision')"
  >
    <UiPill
      v-for="vision in items"
      :key="vision._id"
      button
      :active="selected.has(vision.slug as string)"
      :aria-pressed="selected.has(vision.slug as string)"
      @click="toggle(vision.slug)"
    >
      {{ vision.label }}
    </UiPill>
  </div>
</template>

<style lang="scss" scoped>
.vision-filter {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
}
</style>
