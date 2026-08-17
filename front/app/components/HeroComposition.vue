<script setup lang="ts">
// "Composición": el orbe con los dos anillos que encabeza el listado de ejes.
// Exportado tal cual desde Figma (nodo 3190:435, lienzo 810×810).
//
// Va incrustado en vez de como <img> por dos motivos: es decorativo y no debe
// esperar a una petición aparte, y así los trazos y el degradado pueden usar
// `currentColor`, con lo que siguen el color de marca en lugar de llevar el
// #FF4D33 fijado dentro del fichero.
//
// Los anillos ocupan 630 de los 810 del lienzo (77,8%): el resplandor sobresale
// por fuera, que es justo lo que se ve en el diseño.
//
// En la portada el mismo lienzo aparece SIN anillos: sobre la foto del banner el
// diseño deja solo el resplandor (nodo 3160:117). De ahí `rings`.
withDefaults(defineProps<{ rings?: boolean }>(), { rings: true })
</script>

<template>
  <svg
    class="hero-composition"
    viewBox="0 0 810 810"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <radialGradient
        id="hero-composition-glow"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(405 405) rotate(90) scale(405)"
      >
        <stop stop-color="currentColor" />
        <stop
          offset="1"
          stop-color="currentColor"
          stop-opacity="0"
        />
      </radialGradient>
    </defs>

    <circle
      cx="405"
      cy="405"
      r="405"
      fill="url(#hero-composition-glow)"
    />
    <path
      v-if="rings"
      d="M405 326.976C492.231 326.976 571.17 335.816 628.272 350.092C656.831 357.231 679.871 365.717 695.748 375.101C711.692 384.524 720.098 394.661 720.098 405C720.098 415.339 711.692 425.476 695.748 434.899C679.871 444.284 656.831 452.769 628.272 459.908C571.17 474.184 492.231 483.024 405 483.024C317.769 483.024 238.83 474.184 181.728 459.908C153.169 452.769 130.129 444.284 114.252 434.899C98.3083 425.476 89.9024 415.339 89.9023 405C89.9023 394.661 98.3083 384.524 114.252 375.101C130.129 365.717 153.169 357.231 181.728 350.092C238.83 335.816 317.769 326.976 405 326.976Z"
      stroke="currentColor"
      stroke-width="2"
    />
    <path
      v-if="rings"
      d="M483.024 405C483.024 492.231 474.184 571.17 459.908 628.273C452.769 656.831 444.283 679.872 434.899 695.748C425.476 711.692 415.339 720.098 405 720.098C394.661 720.098 384.524 711.692 375.101 695.748C365.716 679.872 357.231 656.831 350.092 628.273C335.816 571.17 326.976 492.231 326.976 405C326.976 317.769 335.816 238.83 350.092 181.728C357.231 153.169 365.717 130.129 375.101 114.252C384.524 98.3084 394.661 89.9024 405 89.9024C415.339 89.9024 425.476 98.3084 434.899 114.252C444.283 130.129 452.769 153.169 459.908 181.728C474.184 238.83 483.024 317.769 483.024 405Z"
      stroke="currentColor"
      stroke-width="2"
    />
  </svg>
</template>

<style lang="scss" scoped>
// El componente sólo dibuja: el tamaño lo decide quien lo coloca. El viewBox
// cuadrado y el preserveAspectRatio por defecto mantienen la proporción sea cual
// sea la caja que reciba.
.hero-composition {
  display: block;
  color: $brand;
  // Decorativo: no debe robar clics al texto que lleva encima.
  pointer-events: none;
}
</style>
