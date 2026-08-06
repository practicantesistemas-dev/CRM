import { z } from 'zod'
import { nit, nombreEntidad } from '@/shared/utils/zodHelpers'

export const empresaSchema = z.object({
  razonSocial: nombreEntidad({ message: 'Ingresa la razón social (mín. 3 caracteres, no solo números o símbolos)' }),
  nit: nit(),
  industria: z.string().trim().min(1, 'Ingresa la industria'),
  direccion: z.string().trim().min(3, 'Ingresa la dirección (mín. 3 caracteres)'),
  ciudad: z.string().trim().min(1, 'Ingresa la ciudad'),
  estado: z.boolean(),
})

export type EmpresaSchema = z.infer<typeof empresaSchema>
