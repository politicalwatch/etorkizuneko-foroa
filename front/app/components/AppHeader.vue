<script setup lang="ts">
// Cabecera del sitio. Se superpone al contenido, así que toma el color de la
// superficie de la página (blanco sobre las páginas negras, negro sobre las
// blancas). Al abrir el menú despliega un panel negro con la navegación y el
// selector de idioma. El logo sale de siteSettings (ver AppLogo).
const { t, locale, locales } = useI18n()
// La superficie que importa aquí no es la de la página sino la que la cabecera
// tiene debajo: en la portada son distintas (ver useHeaderSurface).
const surface = useHeaderSurface()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()

const open = ref(false)
const navItems = useNav()

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
    :class="[`app-header--on-${surface}`, { 'app-header--open': open }]"
  >
    <div class="app-header__bar">
      <NuxtLinkLocale
        to="/"
        :aria-label="t('nav.home')"
        @click="open = false"
      >
        <AppLogo :theme="open || surface === 'dark' ? 'light' : 'dark'" />
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

  // El botón lee `--surface-fg` / `--surface-bg`, que por defecto vienen de la
  // página. Cuando la cabecera se apoya en algo distinto (la foto de la
  // portada) se redefinen aquí y el resto de reglas siguen valiendo tal cual.
  &--on-dark {
    --surface-fg: #{$paper};
    --surface-bg: #{$ink};
  }

  &--on-light {
    --surface-fg: #{$ink};
    --surface-bg: #{$paper};
  }

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

// Botón pill del diseño (borde 1px, alto 30, pill).
// Sigue el color de la superficie de la página; con el menú abierto el panel es
// negro, así que se fuerza a blanco.
.pill {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 12px;
  border: 1px solid currentcolor;
  border-radius: 9999px;
  color: var(--surface-fg, $paper);
  font-size: $text-body;
  line-height: 18px;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  // Al pasar el puntero se invierte: el relleno toma el color del texto y el
  // texto, el del fondo. Se escriben los dos con variables (no `currentcolor`)
  // porque cambiar `color` en la misma regla también cambiaría el relleno.
  &:hover {
    background-color: var(--surface-fg, $paper);
    color: var(--surface-bg, $ink);
  }

  // Con el menú desplegado el panel es negro, sea cual sea la superficie.
  .app-header--open & {
    color: $paper;

    &:hover {
      background-color: $paper;
      color: $ink;
    }
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
