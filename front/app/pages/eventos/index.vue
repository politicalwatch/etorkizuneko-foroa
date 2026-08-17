<script setup lang="ts">
import { AGENDA_QUERY } from '~/queries/agenda'

// Superficie clara: es la de por defecto, no hace falta declararla.
const { locale, t } = useI18n()

// Sólo la fecha (UTC), sin hora: así servidor y cliente calculan lo mismo y la
// hidratación reutiliza el resultado en vez de repetir la petición. Ver la nota
// en queries/agenda.ts.
const { data } = await useSanityQuery(AGENDA_QUERY, {
  lang: locale.value,
  today: new Date().toISOString().slice(0, 10)
})

const title = computed(() => data.value?.page?.title || t('nav.agenda'))
const items = computed(() => data.value?.items ?? [])

useSeoMeta({ title })
</script>

<template>
  <div class="agenda">
    <header class="agenda__header">
      <h1 class="agenda__title">
        {{ title }}
      </h1>
      <ProseText
        v-if="data?.page?.lede"
        :value="data.page.lede"
      />
    </header>

    <FeaturedCard
      v-if="data?.featured"
      :item="data.featured"
    />

    <CardGrid
      :items="items"
      :columns="3"
    />

    <p
      v-if="!data?.featured && !items.length"
      class="agenda__empty"
    >
      {{ t('agenda.empty') }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.agenda {
  display: flex;
  flex-direction: column;
  // Ritmo de dos niveles, medido sobre el diseño: 30px entre bloques que van
  // juntos (tarjeta ↔ imagen, destacado ↔ rejilla) y ~90px donde empieza una
  // sección nueva. Antes eran 60px para todo: demasiado entre los primeros y
  // demasiado poco entre las segundas.
  gap: $space-lg;
  padding: 90px $space-md $space-xl;
}

.agenda__header {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  // 30 de base + 60 = los ~90px de aire que el diseño deja bajo la cabecera.
  margin-bottom: $space-xl;
  max-width: 70ch;
}

.agenda__title {
  font-size: 32px;
  line-height: 36px;
  font-weight: 900;
  letter-spacing: -0.02em;

  @media (width >= 768px) {
    font-size: 44px;
    line-height: 48px;
  }
}

.agenda__empty {
  font-size: $text-body;
  line-height: 19px;
  color: var(--surface-muted, currentcolor);
}
</style>
