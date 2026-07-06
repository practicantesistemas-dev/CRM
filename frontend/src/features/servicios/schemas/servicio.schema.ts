import { z } from 'zod'
import { formatMoneyCOP } from '@/shared/utils/formatters'
import { codigoEntidad, nombreEntidad } from '@/shared/utils/zodHelpers'

export const servicioSchema = z.object({
  nombre: nombreEntidad({ message: 'Ingresa el nombre del servicio (mín. 3 caracteres, no solo números o símbolos)' }),
  codigo: codigoEntidad(),
  categoria: z.string().trim(),
  responsable: z.string().trim(),
  estado: z.enum(['Activo', 'Inactivo', 'En revisión']),
  tipo: z.enum(['Empresarial', 'Individual', 'Bienestar', 'Salud']),
  empresasInteresadas: z.number(),
  contactosInteresados: z.number(),
  ventas: z.number(),
  conversion: z.string(),
  valorPotencial: z.string().trim().transform((v) => (v ? formatMoneyCOP(v) : '')),
  solicitudes: z.number(),
})

export type ServicioSchema = z.infer<typeof servicioSchema>
