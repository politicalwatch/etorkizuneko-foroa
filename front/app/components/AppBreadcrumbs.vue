<script setup lang="ts">
export interface Crumb {
  label: string
  to?: string
}

// Rastro de navegación: "Visiones de futuro → Seguridad integral".
defineProps<{ items: Crumb[] }>()

const { t } = useI18n()
</script>

<template>
  <nav
    class="crumbs"
    :aria-label="t('common.breadcrumb')"
  >
    <ol class="crumbs__list">
      <li
        v-for="(crumb, index) in items"
        :key="crumb.label"
        class="crumbs__item"
      >
        <span
          v-if="index > 0"
          class="crumbs__sep"
          aria-hidden="true"
        >→</span>

        <NuxtLinkLocale
          v-if="crumb.to"
          :to="crumb.to"
          class="crumbs__link"
        >
          {{ crumb.label }}
        </NuxtLinkLocale>
        <span
          v-else
          aria-current="page"
        >{{ crumb.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<style lang="scss" scoped>
.crumbs__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $space-xs;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: $text-caption;
  line-height: 16px;
  color: $brand;
}

.crumbs__item {
  display: inline-flex;
  align-items: center;
  gap: $space-xs;
}

.crumbs__link {
  color: inherit;
  text-decoration: underline;
}

.crumbs__sep {
  opacity: 0.7;
}
</style>
