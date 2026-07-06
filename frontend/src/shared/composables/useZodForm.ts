import { reactive, ref, watch, type Ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { ZodType, z } from 'zod'

/**
 * Conecta un objeto "draft" (fuente de verdad, editado con v-model en el template)
 * a VeeValidate + Zod: valida en cada cambio y, al enviar, reescribe el draft con
 * la salida ya formateada/transformada por el schema (trim, normalización, etc).
 *
 * La validación corre siempre en vivo, pero el error/estado válido de un campo solo
 * se muestra una vez que el usuario lo "toca" (blur) o intenta enviar el formulario —
 * así un formulario recién abierto no aparece todo en rojo, y un campo pasa de
 * inválido a válido (o viceversa) en vivo apenas se corrige, sin reenviar.
 */
export function useZodForm<Schema extends ZodType>(schema: Schema, draft: Ref<z.infer<Schema>>) {
  const { errors, handleSubmit, setValues } = useForm({
    validationSchema: toTypedSchema(schema),
  })

  const submitted = ref(false)
  const tocados = reactive<Record<string, boolean>>({})

  watch(
    draft,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value) => setValues(value as any, true),
    { deep: true, immediate: true },
  )

  const tocar = (campo: string) => { tocados[campo] = true }
  const esVisible = (campo: string) => submitted.value || !!tocados[campo]

  const onValidSubmit = (onSuccess: () => void) => {
    const submit = handleSubmit((formateado) => {
      Object.assign(draft.value as object, formateado)
      onSuccess()
    })
    return () => {
      submitted.value = true
      return submit()
    }
  }

  return { errors, submitted, tocar, esVisible, onValidSubmit }
}
