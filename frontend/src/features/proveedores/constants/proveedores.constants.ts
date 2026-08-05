import type { ProveedorDraft } from '../types/proveedor'

export const PROVEEDOR_DRAFT_VACIO: ProveedorDraft = {
  nombre: '', categoria: '', nit: '', correo: '', telefono: '', estado: 'Activo',
}

export const categoriaColor = (cat: string) => {
  const map: Record<string, string> = {
    'Insumos Médicos':     'text-[#065F46]',
    'Material POP':        'text-[#1E3A8A]',
    'Equipos Tecnológicos':'text-[#1A2A6C]',
    'Alimentación':        'text-[#92400E]',
    'Transporte':          'text-[#9D174D]',
  }
  return map[cat] ?? 'text-slate-500'
}
