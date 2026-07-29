// Idiomas soportados por el Studio. Español es el idioma principal (por defecto).
// Compartir esta lista entre el schema, el plugin de i18n y language-filter.
export interface Language {
  id: string
  title: string
}

export const LANGUAGES: Language[] = [
  {id: 'es', title: 'Español'},
  {id: 'eu', title: 'Euskera'},
  {id: 'en', title: 'English'},
]

// Idioma base: siempre visible, obligatorio y usado como fallback en los previews.
export const BASE_LANGUAGE = 'es'
