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
    <UHeader>
      <template #left>
        <NuxtLinkLocale to="/">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLinkLocale>
      </template>

      <template #right>
        <LangSwitcher />
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Etorkizuneko Foroa
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
