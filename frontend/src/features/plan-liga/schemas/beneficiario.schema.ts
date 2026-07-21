import { z } from 'zod'
import { documentoIdentidad, nombreEntidad, nombrePersona, optionalEmail, telefonoCO } from '@/shared/utils/zodHelpers'

export const beneficiarioSchema = z.object({
  tipoDocumento: z.string().trim(),
  documento: documentoIdentidad(),
  nombre: nombrePersona(),
  fechaNacimiento: z.string().trim(),
  sexo: z.union([z.enum(['Masculino', 'Femenino']), z.literal('')]),
  correo: optionalEmail(),
  telefono: telefonoCO(),
  direccion: z.string().trim(),
  ciudad: z.string().trim(),
  departamento: z.string().trim(),
  empresa: nombreEntidad({ opcional: true }),
  estado: z.enum(['Activo', 'Inactivo', 'Reemplazado', 'Retirado']),
  fechaInscripcion: z.string().trim(),
})

export type BeneficiarioSchema = z.infer<typeof beneficiarioSchema>
