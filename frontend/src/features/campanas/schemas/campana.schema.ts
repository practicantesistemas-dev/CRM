import { z } from 'zod'
import { nombreEntidad } from '@/shared/utils/zodHelpers'

export const campanaSchema = z.object({
  nombre: nombreEntidad({ message: 'Ingresa el nombre de la campaña (mín. 3 caracteres, no solo números o símbolos)' }),
  segmento: z.string().trim(),
  estado: z.enum(['Borrador', 'Enviada', 'Programada']),
  enviados: z.number(),
  aperturas: z.number(),
  clics: z.number(),
  rebotes: z.number(),
  fecha: z.string().trim(),
})

export type CampanaSchema = z.infer<typeof campanaSchema>
