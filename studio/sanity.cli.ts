import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'gm41vkqd',
    // Dataset objetivo de los comandos de la CLI (dataset export/import, etc.).
    // Por defecto production; SANITY_STUDIO_DATASET=dev para el sandbox local.
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    appId: 'kyub8bvqa3zaxfa4z26p0kad',
    autoUpdates: true,
  },
})
