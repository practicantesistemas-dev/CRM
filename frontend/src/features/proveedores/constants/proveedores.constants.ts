import type { ProveedorDraft } from '../types/proveedor'

export const PROVEEDOR_DRAFT_VACIO: ProveedorDraft = {
  nombre: '', categoria: '', nit: '', correo: '', telefono: '', estado: 'Activo',
}

export const categoriaColor = (cat: string) => {
  const map: Record<string, string> = {
    'Insumos Médicos':     'text-[#065F46] dark:text-emerald-400',
    'Material POP':        'text-[#1E3A8A] dark:text-blue-300',
    'Equipos Tecnológicos':'text-[#1A2A6C] dark:text-indigo-300',
    'Alimentación':        'text-[#92400E] dark:text-amber-400',
    'Transporte':          'text-[#9D174D] dark:text-pink-300',
  }
  return map[cat] ?? 'text-slate-500 dark:text-slate-400'
}
