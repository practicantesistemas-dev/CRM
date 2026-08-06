import { z } from 'zod'

const MENSAJE_SUJETO = 'Selecciona al menos un contacto, empresa o titular Plan Liga'

export const actividadSchema = z.object({
  tipo: z.enum(['Llamada', 'Correo', 'Reunión', 'WhatsApp', 'Nota']),
  contactoId: z.number().int().positive().nullable(),
  contactoNombre: z.string().trim(),
  empresaNombre: z.string().trim(),
  titularId: z.number().int().positive().nullable(),
  titularNombre: z.string().trim(),
  accion: z.string().trim().min(5, 'Describe la actividad realizada (mín. 5 caracteres)'),
  proximoPaso: z.string().trim(),
  proximoPasoFecha: z.string().trim(),
  fecha: z.string().trim(),
  oportunidadId: z.number().int().positive().nullable(),
}).superRefine((data, ctx) => {
  if (!data.contactoId && !data.empresaNombre.trim() && !data.titularId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['contactoId'], message: MENSAJE_SUJETO })
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['empresaNombre'], message: MENSAJE_SUJETO })
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['titularId'], message: MENSAJE_SUJETO })
  }
  if (data.proximoPasoFecha && !data.proximoPaso.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['proximoPaso'], message: 'Describe el próximo paso para poder ponerle fecha' })
  }
})

export type ActividadSchema = z.infer<typeof actividadSchema>
