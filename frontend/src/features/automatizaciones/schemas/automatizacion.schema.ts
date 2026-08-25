import { z } from 'zod'
import { nombreEntidad } from '@/shared/utils/zodHelpers'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const automatizacionSchema = z.object({
  nombre: nombreEntidad({ message: 'Ingresa el nombre (mín. 3 caracteres, no solo números o símbolos)' }),
  descripcion: z.string().trim(),
  // Por ahora la única acción disponible es "Enviar correo" (ver ACCIONES en las constantes).
  accion: z.enum([
    'Enviar correo', 'Crear tarea', 'Notificar responsable', 'Mover etapa',
    'Asignar etiqueta', 'Crear actividad', 'Enviar WhatsApp',
  ]),
  correos: z.string().trim(),
  asunto: z.string().trim(),
  cuerpo: z.string().trim(),
}).superRefine((data, ctx) => {
  if (data.accion !== 'Enviar correo') return
  const lista = data.correos.split(',').map(c => c.trim()).filter(Boolean)
  if (lista.length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['correos'], message: 'Ingresa al menos un correo destino' })
  } else {
    const invalido = lista.find(c => !EMAIL_RE.test(c))
    if (invalido) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['correos'], message: `Correo inválido: ${invalido}` })
    }
  }
  if (data.asunto.length < 3) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['asunto'], message: 'Ingresa el asunto del correo (mín. 3 caracteres)' })
  }
  if (data.cuerpo.length < 10) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cuerpo'], message: 'Ingresa el cuerpo del correo (mín. 10 caracteres)' })
  }
})

export type AutomatizacionSchema = z.infer<typeof automatizacionSchema>
