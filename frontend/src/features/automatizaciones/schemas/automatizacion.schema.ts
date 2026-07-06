import { z } from 'zod'
import { nombreEntidad } from '@/shared/utils/zodHelpers'

export const automatizacionSchema = z.object({
  nombre: nombreEntidad({ message: 'Ingresa el nombre (mín. 3 caracteres, no solo números o símbolos)' }),
  descripcion: z.string().trim(),
  trigger: z.enum([
    'Nuevo contacto', 'Cambio de etapa', 'Fecha de seguimiento', 'Sin actividad 7 días',
    'Campaña enviada', 'Formulario completado', 'Nuevo beneficiario', 'Inscripción Plan Liga',
  ]),
  accion: z.enum([
    'Enviar correo', 'Crear tarea', 'Notificar responsable', 'Mover etapa',
    'Asignar etiqueta', 'Crear actividad', 'Enviar WhatsApp',
  ]),
})

export type AutomatizacionSchema = z.infer<typeof automatizacionSchema>
