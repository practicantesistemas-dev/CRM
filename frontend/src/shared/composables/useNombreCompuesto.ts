import { reactive, watch, type Ref } from 'vue'
import { joinNombreCompleto, splitNombreCompleto } from '../utils/nombreCompuesto'

/**
 * Expone 4 campos reactivos (nombre1, nombre2, apellido1, apellido2) sincronizados en
 * ambas direcciones con un campo de texto único del draft (ej. draft.nombre / draft.contacto).
 * El draft sigue siendo la única fuente de verdad que valida el schema Zod.
 */
export function useNombreCompuesto<T extends Record<string, unknown>>(draft: Ref<T>, campo: keyof T & string) {
  const partes = reactive({ nombre1: '', nombre2: '', apellido1: '', apellido2: '' })

  let escribiendoDesdePartes = false

  watch(
    () => draft.value[campo] as unknown as string,
    (valorExterno) => {
      if (escribiendoDesdePartes) { escribiendoDesdePartes = false; return }
      Object.assign(partes, splitNombreCompleto(valorExterno ?? ''))
    },
    { immediate: true },
  )

  watch(partes, () => {
    escribiendoDesdePartes = true
    ;(draft.value[campo] as unknown as string) = joinNombreCompleto(partes)
  })

  return partes
}
