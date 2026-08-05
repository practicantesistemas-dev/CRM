import { z } from 'zod'
import { nombreEntidad } from '@/shared/utils/zodHelpers'

export const actividadServicioSchema = z.object({
  nombre: nombreEntidad({ message: 'Ingresa un nombre válido para el servicio (mín. 3 caracteres)' }),
  cantidad: z.coerce.number().min(0, 'La cantidad no puede ser negativa'),
  precio: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  descripcion: z.string().trim(),
})

export type ActividadServicioSchema = z.infer<typeof actividadServicioSchema>
