<script setup lang="ts">
interface GalleryImage {
  _key: string
  alt?: string
  asset?: { _ref?: string }
}

// "El proceso en imágenes": rejilla de hasta 8 fotos intercalada en el cuerpo.
const props = defineProps<{
  value: {
    images?: GalleryImage[]
  }
}>()

const images = computed(() => props.value?.images ?? [])
</script>

<template>
  <ul
    v-if="images.length"
    class="gallery"
  >
    <li
      v-for="image in images"
      :key="image._key"
      class="gallery__item"
    >
      <SanityImage
        v-if="image.asset?._ref"
        class="gallery__image"
        :asset-id="image.asset._ref"
        auto="format"
        :w="640"
        :alt="image.alt ?? ''"
      />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.gallery {
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

.gallery__item {
  aspect-ratio: 4 / 3;
  border-radius: $radius-card;
  overflow: hidden;
}

.gallery__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
