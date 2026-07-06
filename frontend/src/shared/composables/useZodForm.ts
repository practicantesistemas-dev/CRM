import { ref, watch, type Ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { ZodType, z } from 'zod'

/**
 * Conecta un objeto "draft" (fuente de verdad, editado con v-model en el template)
 * a VeeValidate + Zod: valida en cada cambio y, al enviar, reescribe el draft con
 * la salida ya formateada/transformada por el schema (trim, normalización, etc).
 *
 * No valida en silencio mientras el usuario llena el formulario por primera vez: solo
 * después del primer intento de envío (`submitted`) empieza a revalidar en vivo, para
 * que un campo pueda pasar de inválido a válido (o viceversa) mientras se corrige.
 */
export function useZodForm<Schema extends ZodType>(schema: Schema, draft: Ref<z.infer<Schema>>) {
  const { errors, handleSubmit, setValues } = useForm({
    validationSchema: toTypedSchema(schema),
  })

  const submitted = ref(false)

  watch(
    draft,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value) => setValues(value as any, submitted.value),
    { deep: true, immediate: true },
  )

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

  return { errors, submitted, onValidSubmit }
}
