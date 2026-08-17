<script setup lang="ts">
// El mapa de los nueve ejes que cierra la portada (nodos 3166:194 en escritorio
// y 3017:79 en móvil): sobre la vista de Euskadi hay nueve puntos coral y, al
// pulsar uno, se abre una ficha con el eje y un enlace a su página.
//
// Las posiciones son las del diseño, en porcentaje de la caja del mapa. Qué eje
// cae en qué punto es indiferente —el mapa es una ilustración, no un plano—,
// así que los ejes se reparten por su orden editorial.
//
// Hay dos juegos de coordenadas porque el diseño encuadra la misma imagen de
// dos formas (apaisada en escritorio, vertical en móvil) y los puntos no caen
// en el mismo sitio. Se eligen por media query y no por JavaScript, para que el
// primer pintado ya sea el bueno.
//
// La imagen es un fichero del repositorio y no un campo de Sanity a propósito:
// estas coordenadas están atadas a ESTE encuadre, así que poder cambiarla desde
// el Studio solo serviría para descolocar los nueve puntos sin avisar.
// `summary` es el resumen largo del eje: en la ficha cabe un párrafo entero,
// bastante más que en la tarjeta del listado. La query ya cae al resumen corto
// cuando el largo está vacío, así que aquí siempre llega algo.
interface MapVision {
  _id: string
  slug?: string | null
  title?: string | null
  summary?: string | null
}

const props = defineProps<{ visions: MapVision[] }>()

const { t } = useI18n()

// [escritorio x, escritorio y, móvil x, móvil y], en % de la caja del mapa.
const POINTS = [
  [27.1, 61.4, 90.9, 12.8],
  [46.4, 37.5, 57.7, 25.0],
  [86.2, 51.3, 9.6, 37.4],
  [78.3, 12.4, 40.9, 34.6],
  [54.5, 26.5, 88.9, 54.3],
  [24.0, 38.8, 57.7, 45.7],
  [65.3, 66.9, 73.4, 79.3],
  [55.6, 44.0, 13.2, 61.5],
  [69.2, 79.8, 68.2, 66.1]
] as const

// Por encima de este alto la ficha no cabe hacia arriba y se abre hacia abajo.
// Se decide por separado en cada encuadre: un punto puede estar arriba del todo
// en móvil y a media altura en escritorio.
const FLIP_ABOVE = 45

// Si algún día hay más de nueve ejes, los que sobren se quedan sin punto y no
// salen en el mapa; el listado /ejes los sigue enseñando todos.
const points = computed(() =>
  props.visions.slice(0, POINTS.length).map((vision, index) => {
    const [dx, dy, mx, my] = POINTS[index]!
    return {
      vision,
      belowLg: dy < FLIP_ABOVE,
      belowSm: my < FLIP_ABOVE,
      style: {
        '--x': `${dx}%`,
        '--y': `${dy}%`,
        '--x-sm': `${mx}%`,
        '--y-sm': `${my}%`
      }
    }
  })
)

const openId = ref<string | null>(null)

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') openId.value = null
}

// Cualquier clic fuera de un punto cierra la ficha. Se mira el ancestro en vez
// de poner el manejador en el mapa porque el propio botón burbujea hasta él y
// cerraría la ficha justo después de abrirla.
function onPointerDown(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  if (!target?.closest?.('.map__point')) openId.value = null
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onPointerDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onPointerDown)
})
</script>

<template>
  <div class="map">
    <p class="sr-only">
      {{ t('home.map.hint') }}
    </p>

    <div class="map__frame">
      <img
        class="map__image"
        src="/mapa.webp"
        alt=""
        loading="lazy"
        decoding="async"
      >

      <ul class="map__points">
        <li
          v-for="point in points"
          :key="point.vision._id"
          class="map__point"
          :style="point.style"
        >
          <button
            type="button"
            class="map__dot"
            :aria-expanded="openId === point.vision._id"
            :aria-label="t('home.map.point', { title: point.vision.title ?? '' })"
            @click="toggle(point.vision._id)"
          />

          <!-- La ficha va aquí dentro, y no en una capa aparte, para que en el
               teclado y en el lector de pantalla venga justo detrás de su punto. -->
          <template v-if="openId === point.vision._id">
            <span
              class="map__line"
              :class="{
                'map__line--below-sm': point.belowSm,
                'map__line--below-lg': point.belowLg
              }"
              aria-hidden="true"
            />

            <div
              class="map__popup"
              :class="{
                'map__popup--below-sm': point.belowSm,
                'map__popup--below-lg': point.belowLg
              }"
            >
              <h3 class="map__popup-title">
                {{ point.vision.title }}
              </h3>
              <p
                v-if="point.vision.summary"
                class="map__popup-text"
              >
                {{ point.vision.summary }}
              </p>
              <UiPill
                v-if="point.vision.slug"
                :to="`/ejes/${point.vision.slug}`"
              >
                {{ t('common.readMore') }}
              </UiPill>
            </div>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Medidas del diseño. El punto y el filito que lo une a la ficha crecen juntos,
// así que el hueco entre el centro del punto y el borde de la ficha es la suma
// del radio y del filito.
$dot-sm: 30px;
$dot-lg: 40px;
$line-sm: 30px;
$line-lg: 40px;
$gap-sm: 45px; // 30/2 + 30
$gap-lg: 60px; // 40/2 + 40
$popup-sm: 240px;
$popup-lg: 450px;

.map__frame {
  position: relative;
  // Los dos encuadres del diseño.
  aspect-ratio: 440 / 540;

  @media (width >= 1024px) {
    aspect-ratio: 1920 / 1560;
  }
}

.map__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: $radius-card;
}

// La capa de puntos cubre el mapa entero, así que se deja pasar el puntero:
// si no, se comería los clics destinados a cerrar la ficha.
.map__points {
  position: absolute;
  inset: 0;
  list-style: none;
  padding: 0;
  margin: 0;
  pointer-events: none;
}

.map__dot,
.map__popup {
  pointer-events: auto;
}

.map__dot {
  position: absolute;
  left: var(--x-sm);
  top: var(--y-sm);
  width: $dot-sm;
  height: $dot-sm;
  border-radius: 50%;
  background-color: $brand;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: transform 0.15s ease;

  &:hover,
  &:focus-visible {
    transform: translate(-50%, -50%) scale(1.15);
  }

  @media (width >= 1024px) {
    left: var(--x);
    top: var(--y);
    width: $dot-lg;
    height: $dot-lg;
  }
}

.map__line {
  position: absolute;
  left: var(--x-sm);
  top: auto;
  bottom: calc(100% - var(--y-sm) + #{$dot-sm} / 2);
  width: 1px;
  height: $line-sm;
  background-color: $brand;
  transform: translateX(-50%);
}

.map__line--below-sm {
  bottom: auto;
  top: calc(var(--y-sm) + #{$dot-sm} / 2);
}

.map__popup {
  position: absolute;
  z-index: 1;
  // Centrada en el punto, pero sin salirse: el `clamp` la frena contra los dos
  // bordes del mapa antes que dejarla cortada.
  left: clamp(0px, calc(var(--x-sm) - #{$popup-sm} / 2), calc(100% - #{$popup-sm}));
  top: auto;
  bottom: calc(100% - var(--y-sm) + #{$gap-sm});
  width: $popup-sm;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-sm;
  padding: $space-md;
  border: 1px solid $brand;
  border-radius: $radius-card;
  background-color: $overlay;
  backdrop-filter: blur(2px);
}

.map__popup--below-sm {
  bottom: auto;
  top: calc(var(--y-sm) + #{$gap-sm});
}

// En escritorio se repite la posición "hacia arriba" (con `top: auto`, que
// deshace la variante móvil) y después la variante "hacia abajo" de este
// encuadre. El orden importa: la última regla que case es la que manda.
@media (width >= 1024px) {
  .map__line {
    left: var(--x);
    top: auto;
    bottom: calc(100% - var(--y) + #{$dot-lg} / 2);
    height: $line-lg;
  }

  .map__line--below-lg {
    bottom: auto;
    top: calc(var(--y) + #{$dot-lg} / 2);
  }

  .map__popup {
    left: clamp(0px, calc(var(--x) - #{$popup-lg} / 2), calc(100% - #{$popup-lg}));
    top: auto;
    bottom: calc(100% - var(--y) + #{$gap-lg});
    width: $popup-lg;
    gap: $space-md;
  }

  .map__popup--below-lg {
    bottom: auto;
    top: calc(var(--y) + #{$gap-lg});
  }
}

.map__popup-title {
  font-size: $text-body;
  line-height: 19px;
  font-weight: 900;

  @media (width >= 1024px) {
    font-size: 24px;
    line-height: 28px;
  }
}

// El resumen largo llega a ~600 caracteres. En la caja de escritorio entra de
// sobra, pero en la de móvil (210px de ancho útil) se iría por encima del mapa
// y taparía la cabecera de la sección, así que se le pone tope y se desplaza.
.map__popup-text {
  font-size: $text-caption;
  line-height: 16px;
  max-height: 40svh;
  overflow-y: auto;
  overscroll-behavior: contain;

  @media (width >= 1024px) {
    font-size: $text-title;
    line-height: 24px;
    max-height: none;
    overflow-y: visible;
  }
}
</style>
