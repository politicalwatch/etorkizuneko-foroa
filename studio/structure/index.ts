import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {EyeOpenIcon} from '@sanity/icons/EyeOpen'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {RocketIcon} from '@sanity/icons/Rocket'

// Tipos gestionados como singleton (un único documento, sin lista)
export const SINGLETONS = [
  'siteSettings',
  'homePage',
  'visionsPage',
  'agendaPage',
  'processesPage',
]

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
      S.listItem()
        .title('Página de visiones de futuro')
        .icon(EyeOpenIcon)
        .child(S.document().schemaType('visionsPage').documentId('visionsPage')),
      S.listItem()
        .title('Página de agenda')
        .icon(CalendarIcon)
        .child(S.document().schemaType('agendaPage').documentId('agendaPage')),
      S.listItem()
        .title('Página de procesos finalizados')
        .icon(RocketIcon)
        .child(S.document().schemaType('processesPage').documentId('processesPage')),

      S.divider(),

      // 2. Los ejes, en el orden en que salen en el listado del sitio
      S.listItem()
        .title('Ejes')
        .icon(EyeOpenIcon)
        .child(
          S.documentTypeList('vision')
            .title('Ejes')
            .defaultOrdering([{field: 'order', direction: 'asc'}]),
        ),

      // 3. Resto de tipos como listas normales, excluyendo singletons y ejes
      ...S.documentTypeListItems().filter(
        (listItem) => ![...SINGLETONS, 'vision'].includes(listItem.getId() as string),
      ),
    ])
