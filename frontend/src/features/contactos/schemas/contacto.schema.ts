import { z } from 'zod'
import { documentoIdentidad, nombrePersona, optionalEmail, telefonoCO } from '@/shared/utils/zodHelpers'

export const contactoSchema = z.object({
  nombre: nombrePersona(),
  tipoDocumento: z.enum(['CC', 'CE', 'TI', 'NIT', 'PP']),
  documento: documentoIdentidad({ opcional: true }),
  correo: optionalEmail(),
  telefono: telefonoCO(),
  empresa: z.string().trim(),
  cargo: z.string().trim(),
  ciudad: z.string().trim().min(1, 'La ciudad es obligatoria'),
  departamento: z.string().trim().min(1, 'El departamento es obligatorio'),
  estado: z.enum(['Activo', 'Inactivo', 'Prospecto', 'En proceso']),
  tipoContacto: z.enum(['Cliente', 'Prospecto']),
  fechaNacimiento: z.string().trim(),
  sexo: z.union([z.enum(['Masculino', 'Femenino']), z.literal('')]),
  etiquetas: z.array(z.object({ id: z.number(), nombre: z.string(), color: z.string() })),
})

export type ContactoSchema = z.infer<typeof contactoSchema>
