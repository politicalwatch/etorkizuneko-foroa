<script setup lang="ts">
// Bloque de cierre de las páginas de detalle: "Visiones de futuro" + las
// etiquetas del resto de ejes. El eje que se está viendo se marca en coral en
// lugar de ocultarse, para que se vea dónde está uno dentro del conjunto.
defineProps<{
  visions: { _id: string, slug?: string | null, label?: string | null }[]
  currentSlug?: string | null
}>()

const { t } = useI18n()
</script>

<template>
  <section
    v-if="visions.length"
    class="chips"
  >
    <h2 class="chips__title">
      {{ t('nav.visions') }}
    </h2>
    <i18n-t
      keypath="vision.exploreOthers"
      tag="p"
      class="chips__lede"
    >
      <template #visions>
        <strong>{{ t('vision.exploreOthersHighlight') }}</strong>
      </template>
    </i18n-t>

    <ul class="chips__list">
      <li
        v-for="vision in visions"
        :key="vision._id"
      >
        <UiPill
          :to="vision.slug ? `/ejes/${vision.slug}` : undefined"
          :active="vision.slug === currentSlug"
        >
          {{ vision.label }}
        </UiPill>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.chips {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}

.chips__title {
  font-size: $text-title;
  line-height: 24px;
  font-weight: 700;
}

.chips__lede {
  font-size: $text-body;
  line-height: 19px;

  strong {
    font-weight: 700;
  }
}

.chips__list {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
  list-style: none;
  padding: 0;
  margin-top: $space-sm;
}
</style>
