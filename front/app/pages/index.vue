<script setup lang="ts">
import { HOME_QUERY } from '~/queries/home'

// Superficie clara: es la de por defecto, no hace falta declararla. Lo que sí
// hay que decir es que la cabecera arranca sobre la foto oscura del banner, o
// saldría en negro sobre negro (ver useHeaderSurface).
definePageMeta({ headerSurface: 'dark' })

const { locale } = useI18n()

// Fecha pelada, sin hora, para que la clave de caché coincida entre servidor y
// cliente y la hidratación no repita la petición. Está explicado en
// queries/agenda.ts.
const { data } = await useSanityQuery(HOME_QUERY, {
  lang: locale.value,
  today: new Date().toISOString().slice(0, 10)
})

const page = computed(() => data.value?.page)
const intro = computed(() => page.value?.intro ?? [])
const happening = computed(() => data.value?.happening ?? [])
const finished = computed(() => data.value?.finished ?? [])
const visions = computed(() => data.value?.visions ?? [])

// El H1 va oculto dentro del banner (el diseño no pone titular visible), así
// que el título de la pestaña sale de los ajustes del sitio.
const { data: settings } = useSiteSettings()
useSeoMeta({ title: () => settings.value?.siteTitle ?? 'Etorkizuneko Foroa' })
</script>

<template>
  <div class="home">
    <HomeBanner
      :image="page?.mainImage"
      :claim="page?.claim"
    />

    <section
      v-if="intro.length"
      class="home__intro"
    >
      <div class="home__columns">
        <HomeSection
          v-for="(block, index) in intro"
          :key="index"
          :title="block?.title"
          :body="block?.body"
        />
      </div>

      <HomeDiagram />
    </section>

    <section
      v-if="page?.agendaSection || happening.length"
      class="home__block"
    >
      <HomeSection
        :title="page?.agendaSection?.title"
        :body="page?.agendaSection?.body"
      >
        <template #cta>
          <UiPill to="/eventos">
            {{ $t('home.goToAgenda') }}
          </UiPill>
        </template>
      </HomeSection>

      <CardGrid
        :items="happening"
        :columns="3"
      />
    </section>

    <section
      v-if="page?.processesSection || finished.length"
      class="home__block"
    >
      <HomeSection
        :title="page?.processesSection?.title"
        :body="page?.processesSection?.body"
      >
        <template #cta>
          <UiPill to="/procesos">
            {{ $t('home.viewAllProcesses') }}
          </UiPill>
        </template>
      </HomeSection>

      <CardSlider :items="finished" />
    </section>

    <!-- Único bloque sobre negro de la página, y a sangre: por eso se sale del
         gutter con márgenes negativos en vez de vivir en el flujo normal. -->
    <section class="home__visions">
      <div class="home__visions-inner">
        <HomeSection
          :title="page?.visionsSection?.title"
          :body="page?.visionsSection?.body"
        >
          <template #cta>
            <UiPill to="/ejes">
              {{ $t('home.exploreVisions') }}
            </UiPill>
          </template>
        </HomeSection>

        <VisionMap :visions="visions" />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  // El banner llega hasta el borde y trae su propio aire; el resto de secciones
  // respiran con el mismo ritmo que las demás páginas.
  gap: $space-xl;
  padding-bottom: $space-xl;
}

// Bloques que sí llevan el gutter de página.
.home__intro,
.home__block {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
  padding: 0 $space-md;
}

.home__intro {
  gap: $space-xl;
}

.home__columns {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-lg;

  @media (width >= 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: $space-md;
  }
}

// A sangre: la sección se estira hasta los bordes de la ventana anulando el
// gutter del contenedor.
.home__visions {
  margin-inline: 0;
  padding: $space-lg $space-md $space-xl;
  border-radius: $radius-panel;
  color: $paper;
  background-color: $ink;

  // Dentro de este panel las píldoras se invierten contra el negro de la
  // sección, no contra el blanco de la página.
  --pill-fill: #{$paper};
  --pill-ink: #{$ink};

  @media (width >= 1024px) {
    padding: $space-xl $space-md;
  }
}

.home__visions-inner {
  display: flex;
  flex-direction: column;
  gap: $space-lg;

  @media (width >= 1024px) {
    // En escritorio el mapa ocupa todo el panel y el texto va encima, arriba a
    // la izquierda: la cabecera se saca del flujo para que no empuje al mapa.
    position: relative;
    gap: 0;
  }
}

@media (width >= 1024px) {
  .home__visions-inner :deep(.home-section) {
    position: absolute;
    inset-inline-start: 0;
    top: 0;
    z-index: 2;
    max-width: 50%;
  }
}
</style>
