<script setup lang="ts">
// Pie de página. Reutiliza el logo, la navegación (useNav) y siteSettings.
// `theme`:
//  - 'light' (por defecto): sobre fondo claro. Degradado coral → blanco, texto negro.
//  - 'dark': sobre fondo negro. Degradado coral → transparente (deja ver el fondo),
//    texto/logo en blanco y logos de partners invertidos a blanco.
withDefaults(defineProps<{ theme?: 'light' | 'dark' }>(), { theme: 'light' })

const { t } = useI18n()
const navItems = useNav()
const { data: settings } = useSiteSettings()

// URLs de los partners.
const PARTNERS = {
  politicalWatch: 'https://politicalwatch.es',
  dot: 'https://feeldot.com'
}

const email = computed(() => settings.value?.contactEmail || 'kaixo@etorkizunekoforoa.eus')
const title = computed(() => settings.value?.siteTitle || 'Etorkizuneko Foroa')
// Año de la visita (hora de request en SSR / cliente al hidratar)
const year = new Date().getFullYear()
</script>

<template>
  <footer
    class="footer"
    :class="`footer--${theme}`"
  >
    <div class="footer__inner">
      <NuxtLinkLocale
        to="/"
        :aria-label="t('nav.home')"
      >
        <AppLogo :theme="theme === 'dark' ? 'light' : 'dark'" />
      </NuxtLinkLocale>

      <div class="footer__menu">
        <nav class="footer__pages">
          <NuxtLinkLocale
            v-for="item in navItems"
            :key="item.key"
            :to="item.to"
            class="footer__link"
          >
            {{ item.label }}
          </NuxtLinkLocale>
        </nav>

        <div class="footer__partners">
          <i18n-t
            keypath="footer.credit"
            tag="p"
            class="footer__credit"
          >
            <template #gv>
              <strong>{{ t('footer.gobiernoVasco') }}</strong>
            </template>
            <template #pw>
              <a
                class="footer__partner-link"
                :href="PARTNERS.politicalWatch"
                target="_blank"
                rel="noopener"
              >Political Watch</a>
            </template>
            <template #dot>
              <a
                class="footer__partner-link"
                :href="PARTNERS.dot"
                target="_blank"
                rel="noopener"
              >dot</a>
            </template>
          </i18n-t>

          <div class="footer__logos">
            <img
              src="/partners/political-watch.svg"
              alt="Political Watch"
              class="footer__logo-pw"
            >
            <img
              src="/partners/dot.svg"
              alt="dot"
              class="footer__logo-dot"
            >
          </div>
        </div>
      </div>

      <a
        class="footer__email"
        :href="`mailto:${email}`"
      >{{ email }}</a>

      <div class="footer__legal">
        <NuxtLinkLocale
          to="/privacidad"
          class="footer__link"
        >
          {{ t('footer.privacy') }}
        </NuxtLinkLocale>
        <p>{{ year }} © {{ title }}</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  // Resplandor coral desde abajo (aproxima el círculo del diseño).
  // El degradado siempre acaba en transparente; el fondo lo pone cada variante.
  background-image: radial-gradient(90% 78% at 50% 120%, $brand 0%, transparent 150%);
  background-color: transparent;

  // Sobre fondo claro: el degradado se apoya en blanco (coral → blanco).
  &--light {
    color: $ink;
  }

  // Sobre fondo negro: sin fondo propio (coral → transparente), contenido claro.
  &--dark {
    color: $paper;

    // Los logos de partners son SVG negros: se invierten a blanco.
    .footer__logo-pw,
    .footer__logo-dot {
      filter: invert(1);
    }
  }
}

.footer__inner {
  display: flex;
  flex-direction: column;
  gap: $space-xl;
  padding: $space-md;
}

.footer__menu {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-sm;
}

.footer__pages {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}

.footer__link {
  font-size: $text-body;
  line-height: 19px;
  color: inherit; // sigue el color de la variante (negro en light, blanco en dark)
  transition: color 0.15s ease;

  &:hover {
    color: $brand;
  }
}

.footer__partners {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
}

.footer__credit {
  font-size: $text-body;
  line-height: 19px;

  strong {
    font-weight: 700;
  }
}

.footer__partner-link {
  color: $brand;
  text-decoration: underline;
}

.footer__logos {
  display: flex;
  flex-direction: column;
  gap: $space-md;
  align-items: flex-start;
}

.footer__logo-pw {
  width: auto;
  height: 12px;
}

.footer__logo-dot {
  width: auto;
  height: 15px;
}

.footer__email {
  font-size: $text-title;
  line-height: 24px;
  color: inherit; // sigue el color de la variante (negro en light, blanco en dark)
  text-decoration: underline;
  word-break: break-word;
}

.footer__legal {
  display: flex;
  flex-direction: column;
  gap: $space-md;
  font-size: $text-body;
  line-height: 19px;
}
</style>
