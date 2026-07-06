import { z } from 'zod'
import { nit, nombreEntidad } from '@/shared/utils/zodHelpers'

export const empresaSchema = z.object({
  razonSocial: nombreEntidad({ message: 'Ingresa la razón social (mín. 3 caracteres, no solo números o símbolos)' }),
  nit: nit(),
  industria: z.string().trim(),
  direccion: z.string().trim(),
  ciudad: z.string().trim(),
  responsable: z.string().trim(),
  estado: z.enum(['Activa', 'Inactiva', 'Prospecto']),
  contactos: z.number(),
  servicios: z.array(z.string()),
})

export type EmpresaSchema = z.infer<typeof empresaSchema>
