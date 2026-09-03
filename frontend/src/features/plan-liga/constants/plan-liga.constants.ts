import { Phone, Mail, Calendar, MessageCircle, MessageSquare, FileText } from 'lucide-vue-next'
import type {
  Beneficiario, BeneficiarioDraft, OpcionImportacion, Titular, TitularDraft, TipoSeguimiento, ReemplazoPersonaDraft,
} from '../types/plan-liga'

const TITULAR_EXTRA_VACIO = {
  tipoDocumento: 'CC', direccion: '', ciudad: '', departamento: '',
  // El titular siempre se crea como tipo de afiliado 1 (cotizante); el campo no es editable en el formulario.
  tipoPlan: '', tipoAfiliado: '1', eps: '', otraEps: '', planSalud: '', planNombre: '', factura: '',
}

const BENEFICIARIO_EXTRA_VACIO = {
  tipoDocumento: 'CC', sexo: '' as const, correo: '', telefono: '', direccion: '', ciudad: '', departamento: '', empresa: '',
  tipoPlan: '', eps: '', otraEps: '', planSalud: '', planNombre: '',
}

export const TITULAR_DRAFT_VACIO: TitularDraft = {
  ...TITULAR_EXTRA_VACIO,
  documento: '', nombre: '', fechaNacimiento: '', sexo: '', correo: '', telefono: '',
  empresa: '', planContratado: '', tipoPlanId: null, fechaInscripcion: new Date().toISOString().split('T')[0], estado: 'Activo',
}

export const BENEFICIARIO_DRAFT_VACIO: BeneficiarioDraft = {
  ...BENEFICIARIO_EXTRA_VACIO,
  documento: '', nombre: '', fechaNacimiento: '', estado: 'Activo',
  fechaInscripcion: new Date().toISOString().split('T')[0],
}

export const REEMPLAZO_PERSONA_DRAFT_VACIO: ReemplazoPersonaDraft = {
  tipoDocumento: 'CC', documento: '', nombre: '', fechaNacimiento: '', sexo: '',
  correo: '', telefono: '', direccion: '', ciudad: '', departamento: '', empresa: '',
}

export const CUPO_MAXIMO = 4

// La activación uno por uno ya no le pide la fecha al usuario: se activa con la fecha de hoy.
export const fechaIngresoMaxima = (): string => new Date().toISOString().split('T')[0]

/**
 * Cupo real de beneficiarios de un titular según los planes que trae el backend.
 * Si no hay ese dato (titular creado localmente) usa el tope por defecto. Si el backend
 * sí trae un plan vinculado con cupo 0 (p. ej. un plan "Individual", que por diseño no
 * admite beneficiarios), se respeta ese 0 — salvo que haya beneficiarios activos a pesar
 * del cupo 0, lo que indica que el plan no quedó bien vinculado y se usa el tope por defecto.
 */
export const cupoMaximoTitular = (t: Titular): number => {
  if (!t.planesDetalle?.length) return CUPO_MAXIMO
  const cupo = t.planesDetalle.reduce((sum, p) => sum + p.cupo, 0)
  if (cupo > 0) return cupo
  const activos = t.planesDetalle.reduce((sum, p) => sum + p.activos, 0)
  return activos > 0 ? CUPO_MAXIMO : 0
}

export const TIPO_SEG_META: Record<TipoSeguimiento, { icono: unknown; color: string }> = {
  'Llamada':  { icono: Phone,         color: '#2447F9' },
  'Correo':   { icono: Mail,          color: '#EC4899' },
  'Reunión':  { icono: Calendar,      color: '#C9A227' },
  'WhatsApp': { icono: MessageCircle, color: '#059669' },
  'Mensaje':  { icono: MessageSquare, color: '#7C3AED' },
  'Nota':     { icono: FileText,      color: '#1A2A6C' },
}

export const OPCIONES_IMPORT: OpcionImportacion[] = [
  { key: 'agregar_grupos', label: 'Agregar grupos',                desc: 'Crea titulares y sus beneficiarios en bloque a partir de la plantilla de carga.', color: '#EC4899', bg: '#FCE7F3' },
  { key: 'titular',        label: 'Activar / Desactivar titular',     desc: 'Cambia el estado de titulares existentes por documento.',                        color: '#2447F9', bg: '#EEF2FF' },
  { key: 'beneficiario',   label: 'Activar / Desactivar beneficiario', desc: 'Cambia el estado de beneficiarios existentes por documento.',                    color: '#059669', bg: '#D1FAE5' },
]

// El servicio normaliza fechaNacimiento/fechaInscripcion a 'AAAA-MM-DD' (ver fechaApiAIso en
// plan-liga.api.ts); esto las reformatea a DD/MM/AAAA solo para mostrarlas en las tarjetas.
export const formatearFechaCorta = (fechaIso: string): string => {
  const m = fechaIso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return fechaIso
  const [, anio, mes, dia] = m
  return `${dia}/${mes}/${anio}`
}

export const estadoTitularStyle = (e: Titular['estado']) => e === 'Activo' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'

export const estadoBeneStyle = (e: Beneficiario['estado']) =>
  ({
    Activo: 'text-emerald-600 dark:text-emerald-400',
    Inactivo: 'text-slate-400 dark:text-slate-500',
    Reemplazado: 'text-amber-600 dark:text-amber-400',
    Retirado: 'text-red-500 dark:text-red-400',
  } as Record<string, string>)[e] ?? 'text-slate-400 dark:text-slate-500'

export const planStyle = (p: string) => p === 'Plan Liga Empresarial' ? 'text-[#1E3A8A] dark:text-blue-300' : 'text-[#9D174D] dark:text-pink-300'
