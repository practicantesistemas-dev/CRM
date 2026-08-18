import type { PlanDraft } from '../services/servicios.api'

export const PLAN_DRAFT_VACIO: PlanDraft = {
  categoria: '',
  nombre: '',
  tipoCliente: 'Particular',
  beneficiarios: 1,
  beneficiariosAdicionales: 0,
  descripcion: '',
  estado: 'Activo',
}
