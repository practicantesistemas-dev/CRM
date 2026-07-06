import { z } from 'zod'
import { formatMoneyCOP } from '@/shared/utils/formatters'
import { nombreEntidad, nombrePersona } from '@/shared/utils/zodHelpers'

export const oportunidadSchema = z.object({
  empresa: nombreEntidad({ message: 'Ingresa la empresa (mín. 3 caracteres, no solo números o símbolos)' }),
  contacto: nombrePersona({ opcional: true }),
  servicio: z.string().trim().min(1, 'Selecciona un servicio'),
  responsable: z.string().trim(),
  valor: z.string().trim().transform(formatMoneyCOP),
  probabilidad: z.number().min(0).max(100),
  estado: z.enum(['Lead', 'Primer Contacto', 'Reunión', 'Cotización', 'Negociación', 'Ganada', 'Perdida']),
})

export type OportunidadSchema = z.infer<typeof oportunidadSchema>
