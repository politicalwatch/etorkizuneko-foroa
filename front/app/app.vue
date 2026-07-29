<script setup lang="ts">
// Head dirigido por i18n: <html lang/dir>, hreflang y og:locale por idioma
const localeHead = useLocaleHead()
useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs ?? {},
  link: localeHead.value.link ?? [],
  meta: localeHead.value.meta ?? []
}))
</script>

<template>
  <UApp>
    <div class="relative min-h-screen">
      <AppHeader />

      <main>
        <NuxtPage />
      </main>
    </div>
  </UApp>
</template>
