import { Phone, Mail, Calendar, MessageCircle, FileText } from 'lucide-vue-next'
import type {
  Beneficiario, BeneficiarioDraft, OpcionImportacion, Titular, TitularDraft, TipoSeguimiento,
} from '../types/plan-liga'

const TITULAR_EXTRA_VACIO = {
  tipoDocumento: 'CC', direccion: '', ciudad: '', departamento: '',
  // El titular siempre se crea como tipo de afiliado 1 (cotizante); el campo no es editable en el formulario.
  tipoPlan: '', tipoAfiliado: '1', eps: '', otraEps: '', planSalud: '', planNombre: '',
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

export const CUPO_MAXIMO = 4

// La activación uno por uno ya no le pide la fecha al usuario: se activa con la fecha de hoy.
export const fechaIngresoMaxima = (): string => new Date().toISOString().split('T')[0]

/**
 * Cupo real de beneficiarios de un titular según los planes que trae el backend.
 * Si no hay ese dato (titular creado localmente) o el plan no quedó vinculado
 * (cupo en 0 aunque sí haya beneficiarios activos), usa el tope por defecto.
 */
export const cupoMaximoTitular = (t: Titular): number => {
  const cupo = t.planesDetalle?.reduce((sum, p) => sum + p.cupo, 0) ?? 0
  return cupo > 0 ? cupo : CUPO_MAXIMO
}

export const TIPO_SEG_META: Record<TipoSeguimiento, { icono: unknown; color: string }> = {
  'Llamada':  { icono: Phone,         color: '#2447F9' },
  'Correo':   { icono: Mail,          color: '#EC4899' },
  'Reunión':  { icono: Calendar,      color: '#C9A227' },
  'WhatsApp': { icono: MessageCircle, color: '#059669' },
  'Nota':     { icono: FileText,      color: '#1A2A6C' },
}

export const OPCIONES_IMPORT: OpcionImportacion[] = [
  { key: 'agregar_grupos', label: 'Agregar grupos',                desc: 'Crea titulares y sus beneficiarios en bloque a partir de la plantilla de carga.', color: '#EC4899', bg: '#FCE7F3' },
  { key: 'titular',        label: 'Activar / Desactivar titular',     desc: 'Cambia el estado de titulares existentes por documento.',                        color: '#2447F9', bg: '#EEF2FF' },
  { key: 'beneficiario',   label: 'Activar / Desactivar beneficiario', desc: 'Cambia el estado de beneficiarios existentes por documento.',                    color: '#059669', bg: '#D1FAE5' },
]

export const estadoTitularStyle = (e: Titular['estado']) => e === 'Activo' ? 'text-emerald-600' : 'text-slate-400'

export const estadoBeneStyle = (e: Beneficiario['estado']) =>
  ({ Activo: 'text-emerald-600', Inactivo: 'text-slate-400', Reemplazado: 'text-amber-600', Retirado: 'text-red-500' } as Record<string, string>)[e] ?? 'text-slate-400'

export const planStyle = (p: string) => p === 'Plan Liga Empresarial' ? 'text-[#1E3A8A]' : 'text-[#9D174D]'
