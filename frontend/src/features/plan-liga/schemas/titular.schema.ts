import { z } from 'zod'
import { documentoIdentidad, nombreEntidad, nombrePersona, optionalEmail, telefonoCO } from '@/shared/utils/zodHelpers'

export const titularSchema = z.object({
  tipoDocumento: z.string().trim().min(1, 'Selecciona un tipo de documento'),
  documento: documentoIdentidad(),
  nombre: nombrePersona(),
  fechaNacimiento: z.string().trim().min(1, 'La fecha de nacimiento es obligatoria'),
  sexo: z.union([z.enum(['Masculino', 'Femenino']), z.literal('')])
    .superRefine((v, ctx) => {
      if (v === '') ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Selecciona el sexo biológico' })
    }),
  correo: optionalEmail(),
  telefono: telefonoCO(),
  direccion: z.string().trim(),
  ciudad: z.string().trim().min(1, 'La ciudad es obligatoria'),
  departamento: z.string().trim().min(1, 'El departamento es obligatorio'),
  empresa: nombreEntidad({ opcional: true }),
  planContratado: z.string().trim().min(1, 'Selecciona un plan contratado'),
  servicioId: z.number().nullable(),
  tipoPlan: z.string().trim().min(1, 'El tipo de plan es obligatorio'),
  tipoAfiliado: z.string().trim(),
  eps: z.string().trim().min(1, 'La EPS es obligatoria'),
  otraEps: z.string().trim(),
  planSalud: z.string().trim(),
  planNombre: z.string().trim().min(1, 'El nombre del plan es obligatorio'),
  fechaInscripcion: z.string().trim().min(1, 'La fecha de inscripción es obligatoria'),
  estado: z.enum(['Activo', 'Inactivo']),
})

export type TitularSchema = z.infer<typeof titularSchema>
