<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  Search, Plus, X, Edit2, Layers, User, Hash,
  TrendingUp, Building2, Users, BarChart3, Tag
} from 'lucide-vue-next'

interface Servicio {
  id: number
  nombre: string
  codigo: string
  categoria: string
  responsable: string
  estado: 'Activo' | 'Inactivo' | 'En revisión'
  tipo: 'Empresarial' | 'Individual' | 'Bienestar' | 'Salud'
  empresasInteresadas: number
  contactosInteresados: number
  ventas: number
  conversion: string
  valorPotencial: string
  solicitudes: number
}

const servicios = ref<Servicio[]>([
  { id: 1, nombre: 'Plan Liga Empresarial', codigo: 'PLE-001', categoria: 'Plan Liga', responsable: 'María García', estado: 'Activo', tipo: 'Empresarial', empresasInteresadas: 24, contactosInteresados: 312, ventas: 18, conversion: '42%', valorPotencial: '$45.000.000', solicitudes: 312 },
  { id: 2, nombre: 'Plan Liga Individual', codigo: 'PLI-001', categoria: 'Plan Liga', responsable: 'Juan López', estado: 'Activo', tipo: 'Individual', empresasInteresadas: 0, contactosInteresados: 245, ventas: 86, conversion: '35%', valorPotencial: '$12.300.000', solicitudes: 245 },
  { id: 3, nombre: 'Tamizajes', codigo: 'TAM-001', categoria: 'Salud Preventiva', responsable: 'Carlos Torres', estado: 'Activo', tipo: 'Salud', empresasInteresadas: 11, contactosInteresados: 134, ventas: 41, conversion: '31%', valorPotencial: '$8.200.000', solicitudes: 134 },
  { id: 4, nombre: 'Brigadas de Salud', codigo: 'BRI-001', categoria: 'Salud Preventiva', responsable: 'María García', estado: 'Activo', tipo: 'Salud', empresasInteresadas: 9, contactosInteresados: 187, ventas: 52, conversion: '28%', valorPotencial: '$15.600.000', solicitudes: 187 },
  { id: 5, nombre: 'Capacitaciones', codigo: 'CAP-001', categoria: 'Bienestar', responsable: 'Juan López', estado: 'En revisión', tipo: 'Bienestar', empresasInteresadas: 6, contactosInteresados: 89, ventas: 14, conversion: '16%', valorPotencial: '$4.500.000', solicitudes: 89 },
  { id: 6, nombre: 'Programas de Bienestar', codigo: 'BIE-001', categoria: 'Bienestar', responsable: 'Carlos Torres', estado: 'Activo', tipo: 'Bienestar', empresasInteresadas: 8, contactosInteresados: 102, ventas: 22, conversion: '22%', valorPotencial: '$9.800.000', solicitudes: 102 },
])

const vistaActiva = ref<'lista' | 'indicadores'>('lista')
const buscar = ref('')
const filtroEstado = ref('todos')
const filtroTipo = ref('todos')

const serviciosFiltrados = computed(() =>
  servicios.value.filter(s => {
    const q = buscar.value.toLowerCase()
    const matchBuscar = !q || [s.nombre, s.codigo, s.categoria].some(f => f.toLowerCase().includes(q))
    return matchBuscar
      && (filtroEstado.value === 'todos' || s.estado === filtroEstado.value)
      && (filtroTipo.value === 'todos' || s.tipo === filtroTipo.value)
  })
)

const totalSolicitudes = computed(() => servicios.value.reduce((acc, s) => acc + s.solicitudes, 0))
const totalVentas = computed(() => servicios.value.reduce((acc, s) => acc + s.ventas, 0))
const totalEmpresas = computed(() => servicios.value.reduce((acc, s) => acc + s.empresasInteresadas, 0))

const topServicios = computed(() => [...servicios.value].sort((a, b) => b.solicitudes - a.solicitudes))

const modalVisible = ref(false)
const modalModo = ref<'nuevo' | 'editar'>('nuevo')
const servicioEditando = ref<Servicio | null>(null)
const formVacio = {
  nombre: '', codigo: '', categoria: '', responsable: '', estado: 'Activo' as const,
  tipo: 'Empresarial' as const, empresasInteresadas: 0, contactosInteresados: 0,
  ventas: 0, conversion: '0%', valorPotencial: '', solicitudes: 0
}
const form = reactive({ ...formVacio })

const abrirNuevo = () => { modalModo.value = 'nuevo'; Object.assign(form, formVacio); modalVisible.value = true }
const abrirEditar = (s: Servicio) => { modalModo.value = 'editar'; servicioEditando.value = s; Object.assign(form, s); modalVisible.value = true }

const guardar = () => {
  if (!form.nombre || !form.codigo) return
  if (modalModo.value === 'nuevo') {
    servicios.value.unshift({ ...form, id: Date.now() })
  } else if (servicioEditando.value) {
    const idx = servicios.value.findIndex(s => s.id === servicioEditando.value!.id)
    if (idx !== -1) servicios.value[idx] = { ...form, id: servicioEditando.value.id }
  }
  modalVisible.value = false
}

const estadoStyle = (e: string) => {
  if (e === 'Activo') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (e === 'Inactivo') return 'bg-slate-100 text-slate-500 border-slate-200'
  return 'bg-amber-50 text-amber-700 border-amber-200'
}

const tipoColor = (t: string) => {
  const map: Record<string, string> = {
    'Empresarial': 'bg-[#EEF2FF] text-[#2447F9] border-blue-200',
    'Individual': 'bg-[#FCE7F3] text-[#EC4899] border-pink-200',
    'Bienestar': 'bg-[#D1FAE5] text-[#059669] border-emerald-200',
    'Salud': 'bg-[#FEF9C3] text-[#C9A227] border-amber-200',
  }
  return map[t] ?? 'bg-slate-100 text-slate-600 border-slate-200'
}

const toggleEstado = (s: Servicio) => {
  s.estado = s.estado === 'Activo' ? 'Inactivo' : 'Activo'
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          Servicios Plan Liga
          <span class="bg-[#EEF2FF] text-[#2447F9] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ servicios.length }}</span>
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Administra servicios institucionales, indicadores y asociaciones</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
          <button @click="vistaActiva = 'lista'" class="px-3 py-1.5 text-[11px] font-semibold transition-all" :class="vistaActiva === 'lista' ? 'bg-[#2447F9] text-white' : 'text-slate-500 hover:bg-slate-50'">Lista</button>
          <button @click="vistaActiva = 'indicadores'" class="px-3 py-1.5 text-[11px] font-semibold transition-all" :class="vistaActiva === 'indicadores' ? 'bg-[#2447F9] text-white' : 'text-slate-500 hover:bg-slate-50'">Indicadores</button>
        </div>
        <button @click="abrirNuevo" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
          <Plus :size="14" /> Nuevo servicio
        </button>
      </div>
    </div>

    <!-- Vista: Lista -->
    <template v-if="vistaActiva === 'lista'">
      <!-- Toolbar -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
        <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div class="relative flex-1 min-w-0">
            <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input v-model="buscar" placeholder="Buscar por nombre, código o categoría..." class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
          </div>
          <div class="flex items-center gap-2">
            <select v-model="filtroEstado" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
              <option value="todos">Estado: Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="En revisión">En revisión</option>
            </select>
            <select v-model="filtroTipo" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
              <option value="todos">Tipo: Todos</option>
              <option value="Empresarial">Empresarial</option>
              <option value="Individual">Individual</option>
              <option value="Bienestar">Bienestar</option>
              <option value="Salud">Salud</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[960px]">
            <thead class="bg-[#F8FAFC] border-b border-slate-200">
              <tr>
                <th class="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Servicio</th>
                <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Código</th>
                <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
                <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
                <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Solicitudes</th>
                <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Conversión</th>
                <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Responsable</th>
                <th class="text-right px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="s in serviciosFiltrados" :key="s.id" class="hover:bg-slate-50/60 transition-colors group">
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-[#FEF9C3] text-[#C9A227] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                      <Layers :size="16" />
                    </div>
                    <div>
                      <div class="text-[12px] font-semibold text-[#0F172A]">{{ s.nombre }}</div>
                      <div class="text-[10px] text-slate-400">{{ s.valorPotencial }} potencial</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3.5 text-[11px] text-slate-600 font-mono font-medium">{{ s.codigo }}</td>
                <td class="px-4 py-3.5">
                  <span class="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border" :class="tipoColor(s.tipo)">{{ s.tipo }}</span>
                </td>
                <td class="px-4 py-3.5 text-[11px] text-slate-600">{{ s.categoria }}</td>
                <td class="px-4 py-3.5">
                  <div class="text-[12px] font-bold text-[#0F172A]">{{ s.solicitudes }}</div>
                  <div class="text-[10px] text-slate-400">{{ s.ventas }} ventas</div>
                </td>
                <td class="px-4 py-3.5">
                  <span class="text-[12px] font-bold text-emerald-600">{{ s.conversion }}</span>
                </td>
                <td class="px-4 py-3.5">
                  <button @click="toggleEstado(s)" class="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all hover:opacity-80 cursor-pointer" :class="estadoStyle(s.estado)">{{ s.estado }}</button>
                </td>
                <td class="px-4 py-3.5">
                  <div class="flex items-center gap-1.5">
                    <div class="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#2447F9] text-[8px] font-bold flex items-center justify-center flex-shrink-0">
                      {{ s.responsable.split(' ').map(n => n[0]).join('') }}
                    </div>
                    <span class="text-[11px] text-slate-600 truncate max-w-[100px]">{{ s.responsable }}</span>
                  </div>
                </td>
                <td class="px-5 py-3.5 text-right">
                  <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="abrirEditar(s)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 flex items-center justify-center transition-all" title="Editar">
                      <Edit2 :size="12" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="serviciosFiltrados.length === 0">
                <td colspan="9" class="text-center py-16 text-slate-400 text-[12px]">No se encontraron servicios.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Vista: Indicadores -->
    <template v-if="vistaActiva === 'indicadores'">
      <!-- KPIs Comerciales -->
      <div>
        <h3 class="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-3">Indicadores Comerciales</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div class="w-9 h-9 rounded-xl bg-[#E8EAF6] flex items-center justify-center mb-3"><Building2 :size="17" class="text-[#1A2A6C]" /></div>
            <div class="text-[26px] font-bold text-[#0F172A] leading-none">{{ totalEmpresas }}</div>
            <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Empresas interesadas</div>
          </div>
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div class="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-3"><Users :size="17" class="text-[#2447F9]" /></div>
            <div class="text-[26px] font-bold text-[#0F172A] leading-none">{{ totalSolicitudes }}</div>
            <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Contactos interesados</div>
          </div>
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div class="w-9 h-9 rounded-xl bg-[#D1FAE5] flex items-center justify-center mb-3"><TrendingUp :size="17" class="text-[#059669]" /></div>
            <div class="text-[26px] font-bold text-[#0F172A] leading-none">{{ totalVentas }}</div>
            <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Ventas totales</div>
          </div>
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div class="w-9 h-9 rounded-xl bg-[#FEF9C3] flex items-center justify-center mb-3"><BarChart3 :size="17" class="text-[#C9A227]" /></div>
            <div class="text-[26px] font-bold text-[#0F172A] leading-none">34%</div>
            <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Conversión promedio</div>
          </div>
        </div>
      </div>

      <!-- Marketing indicators -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <!-- Top servicios por solicitudes -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div class="flex items-center gap-2 mb-4">
            <BarChart3 :size="14" class="text-[#2447F9]" />
            <h3 class="text-[13px] font-bold text-[#0F172A]">Servicios más solicitados</h3>
          </div>
          <div class="space-y-4">
            <div v-for="(s, idx) in topServicios" :key="s.id">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                    :style="{ backgroundColor: idx === 0 ? '#C9A227' : idx === 1 ? '#94A3B8' : idx === 2 ? '#CD7F32' : '#CBD5E1' }">
                    {{ idx + 1 }}
                  </span>
                  <span class="text-[12px] font-semibold text-slate-700">{{ s.nombre }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-[11px] text-slate-400">{{ s.solicitudes }} sol.</span>
                  <span class="text-[11px] font-bold text-emerald-600">{{ s.conversion }}</span>
                </div>
              </div>
              <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-[#2447F9] transition-all" :style="{ width: (s.solicitudes / topServicios[0].solicitudes * 100) + '%' }" />
              </div>
            </div>
          </div>
        </div>

        <!-- Distribución por tipo -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div class="flex items-center gap-2 mb-4">
            <Tag :size="14" class="text-[#C9A227]" />
            <h3 class="text-[13px] font-bold text-[#0F172A]">Distribución por tipo</h3>
          </div>
          <div class="space-y-3">
            <div v-for="tipo in ['Empresarial', 'Individual', 'Salud', 'Bienestar']" :key="tipo">
              <div class="flex justify-between text-[11px] mb-1.5">
                <span class="font-medium text-slate-600">{{ tipo }}</span>
                <span class="font-bold text-[#0F172A]">{{ servicios.filter(s => s.tipo === tipo).reduce((acc, s) => acc + s.solicitudes, 0) }} sol.</span>
              </div>
              <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all"
                  :style="{
                    width: (servicios.filter(s => s.tipo === tipo).reduce((acc, s) => acc + s.solicitudes, 0) / totalSolicitudes * 100) + '%',
                    backgroundColor: tipo === 'Empresarial' ? '#2447F9' : tipo === 'Individual' ? '#EC4899' : tipo === 'Salud' ? '#C9A227' : '#059669'
                  }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal Nuevo/Editar -->
    <Teleport to="body">
      <div v-if="modalVisible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="modalVisible = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[14px] font-bold text-[#0F172A]">{{ modalModo === 'nuevo' ? 'Nuevo Servicio' : 'Editar Servicio' }}</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">Plan Liga institucional</p>
            </div>
            <button @click="modalVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
          </div>
          <div class="overflow-y-auto flex-1 p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre *</label>
                <div class="relative">
                  <Layers :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="form.nombre" placeholder="Ej: Plan Liga Empresarial" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Código *</label>
                <div class="relative">
                  <Hash :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="form.codigo" placeholder="PLE-001" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Categoría</label>
                <input v-model="form.categoria" placeholder="Ej: Plan Liga" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tipo</label>
                <select v-model="form.tipo" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
                  <option value="Empresarial">Empresarial</option>
                  <option value="Individual">Individual</option>
                  <option value="Bienestar">Bienestar</option>
                  <option value="Salud">Salud</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Responsable</label>
                <div class="relative">
                  <User :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select v-model="form.responsable" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
                    <option value="">Seleccionar</option>
                    <option value="María García">María García</option>
                    <option value="Juan López">Juan López</option>
                    <option value="Carlos Torres">Carlos Torres</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
                <select v-model="form.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="En revisión">En revisión</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Valor Potencial</label>
                <input v-model="form.valorPotencial" placeholder="Ej: $10.000.000" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
            <button @click="modalVisible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
            <button @click="guardar" class="h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
              {{ modalModo === 'nuevo' ? 'Crear servicio' : 'Guardar cambios' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
