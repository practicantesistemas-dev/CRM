<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  Search, Plus, Download, Upload, X, Edit2,
  Clock, User, Building2, Phone, Mail,
  MapPin, Tag, UserCheck, Briefcase, Calendar, FileText,
  MessageCircle, ClipboardList, CheckCircle
} from 'lucide-vue-next'

interface Contacto {
  id: number
  nombre: string
  tipoDocumento: string
  documento: string
  correo: string
  telefono: string
  empresa: string
  cargo: string
  ciudad: string
  estado: 'Activo' | 'Inactivo' | 'Prospecto' | 'En proceso'
  fechaNacimiento: string
  sexo: 'Masculino' | 'Femenino' | 'Otro'
  etiquetas: string[]
  responsable: string
}

// ─── Mock data ──────────────────────────────────────────────────────────────
const contactos = ref<Contacto[]>([
  { id: 1, nombre: 'Carlos Mendoza',      tipoDocumento: 'CC', documento: '10293844',   correo: 'carlos.mendoza@globaltech.com', telefono: '300-555-0192', empresa: 'Global Tech S.A.S',    cargo: 'Gerente Comercial',      ciudad: 'Pereira',      estado: 'Activo',     fechaNacimiento: '1989-03-15', sexo: 'Masculino', etiquetas: ['VIP', 'Plan Liga'], responsable: 'María García'  },
  { id: 2, nombre: 'Ana Victoria Ruiz',   tipoDocumento: 'CC', documento: '25841203',   correo: 'ana.ruiz@esteticamayo.com',    telefono: '311-222-4455', empresa: 'Estética Mayo',         cargo: 'CEO',                    ciudad: 'Bogotá',       estado: 'En proceso', fechaNacimiento: '1985-07-22', sexo: 'Femenino',  etiquetas: ['Interesado'],       responsable: 'Juan López'    },
  { id: 3, nombre: 'Pedro Sánchez Mejía', tipoDocumento: 'CC', documento: '71234567',   correo: 'pedro@constructoraabc.co',     telefono: '314-888-1122', empresa: 'Constructora ABC',      cargo: 'Director de RRHH',       ciudad: 'Medellín',     estado: 'Activo',     fechaNacimiento: '1978-11-08', sexo: 'Masculino', etiquetas: ['Plan Liga', 'Empresarial'], responsable: 'Carlos Torres' },
  { id: 4, nombre: 'Laura Gómez Vargas',  tipoDocumento: 'CC', documento: '43901234',   correo: 'laura.gomez@farmanorte.com',  telefono: '320-777-3344', empresa: 'Farmacia Norte',        cargo: 'Coordinadora Bienestar', ciudad: 'Manizales',    estado: 'Prospecto',  fechaNacimiento: '1993-05-30', sexo: 'Femenino',  etiquetas: ['Nuevo'],            responsable: 'María García'  },
  { id: 5, nombre: 'Roberto Díaz Castro', tipoDocumento: 'CC', documento: '19283746',   correo: 'roberto@techsolutions.co',    telefono: '301-444-9988', empresa: 'Tech Solutions',        cargo: 'CTO',                    ciudad: 'Cali',         estado: 'Activo',     fechaNacimiento: '1982-09-14', sexo: 'Masculino', etiquetas: ['VIP'],              responsable: 'Juan López'    },
  { id: 6, nombre: 'Sandra Morales López',tipoDocumento: 'CC', documento: '52000111',   correo: 'smorales@grupoXYZ.com',       telefono: '316-555-7766', empresa: 'Grupo Empresarial XYZ', cargo: 'Jefe de Talento Humano', ciudad: 'Bogotá',       estado: 'En proceso', fechaNacimiento: '1990-01-18', sexo: 'Femenino',  etiquetas: ['Plan Liga'],        responsable: 'Carlos Torres' },
  { id: 7, nombre: 'Jorge Ramírez Pérez', tipoDocumento: 'CC', documento: '80123456',   correo: 'jorge.ramirez@salvatech.co',  telefono: '312-333-6655', empresa: 'SalvaTech',             cargo: 'Gerente General',        ciudad: 'Barranquilla', estado: 'Inactivo',   fechaNacimiento: '1975-06-25', sexo: 'Masculino', etiquetas: [],                   responsable: 'María García'  },
  { id: 8, nombre: 'Valentina Cruz',       tipoDocumento: 'CC', documento: '1098765432', correo: 'vcruz@innovagroup.com',       telefono: '318-999-2211', empresa: 'Innova Group',          cargo: 'Analista Comercial',     ciudad: 'Pereira',      estado: 'Activo',     fechaNacimiento: '1997-12-03', sexo: 'Femenino',  etiquetas: ['Interesado', 'Nuevo'], responsable: 'Juan López'  },
])

// ─── Filters ───────────────────────────────────────────────────────────────
const buscar            = ref('')
const filtroEstado      = ref('todos')
const filtroCiudad      = ref('todas')
const filtroResponsable = ref('todos')
const filtroSexo        = ref('todos')
const filtroEdad        = ref('todos')

const calcEdadBucket = (fechaNac: string): string => {
  if (!fechaNac) return ''
  const edad = new Date().getFullYear() - new Date(fechaNac).getFullYear()
  if (edad < 18)  return '0-17'
  if (edad <= 35) return '18-35'
  if (edad <= 50) return '36-50'
  return '51+'
}

const contactosFiltrados = computed(() =>
  contactos.value.filter(c => {
    const q = buscar.value.toLowerCase()
    return (!q || [c.nombre, c.correo, c.empresa, c.documento].some(f => f.toLowerCase().includes(q)))
      && (filtroEstado.value      === 'todos'  || c.estado === filtroEstado.value)
      && (filtroCiudad.value      === 'todas'  || c.ciudad === filtroCiudad.value)
      && (filtroResponsable.value === 'todos'  || c.responsable === filtroResponsable.value)
      && (filtroSexo.value        === 'todos'  || c.sexo === filtroSexo.value)
      && (filtroEdad.value        === 'todos'  || calcEdadBucket(c.fechaNacimiento) === filtroEdad.value)
  })
)

const ciudades       = computed(() => [...new Set(contactos.value.map(c => c.ciudad))].sort())
const responsables   = computed(() => [...new Set(contactos.value.map(c => c.responsable))].sort())
const filtrosActivos = computed(() =>
  [filtroEstado.value !== 'todos', filtroCiudad.value !== 'todas',
   filtroResponsable.value !== 'todos', filtroSexo.value !== 'todos',
   filtroEdad.value !== 'todos'].filter(Boolean).length
)

const limpiarFiltros = () => {
  filtroEstado.value      = 'todos'
  filtroCiudad.value      = 'todas'
  filtroResponsable.value = 'todos'
  filtroSexo.value        = 'todos'
  filtroEdad.value        = 'todos'
}

// ─── Modal Contacto ─────────────────────────────────────────────────────────
const modalVisible      = ref(false)
const modalModo         = ref<'nuevo' | 'editar'>('nuevo')
const contactoEditando  = ref<Contacto | null>(null)

const formVacio: Omit<Contacto, 'id'> = {
  nombre: '', tipoDocumento: 'CC', documento: '', correo: '',
  telefono: '', empresa: '', cargo: '', ciudad: '', estado: 'Prospecto',
  fechaNacimiento: '', sexo: 'Masculino', etiquetas: [], responsable: ''
}
const form = reactive<Omit<Contacto, 'id'>>({ ...formVacio })
const etiquetaInput = ref('')

const abrirNuevo = () => {
  modalModo.value = 'nuevo'
  contactoEditando.value = null
  Object.assign(form, { ...formVacio, etiquetas: [] })
  modalVisible.value = true
}
const abrirEditar = (c: Contacto) => {
  modalModo.value = 'editar'
  contactoEditando.value = c
  Object.assign(form, { ...c, etiquetas: [...c.etiquetas] })
  modalVisible.value = true
}
const agregarEtiqueta = () => {
  const tag = etiquetaInput.value.trim()
  if (tag && !form.etiquetas.includes(tag)) form.etiquetas.push(tag)
  etiquetaInput.value = ''
}
const quitarEtiqueta = (tag: string) => { form.etiquetas = form.etiquetas.filter(t => t !== tag) }
const guardarContacto = () => {
  if (!form.nombre || !form.correo) return
  if (modalModo.value === 'nuevo') {
    contactos.value.unshift({ ...form, id: Date.now(), etiquetas: [...form.etiquetas] })
  } else if (contactoEditando.value) {
    const idx = contactos.value.findIndex(c => c.id === contactoEditando.value!.id)
    if (idx !== -1) contactos.value[idx] = { ...form, id: contactoEditando.value.id, etiquetas: [...form.etiquetas] }
  }
  modalVisible.value = false
}

// ─── Historial drawer ───────────────────────────────────────────────────────
const drawerVisible      = ref(false)
const contactoHistorial  = ref<Contacto | null>(null)
const abrirHistorial = (c: Contacto) => { contactoHistorial.value = c; drawerVisible.value = true }

const historialItems = [
  { tipo: 'Llamada',  desc: 'Llamada de seguimiento Plan Liga',                        fecha: '2026-06-28', usuario: 'María García',  icono: Phone,    color: '#2447F9', bg: '#EEF2FF' },
  { tipo: 'Correo',   desc: 'Envío propuesta comercial adjunta',                       fecha: '2026-06-20', usuario: 'Juan López',    icono: Mail,     color: '#EC4899', bg: '#FCE7F3' },
  { tipo: 'Reunión',  desc: 'Presentación servicios Plan Liga',                        fecha: '2026-06-10', usuario: 'Carlos Torres', icono: Calendar, color: '#C9A227', bg: '#FEF9C3' },
  { tipo: 'Nota',     desc: 'Cliente interesado en plan empresarial para 50 empleados', fecha: '2026-06-01', usuario: 'María García',  icono: FileText, color: '#059669', bg: '#D1FAE5' },
]

// ─── Modal Seguimiento rápido ───────────────────────────────────────────────
type TipoSeg = 'Llamada' | 'Correo' | 'Reunión' | 'WhatsApp' | 'Nota'

const tiposMeta: Record<TipoSeg, { icono: any; color: string; bg: string }> = {
  'Llamada':  { icono: Phone,          color: '#2447F9', bg: '#EEF2FF' },
  'Correo':   { icono: Mail,           color: '#EC4899', bg: '#FCE7F3' },
  'Reunión':  { icono: Calendar,       color: '#C9A227', bg: '#FEF9C3' },
  'WhatsApp': { icono: MessageCircle,  color: '#059669', bg: '#D1FAE5' },
  'Nota':     { icono: FileText,       color: '#1A2A6C', bg: '#E8EAF6' },
}

const modalSegVisible   = ref(false)
const contactoSegActual = ref<Contacto | null>(null)
const segGuardado       = ref(false)

const formSeg = reactive<{ tipo: TipoSeg; accion: string; proximoPaso: string; fecha: string }>({
  tipo: 'Nota', accion: '', proximoPaso: '', fecha: new Date().toISOString().split('T')[0]
})

const abrirSeguimiento = (c: Contacto) => {
  contactoSegActual.value = c
  Object.assign(formSeg, { tipo: 'Nota', accion: '', proximoPaso: '', fecha: new Date().toISOString().split('T')[0] })
  segGuardado.value = false
  modalSegVisible.value = true
}

const guardarSeguimiento = () => {
  if (!formSeg.accion.trim()) return
  // En producción esto se persistiría en la bitácora
  segGuardado.value = true
  setTimeout(() => { modalSegVisible.value = false; segGuardado.value = false }, 1200)
}

// ─── Pagination ─────────────────────────────────────────────────────────────
const paginaActual = ref(1)
const porPagina    = 8
const paginado     = computed(() => {
  const start = (paginaActual.value - 1) * porPagina
  return contactosFiltrados.value.slice(start, start + porPagina)
})
const totalPaginas = computed(() => Math.ceil(contactosFiltrados.value.length / porPagina))

// ─── Helpers ────────────────────────────────────────────────────────────────
const estadoStyle = (e: string) => {
  switch (e) {
    case 'Activo':     return 'text-emerald-600'
    case 'Inactivo':   return 'text-slate-400'
    case 'Prospecto':  return 'text-amber-600'
    case 'En proceso': return 'text-[#1E3A8A]'
    default:           return 'text-slate-400'
  }
}
const etiquetaColor = (tag: string) => {
  const map: Record<string, string> = {
    'VIP':        'text-[#92400E]',
    'Plan Liga':  'text-[#1E3A8A]',
    'Interesado': 'text-[#9D174D]',
    'Empresarial':'text-[#1A2A6C]',
    'Nuevo':      'text-[#065F46]',
  }
  return map[tag] ?? 'text-slate-500'
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">

    <!-- ── Page Header ──────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          Gestión de Contactos
          <span class="bg-[#EEF2FF] text-[#2447F9] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ contactos.length }}</span>
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Administra contactos, cargos, etiquetas y seguimientos</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Upload :size="13" /> Importar
        </button>
        <button class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Download :size="13" /> Exportar
        </button>
        <button @click="abrirNuevo" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
          <Plus :size="14" /> Nuevo contacto
        </button>
      </div>
    </div>

    <!-- ── Toolbar ───────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="buscar" placeholder="Buscar por nombre, correo, empresa o documento..."
            class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <select v-model="filtroEstado" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Estado: Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Prospecto">Prospecto</option>
            <option value="En proceso">En proceso</option>
          </select>
          <select v-model="filtroCiudad" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todas">Ciudad: Todas</option>
            <option v-for="ciudad in ciudades" :key="ciudad" :value="ciudad">{{ ciudad }}</option>
          </select>
          <select v-model="filtroResponsable" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Responsable: Todos</option>
            <option v-for="r in responsables" :key="r" :value="r">{{ r }}</option>
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
          <button v-if="filtrosActivos > 0" @click="limpiarFiltros"
            class="flex items-center gap-1 h-9 px-3 rounded-lg border border-red-200 bg-red-50 text-[11px] font-semibold text-red-500 hover:bg-red-100 transition-all">
            <X :size="12" /> Limpiar ({{ filtrosActivos }})
          </button>
        </div>
      </div>
      <div class="mt-2 text-[11px] text-slate-400">
        Mostrando <strong class="text-slate-600">{{ contactosFiltrados.length }}</strong> contactos
        <span v-if="buscar || filtrosActivos > 0"> · filtrado de {{ contactos.length }} total</span>
      </div>
    </div>

    <!-- ── Table ─────────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[1000px]">
          <thead class="bg-[#F8FAFC] border-b border-slate-200">
            <tr>
              <th class="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-[220px]">Contacto</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Documento</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Empresa · Cargo</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ciudad</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Etiquetas</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Responsable</th>
              <th class="text-right px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="c in paginado" :key="c.id" class="hover:bg-slate-50/60 transition-colors group">
              <!-- Contacto -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#2447F9] font-bold text-[12px] flex items-center justify-center flex-shrink-0">
                    {{ c.nombre.split(' ').map(n => n[0]).slice(0, 2).join('') }}
                  </div>
                  <div class="min-w-0">
                    <div class="text-[12px] font-semibold text-[#0F172A] truncate">{{ c.nombre }}</div>
                    <div class="text-[11px] text-slate-400 truncate">{{ c.correo }}</div>
                    <div class="text-[10px] text-slate-400">{{ c.telefono }}</div>
                  </div>
                </div>
              </td>
              <!-- Documento -->
              <td class="px-4 py-3.5">
                <div class="text-[11px] text-slate-500 font-medium"><span class="text-slate-400 mr-1">{{ c.tipoDocumento }}</span>{{ c.documento }}</div>
                <div class="text-[10px] text-slate-400 mt-0.5">Nac: {{ c.fechaNacimiento }}</div>
              </td>
              <!-- Empresa -->
              <td class="px-4 py-3.5">
                <div class="text-[12px] font-semibold text-slate-700 truncate max-w-[160px]">{{ c.empresa }}</div>
                <div class="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5"><Briefcase :size="10" />{{ c.cargo }}</div>
              </td>
              <!-- Ciudad -->
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1 text-[11px] text-slate-600"><MapPin :size="11" class="text-slate-400" />{{ c.ciudad }}</div>
              </td>
              <!-- Estado -->
              <td class="px-4 py-3.5">
                <span class="text-[11px] font-semibold" :class="estadoStyle(c.estado)">{{ c.estado }}</span>
              </td>
              <!-- Etiquetas -->
              <td class="px-4 py-3.5">
                <div class="flex flex-wrap gap-1">
                  <span v-for="tag in c.etiquetas.slice(0, 2)" :key="tag"
                    class="text-[10px] font-semibold" :class="etiquetaColor(tag)">{{ tag }}</span>
                  <span v-if="c.etiquetas.length > 2"
                    class="text-[10px] font-semibold text-slate-400">+{{ c.etiquetas.length - 2 }}</span>
                  <span v-if="c.etiquetas.length === 0" class="text-[11px] text-slate-300">—</span>
                </div>
              </td>
              <!-- Responsable -->
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1.5">
                  <div class="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#2447F9] text-[8px] font-bold flex items-center justify-center flex-shrink-0">
                    {{ c.responsable.split(' ').map(n => n[0]).join('') }}
                  </div>
                  <span class="text-[11px] text-slate-600 truncate max-w-[100px]">{{ c.responsable }}</span>
                </div>
              </td>
              <!-- Acciones -->
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <!-- Seguimiento rápido → bitácora -->
                  <button
                    @click="abrirSeguimiento(c)"
                    class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#D1FAE5] hover:text-[#059669] text-slate-500 flex items-center justify-center transition-all"
                    title="Registrar seguimiento"
                  >
                    <ClipboardList :size="12" />
                  </button>
                  <button
                    @click="abrirEditar(c)"
                    class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 flex items-center justify-center transition-all"
                    title="Editar"
                  >
                    <Edit2 :size="12" />
                  </button>
                  <button
                    @click="abrirHistorial(c)"
                    class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-600 text-slate-500 flex items-center justify-center transition-all"
                    title="Historial"
                  >
                    <Clock :size="12" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginado.length === 0">
              <td colspan="8" class="text-center py-16 text-slate-400 text-[12px]">No se encontraron contactos con los filtros aplicados.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div v-if="totalPaginas > 1" class="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-[#F8FAFC]">
        <span class="text-[11px] text-slate-500">Página {{ paginaActual }} de {{ totalPaginas }}</span>
        <div class="flex gap-1">
          <button v-for="p in totalPaginas" :key="p" @click="paginaActual = p"
            class="w-7 h-7 rounded-lg text-[11px] font-semibold transition-all"
            :class="p === paginaActual ? 'bg-[#2447F9] text-white shadow' : 'bg-white border border-slate-200 text-slate-500 hover:border-[#2447F9] hover:text-[#2447F9]'">{{ p }}</button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════
         TELEPORTS
    ═══════════════════════════════════════════════════ -->
    <Teleport to="body">

      <!-- ── Modal: Seguimiento rápido ─────────────────── -->
      <div
        v-if="modalSegVisible"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        @click.self="modalSegVisible = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[14px] font-bold text-[#0F172A] flex items-center gap-2">
                <ClipboardList :size="15" class="text-[#059669]" />
                Registrar seguimiento
              </h3>
              <p class="text-[11px] text-slate-400 mt-0.5">{{ contactoSegActual?.nombre }} · {{ contactoSegActual?.empresa }}</p>
            </div>
            <button @click="modalSegVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
              <X :size="14" />
            </button>
          </div>

          <!-- Éxito -->
          <div v-if="segGuardado" class="p-8 text-center">
            <CheckCircle :size="36" class="text-[#059669] mx-auto mb-3" />
            <p class="text-[13px] font-bold text-[#0F172A]">Seguimiento registrado</p>
            <p class="text-[11px] text-slate-400 mt-1">Se guardó en la Bitácora de Relacionamiento</p>
          </div>

          <div v-else class="p-6 space-y-4">
            <!-- Tipo selector -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-2 uppercase tracking-wide">Tipo de actividad</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="(meta, tipo) in tiposMeta"
                  :key="tipo"
                  @click="formSeg.tipo = tipo as TipoSeg"
                  class="flex items-center gap-1.5 h-8 px-3 rounded-lg border text-[11px] font-semibold transition-all"
                  :class="formSeg.tipo === tipo
                    ? 'text-white border-transparent shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'"
                  :style="formSeg.tipo === tipo ? { backgroundColor: meta.color, borderColor: meta.color } : {}"
                >
                  <component :is="meta.icono" :size="12" />
                  {{ tipo }}
                </button>
              </div>
            </div>

            <!-- Acción -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">¿Qué se hizo? *</label>
              <textarea
                v-model="formSeg.accion"
                rows="3"
                placeholder="Describe la actividad realizada..."
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#059669] focus:bg-white transition-all resize-none"
              />
            </div>

            <!-- Próximo paso -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Próximo paso</label>
              <input
                v-model="formSeg.proximoPaso"
                placeholder="¿Qué sigue? (opcional)"
                class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#059669] focus:bg-white transition-all"
              />
            </div>

            <!-- Fecha -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha</label>
              <input
                v-model="formSeg.fecha"
                type="date"
                class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#059669] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div v-if="!segGuardado" class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
            <button @click="modalSegVisible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
            <button @click="guardarSeguimiento" class="h-9 px-6 rounded-lg bg-[#059669] text-white text-[11px] font-bold shadow hover:bg-[#047857] transition-all">
              Guardar en Bitácora
            </button>
          </div>
        </div>
      </div>

      <!-- ── Modal: Nuevo / Editar Contacto ────────────── -->
      <div v-if="modalVisible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="modalVisible = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[14px] font-bold text-[#0F172A]">{{ modalModo === 'nuevo' ? 'Nuevo Contacto' : 'Editar Contacto' }}</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">Complete todos los campos requeridos</p>
            </div>
            <button @click="modalVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
          </div>
          <div class="overflow-y-auto flex-1 p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre completo *</label>
                <div class="relative"><User :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="form.nombre" placeholder="Ej: Carlos Mendoza Ruiz" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" /></div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tipo documento</label>
                <select v-model="form.tipoDocumento" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
                  <option value="CC">Cédula de Ciudadanía (CC)</option>
                  <option value="CE">Cédula de Extranjería (CE)</option>
                  <option value="TI">Tarjeta de Identidad (TI)</option>
                  <option value="NIT">NIT</option>
                  <option value="PP">Pasaporte (PP)</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Número de documento</label>
                <input v-model="form.documento" placeholder="Ej: 10293844" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Correo electrónico *</label>
                <div class="relative"><Mail :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="form.correo" type="email" placeholder="correo@empresa.com" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" /></div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Teléfono</label>
                <div class="relative"><Phone :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="form.telefono" placeholder="300-000-0000" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" /></div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa</label>
                <div class="relative"><Building2 :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="form.empresa" placeholder="Nombre de la empresa" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" /></div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Cargo</label>
                <div class="relative"><Briefcase :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="form.cargo" placeholder="Ej: Gerente Comercial" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" /></div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Ciudad</label>
                <div class="relative"><MapPin :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="form.ciudad" placeholder="Ej: Pereira" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" /></div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
                <select v-model="form.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
                  <option value="Activo">Activo</option><option value="Inactivo">Inactivo</option>
                  <option value="Prospecto">Prospecto</option><option value="En proceso">En proceso</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha de nacimiento</label>
                <div class="relative"><Calendar :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="form.fechaNacimiento" type="date" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" /></div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Responsable</label>
                <div class="relative"><UserCheck :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select v-model="form.responsable" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
                    <option value="">Seleccionar responsable</option>
                    <option value="María García">María García</option>
                    <option value="Juan López">Juan López</option>
                    <option value="Carlos Torres">Carlos Torres</option>
                  </select></div>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Etiquetas</label>
                <div class="flex gap-2 mb-2 flex-wrap">
                  <span v-for="tag in form.etiquetas" :key="tag" class="inline-flex items-center gap-1 text-[10px] font-semibold" :class="etiquetaColor(tag)">
                    {{ tag }}<button @click="quitarEtiqueta(tag)" class="hover:opacity-70"><X :size="9" /></button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <div class="relative flex-1"><Tag :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input v-model="etiquetaInput" placeholder="Escribir etiqueta y presionar Enter..." @keydown.enter.prevent="agregarEtiqueta"
                      class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" /></div>
                  <button @click="agregarEtiqueta" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Agregar</button>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
            <button @click="modalVisible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
            <button @click="guardarContacto" class="h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
              {{ modalModo === 'nuevo' ? 'Crear contacto' : 'Guardar cambios' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── Drawer: Historial ──────────────────────────── -->
      <div v-if="drawerVisible" class="fixed inset-0 z-[99999]" @click.self="drawerVisible = false">
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" @click="drawerVisible = false" />
        <div class="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col z-10">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[13px] font-bold text-[#0F172A]">Historial</h3>
              <p class="text-[11px] text-slate-400">{{ contactoHistorial?.nombre }}</p>
            </div>
            <button @click="drawerVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
          </div>
          <div class="flex-1 overflow-y-auto p-5 space-y-3">
            <div v-for="(act, i) in historialItems" :key="i" class="flex gap-3">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: act.bg }">
                <component :is="act.icono" :size="13" :style="{ color: act.color }" />
              </div>
              <div class="flex-1 bg-slate-50 rounded-xl p-3">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[10px] font-bold uppercase" :style="{ color: act.color }">{{ act.tipo }}</span>
                  <span class="text-[10px] text-slate-400">{{ act.fecha }}</span>
                </div>
                <p class="text-[11px] text-slate-700">{{ act.desc }}</p>
                <p class="text-[10px] text-slate-400 mt-1">Por {{ act.usuario }}</p>
              </div>
            </div>
          </div>
          <div class="px-5 py-4 border-t border-slate-200">
            <button @click="drawerVisible = false; abrirSeguimiento(contactoHistorial!)"
              class="w-full h-9 rounded-lg bg-[#059669] text-white text-[11px] font-bold hover:bg-[#047857] transition-all flex items-center justify-center gap-1.5">
              <ClipboardList :size="13" /> Registrar actividad
            </button>
          </div>
        </div>
      </div>

    </Teleport>
  </div>
</template>
