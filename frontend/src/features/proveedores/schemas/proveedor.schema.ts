import { z } from 'zod'
import { nit, nombreEntidad, optionalEmail, telefonoCO } from '@/shared/utils/zodHelpers'

export const proveedorSchema = z.object({
  nombre: nombreEntidad({ message: 'Ingresa el nombre del proveedor (mín. 3 caracteres, no solo números o símbolos)' }),
  categoria: z.string().trim(),
  nit: nit({ opcional: true }),
  correo: optionalEmail(),
  telefono: telefonoCO(),
  estado: z.enum(['Activo', 'Inactivo']),
})

export type ProveedorSchema = z.infer<typeof proveedorSchema>
