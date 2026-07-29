import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'

// Tipos gestionados como singleton (un único documento, sin lista)
export const SINGLETONS = ['siteSettings', 'homePage']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      // 1. Singletons arriba
      S.listItem()
        .title('Ajustes del sitio')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Página de inicio')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage')),

      S.divider(),

      // 2. Resto de tipos como listas normales, excluyendo los singletons
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETONS.includes(listItem.getId() as string),
      ),
    ])
