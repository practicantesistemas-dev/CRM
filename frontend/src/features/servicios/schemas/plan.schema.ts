import { z } from 'zod'
import { nombreEntidad } from '@/shared/utils/zodHelpers'

export const planSchema = z.object({
  categoria: nombreEntidad({ message: 'Ingresa el nombre del servicio (mín. 3 caracteres, no solo números o símbolos)' }),
  nombre: nombreEntidad({ message: 'Ingresa el nombre del plan (mín. 3 caracteres, no solo números o símbolos)' }),
  tipoCliente: z.enum(['Particular', 'Empresarial']),
  beneficiarios: z.number().min(0, 'Debe ser 0 o mayor'),
  beneficiariosAdicionales: z.number().min(0, 'Debe ser 0 o mayor'),
  descripcion: z.string().trim(),
  estado: z.enum(['Activo', 'Inactivo']),
})

export type PlanSchema = z.infer<typeof planSchema>
