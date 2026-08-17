<script setup lang="ts">
// El diagrama de los "dos planos" que cierra la introducción de la portada:
// dos elipses coral al 50% que se solapan, con la intersección al 100%, y un
// rótulo arriba y otro abajo (nodos 3160:308 en escritorio y 3028:213 en móvil).
//
// Va incrustado, como HeroComposition: es decorativo, no debe esperar a una
// petición aparte y así el color sale de `currentColor` en vez de llevar el
// #FF4D33 fijado dentro del fichero.
//
// Las elipses son las exportadas de Figma tal cual (rx 270 / ry 135, centradas
// en cy 135 y cy 270 sobre un lienzo de 540×405). Los rótulos NO son contenido
// editable: nombran las dos patas del proyecto, que son fijas, así que viven en
// los ficheros de idioma.
const { t } = useI18n()
</script>

<template>
  <figure class="diagram">
    <figcaption class="diagram__label">
      {{ t('home.diagram.narrative') }}
    </figcaption>

    <svg
      class="diagram__figure"
      viewBox="0 0 540 405"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <!-- La intersección se pinta recortando la elipse de abajo con la de
             arriba: es como está montado en el diseño. -->
        <mask id="home-diagram-mask">
          <ellipse
            cx="270"
            cy="135"
            rx="270"
            ry="135"
            fill="#fff"
          />
        </mask>
      </defs>

      <ellipse
        cx="270"
        cy="135"
        rx="270"
        ry="135"
        fill="currentColor"
        fill-opacity="0.5"
      />
      <ellipse
        cx="270"
        cy="270"
        rx="270"
        ry="135"
        fill="currentColor"
        fill-opacity="0.5"
      />
      <ellipse
        cx="270"
        cy="270"
        rx="270"
        ry="135"
        fill="currentColor"
        mask="url(#home-diagram-mask)"
      />
    </svg>

    <p class="diagram__label">
      {{ t('home.diagram.institutional') }}
    </p>
  </figure>
</template>

<style lang="scss" scoped>
.diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
  margin: 0 auto;
  // El ancho lo fija el diseño: 220px en móvil, 540px en escritorio.
  width: 100%;
  max-width: 220px;
  color: $brand;

  @media (width >= 768px) {
    max-width: 540px;
    gap: $space-md;
  }
}

.diagram__figure {
  display: block;
  width: 100%;
  height: auto;
}

.diagram__label {
  margin: 0;
  font-size: $text-body;
  line-height: 19px;
  text-align: center;
  color: $brand;

  @media (width >= 768px) {
    font-size: $text-title;
    line-height: 24px;
  }
}
</style>
