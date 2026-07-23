import { z } from 'zod'
import { documentoIdentidad, nombreEntidad, nombrePersona, optionalEmail, telefonoCO } from '@/shared/utils/zodHelpers'

export const beneficiarioSchema = z.object({
  tipoDocumento: z.string().trim().min(1, 'Selecciona un tipo de documento'),
  documento: documentoIdentidad(),
  nombre: nombrePersona(),
  fechaNacimiento: z.string().trim(),
  sexo: z.union([z.enum(['Masculino', 'Femenino']), z.literal('')]),
  correo: optionalEmail(),
  telefono: telefonoCO(),
  direccion: z.string().trim(),
  ciudad: z.string().trim().min(1, 'La ciudad es obligatoria'),
  departamento: z.string().trim().min(1, 'El departamento es obligatorio'),
  empresa: nombreEntidad({ opcional: true }),
  tipoPlan: z.string().trim(),
  eps: z.string().trim(),
  otraEps: z.string().trim(),
  planSalud: z.string().trim(),
  planNombre: z.string().trim(),
  estado: z.enum(['Activo', 'Inactivo', 'Reemplazado', 'Retirado']),
  fechaInscripcion: z.string().trim().min(1, 'La fecha de ingreso es obligatoria'),
})

export type BeneficiarioSchema = z.infer<typeof beneficiarioSchema>
