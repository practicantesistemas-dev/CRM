import { watch, type Ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { ZodType, z } from 'zod'

/**
 * Conecta un objeto "draft" (fuente de verdad, editado con v-model en el template)
 * a VeeValidate + Zod: valida en cada cambio y, al enviar, reescribe el draft con
 * la salida ya formateada/transformada por el schema (trim, normalización, etc).
 */
export function useZodForm<Schema extends ZodType>(schema: Schema, draft: Ref<z.infer<Schema>>) {
  const { errors, handleSubmit, setValues } = useForm({
    validationSchema: toTypedSchema(schema),
  })

  watch(
    draft,
    (value) => setValues(value as Record<string, unknown>, false),
    { deep: true, immediate: true },
  )

  const onValidSubmit = (onSuccess: () => void) =>
    handleSubmit((formateado) => {
      Object.assign(draft.value as object, formateado)
      onSuccess()
    })

  return { errors, onValidSubmit }
}
