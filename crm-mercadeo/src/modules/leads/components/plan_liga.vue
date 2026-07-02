<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  Heart, Users, Plus, Search, Download, Upload,
  Edit2, ToggleLeft, ToggleRight, X,
  AlertCircle, CheckCircle, RefreshCw, History,
  ClipboardList, Phone, Mail, Calendar, FileText,
  MessageCircle, FileSpreadsheet, Loader2
} from 'lucide-vue-next'

// ─── Interfaces ────────────────────────────────────────────────────
interface Titular {
  id: number
  documento: string
  nombre: string
  fechaNacimiento: string
  sexo: 'Masculino' | 'Femenino' | 'Otro'
  correo: string
  telefono: string
  empresa: string
  planContratado: string
  fechaInscripcion: string
  estado: 'Activo' | 'Inactivo'
}

interface Beneficiario {
  id: number
  titularId: number
  documento: string
  nombre: string
  fechaNacimiento: string
  parentesco: string
  estado: 'Activo' | 'Inactivo' | 'Reemplazado' | 'Retirado'
  fechaInscripcion: string
}

// ─── Mock data ──────────────────────────────────────────────────────
const titulares = ref<Titular[]>([
  { id: 1, documento: '10293844', nombre: 'Carlos Mendoza Ruiz',  fechaNacimiento: '1989-03-15', sexo: 'Masculino', correo: 'carlos@globaltech.com', telefono: '300-555-0192', empresa: 'Global Tech S.A.S',    planContratado: 'Plan Liga Empresarial', fechaInscripcion: '2026-01-10', estado: 'Activo'   },
  { id: 2, documento: '25841203', nombre: 'Ana Victoria Ruiz',    fechaNacimiento: '1985-07-22', sexo: 'Femenino',  correo: 'ana@esteticamayo.com',  telefono: '311-222-4455', empresa: 'Estética Mayo',         planContratado: 'Plan Liga Individual',  fechaInscripcion: '2026-02-15', estado: 'Activo'   },
  { id: 3, documento: '71234567', nombre: 'Pedro Sánchez Mejía',  fechaNacimiento: '1978-11-08', sexo: 'Masculino', correo: 'pedro@constructora.co', telefono: '314-888-1122', empresa: 'Constructora ABC',      planContratado: 'Plan Liga Empresarial', fechaInscripcion: '2026-03-01', estado: 'Activo'   },
  { id: 4, documento: '43901234', nombre: 'Laura Gómez Vargas',   fechaNacimiento: '1993-05-30', sexo: 'Femenino',  correo: 'laura@farmanorte.com',  telefono: '320-777-3344', empresa: 'Farmacia Norte',        planContratado: 'Plan Liga Individual',  fechaInscripcion: '2026-03-20', estado: 'Activo'   },
  { id: 5, documento: '19283746', nombre: 'Roberto Díaz Castro',  fechaNacimiento: '1982-09-14', sexo: 'Masculino', correo: 'roberto@techsol.co',   telefono: '301-444-9988', empresa: 'Tech Solutions',        planContratado: 'Plan Liga Empresarial', fechaInscripcion: '2026-04-05', estado: 'Inactivo' },
  { id: 6, documento: '52000111', nombre: 'Sandra Morales López', fechaNacimiento: '1990-01-18', sexo: 'Femenino',  correo: 'smorales@grupoXYZ.com',telefono: '316-555-7766', empresa: 'Grupo Empresarial XYZ', planContratado: 'Plan Liga Empresarial', fechaInscripcion: '2026-04-18', estado: 'Activo'   },
])

const beneficiarios = ref<Beneficiario[]>([
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
])

// ─── Business rule ─────────────────────────────────────────────────
const activosPorTitular = (id: number) =>
  beneficiarios.value.filter(b => b.titularId === id && b.estado === 'Activo').length
const puedeAgregar = (id: number) => activosPorTitular(id) < 4

// ─── Filters ───────────────────────────────────────────────────────
const buscar       = ref('')
const filtroEstado = ref('todos')
const filtroPlan   = ref('todos')
const filtroSexo   = ref('todos')
const filtroEdad   = ref('todos')

const calcEdadBucket = (fechaNac: string): string => {
  if (!fechaNac) return ''
  const edad = new Date().getFullYear() - new Date(fechaNac).getFullYear()
  if (edad < 18)  return '0-17'
  if (edad <= 35) return '18-35'
  if (edad <= 50) return '36-50'
  return '51+'
}

const titularesFiltrados = computed(() =>
  titulares.value.filter(t => {
    const q = buscar.value.toLowerCase()
    return (!q || [t.nombre, t.documento, t.empresa, t.correo].some(f => f.toLowerCase().includes(q)))
      && (filtroEstado.value === 'todos' || t.estado === filtroEstado.value)
      && (filtroPlan.value   === 'todos' || t.planContratado === filtroPlan.value)
      && (filtroSexo.value   === 'todos' || t.sexo === filtroSexo.value)
      && (filtroEdad.value   === 'todos' || calcEdadBucket(t.fechaNacimiento) === filtroEdad.value)
  })
)
const planes = computed(() => [...new Set(titulares.value.map(t => t.planContratado))].sort())

// ─── Stats ─────────────────────────────────────────────────────────
const totalActivos       = computed(() => titulares.value.filter(t => t.estado === 'Activo').length)
const totalBeneficiarios = computed(() => beneficiarios.value.filter(b => b.estado === 'Activo').length)
const titularesTope      = computed(() => titulares.value.filter(t => activosPorTitular(t.id) >= 4).length)

// ─── Modal Titular ─────────────────────────────────────────────────
const modalTitularVisible = ref(false)
const modalModo           = ref<'nuevo' | 'editar'>('nuevo')
const titularEditando     = ref<Titular | null>(null)
const formTitularVacio    = { documento: '', nombre: '', fechaNacimiento: '', sexo: 'Masculino' as const, correo: '', telefono: '', empresa: '', planContratado: 'Plan Liga Individual', fechaInscripcion: new Date().toISOString().split('T')[0], estado: 'Activo' as const }
const formTitular         = reactive({ ...formTitularVacio })

const abrirNuevoTitular  = () => { modalModo.value = 'nuevo'; titularEditando.value = null; Object.assign(formTitular, { ...formTitularVacio, fechaInscripcion: new Date().toISOString().split('T')[0] }); modalTitularVisible.value = true }
const abrirEditarTitular = (t: Titular) => { modalModo.value = 'editar'; titularEditando.value = t; Object.assign(formTitular, t); modalTitularVisible.value = true }
const guardarTitular = () => {
  if (!formTitular.documento || !formTitular.nombre) return
  if (modalModo.value === 'nuevo') { titulares.value.unshift({ ...formTitular, id: Date.now() }) }
  else if (titularEditando.value) { const idx = titulares.value.findIndex(t => t.id === titularEditando.value!.id); if (idx !== -1) titulares.value[idx] = { ...formTitular, id: titularEditando.value.id } }
  modalTitularVisible.value = false
}
const toggleEstadoTitular = (t: Titular) => { t.estado = t.estado === 'Activo' ? 'Inactivo' : 'Activo' }

// ─── Drawer Beneficiarios ──────────────────────────────────────────
const drawerVisible        = ref(false)
const titularSeleccionado  = ref<Titular | null>(null)
const errLimite            = ref(false)

const abrirBeneficiarios = (t: Titular) => { titularSeleccionado.value = t; drawerVisible.value = true; errLimite.value = false }
const beneficiariosTitular = computed(() => titularSeleccionado.value ? beneficiarios.value.filter(b => b.titularId === titularSeleccionado.value!.id) : [])
const activosActual        = computed(() => titularSeleccionado.value ? activosPorTitular(titularSeleccionado.value.id) : 0)

// ─── Modal Beneficiario ────────────────────────────────────────────
const modalBeneVisible     = ref(false)
const modalBeneModo        = ref<'nuevo' | 'editar'>('nuevo')
const beneficiarioEditando = ref<Beneficiario | null>(null)
const formBeneVacio        = { documento: '', nombre: '', fechaNacimiento: '', parentesco: 'Hijo(a)', estado: 'Activo' as const, fechaInscripcion: new Date().toISOString().split('T')[0] }
const formBene             = reactive({ ...formBeneVacio })
const parentescos          = ['Cónyuge', 'Hijo(a)', 'Padre/Madre', 'Hermano(a)', 'Otro']

const abrirNuevoBeneficiario = () => {
  if (!titularSeleccionado.value) return
  if (!puedeAgregar(titularSeleccionado.value.id)) { errLimite.value = true; return }
  errLimite.value = false; modalBeneModo.value = 'nuevo'; beneficiarioEditando.value = null
  Object.assign(formBene, { ...formBeneVacio, fechaInscripcion: new Date().toISOString().split('T')[0] })
  modalBeneVisible.value = true
}
const abrirEditarBeneficiario = (b: Beneficiario) => {
  errLimite.value = false; modalBeneModo.value = 'editar'; beneficiarioEditando.value = b
  Object.assign(formBene, b); modalBeneVisible.value = true
}
const guardarBeneficiario = () => {
  if (!formBene.documento || !formBene.nombre || !titularSeleccionado.value) return
  if (modalBeneModo.value === 'nuevo') {
    beneficiarios.value.push({ ...formBene, id: Date.now(), titularId: titularSeleccionado.value.id })
  } else if (beneficiarioEditando.value) {
    const idx = beneficiarios.value.findIndex(b => b.id === beneficiarioEditando.value!.id)
    if (idx !== -1) beneficiarios.value[idx] = { ...formBene, id: beneficiarioEditando.value.id, titularId: beneficiarioEditando.value.titularId }
  }
  modalBeneVisible.value = false
}
const toggleEstadoBeneficiario = (b: Beneficiario) => {
  if (b.estado === 'Activo') { b.estado = 'Inactivo' }
  else if (b.estado === 'Inactivo') {
    if (!titularSeleccionado.value || !puedeAgregar(titularSeleccionado.value.id)) { errLimite.value = true; return }
    b.estado = 'Activo'
  }
}
const reemplazarBeneficiario = (b: Beneficiario) => { b.estado = 'Reemplazado'; abrirNuevoBeneficiario() }

// ─── Seguimiento rápido ────────────────────────────────────────────
type TipoSeg = 'Llamada' | 'Correo' | 'Reunión' | 'WhatsApp' | 'Nota'
const tipoSegMeta: Record<TipoSeg, { icono: any; color: string }> = {
  'Llamada':  { icono: Phone,         color: '#2447F9' },
  'Correo':   { icono: Mail,          color: '#EC4899' },
  'Reunión':  { icono: Calendar,      color: '#C9A227' },
  'WhatsApp': { icono: MessageCircle, color: '#059669' },
  'Nota':     { icono: FileText,      color: '#1A2A6C' },
}
const modalSegVisible  = ref(false)
const titularSegActual = ref<Titular | null>(null)
const segGuardado      = ref(false)
const formSeg          = reactive({ tipo: 'Nota' as TipoSeg, accion: '', proximoPaso: '', fecha: new Date().toISOString().split('T')[0] })

const abrirSeguimiento = (t: Titular) => {
  titularSegActual.value = t
  Object.assign(formSeg, { tipo: 'Nota', accion: '', proximoPaso: '', fecha: new Date().toISOString().split('T')[0] })
  segGuardado.value = false; modalSegVisible.value = true
}
const guardarSeguimiento = () => {
  if (!formSeg.accion.trim()) return
  segGuardado.value = true
  setTimeout(() => { modalSegVisible.value = false; segGuardado.value = false }, 1200)
}

// ─── Importación masiva ────────────────────────────────────────────
type TipoImport = 'activar_titular' | 'activar_beneficiario' | 'reemplazar' | 'desactivar'
const modalImportVisible = ref(false)
const tipoImport         = ref<TipoImport>('activar_titular')
const archivoNombre      = ref('')
const procesandoImport   = ref(false)
const resultadoImport    = ref<{ total: number; exitosos: number; errores: number } | null>(null)
const dragOverImport     = ref(false)

const opcionesImport: { key: TipoImport; label: string; desc: string; color: string; bg: string }[] = [
  { key: 'activar_titular',      label: 'Activar / Registrar titulares',     desc: 'Nuevos titulares o activa existentes. Requiere: Documento, Nombre, Correo, Plan.',           color: '#EC4899', bg: '#FCE7F3' },
  { key: 'activar_beneficiario', label: 'Activar / Registrar beneficiarios', desc: 'Agrega beneficiarios a titulares existentes. Respeta límite de 4 activos por titular.',      color: '#2447F9', bg: '#EEF2FF' },
  { key: 'reemplazar',           label: 'Reemplazar beneficiario',            desc: 'Reemplaza un beneficiario activo. Requiere: Doc. titular, Doc. a reemplazar, nuevo bene.',  color: '#C9A227', bg: '#FEF9C3' },
  { key: 'desactivar',           label: 'Desactivar titular o beneficiario',  desc: 'Desactiva por documento. Columna Tipo: T (titular) o B (beneficiario).',                    color: '#059669', bg: '#D1FAE5' },
]

const onDragOverImport  = (e: DragEvent) => { e.preventDefault(); dragOverImport.value = true }
const onDragLeaveImport = () => { dragOverImport.value = false }
const onDropImport = (e: DragEvent) => {
  e.preventDefault(); dragOverImport.value = false
  const file = e.dataTransfer?.files[0]
  if (file) archivoNombre.value = file.name
}
const onFileInput = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) archivoNombre.value = file.name
}
const procesarImport = () => {
  if (!archivoNombre.value) return
  procesandoImport.value = true; resultadoImport.value = null
  setTimeout(() => { procesandoImport.value = false; resultadoImport.value = { total: 24, exitosos: 21, errores: 3 } }, 1800)
}
const resetImport        = () => { archivoNombre.value = ''; resultadoImport.value = null }
const descargarPlantilla = () => {
  const op = opcionesImport.find(o => o.key === tipoImport.value)
  console.log('Descargando plantilla:', op?.label)
}

// ─── Style helpers ─────────────────────────────────────────────────
const estadoTitularStyle = (e: string) => e === 'Activo' ? 'text-emerald-600' : 'text-slate-400'
const estadoBeneStyle = (e: string) => ({ Activo: 'text-emerald-600', Inactivo: 'text-slate-400', Reemplazado: 'text-amber-600', Retirado: 'text-red-500' } as Record<string, string>)[e] ?? 'text-slate-400'
const planStyle = (p: string) => p === 'Plan Liga Empresarial' ? 'text-[#1E3A8A]' : 'text-[#9D174D]'
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">

    <!-- ── Header ─────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          <Heart :size="20" class="text-[#EC4899]" />
          Plan Liga · Afiliaciones
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Gestión de titulares y beneficiarios del programa Plan Liga Ama Salvar Vidas</p>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <button @click="modalImportVisible = true"
          class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Upload :size="13" /> Importar Excel
        </button>
        <button class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Download :size="13" /> Exportar
        </button>
        <button @click="abrirNuevoTitular"
          class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#EC4899] text-white text-[11px] font-bold shadow hover:bg-[#D61F69] transition-all">
          <Plus :size="14" /> Nuevo titular
        </button>
      </div>
    </div>

    <!-- ── KPIs ──────────────────────────────────────────────────── -->
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#FCE7F3] flex items-center justify-center mb-3"><Heart :size="17" class="text-[#EC4899]" /></div>
        <div class="text-[28px] font-bold text-[#0F172A] leading-none">{{ totalActivos }}</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Titulares activos</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-3"><Users :size="17" class="text-[#2447F9]" /></div>
        <div class="text-[28px] font-bold text-[#0F172A] leading-none">{{ totalBeneficiarios }}</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Beneficiarios activos</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#FEF9C3] flex items-center justify-center mb-3"><Users :size="17" class="text-[#C9A227]" /></div>
        <div class="text-[28px] font-bold text-[#0F172A] leading-none">{{ titularesTope }}</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Titulares en tope (4/4)</div>
      </div>
    </div>

    <!-- ── Toolbar ───────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="buscar" placeholder="Buscar por nombre, documento, empresa o correo..."
            class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
        </div>
        <div class="flex items-center gap-2">
          <select v-model="filtroEstado" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Estado: Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          <select v-model="filtroPlan" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Plan: Todos</option>
            <option v-for="p in planes" :key="p" :value="p">{{ p }}</option>
          </select>
          <select v-model="filtroSexo" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Sexo: Todos</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
          <select v-model="filtroEdad" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Edad: Todos</option>
            <option value="0-17">0 – 17 años</option>
            <option value="18-35">18 – 35 años</option>
            <option value="36-50">36 – 50 años</option>
            <option value="51+">51+ años</option>
          </select>
        </div>
      </div>
      <div class="mt-2 text-[11px] text-slate-400">Mostrando <strong class="text-slate-600">{{ titularesFiltrados.length }}</strong> titulares</div>
    </div>

    <!-- ── Tabla Titulares ───────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[1000px]">
          <thead class="bg-[#F8FAFC] border-b border-slate-200">
            <tr>
              <th class="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Titular</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Documento</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Empresa</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Plan</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Beneficiarios</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Inscripción</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
              <th class="text-right px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="t in titularesFiltrados" :key="t.id" class="hover:bg-slate-50/60 transition-colors group">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-[#FCE7F3] text-[#EC4899] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                    {{ t.nombre.split(' ').map(n => n[0]).slice(0, 2).join('') }}
                  </div>
                  <div>
                    <div class="text-[12px] font-semibold text-[#0F172A]">{{ t.nombre }}</div>
                    <div class="text-[10px] text-slate-400">{{ t.correo }}</div>
                    <div class="text-[10px] text-slate-400">{{ t.telefono }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3.5 text-[11px] text-slate-600 font-medium">{{ t.documento }}</td>
              <td class="px-4 py-3.5 text-[11px] text-slate-600 truncate max-w-[140px]">{{ t.empresa }}</td>
              <td class="px-4 py-3.5">
                <span class="text-[11px] font-semibold" :class="planStyle(t.planContratado)">{{ t.planContratado }}</span>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-2">
                  <div class="flex gap-0.5">
                    <div v-for="slot in 4" :key="slot" class="w-4 h-4 rounded-sm border transition-all"
                      :class="slot <= activosPorTitular(t.id) ? 'bg-[#EC4899] border-[#EC4899]' : 'bg-slate-100 border-slate-200'" />
                  </div>
                  <span class="text-[11px] font-bold" :class="activosPorTitular(t.id) >= 4 ? 'text-[#EC4899]' : 'text-slate-600'">{{ activosPorTitular(t.id) }}/4</span>
                </div>
                <button @click="abrirBeneficiarios(t)" class="text-[10px] text-[#2447F9] hover:underline mt-0.5 block">Ver beneficiarios</button>
              </td>
              <td class="px-4 py-3.5 text-[11px] text-slate-500">{{ t.fechaInscripcion }}</td>
              <td class="px-4 py-3.5">
                <span class="text-[11px] font-semibold" :class="estadoTitularStyle(t.estado)">{{ t.estado }}</span>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="abrirSeguimiento(t)"
                    class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#D1FAE5] hover:text-[#059669] text-slate-500 flex items-center justify-center transition-all"
                    title="Registrar seguimiento">
                    <ClipboardList :size="12" />
                  </button>
                  <button @click="abrirEditarTitular(t)"
                    class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 flex items-center justify-center transition-all"
                    title="Editar"><Edit2 :size="12" /></button>
                  <button @click="toggleEstadoTitular(t)"
                    class="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center transition-all"
                    :class="t.estado === 'Activo' ? 'hover:bg-red-50 hover:text-red-500' : 'hover:bg-emerald-50 hover:text-emerald-600'"
                    :title="t.estado === 'Activo' ? 'Desactivar' : 'Activar'">
                    <component :is="t.estado === 'Activo' ? ToggleRight : ToggleLeft" :size="14" />
                  </button>
                  <button @click="abrirBeneficiarios(t)"
                    class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#FCE7F3] hover:text-[#EC4899] text-slate-500 flex items-center justify-center transition-all"
                    title="Beneficiarios"><Users :size="12" /></button>
                </div>
              </td>
            </tr>
            <tr v-if="titularesFiltrados.length === 0">
              <td colspan="8" class="text-center py-16 text-slate-400 text-[12px]">No se encontraron titulares.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════
         TELEPORTS
    ═══════════════════════════════════════════════════════════════ -->
    <Teleport to="body">

      <!-- ── Modal: Seguimiento rápido ─────────────────────── -->
      <div v-if="modalSegVisible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="modalSegVisible = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[14px] font-bold text-[#0F172A] flex items-center gap-2"><ClipboardList :size="15" class="text-[#059669]" />Registrar seguimiento</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">{{ titularSegActual?.nombre }} · {{ titularSegActual?.empresa }}</p>
            </div>
            <button @click="modalSegVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
          </div>
          <div v-if="segGuardado" class="p-8 text-center">
            <CheckCircle :size="36" class="text-[#059669] mx-auto mb-3" />
            <p class="text-[13px] font-bold text-[#0F172A]">Seguimiento registrado</p>
            <p class="text-[11px] text-slate-400 mt-1">Se guardó en la Bitácora de Relacionamiento</p>
          </div>
          <div v-else class="p-6 space-y-4">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-2 uppercase tracking-wide">Tipo de actividad</label>
              <div class="flex flex-wrap gap-2">
                <button v-for="(meta, tipo) in tipoSegMeta" :key="tipo" @click="formSeg.tipo = tipo as TipoSeg"
                  class="flex items-center gap-1.5 h-8 px-3 rounded-lg border text-[11px] font-semibold transition-all"
                  :class="formSeg.tipo === tipo ? 'text-white border-transparent shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'"
                  :style="formSeg.tipo === tipo ? { backgroundColor: meta.color } : {}">
                  <component :is="meta.icono" :size="12" />{{ tipo }}
                </button>
              </div>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">¿Qué se hizo? *</label>
              <textarea v-model="formSeg.accion" rows="3" placeholder="Describe la actividad realizada..."
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#059669] focus:bg-white transition-all resize-none" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Próximo paso</label>
              <input v-model="formSeg.proximoPaso" placeholder="¿Qué sigue? (opcional)" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#059669] focus:bg-white transition-all" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha</label>
              <input v-model="formSeg.fecha" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#059669] focus:bg-white transition-all" />
            </div>
          </div>
          <div v-if="!segGuardado" class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
            <button @click="modalSegVisible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
            <button @click="guardarSeguimiento" class="h-9 px-6 rounded-lg bg-[#059669] text-white text-[11px] font-bold shadow hover:bg-[#047857] transition-all">Guardar en Bitácora</button>
          </div>
        </div>
      </div>

      <!-- ── Modal: Importación masiva ─────────────────────── -->
      <div v-if="modalImportVisible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="modalImportVisible = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[14px] font-bold text-[#0F172A] flex items-center gap-2"><Upload :size="15" class="text-[#EC4899]" />Importación masiva · Plan Liga</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">Selecciona el tipo de operación y sube el archivo</p>
            </div>
            <button @click="modalImportVisible = false; resetImport()" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
          </div>

          <div class="overflow-y-auto flex-1 p-6 space-y-5">
            <!-- Paso 1: tipo de operación -->
            <div>
              <p class="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-3">1. Tipo de operación</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button v-for="op in opcionesImport" :key="op.key"
                  @click="tipoImport = op.key; resetImport()"
                  class="flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all"
                  :class="tipoImport === op.key ? 'shadow-sm' : 'border-slate-200 hover:border-slate-300'"
                  :style="tipoImport === op.key ? { borderColor: op.color, backgroundColor: op.bg } : {}">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" :style="{ backgroundColor: tipoImport === op.key ? op.color : '#F1F5F9' }">
                    <FileSpreadsheet :size="15" :style="{ color: tipoImport === op.key ? 'white' : '#94A3B8' }" />
                  </div>
                  <div class="min-w-0">
                    <div class="text-[11px] font-bold" :style="{ color: tipoImport === op.key ? op.color : '#0F172A' }">{{ op.label }}</div>
                    <div class="text-[10px] text-slate-500 mt-0.5 leading-tight">{{ op.desc }}</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Paso 2: descarga plantilla -->
            <div class="flex items-center justify-between bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3">
              <div>
                <p class="text-[11px] font-bold text-slate-700">Plantilla: {{ opcionesImport.find(o => o.key === tipoImport)?.label }}</p>
                <p class="text-[10px] text-slate-400 mt-0.5">Descarga el formato correcto para esta operación</p>
              </div>
              <button @click="descargarPlantilla" class="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all shrink-0">
                <Download :size="12" /> Descargar
              </button>
            </div>

            <!-- Paso 3: subir archivo -->
            <div>
              <p class="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-3">2. Subir archivo</p>
              <div class="border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer"
                :class="dragOverImport ? 'border-[#EC4899] bg-[#FCE7F3]' : 'border-slate-300 hover:border-slate-400 bg-slate-50'"
                @dragover="onDragOverImport" @dragleave="onDragLeaveImport" @drop="onDropImport"
                @click="($refs.fileRef as HTMLInputElement)?.click()">
                <input ref="fileRef" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="onFileInput" />
                <FileSpreadsheet :size="28" class="mx-auto mb-2" :class="archivoNombre ? 'text-[#EC4899]' : 'text-slate-400'" />
                <p class="text-[12px] font-semibold text-slate-600">{{ archivoNombre || 'Arrastra aquí o haz clic para seleccionar' }}</p>
                <p v-if="!archivoNombre" class="text-[10px] text-slate-400 mt-1">Formatos: .xlsx, .xls, .csv · Máx. 5 MB</p>
                <p v-else class="text-[10px] text-[#EC4899] mt-1 font-medium">Archivo listo para procesar</p>
              </div>
            </div>

            <!-- Resultado -->
            <div v-if="resultadoImport" class="grid grid-cols-3 gap-3">
              <div class="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
                <div class="text-[24px] font-bold text-[#0F172A]">{{ resultadoImport.total }}</div>
                <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Total filas</div>
              </div>
              <div class="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
                <div class="text-[24px] font-bold text-emerald-700">{{ resultadoImport.exitosos }}</div>
                <div class="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mt-1">Procesados</div>
              </div>
              <div class="bg-red-50 rounded-xl p-4 text-center border border-red-200">
                <div class="text-[24px] font-bold text-red-600">{{ resultadoImport.errores }}</div>
                <div class="text-[10px] font-semibold text-red-500 uppercase tracking-wide mt-1">Con errores</div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
            <button @click="modalImportVisible = false; resetImport()" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cerrar</button>
            <button @click="procesarImport" :disabled="!archivoNombre || procesandoImport"
              class="flex items-center gap-1.5 h-9 px-6 rounded-lg text-[11px] font-bold shadow transition-all"
              :class="archivoNombre && !procesandoImport ? 'bg-[#EC4899] text-white hover:bg-[#D61F69]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'">
              <Loader2 v-if="procesandoImport" :size="13" class="animate-spin" />
              <Upload v-else :size="13" />
              {{ procesandoImport ? 'Procesando...' : 'Procesar archivo' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── Modal: Nuevo / Editar Titular ─────────────────── -->
      <div v-if="modalTitularVisible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="modalTitularVisible = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[14px] font-bold text-[#0F172A]">{{ modalModo === 'nuevo' ? 'Nuevo Titular' : 'Editar Titular' }}</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">Programa Plan Liga Ama Salvar Vidas</p>
            </div>
            <button @click="modalTitularVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
          </div>
          <div class="overflow-y-auto flex-1 p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre completo *</label>
                <input v-model="formTitular.nombre" placeholder="Ej: Carlos Mendoza Ruiz" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Documento *</label>
                <input v-model="formTitular.documento" placeholder="Número de documento" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha de nacimiento</label>
                <input v-model="formTitular.fechaNacimiento" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Correo</label>
                <input v-model="formTitular.correo" type="email" placeholder="correo@empresa.com" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Teléfono</label>
                <input v-model="formTitular.telefono" placeholder="300-000-0000" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa</label>
                <input v-model="formTitular.empresa" placeholder="Nombre empresa" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Plan contratado</label>
                <select v-model="formTitular.planContratado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer">
                  <option value="Plan Liga Empresarial">Plan Liga Empresarial</option>
                  <option value="Plan Liga Individual">Plan Liga Individual</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha de inscripción</label>
                <input v-model="formTitular.fechaInscripcion" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
                <select v-model="formTitular.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer">
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
            <button @click="modalTitularVisible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
            <button @click="guardarTitular" class="h-9 px-6 rounded-lg bg-[#EC4899] text-white text-[11px] font-bold shadow hover:bg-[#D61F69] transition-all">
              {{ modalModo === 'nuevo' ? 'Crear titular' : 'Guardar cambios' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── Drawer: Beneficiarios ──────────────────────────── -->
      <div v-if="drawerVisible" class="fixed inset-0 z-[99999]" @click.self="drawerVisible = false">
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" @click="drawerVisible = false" />
        <div class="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col z-10">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-[#F8FAFC] shrink-0">
            <div>
              <h3 class="text-[13px] font-bold text-[#0F172A] flex items-center gap-2"><Users :size="15" class="text-[#EC4899]" />Beneficiarios</h3>
              <p class="text-[11px] text-slate-500 mt-0.5">{{ titularSeleccionado?.nombre }}</p>
            </div>
            <button @click="drawerVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
          </div>
          <div class="px-5 py-3 border-b border-slate-100 shrink-0">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Cupos utilizados</span>
              <span class="text-[12px] font-bold" :class="activosActual >= 4 ? 'text-[#EC4899]' : 'text-[#059669]'">{{ activosActual }} / 4 activos</span>
            </div>
            <div class="flex gap-2">
              <div v-for="slot in 4" :key="slot" class="flex-1 h-2.5 rounded-full transition-all" :class="slot <= activosActual ? 'bg-[#EC4899]' : 'bg-slate-100'" />
            </div>
            <div v-if="errLimite" class="mt-2 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <AlertCircle :size="13" class="text-red-500 shrink-0" />
              <p class="text-[11px] text-red-600 font-medium">El titular ya cuenta con el máximo permitido de <strong>4 beneficiarios activos</strong>.</p>
              <button @click="errLimite = false" class="ml-auto text-red-400 hover:text-red-600 shrink-0"><X :size="11" /></button>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            <div v-for="b in beneficiariosTitular" :key="b.id"
              class="bg-white rounded-xl border border-slate-200 p-4 group hover:shadow-sm transition-all"
              :class="b.estado === 'Retirado' || b.estado === 'Reemplazado' ? 'opacity-60' : ''">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#2447F9] text-[10px] font-bold flex items-center justify-center shrink-0">
                    {{ b.nombre.split(' ').map(n => n[0]).slice(0, 2).join('') }}
                  </div>
                  <div class="min-w-0">
                    <div class="text-[12px] font-semibold text-[#0F172A] truncate">{{ b.nombre }}</div>
                    <div class="text-[10px] text-slate-400">{{ b.documento }} · {{ b.parentesco }}</div>
                    <div class="text-[10px] text-slate-400">Nac: {{ b.fechaNacimiento }}</div>
                  </div>
                </div>
                <span class="text-[10px] font-semibold shrink-0" :class="estadoBeneStyle(b.estado)">{{ b.estado }}</span>
              </div>
              <div class="flex items-center gap-1 mt-3 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="abrirEditarBeneficiario(b)" class="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 text-[10px] font-semibold transition-all"><Edit2 :size="10" /> Editar</button>
                <button v-if="b.estado === 'Activo'" @click="toggleEstadoBeneficiario(b)" class="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 text-[10px] font-semibold transition-all"><ToggleLeft :size="10" /> Desactivar</button>
                <button v-else-if="b.estado === 'Inactivo'" @click="toggleEstadoBeneficiario(b)" class="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-500 text-[10px] font-semibold transition-all"><ToggleRight :size="10" /> Activar</button>
                <button v-if="b.estado === 'Activo'" @click="reemplazarBeneficiario(b)" class="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-600 text-slate-500 text-[10px] font-semibold transition-all"><RefreshCw :size="10" /> Reemplazar</button>
                <button class="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 text-[10px] font-semibold transition-all"><History :size="10" /> Historial</button>
              </div>
            </div>
            <div v-if="beneficiariosTitular.length === 0" class="text-center py-10 text-slate-400 text-[12px]">
              <Users :size="28" class="text-slate-300 mx-auto mb-2" />No hay beneficiarios registrados.
            </div>
          </div>
          <div class="px-4 py-4 border-t border-slate-200 shrink-0">
            <button @click="abrirNuevoBeneficiario" :disabled="!puedeAgregar(titularSeleccionado?.id ?? 0)"
              class="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-[12px] font-bold shadow transition-all"
              :class="puedeAgregar(titularSeleccionado?.id ?? 0) ? 'bg-[#EC4899] text-white hover:bg-[#D61F69]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'">
              <Plus :size="14" />
              <span v-if="puedeAgregar(titularSeleccionado?.id ?? 0)">Agregar beneficiario ({{ activosActual }}/4)</span>
              <span v-else>Límite alcanzado (4/4)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ── Modal: Nuevo / Editar Beneficiario ────────────── -->
      <div v-if="modalBeneVisible" class="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="modalBeneVisible = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[14px] font-bold text-[#0F172A]">{{ modalBeneModo === 'nuevo' ? 'Nuevo Beneficiario' : 'Editar Beneficiario' }}</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">Titular: {{ titularSeleccionado?.nombre }}</p>
            </div>
            <button @click="modalBeneVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
          </div>
          <div v-if="modalBeneModo === 'nuevo'" class="px-6 pt-4 flex items-center gap-2 bg-[#FCE7F3] border-b border-pink-200">
            <CheckCircle :size="14" class="text-[#EC4899] shrink-0" />
            <p class="text-[11px] text-[#EC4899] font-medium py-2">Cupo disponible: <strong>{{ 4 - activosActual }}</strong> beneficiarios restantes.</p>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre completo *</label>
                <input v-model="formBene.nombre" placeholder="Nombre del beneficiario" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Documento *</label>
                <input v-model="formBene.documento" placeholder="Número documento" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha nacimiento</label>
                <input v-model="formBene.fechaNacimiento" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Parentesco</label>
                <select v-model="formBene.parentesco" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer">
                  <option v-for="p in parentescos" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
                <select v-model="formBene.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer">
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Reemplazado">Reemplazado</option>
                  <option value="Retirado">Retirado</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha inscripción</label>
                <input v-model="formBene.fechaInscripcion" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
            <button @click="modalBeneVisible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
            <button @click="guardarBeneficiario" class="h-9 px-6 rounded-lg bg-[#EC4899] text-white text-[11px] font-bold shadow hover:bg-[#D61F69] transition-all">
              {{ modalBeneModo === 'nuevo' ? 'Agregar beneficiario' : 'Guardar cambios' }}
            </button>
          </div>
        </div>
      </div>

    </Teleport>
  </div>
</template>
