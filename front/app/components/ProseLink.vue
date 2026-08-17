<script setup lang="ts">
// Anotación `link` del texto enriquecido.
const props = defineProps<{
  value: {
    href?: string
    blank?: boolean
  }
}>()

const target = computed(() => (props.value?.blank ? '_blank' : undefined))
const rel = computed(() => (props.value?.blank ? 'noopener noreferrer' : undefined))
</script>

<template>
  <a
    :href="value?.href"
    :target="target"
    :rel="rel"
  ><slot /></a>
</template>
