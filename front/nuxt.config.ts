// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/a11y',
    '@nuxtjs/sanity',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
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

  sanity: {
    projectId: 'gm41vkqd',
    dataset: 'production',
    apiVersion: '2026-05-15',
    typegen: {
      enabled: true,
      // Entrada que incluye los tipos generados por el plugin de i18n del Studio
      schemaTypesPath: '../studio/schemaTypes/typegen.ts',
      queryPaths: ['./app/**/*.{ts,tsx,vue}']
    }
  }
})
