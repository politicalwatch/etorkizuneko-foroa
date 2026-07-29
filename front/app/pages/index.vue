<script setup lang="ts">
import { HOME_QUERY } from '~/queries/home'

const { locale } = useI18n()
const { data } = await useSanityQuery(HOME_QUERY, { lang: locale.value })
</script>

<template>
  <UContainer class="py-12 space-y-10">
    <section>
      <h1 class="text-3xl font-bold text-highlighted">
        {{ data?.home?.projectTitle }}
      </h1>
      <p class="mt-3 text-muted whitespace-pre-line">
        {{ data?.home?.projectDescription }}
      </p>
    </section>

    <section>
      <h2 class="text-xl font-semibold mb-4">
        {{ $t('nav.visions') }}
      </h2>
      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="vision in data?.visions ?? []"
          :key="vision._id"
        >
          <NuxtLinkLocale
            :to="`/ejes/${vision.slug}`"
            class="block p-4 rounded-lg ring ring-default hover:bg-elevated transition-colors"
          >
            {{ vision.title }}
          </NuxtLinkLocale>
        </li>
      </ul>
    </section>

    <p class="text-xs text-dimmed">
      Vista placeholder — routing e i18n listos, diseño pendiente de especificar.
    </p>
  </UContainer>
</template>
