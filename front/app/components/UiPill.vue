<script setup lang="ts">
// Píldora del diseño: 30px de alto, borde de 1px, esquinas redondeadas.
// Hereda el color del contexto, así funciona sobre negro, blanco y coral.
//
// Cuatro formas según lo que se le pase, de más específica a menos:
//  - `to`     → enlace interno (NuxtLinkLocale). "Leer más", "Ver proceso".
//  - `href`   → enlace externo. "Inscríbete", "Apúntate".
//  - `button` → botón real, para acciones dentro de la página (el filtro por
//               eje). Va como <button> y no como <a> para que el teclado y los
//               lectores de pantalla lo anuncien como control, no como enlace.
//  - nada     → <span> decorativo, sin interacción.
withDefaults(defineProps<{
  to?: string
  href?: string
  button?: boolean
  active?: boolean
}>(), {
  to: undefined,
  href: undefined,
  button: false,
  active: false
})
</script>

<template>
  <NuxtLinkLocale
    v-if="to"
    :to="to"
    class="ui-pill"
    :class="{ 'ui-pill--active': active }"
  >
    <slot />
  </NuxtLinkLocale>

  <a
    v-else-if="href"
    :href="href"
    target="_blank"
    rel="noopener"
    class="ui-pill"
    :class="{ 'ui-pill--active': active }"
  >
    <slot />
  </a>

  <button
    v-else-if="button"
    type="button"
    class="ui-pill"
    :class="{ 'ui-pill--active': active }"
  >
    <slot />
  </button>

  <span
    v-else
    class="ui-pill"
    :class="{ 'ui-pill--active': active }"
  >
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.ui-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 12px;
  border: 1px solid currentcolor;
  border-radius: 9999px;
  color: inherit;
  background: none;
  font-size: $text-body;
  font-family: inherit;
  line-height: 18px;
  white-space: nowrap;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

button.ui-pill {
  cursor: pointer;
}

// Solo enlaces y botones reaccionan al puntero; la variante <span> es decorativa.
//
// Al invertirse, el relleno toma el color del texto y el texto el del fondo que
// tiene detrás. Se escriben con variables en vez de `currentcolor` porque
// cambiar `color` en la misma regla también cambiaría el relleno. Por defecto
// se leen de la superficie de la página; las tarjetas, que tienen su propio
// fondo (foto o coral), sobreescriben `--pill-ink`.
a.ui-pill:hover,
button.ui-pill:hover {
  background-color: var(--pill-fill, var(--surface-fg, #{$paper}));
  border-color: var(--pill-fill, var(--surface-fg, #{$paper}));
  color: var(--pill-ink, var(--surface-bg, #{$ink}));
}

// El estado activo manda sobre el hover: una etiqueta seleccionada sigue
// leyéndose como seleccionada al pasar el puntero por encima.
.ui-pill--active,
a.ui-pill--active:hover,
button.ui-pill--active:hover {
  background-color: $brand;
  border-color: $brand;
  color: $paper;
}
</style>
