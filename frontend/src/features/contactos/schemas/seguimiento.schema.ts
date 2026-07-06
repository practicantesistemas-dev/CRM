import { z } from 'zod'

export const seguimientoSchema = z.object({
  tipo: z.enum(['Llamada', 'Correo', 'Reunión', 'WhatsApp', 'Nota']),
  accion: z.string().trim().min(5, 'Describe la actividad realizada (mín. 5 caracteres)'),
  proximoPaso: z.string().trim(),
  fecha: z.string().trim(),
})

export type SeguimientoSchema = z.infer<typeof seguimientoSchema>
