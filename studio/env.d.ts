// Sanity inyecta en el bundle del Studio las variables de entorno con prefijo
// SANITY_STUDIO_, accesibles vía process.env. Aquí no hay @types/node (ni hace
// falta: el Studio corre en el navegador), así que se declara solo lo que se usa.
declare const process: {
  env: {
    SANITY_STUDIO_DATASET?: string
  }
}
