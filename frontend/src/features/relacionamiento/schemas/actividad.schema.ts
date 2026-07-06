import { z } from 'zod'
import { nombreEntidad, nombrePersona } from '@/shared/utils/zodHelpers'

export const actividadSchema = z.object({
  tipo: z.enum(['Llamada', 'Correo', 'Reunión', 'WhatsApp', 'Nota']),
  contacto: nombrePersona(),
  empresa: nombreEntidad({ opcional: true }),
  accion: z.string().trim().min(5, 'Describe la actividad realizada (mín. 5 caracteres)'),
  proximoPaso: z.string().trim(),
  fecha: z.string().trim(),
  usuario: z.string().trim(),
})

export type ActividadSchema = z.infer<typeof actividadSchema>
