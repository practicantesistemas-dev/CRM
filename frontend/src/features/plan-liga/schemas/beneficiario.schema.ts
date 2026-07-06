import { z } from 'zod'
import { documentoIdentidad, nombrePersona } from '@/shared/utils/zodHelpers'

export const beneficiarioSchema = z.object({
  documento: documentoIdentidad(),
  nombre: nombrePersona(),
  fechaNacimiento: z.string().trim(),
  parentesco: z.string().trim(),
  estado: z.enum(['Activo', 'Inactivo', 'Reemplazado', 'Retirado']),
  fechaInscripcion: z.string().trim(),
})

export type BeneficiarioSchema = z.infer<typeof beneficiarioSchema>
