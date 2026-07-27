import { z } from 'zod'
import { documentoIdentidad, nombreEntidad, nombrePersona, optionalEmail, telefonoCO } from '@/shared/utils/zodHelpers'

// Datos de la PERSONA NUEVA en un reemplazo: solo identificación y contacto son obligatorios
// (plan/EPS/cupo se heredan del titular/beneficiario anterior, así que no aplican acá).
export const reemplazoPersonaSchema = z.object({
  tipoDocumento: z.string().trim().min(1, 'Selecciona un tipo de documento'),
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
})

export type ReemplazoPersonaSchema = z.infer<typeof reemplazoPersonaSchema>
