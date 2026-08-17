<script setup lang="ts">
import { VISIONS_PAGE_QUERY } from '~/queries/vision'

// Esta página va sobre negro: lo leen app.vue, el header y el footer.
definePageMeta({ surface: 'dark' })

const { locale, t } = useI18n()

const { data } = await useSanityQuery(VISIONS_PAGE_QUERY, { lang: locale.value })

const title = computed(() => data.value?.page?.title || t('nav.visions'))
const visions = computed(() => data.value?.visions ?? [])

// Texto que acompaña al orbe: la entradilla del primer eje. Es contenido ya
// escrito, así que no se duplica en el singleton.
const orbLede = computed(() => visions.value[0]?.lede)

useSeoMeta({ title })
</script>

<template>
  <div class="visions">
    <!-- Entradilla y hero comparten caja: en el diseño la composición abarca
         las dos, arrancando por encima del titular. -->
    <div class="visions__top">
      <header class="visions__intro">
        <h1 class="visions__title">
          {{ title }}
        </h1>
        <ProseText
          v-if="data?.page?.lede"
          class="visions__lede"
          :value="data.page.lede"
        />
      </header>

      <section class="visions__hero">
        <HeroComposition class="visions__orb" />

        <ProseText
          v-if="orbLede"
          class="visions__orb-text"
          :value="orbLede"
        />
      </section>
    </div>

    <ul class="visions__grid">
      <li
        v-for="vision in visions"
        :key="vision._id"
      >
        <VisionCard
          :slug="vision.slug"
          :title="vision.title"
          :excerpt="vision.excerpt"
          :image="vision.mainImage"
        />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.visions {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: $space-xl;
  padding: 90px $space-md $space-xl;
}

// Entradilla + hero: es la altura que rellena la composición en escritorio.
.visions__top {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: $space-xl;
}

// El texto siempre por encima del resplandor.
.visions__intro,
.visions__orb-text,
.visions__grid {
  position: relative;
  z-index: 1;
}

.visions__intro {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  max-width: 60ch;
}

.visions__title {
  font-size: 32px;
  line-height: 36px;
  font-weight: 900;
  letter-spacing: -0.02em;

  @media (width >= 768px) {
    font-size: 44px;
    line-height: 48px;
  }
}

.visions__hero {
  position: relative;
  // En móvil la composición y el texto van uno debajo del otro: si se
  // superpusieran, el texto quedaría ilegible sobre los anillos.
  display: flex;
  flex-direction: column;
  gap: $space-lg;

  @media (width >= 1024px) {
    // `static` a propósito: así la composición, que es `absolute`, se ancla a
    // .visions__top en vez de a esta sección y puede subir hasta el titular.
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: end;
    min-height: 520px;
  }
}

// Móvil: en el flujo, encima del texto.
.visions__orb {
  align-self: center;
  width: 100%;
  max-width: 420px;
}

@media (width >= 1024px) {
  // Escritorio: centrada en la caja del hero y creciendo con todo su alto. El
  // ancho lo pone su proporción cuadrada, así que basta con fijar el alto.
  .visions__orb {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 100%;
    width: auto;
    max-width: 100%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }
}

.visions__orb-text {
  position: relative;

  @media (width >= 1024px) {
    grid-column: -2 / -1;
    align-self: end;
  }
}

.visions__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-md;
  list-style: none;
  padding: 0;
  margin: 0;

  @media (width >= 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (width >= 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
