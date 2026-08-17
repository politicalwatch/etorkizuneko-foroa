// Lectura común de las tarjetas que mezclan procesos y eventos.
//
// La query proyecta los dos tipos con los mismos campos (ver queries/vision.ts),
// así que los campos que no aplican vienen a null. Aquí se traduce esa forma
// cruda a lo que necesita pintar una tarjeta: qué etiqueta de estado lleva, qué
// fecha muestra y a dónde enlaza.

export type ItemStatus = 'upcoming' | 'in-progress' | 'finished'

export interface RelatedItem {
  _id: string
  _type: 'process' | 'event' | string
  slug?: string | null
  title?: string | null
  subtitle?: string | null
  mainImage?: unknown
  registrationLink?: string | null
  status?: string | null
  startDate?: string | null
  endDate?: string | null
  datetime?: string | null
}

/** Formatea una fecha ISO con el locale activo. */
export function useDateFormat() {
  const { locale } = useI18n()

  const format = (
    value?: string | null,
    options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' }
  ) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat(locale.value, options).format(date)
  }

  /**
   * Rango "02 dic — 23 dic 2026". Si falta el fin, solo el inicio.
   *
   * Cuando las dos fechas caen en el mismo año, el año se escribe una sola vez
   * al final, como en el diseño: repetirlo no aporta y alarga la línea.
   */
  const formatRange = (start?: string | null, end?: string | null) => {
    const from = format(start)
    const to = format(end)
    if (!from || !to) return from || to

    const sameYear = start?.slice(0, 4) === end?.slice(0, 4)
    const fromShort = sameYear ? format(start, { day: '2-digit', month: 'short' }) : from

    return `${fromShort} — ${to}`
  }

  /**
   * Etiqueta corta de tarjeta: "Dic 2026" para procesos, "13 nov 2026" para
   * eventos. Cuando la cadena empieza por el mes va en mayúscula, como en el
   * diseño; Intl lo devuelve en minúscula en español y euskera.
   */
  const formatShort = (value?: string | null, precise = false) => {
    if (precise) return format(value, { day: '2-digit', month: 'short', year: 'numeric' })
    const text = format(value, { month: 'short', year: 'numeric' })
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
  }

  return { format, formatRange, formatShort }
}

export function useItemMeta(item: MaybeRefOrGetter<RelatedItem | null | undefined>) {
  const { t } = useI18n()
  const { formatShort, formatRange } = useDateFormat()

  // OJO: las rutas de aquí salen SIN el prefijo de idioma. Quien las pinta lo
  // hace con `UiPill :to`, que por dentro es `NuxtLinkLocale` y ya se encarga
  // de anteponerlo; si además se pasaran por `localePath` saldría dos veces
  // (/es/es/procesos/...) y el enlace no llevaría a ninguna parte.
  const isEvent = computed(() => toValue(item)?._type === 'event')

  // Etiqueta de la píldora: los eventos son una categoría en sí, los procesos
  // muestran su estado.
  const statusLabel = computed(() => {
    const value = toValue(item)
    if (!value) return ''
    if (value._type === 'event') return t('event.label')
    return value.status ? t(`process.status.${value.status}`) : ''
  })

  // Fecha de la esquina. El evento tiene día concreto; el proceso enseña el
  // rango de su convocatoria, igual que hacen FeaturedCard y ProcessStatusBand.
  //
  // Solo la enseñan los procesos "Próximamente": las fechas de un proceso son
  // las de su convocatoria, así que en cuanto arranca dejan de significar nada
  // y el diseño no las pinta. Es lo mismo que dice el modelo de contenido de
  // `startDate` / `endDate` ("solo se muestra si el estado es upcoming").
  const dateLabel = computed(() => {
    const value = toValue(item)
    if (!value) return ''
    if (value._type === 'event') return formatShort(value.datetime, true)
    if (value.status !== 'upcoming') return ''
    return formatRange(value.startDate, value.endDate)
  })

  // Los eventos aún no tienen página propia: si hay inscripción, se enlaza fuera.
  const href = computed(() => {
    const value = toValue(item)
    if (!value) return undefined
    if (value._type === 'event') return value.registrationLink ?? undefined
    return value.slug ? `/procesos/${value.slug}` : undefined
  })

  const isExternal = computed(() => isEvent.value)

  // Texto del botón: inscribirse si aún se puede, si no "ver proceso".
  const ctaLabel = computed(() => {
    const value = toValue(item)
    if (!value) return ''
    if (value._type === 'event') return t('event.register')
    if (value.registrationLink && value.status === 'upcoming') return t('process.register')
    return t('process.view')
  })

  const ctaHref = computed(() => {
    const value = toValue(item)
    if (!value) return undefined
    if (value._type === 'event') return value.registrationLink ?? undefined
    if (value.registrationLink && value.status === 'upcoming') return value.registrationLink
    return value.slug ? `/procesos/${value.slug}` : undefined
  })

  const ctaIsExternal = computed(() => {
    const value = toValue(item)
    if (!value) return false
    if (value._type === 'event') return Boolean(value.registrationLink)
    return Boolean(value.registrationLink && value.status === 'upcoming')
  })

  return { isEvent, statusLabel, dateLabel, href, isExternal, ctaLabel, ctaHref, ctaIsExternal }
}
