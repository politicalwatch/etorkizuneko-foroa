// https://nuxt.com/docs/api/configuration/nuxt-config

// Proyecto y dataset de Sanity. Se leen una sola vez porque los consumen dos
// bloques distintos (`sanity` y `image`), y si se desincronizan el sitio leería
// el contenido de un dataset y las imágenes de otro.
//
// El proyecto es obligatorio y no tiene valor por defecto: sin él el módulo
// fallaría más tarde con un error opaco, así que se corta aquí con un mensaje
// que dice qué hacer.
const SANITY_PROJECT_ID = process.env.NUXT_PUBLIC_SANITY_PROJECT_ID

if (!SANITY_PROJECT_ID) {
  throw new Error(
    'Falta la variable NUXT_PUBLIC_SANITY_PROJECT_ID.\n'
    + 'Copia front/.env.example a front/.env y rellénala '
    + '(el ID del proyecto sale de `npx sanity debug` en studio/, o de sanity.io/manage).'
  )
}

// Por defecto production; poner NUXT_PUBLIC_SANITY_DATASET=dev en .env para
// trabajar contra el dataset de pruebas sin tocar el contenido real.
const SANITY_DATASET = process.env.NUXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/sanity',
    '@nuxtjs/i18n',
    '@nuxt/a11y'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // El diseño es de identidad fija (blanco / negro / coral); no invertir con el
  // dark mode del sistema.
  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  compatibilityDate: '2026-06-30',

  // Autoinyecta los tokens SCSS en cada <style lang="scss"> de los componentes,
  // así se pueden usar $brand, $space-md, etc. sin importar el partial.
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/tokens" as *;\n'
        }
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Inter (familia del diseño). @nuxt/fonts (incluido por Nuxt UI) la provisiona.
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 700, 900] }
    ]
  },

  i18n: {
    strategy: 'prefix',
    defaultLocale: 'es',
    // Dominio del sitio (para hreflang/canonical).
    // En producción, sobreescribir con la env NUXT_PUBLIC_I18N_BASE_URL
    baseUrl: 'http://localhost:3000',
    // Los códigos coinciden con los _key de Sanity (se usan como $lang en GROQ)
    locales: [
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' },
      { code: 'eu', language: 'eu-ES', name: 'Euskera', file: 'eu.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
    ],
    // Sin autodetección por navegador: la URL manda (/es, /eu, /en)
    detectBrowserLanguage: false
  },

  // @nuxtjs/sanity pinta <SanityImage> como <NuxtImg provider="sanity">, pero no
  // registra el proveedor: hay que declararlo aquí. Sin esto, @nuxt/image lanza
  // "Unknown provider: sanity" en cuanto una página tiene que pintar una imagen.
  image: {
    sanity: {
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET
    }
  },

  sanity: {
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: '2026-05-15',

    // Preview de borradores desde la herramienta Presentation del Studio.
    //
    // OJO: NO usar la opción `token` de primer nivel — el módulo la mete en
    // `runtimeConfig.public.sanity.token`, es decir, viaja al navegador.
    // `visualEditing.token` sí queda en el runtimeConfig privado (servidor),
    // y las queries del cliente pasan por /_sanity/visual-editing/fetch.
    //
    // El token debe existir en enBUILD TIME: si falta, el módulo desactiva
    // visual editing (con warning) y las rutas /preview/* no se registran.
    visualEditing: {
      token: process.env.NUXT_SANITY_VISUAL_EDITING_TOKEN ?? '',
      studioUrl: process.env.NUXT_PUBLIC_SANITY_VISUAL_EDITING_STUDIO_URL ?? 'http://localhost:3333',
      // Content Source Maps: marcas invisibles en los strings que permiten el
      // click-to-edit. El filtro por defecto ya excluye slug.current y URLs.
      stega: true,
      // 'live-visual-editing' = overlays + actualización en vivo al teclear.
      // 'visual-editing' = overlays, recarga al guardar. 'custom' = ninguno.
      // El modo NO afecta a si se ven borradores; eso lo decide la cookie de preview.
      mode: 'live-visual-editing'
    },

    typegen: {
      enabled: true,
      // Entrada que incluye los tipos generados por el plugin de i18n del Studio
      schemaTypesPath: '../studio/schemaTypes/typegen.ts',
      queryPaths: ['./app/**/*.{ts,tsx,vue}']
    }
  }
})
