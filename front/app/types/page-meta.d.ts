// `surface` declara si la página va sobre negro o sobre blanco. Lo consumen
// app.vue, AppHeader y AppFooter a través de `useSurface()`.
//
// `headerSurface` solo hace falta cuando la cabecera, que va superpuesta, no se
// apoya en el mismo color que el resto de la página: la portada es blanca pero
// empieza con una foto oscura. Lo consume AppHeader vía `useHeaderSurface()`.
import type { Surface } from '~/composables/useSurface'

declare module '#app' {
  interface PageMeta {
    surface?: Surface
    headerSurface?: Surface
  }
}

// Nuxt reexporta PageMeta desde vue-router, así que hay que ampliar las dos.
declare module 'vue-router' {
  interface RouteMeta {
    surface?: Surface
    headerSurface?: Surface
  }
}

export {}
