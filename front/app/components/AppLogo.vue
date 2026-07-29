<script setup lang="ts">
// Logo de Etorkizuneko Foroa. Usa el logo de siteSettings si existe; si no,
// cae en el lockup del diseño (marco cuadrado + wordmark).
// `theme`: 'light' = contenido blanco (sobre fondos oscuros), 'dark' = negro.
withDefaults(defineProps<{ theme?: 'light' | 'dark' }>(), { theme: 'light' })

const { data: settings } = useSiteSettings()
const fallbackTitle = 'Etorkizuneko Foroa'
</script>

<template>
  <span
    class="app-logo inline-flex items-center gap-xs"
    :class="theme === 'light' ? 'app-logo--light' : 'app-logo--dark'"
  >
    <img
      v-if="settings?.logoUrl"
      :src="settings.logoUrl"
      :alt="settings?.siteTitle || fallbackTitle"
      class="h-[34px] w-auto shrink-0 object-contain"
    >
    <template v-else>
      <span
        class="app-logo__mark"
        aria-hidden="true"
      />
      <span class="app-logo__wordmark">{{ settings?.siteTitle || fallbackTitle }}</span>
    </template>
  </span>
</template>

<style lang="scss" scoped>
.app-logo {
  &--light {
    color: $paper;
    .app-logo__mark { border-color: $paper; }
  }

  &--dark {
    color: $ink;
    .app-logo__mark { border-color: $ink; }
  }
}

.app-logo__mark {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border: 2px solid currentColor;
}

.app-logo__wordmark {
  max-width: 195px;
  font-size: $text-title;
  font-weight: 500;
  line-height: 18px;
  text-transform: uppercase;
}
</style>
