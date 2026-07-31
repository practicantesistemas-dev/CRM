import { z } from 'zod'
import { documentoIdentidad, nombrePersona, telefonoCO } from '@/shared/utils/zodHelpers'

export const contactoSchema = z.object({
  nombre: nombrePersona(),
  tipoDocumento: z.enum(['CC', 'CE', 'TI', 'NIT', 'PP']),
  documento: documentoIdentidad({ opcional: true }),
  correo: z.string().trim().toLowerCase().email('Correo electrónico inválido'),
  telefono: telefonoCO(),
  empresa: z.string().trim(),
  cargo: z.string().trim(),
  ciudad: z.string().trim(),
  departamento: z.string().trim(),
  estado: z.enum(['Activo', 'Inactivo', 'Prospecto', 'En proceso']),
  tipoContacto: z.enum(['Cliente', 'Prospecto']),
  fechaNacimiento: z.string().trim(),
  sexo: z.enum(['Masculino', 'Femenino', 'Otro']),
  etiquetas: z.array(z.object({ id: z.number(), nombre: z.string(), color: z.string() })),
  responsable: z.string().trim(),
})

export type ContactoSchema = z.infer<typeof contactoSchema>
