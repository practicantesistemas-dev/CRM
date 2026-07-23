import { z } from 'zod'
import { documentoIdentidad, nombreEntidad, nombrePersona, optionalEmail, telefonoCO } from '@/shared/utils/zodHelpers'

export const titularSchema = z.object({
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
  planContratado: z.string().trim(),
  servicioId: z.number().nullable(),
  tipoPlan: z.string().trim(),
  tipoAfiliado: z.string().trim(),
  eps: z.string().trim(),
  otraEps: z.string().trim(),
  planSalud: z.string().trim(),
  planNombre: z.string().trim(),
  fechaInscripcion: z.string().trim(),
  estado: z.enum(['Activo', 'Inactivo']),
})

export type TitularSchema = z.infer<typeof titularSchema>
