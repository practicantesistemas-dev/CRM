import type { Empresa, EmpresaDraft } from '../types/empresa'

export const EMPRESA_DRAFT_VACIO: EmpresaDraft = {
  razonSocial: '', nit: '', industria: '', direccion: '', ciudad: '', estado: true,
}

export const estadoStyle = (e: Empresa['estado']) => (e ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500')
export const estadoLabel = (e: Empresa['estado']) => (e ? 'Activa' : 'Inactiva')
