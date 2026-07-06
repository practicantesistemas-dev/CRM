import { z } from 'zod'
import { documentoIdentidad, nombreEntidad, nombrePersona, optionalEmail, telefonoCO } from '@/shared/utils/zodHelpers'

export const titularSchema = z.object({
  documento: documentoIdentidad(),
  nombre: nombrePersona(),
  fechaNacimiento: z.string().trim(),
  sexo: z.enum(['Masculino', 'Femenino', 'Otro']),
  correo: optionalEmail(),
  telefono: telefonoCO(),
  empresa: nombreEntidad({ opcional: true }),
  planContratado: z.string().trim(),
  fechaInscripcion: z.string().trim(),
  estado: z.enum(['Activo', 'Inactivo']),
})

export type TitularSchema = z.infer<typeof titularSchema>
