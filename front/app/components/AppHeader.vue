<script setup lang="ts">
// Cabecera del sitio. Se superpone al hero (fondo oscuro), por eso el contenido
// es blanco. Al abrir el menú despliega un panel negro con la navegación y el
// selector de idioma. El logo sale de siteSettings (ver AppLogo).
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()

const open = ref(false)

// Rutas sin prefijo de idioma: NuxtLinkLocale añade /es, /eu, /en.
const navItems = computed(() => [
  { key: 'home', label: t('nav.home'), to: '/' },
  { key: 'visions', label: t('nav.visions'), to: '/ejes' },
  { key: 'processes', label: t('nav.processes'), to: '/procesos' },
  { key: 'agenda', label: t('nav.agenda'), to: '/eventos' }
])

// Cerrar al navegar
watch(() => route.fullPath, () => {
  open.value = false
})

// Cerrar con Escape
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header
    class="app-header"
    :class="{ 'app-header--open': open }"
  >
    <div class="app-header__bar">
      <NuxtLinkLocale
        to="/"
        :aria-label="t('nav.home')"
        @click="open = false"
      >
        <AppLogo theme="light" />
      </NuxtLinkLocale>

      <button
        type="button"
        class="pill"
        :aria-expanded="open"
        aria-controls="app-menu"
        @click="open = !open"
      >
        {{ open ? t('menu.close') : t('menu.open') }}
      </button>
    </div>

    <Transition name="menu">
      <nav
        v-if="open"
        id="app-menu"
        class="app-header__nav"
      >
        <NuxtLinkLocale
          v-for="item in navItems"
          :key="item.key"
          :to="item.to"
          class="app-header__link"
        >
          {{ item.label }}
        </NuxtLinkLocale>

        <div class="app-header__langs">
          <NuxtLink
            v-for="l in locales"
            :key="l.code"
            :to="switchLocalePath(l.code)"
            class="app-header__lang"
            :class="{ 'app-header__lang--active': l.code === locale }"
          >
            {{ l.code.toUpperCase() }}
          </NuxtLink>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  position: absolute;
  inset-inline: 0;
  top: 0;
  z-index: 50;
  padding: $space-md $space-md 0;
  transition: background-color 0.2s ease;

  &--open {
    background-color: $ink;
    border-bottom-left-radius: $radius-panel;
    border-bottom-right-radius: $radius-panel;
    padding-bottom: $space-lg;
  }
}

.app-header__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-md;
}

.app-header__nav {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
  margin-top: $space-lg;
}

.app-header__link {
  color: $paper;
  font-size: $text-title;
  line-height: 24px;
  transition: color 0.15s ease;

  &:hover {
    color: $brand;
  }
}

.app-header__langs {
  display: flex;
  text-align: center;
  font-size: $text-title;
  line-height: 24px;
}

.app-header__lang {
  flex: 1 0 0;
  color: $paper;

  &--active {
    color: $brand;
    text-decoration: underline;
  }
}

// Botón pill del diseño (borde 1px, alto 30, pill)
.pill {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 12px;
  border: 1px solid $paper;
  border-radius: 9999px;
  color: $paper;
  font-size: $text-body;
  line-height: 18px;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: $paper;
    color: $ink;
  }
}

// Transición del panel
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
