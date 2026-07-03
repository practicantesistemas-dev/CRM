import type { Contacto, ContactoDraft } from '../types/contacto'
import { CONTACTOS_MOCK } from '../constants/contactos.constants'

let contactos: Contacto[] = [...CONTACTOS_MOCK]

export function getContactos(): Contacto[] {
  return contactos
}

export function createContacto(data: ContactoDraft): Contacto {
  const nuevo: Contacto = { ...data, id: Date.now(), etiquetas: [...data.etiquetas] }
  contactos = [nuevo, ...contactos]
  return nuevo
}

export function updateContacto(id: number, data: ContactoDraft): Contacto | null {
  const idx = contactos.findIndex(c => c.id === id)
  if (idx === -1) return null
  const actualizado: Contacto = { ...data, id, etiquetas: [...data.etiquetas] }
  contactos = [...contactos.slice(0, idx), actualizado, ...contactos.slice(idx + 1)]
  return actualizado
}
