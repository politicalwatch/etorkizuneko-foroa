# Arquitectura de contenido — Etorkizuneko Foroa

## Convenciones

- Nombres de tipos (`name`): camelCase, singular (ej. `process`, no `processes`).
- Nombres de campos: camelCase.
- Todos los documentos con campo de texto largo usan `text` (no `string`) cuando el límite supera ~200 caracteres.
- Las imágenes usan `image` con `hotspot: true` activado por defecto salvo que se indique lo contrario.
- Los límites de caracteres se implementan como `Rule.max(N)` en la validación del campo.

---

## Documentos

### vision (document)
Propósito: página de cada uno de los 9 ejes de Etorkizuneko Foroa.

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| mainImage | image | Sí | JPG, hotspot activado |
| title | string | Sí | máx. 100 caracteres |
| description | text | Sí | máx. 1000 caracteres |
| data | array of object `data` | Sí | exactamente 3 elementos (min 3, max 3) |

### process (document)
Propósito: página de cada proceso participativo dentro de un eje.

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| mainImage | image | Sí | JPG, hotspot activado |
| title | string | Sí | máx. 100 caracteres |
| description | text | Sí | máx. 1000 caracteres |
| registrationLink | url | No | enlace externo (ej. Typeform) |
| startDate | date | Sí | sin valor inicial por defecto (vacío) |
| endDate | date | Sí | sin valor inicial por defecto (vacío) |
| data | array of object `data` | Sí | exactamente 3 elementos |
| status | string | Sí | lista de opciones: `"Próximamente"`, `"En proceso"`, `"Finalizado"` (usar `list` en el schema) |
| processInPictures | array of image | No | JPG, máximo 8 fotos |
| testimonial | object `testimonial` | No | un único testimonio (ya no es array de 3) |
| vision | reference → `vision` | Sí | eje al que pertenece este proceso |

### event (document)
Propósito: página de un evento (pasado o futuro) de Etorkizuneko Foroa.

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| mainImage | image | Sí | JPG, hotspot activado |
| title | string | Sí | máx. 100 caracteres |
| description | text | Sí | máx. 1000 caracteres |
| place | object `place` | Sí | ver objetos reutilizables |
| datetime | datetime | Sí | sin valor inicial por defecto (vacío) |
| eventInPictures | array of image | No | JPG, máximo 8 fotos |
| vision | reference → `vision` | Sí | eje al que pertenece este evento |
| process | reference → `process` | No | proceso concreto al que está ligado el evento, si aplica |

### siteSettings (document, singleton)
Propósito: configuración global del sitio, un único documento gestionado desde el Studio
(no aparece como lista, sino como entrada única — usar `singleton` en la structure del Studio).

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| siteTitle | string | Sí | nombre del sitio, usado en `<title>` por defecto |
| tagline | string | No | eslogan corto, máx. 160 caracteres |
| logo | image | No | SVG o PNG con fondo transparente |
| favicon | image | No | recomendado 512x512 |
| defaultSeo | object `seo` | No | ver más abajo — valores SEO por defecto si una página no los define |
| socialLinks | array of object `socialLink` | No | ver más abajo |
| contactEmail | string | No | validación de formato email |
| footerText | text | No | texto libre del pie de página |

### homePage (document, singleton)
Propósito: información a mostrar en la página principal, un único documento gestionado desde el Studio

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| mainImage | image | Sí | JPG, hotspot activado |
| projectTitle | string | Sí | máx. 200 caracteres |
| projectDescription | text | Sí | máx. 1000 caracteres |

---

## Objetos reutilizables

### data (object)
Propósito: par nombre/valor para los dashboards de datos de `vision` y `process`.

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| name | string | Sí | |
| value | number | Sí | |

### testimonial (object)
Propósito: testimonio de un participante en un proceso finalizado.

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| text | string | Sí | máx. 240 caracteres |
| person | string | Sí | máx. 100 caracteres |

### place (object)
Propósito: ubicación de un evento, presencial o virtual.

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| city | string | Sí | nombre de la ciudad |
| virtual | boolean | Sí | si es `true`, se muestra "Virtual" en vez de `city`, aunque `city` tenga valor (lógica a implementar en el frontend o en un `preview` del campo) |

#### seo (object)
| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| metaTitle | string | No | máx. 60 caracteres |
| metaDescription | text | No | máx. 160 caracteres |
| ogImage | image | No | imagen para redes sociales (1200x630) |

#### socialLink (object) — nuevo, no estaba en el Word
| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| platform | string | Sí | lista de opciones: `"instagram"`, `"tiktok"`, `"linkedin"`, `"youtube"` (ajustar según redes reales) |
| url | url | Sí | |

---

## Relaciones (resumen)

- `vision` → `data` (object embebido, x3)
- `process` → `vision` (reference, obligatoria — un proceso pertenece a un único eje)
- `process` → `data` (object embebido, x3)
- `process` → `testimonial` (object embebido, único)
- `event` → `place` (object embebido)
- `event` → `vision` (reference, obligatoria)
- `event` → `process` (reference, opcional)
- `siteSettings` → `seo` (object embebido)
- `siteSettings` → `socialLink` (object embebido, array)

> La lista de "procesos de un eje" o "eventos de un eje/proceso" ya no se guarda
> como campo en `vision`/`process` — se resuelve mediante consultas GROQ inversas
> desde el frontend Nuxt (buscando documentos que referencien el `_id` en cuestión).
> Esto es el patrón recomendado en Sanity para relaciones "uno a muchos" cuando el
> lado "muchos" puede crecer sin límite, y evita mantener el array sincronizado
> manualmente en el editor.

## Singletons

- `siteSettings` (document, singleton)
- `homePage` (document, singleton)
