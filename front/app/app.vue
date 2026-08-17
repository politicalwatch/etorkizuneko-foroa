<script setup lang="ts">
// Head dirigido por i18n: <html lang/dir>, hreflang y og:locale por idioma
const localeHead = useLocaleHead()
useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs ?? {},
  link: localeHead.value.link ?? [],
  meta: localeHead.value.meta ?? []
}))

// La página decide si va sobre negro o sobre blanco (ver useSurface).
const surface = useSurface()
</script>

<template>
  <UApp>
    <div
      class="relative min-h-screen surface"
      :class="`surface--${surface}`"
    >
      <AppHeader />

      <main>
        <NuxtPage />
      </main>

      <AppFooter :theme="surface" />
    </div>
  </UApp>
</template>
