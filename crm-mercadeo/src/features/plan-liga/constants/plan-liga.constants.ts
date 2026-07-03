import { Phone, Mail, Calendar, MessageCircle, FileText } from 'lucide-vue-next'
import type {
  Beneficiario, BeneficiarioDraft, OpcionImportacion, Titular, TitularDraft, TipoSeguimiento,
} from '../types/plan-liga'

export const TITULARES_MOCK: Titular[] = [
  { id: 1, documento: '10293844', nombre: 'Carlos Mendoza Ruiz',  fechaNacimiento: '1989-03-15', sexo: 'Masculino', correo: 'carlos@globaltech.com', telefono: '300-555-0192', empresa: 'Global Tech S.A.S',    planContratado: 'Plan Liga Empresarial', fechaInscripcion: '2026-01-10', estado: 'Activo'   },
  { id: 2, documento: '25841203', nombre: 'Ana Victoria Ruiz',    fechaNacimiento: '1985-07-22', sexo: 'Femenino',  correo: 'ana@esteticamayo.com',  telefono: '311-222-4455', empresa: 'Estética Mayo',         planContratado: 'Plan Liga Individual',  fechaInscripcion: '2026-02-15', estado: 'Activo'   },
  { id: 3, documento: '71234567', nombre: 'Pedro Sánchez Mejía',  fechaNacimiento: '1978-11-08', sexo: 'Masculino', correo: 'pedro@constructora.co', telefono: '314-888-1122', empresa: 'Constructora ABC',      planContratado: 'Plan Liga Empresarial', fechaInscripcion: '2026-03-01', estado: 'Activo'   },
  { id: 4, documento: '43901234', nombre: 'Laura Gómez Vargas',   fechaNacimiento: '1993-05-30', sexo: 'Femenino',  correo: 'laura@farmanorte.com',  telefono: '320-777-3344', empresa: 'Farmacia Norte',        planContratado: 'Plan Liga Individual',  fechaInscripcion: '2026-03-20', estado: 'Activo'   },
  { id: 5, documento: '19283746', nombre: 'Roberto Díaz Castro',  fechaNacimiento: '1982-09-14', sexo: 'Masculino', correo: 'roberto@techsol.co',   telefono: '301-444-9988', empresa: 'Tech Solutions',        planContratado: 'Plan Liga Empresarial', fechaInscripcion: '2026-04-05', estado: 'Inactivo' },
  { id: 6, documento: '52000111', nombre: 'Sandra Morales López', fechaNacimiento: '1990-01-18', sexo: 'Femenino',  correo: 'smorales@grupoXYZ.com',telefono: '316-555-7766', empresa: 'Grupo Empresarial XYZ', planContratado: 'Plan Liga Empresarial', fechaInscripcion: '2026-04-18', estado: 'Activo'   },
]

export const BENEFICIARIOS_MOCK: Beneficiario[] = [
  { id: 101, titularId: 1, documento: '1001122334', nombre: 'María Mendoza',    fechaNacimiento: '2015-06-10', parentesco: 'Hijo(a)',     estado: 'Activo',      fechaInscripcion: '2026-01-10' },
  { id: 102, titularId: 1, documento: '1001122335', nombre: 'José Mendoza',     fechaNacimiento: '2017-09-22', parentesco: 'Hijo(a)',     estado: 'Activo',      fechaInscripcion: '2026-01-10' },
  { id: 103, titularId: 1, documento: '55667788',   nombre: 'Rosa Ruiz',        fechaNacimiento: '1960-03-05', parentesco: 'Padre/Madre', estado: 'Activo',      fechaInscripcion: '2026-01-10' },
  { id: 104, titularId: 1, documento: '55667789',   nombre: 'Luis Mendoza',     fechaNacimiento: '1958-11-20', parentesco: 'Padre/Madre', estado: 'Activo',      fechaInscripcion: '2026-01-10' },
  { id: 201, titularId: 2, documento: '1009988776', nombre: 'Tomás Ruiz',       fechaNacimiento: '2010-03-15', parentesco: 'Hijo(a)',     estado: 'Activo',      fechaInscripcion: '2026-02-15' },
  { id: 202, titularId: 2, documento: '3344556677', nombre: 'Carmen Vásquez',   fechaNacimiento: '1958-08-01', parentesco: 'Padre/Madre', estado: 'Activo',      fechaInscripcion: '2026-02-15' },
  { id: 203, titularId: 2, documento: '3344556678', nombre: 'Andrés Vásquez',   fechaNacimiento: '2012-12-30', parentesco: 'Hijo(a)',     estado: 'Retirado',    fechaInscripcion: '2026-02-15' },
  { id: 301, titularId: 3, documento: '7788990011', nombre: 'Sofia Sánchez',    fechaNacimiento: '2008-05-20', parentesco: 'Hijo(a)',     estado: 'Activo',      fechaInscripcion: '2026-03-01' },
  { id: 302, titularId: 3, documento: '7788990012', nombre: 'Daniela Sánchez',  fechaNacimiento: '2005-07-14', parentesco: 'Hijo(a)',     estado: 'Reemplazado', fechaInscripcion: '2026-03-01' },
  { id: 601, titularId: 6, documento: '9900112233', nombre: 'Camila Morales',   fechaNacimiento: '2014-02-11', parentesco: 'Hijo(a)',     estado: 'Activo',      fechaInscripcion: '2026-04-18' },
  { id: 602, titularId: 6, documento: '9900112234', nombre: 'Rodrigo Morales',  fechaNacimiento: '2016-09-03', parentesco: 'Hijo(a)',     estado: 'Activo',      fechaInscripcion: '2026-04-18' },
  { id: 603, titularId: 6, documento: '8899001122', nombre: 'Elena López',      fechaNacimiento: '1955-04-25', parentesco: 'Padre/Madre', estado: 'Activo',      fechaInscripcion: '2026-04-18' },
]

export const TITULAR_DRAFT_VACIO: TitularDraft = {
  documento: '', nombre: '', fechaNacimiento: '', sexo: 'Masculino', correo: '', telefono: '',
  empresa: '', planContratado: 'Plan Liga Individual', fechaInscripcion: new Date().toISOString().split('T')[0], estado: 'Activo',
}

export const BENEFICIARIO_DRAFT_VACIO: BeneficiarioDraft = {
  documento: '', nombre: '', fechaNacimiento: '', parentesco: 'Hijo(a)', estado: 'Activo',
  fechaInscripcion: new Date().toISOString().split('T')[0],
}

export const PARENTESCOS = ['Cónyuge', 'Hijo(a)', 'Padre/Madre', 'Hermano(a)', 'Otro']

export const CUPO_MAXIMO = 4

export const TIPO_SEG_META: Record<TipoSeguimiento, { icono: unknown; color: string }> = {
  'Llamada':  { icono: Phone,         color: '#2447F9' },
  'Correo':   { icono: Mail,          color: '#EC4899' },
  'Reunión':  { icono: Calendar,      color: '#C9A227' },
  'WhatsApp': { icono: MessageCircle, color: '#059669' },
  'Nota':     { icono: FileText,      color: '#1A2A6C' },
}

export const OPCIONES_IMPORT: OpcionImportacion[] = [
  { key: 'activar_titular',      label: 'Activar / Registrar titulares',     desc: 'Nuevos titulares o activa existentes. Requiere: Documento, Nombre, Correo, Plan.',           color: '#EC4899', bg: '#FCE7F3' },
  { key: 'activar_beneficiario', label: 'Activar / Registrar beneficiarios', desc: 'Agrega beneficiarios a titulares existentes. Respeta límite de 4 activos por titular.',      color: '#2447F9', bg: '#EEF2FF' },
  { key: 'reemplazar',           label: 'Reemplazar beneficiario',            desc: 'Reemplaza un beneficiario activo. Requiere: Doc. titular, Doc. a reemplazar, nuevo bene.',  color: '#C9A227', bg: '#FEF9C3' },
  { key: 'desactivar',           label: 'Desactivar titular o beneficiario',  desc: 'Desactiva por documento. Columna Tipo: T (titular) o B (beneficiario).',                    color: '#059669', bg: '#D1FAE5' },
]

export const estadoTitularStyle = (e: Titular['estado']) => e === 'Activo' ? 'text-emerald-600' : 'text-slate-400'

export const estadoBeneStyle = (e: Beneficiario['estado']) =>
  ({ Activo: 'text-emerald-600', Inactivo: 'text-slate-400', Reemplazado: 'text-amber-600', Retirado: 'text-red-500' } as Record<string, string>)[e] ?? 'text-slate-400'

export const planStyle = (p: string) => p === 'Plan Liga Empresarial' ? 'text-[#1E3A8A]' : 'text-[#9D174D]'
