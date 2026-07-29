// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/a11y',
    '@nuxtjs/sanity'
  ],

  sanity: {
    projectId: "gm41vkqd",
    dataset: "production",
    apiVersion: "2026-05-15",
    typegen: {
      enabled: true,
      schemaTypesPath: "../studio/schemaTypes",
      queryPaths: ["./app/**/*.{ts,tsx,vue}"],
    }
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
