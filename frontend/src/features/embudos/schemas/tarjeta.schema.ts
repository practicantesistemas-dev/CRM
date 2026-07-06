import { z } from 'zod'
import { formatMoneyCOP } from '@/shared/utils/formatters'
import { nombreEntidad, nombrePersona } from '@/shared/utils/zodHelpers'

export const tarjetaSchema = z.object({
  empresa: nombreEntidad({ message: 'Ingresa el nombre de la empresa (mín. 3 caracteres, no solo números o símbolos)' }),
  contacto: nombrePersona({ opcional: true }),
  valor: z.string().trim().transform(formatMoneyCOP),
  responsable: z.string().trim(),
  seguimiento: z.string().trim(),
  etapa: z.string().trim().min(1, 'Selecciona una etapa'),
})

export type TarjetaSchema = z.infer<typeof tarjetaSchema>
