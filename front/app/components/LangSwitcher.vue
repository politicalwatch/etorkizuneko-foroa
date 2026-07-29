<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const items = computed(() =>
  locales.value.map(l => ({
    label: l.name ?? l.code,
    to: switchLocalePath(l.code),
    active: l.code === locale.value
  }))
)
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end' }"
  >
    <UButton
      :label="locale.toUpperCase()"
      icon="i-lucide-languages"
      color="neutral"
      variant="ghost"
      size="sm"
    />
  </UDropdownMenu>
</template>
