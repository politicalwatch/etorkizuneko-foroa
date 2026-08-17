<script setup lang="ts">
// Testimonio al cierre del cuerpo: foto a la izquierda y cita en coral a la
// derecha, con la atribución debajo ("A. A. — Participante en …").
const props = defineProps<{
  value: {
    quote?: string
    person?: string
    role?: string
    image?: { alt?: string, asset?: { _ref?: string } }
  }
}>()

const attribution = computed(() =>
  [props.value?.person, props.value?.role].filter(Boolean).join(' — ')
)

// Sin foto no hay dos columnas que repartir: la cita ocupa todo el ancho.
const hasImage = computed(() => Boolean(props.value?.image?.asset?._ref))
</script>

<template>
  <figure
    class="testimonial"
    :class="{ 'testimonial--with-image': hasImage }"
  >
    <SanityImage
      v-if="value.image?.asset?._ref"
      class="testimonial__image"
      :asset-id="value.image.asset._ref"
      auto="format"
      :w="640"
      :alt="value.image.alt ?? ''"
    />

    <div class="testimonial__content">
      <blockquote class="testimonial__quote">
        “{{ value.quote }}”
      </blockquote>
      <figcaption
        v-if="attribution"
        class="testimonial__attribution"
      >
        {{ attribution }}
      </figcaption>
    </div>
  </figure>
</template>

<style lang="scss" scoped>
.testimonial {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-lg;
  margin: 0;

  &--with-image {
    @media (width >= 768px) {
      grid-template-columns: 1fr 1fr;
      align-items: start;
    }
  }
}

.testimonial__image {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  border-radius: $radius-card;
}

.testimonial__content {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.testimonial__quote {
  margin: 0;
  color: $brand;
  font-size: $text-title;
  line-height: 26px;
}

.testimonial__attribution {
  font-size: $text-body;
  line-height: 19px;
  text-align: right;
  color: var(--surface-fg, currentcolor);
}
</style>
