import { z } from 'zod'
import { formatMoneyCOP } from '@/shared/utils/formatters'

export const oportunidadSchema = z.object({
  tipoCliente: z.enum(['empresa', 'contacto', 'titular']),
  empresaId: z.number().int().positive().nullable(),
  empresaNombre: z.string().trim(),
  contactoId: z.number().int().positive().nullable(),
  contactoNombre: z.string().trim(),
  planLigaTitularId: z.number().int().positive().nullable(),
  titularNombre: z.string().trim(),
  servicio: z.string().trim().min(1, 'Selecciona un servicio'),
  responsable: z.string().trim(),
  valor: z.string().trim().transform(formatMoneyCOP),
  probabilidad: z.number().min(0).max(100),
  estado: z.enum(['Lead', 'Primer Contacto', 'Reunión', 'Cotización', 'Negociación', 'Ganada', 'Perdida']),
}).superRefine((data, ctx) => {
  if (data.tipoCliente === 'empresa' && data.empresaId === null) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['empresaId'], message: 'Selecciona una empresa' })
  }
  if (data.tipoCliente === 'contacto' && data.contactoId === null) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['contactoId'], message: 'Selecciona un contacto' })
  }
  if (data.tipoCliente === 'titular' && data.planLigaTitularId === null) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['planLigaTitularId'], message: 'Selecciona un titular Plan Liga' })
  }
})

export type OportunidadSchema = z.infer<typeof oportunidadSchema>
