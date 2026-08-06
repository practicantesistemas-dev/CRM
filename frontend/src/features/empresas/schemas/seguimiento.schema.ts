import { z } from 'zod'

export const seguimientoEmpresaSchema = z.object({
  tipo: z.enum(['Llamada', 'Correo', 'Reunión', 'WhatsApp', 'Nota']),
  accion: z.string().trim().min(5, 'Describe la actividad realizada (mín. 5 caracteres)'),
  proximoPaso: z.string().trim(),
  proximoPasoFecha: z.string().trim(),
  fecha: z.string().trim(),
})

export type SeguimientoEmpresaSchema = z.infer<typeof seguimientoEmpresaSchema>
