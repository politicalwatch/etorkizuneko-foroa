// Forma mínima de un bloque de Portable Text, equivalente a `TypedObject` de
// @portabletext/types. Se declara aquí para no depender de un paquete que solo
// llega de forma transitiva a través de @nuxtjs/sanity.
export interface PortableBlock {
  _type: string
  [prop: string]: unknown
}

/** Normaliza lo que devuelve GROQ (que puede ser null) a algo renderizable. */
export function toBlocks(value: unknown): PortableBlock[] {
  return Array.isArray(value) ? (value as PortableBlock[]) : []
}
