// Superficie de la página actual.
//
// No es un tema que elija la persona que visita: cada página tiene la suya,
// fijada en el diseño. La mayoría van sobre blanco; de momento solo el listado
// y el detalle de eje van sobre negro, y son las que lo declaran con
// `definePageMeta({ surface: 'dark' })`. El header, el footer y el envoltorio de
// app.vue lo leen de aquí para teñirse en consecuencia.
//
// Por defecto claro: así una página nueva sale bien sin declarar nada, que es
// el caso mayoritario.
export type Surface = 'dark' | 'light'

export function useSurface() {
  const route = useRoute()
  return computed<Surface>(() => (route.meta.surface as Surface | undefined) ?? 'light')
}

/**
 * Superficie sobre la que se apoya la cabecera, que se superpone al contenido.
 *
 * Casi siempre es la de la página, y por eso no hay que declarar nada. La
 * excepción es la portada: va sobre blanco, pero arranca con una foto oscura a
 * toda pantalla, así que ahí la cabecera tiene que ir en claro. Esas páginas lo
 * dicen con `definePageMeta({ headerSurface: 'dark' })`.
 */
export function useHeaderSurface() {
  const route = useRoute()
  const surface = useSurface()
  return computed<Surface>(
    () => (route.meta.headerSurface as Surface | undefined) ?? surface.value
  )
}
