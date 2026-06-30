<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  Search, Plus, Download, X, Edit2, Clock,
  Building2, MapPin, User, Hash, Users, Layers, ChevronRight
} from 'lucide-vue-next'

interface Empresa {
  id: number
  razonSocial: string
  nit: string
  industria: string
  direccion: string
  ciudad: string
  responsable: string
  estado: 'Activa' | 'Inactiva' | 'Prospecto'
  contactos: number
  servicios: string[]
}

const empresas = ref<Empresa[]>([
  { id: 1, razonSocial: 'Global Tech S.A.S', nit: '900.123.456-7', industria: 'Tecnología', direccion: 'Cra 8 #20-15', ciudad: 'Pereira', responsable: 'María García', estado: 'Activa', contactos: 3, servicios: ['Plan Liga Empresarial'] },
  { id: 2, razonSocial: 'Constructora ABC', nit: '800.987.654-3', industria: 'Construcción', direccion: 'Av. Américas #45-67', ciudad: 'Medellín', responsable: 'Carlos Torres', estado: 'Activa', contactos: 5, servicios: ['Plan Liga Empresarial', 'Brigadas de Salud'] },
  { id: 3, razonSocial: 'Farmacia Norte', nit: '700.111.222-1', industria: 'Salud', direccion: 'Calle 10 #5-30', ciudad: 'Manizales', responsable: 'María García', estado: 'Prospecto', contactos: 1, servicios: [] },
  { id: 4, razonSocial: 'Estética Mayo', nit: '901.555.333-5', industria: 'Belleza', direccion: 'Carrera 15 #80-20', ciudad: 'Bogotá', responsable: 'Juan López', estado: 'Activa', contactos: 2, servicios: ['Tamizajes'] },
  { id: 5, razonSocial: 'Tech Solutions', nit: '830.666.777-9', industria: 'Tecnología', direccion: 'Av. Roosevelt #38-11', ciudad: 'Cali', responsable: 'Juan López', estado: 'Inactiva', contactos: 1, servicios: [] },
  { id: 6, razonSocial: 'Grupo Empresarial XYZ', nit: '900.444.555-2', industria: 'Comercio', direccion: 'Calle 100 #15-30', ciudad: 'Bogotá', responsable: 'Carlos Torres', estado: 'Activa', contactos: 4, servicios: ['Plan Liga Empresarial', 'Capacitaciones'] },
])

const buscar = ref('')
const filtroEstado = ref('todos')
const filtroIndustria = ref('todas')

const empresasFiltradas = computed(() =>
  empresas.value.filter(e => {
    const q = buscar.value.toLowerCase()
    const matchBuscar = !q || [e.razonSocial, e.nit, e.ciudad].some(f => f.toLowerCase().includes(q))
    return matchBuscar
      && (filtroEstado.value === 'todos' || e.estado === filtroEstado.value)
      && (filtroIndustria.value === 'todas' || e.industria === filtroIndustria.value)
  })
)

const industrias = computed(() => [...new Set(empresas.value.map(e => e.industria))].sort())

const modalVisible = ref(false)
const modalModo = ref<'nuevo' | 'editar'>('nuevo')
const empresaEditando = ref<Empresa | null>(null)
const formVacio = { razonSocial: '', nit: '', industria: '', direccion: '', ciudad: '', responsable: '', estado: 'Prospecto' as const, contactos: 0, servicios: [] as string[] }
const form = reactive({ ...formVacio })

const abrirNuevo = () => { modalModo.value = 'nuevo'; Object.assign(form, { ...formVacio, servicios: [] }); modalVisible.value = true }
const abrirEditar = (e: Empresa) => { modalModo.value = 'editar'; empresaEditando.value = e; Object.assign(form, { ...e, servicios: [...e.servicios] }); modalVisible.value = true }

const guardar = () => {
  if (!form.razonSocial || !form.nit) return
  if (modalModo.value === 'nuevo') {
    empresas.value.unshift({ ...form, id: Date.now(), servicios: [...form.servicios] })
  } else if (empresaEditando.value) {
    const idx = empresas.value.findIndex(e => e.id === empresaEditando.value!.id)
    if (idx !== -1) empresas.value[idx] = { ...form, id: empresaEditando.value.id, servicios: [...form.servicios] }
  }
  modalVisible.value = false
}

const estadoStyle = (e: string) => {
  if (e === 'Activa') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (e === 'Inactiva') return 'bg-slate-100 text-slate-500 border-slate-200'
  return 'bg-amber-50 text-amber-700 border-amber-200'
}

const drawerVisible = ref(false)
const empresaHistorial = ref<Empresa | null>(null)
const abrirHistorial = (e: Empresa) => { empresaHistorial.value = e; drawerVisible.value = true }

const historialMock = [
  { tipo: 'Reunión', desc: 'Presentación servicios Plan Liga Empresarial', fecha: '2026-06-25', usuario: 'María García', color: '#C9A227', bg: '#FEF9C3' },
  { tipo: 'Correo', desc: 'Envío propuesta comercial 50 empleados', fecha: '2026-06-18', usuario: 'Juan López', color: '#EC4899', bg: '#FCE7F3' },
  { tipo: 'Llamada', desc: 'Seguimiento cotización mensual', fecha: '2026-06-10', usuario: 'Carlos Torres', color: '#2447F9', bg: '#EEF2FF' },
  { tipo: 'Nota', desc: 'Interesados en brigada de salud Q3', fecha: '2026-06-01', usuario: 'María García', color: '#059669', bg: '#D1FAE5' },
]
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          Gestión de Empresas
          <span class="bg-[#EEF2FF] text-[#2447F9] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ empresas.length }}</span>
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Empresas vinculadas, industrias y servicios asociados</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Download :size="13" /> Exportar
        </button>
        <button @click="abrirNuevo" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
          <Plus :size="14" /> Nueva empresa
        </button>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="buscar" placeholder="Buscar por razón social, NIT o ciudad..." class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
        </div>
        <div class="flex items-center gap-2">
          <select v-model="filtroEstado" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Estado: Todos</option>
            <option value="Activa">Activa</option>
            <option value="Inactiva">Inactiva</option>
            <option value="Prospecto">Prospecto</option>
          </select>
          <select v-model="filtroIndustria" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todas">Industria: Todas</option>
            <option v-for="ind in industrias" :key="ind" :value="ind">{{ ind }}</option>
          </select>
        </div>
      </div>
      <div class="mt-2 text-[11px] text-slate-400">
        Mostrando <strong class="text-slate-600">{{ empresasFiltradas.length }}</strong> empresas
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[920px]">
          <thead class="bg-[#F8FAFC] border-b border-slate-200">
            <tr>
              <th class="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Empresa</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">NIT</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Industria</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ciudad</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contactos</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Servicios</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Responsable</th>
              <th class="text-right px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="e in empresasFiltradas" :key="e.id" class="hover:bg-slate-50/60 transition-colors group">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-[#E8EAF6] text-[#1A2A6C] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                    {{ e.razonSocial.split(' ').map(w => w[0]).slice(0, 2).join('') }}
                  </div>
                  <div>
                    <div class="text-[12px] font-semibold text-[#0F172A]">{{ e.razonSocial }}</div>
                    <div class="text-[10px] text-slate-400 flex items-center gap-1"><MapPin :size="9" /> {{ e.direccion }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3.5 text-[11px] text-slate-600 font-medium">{{ e.nit }}</td>
              <td class="px-4 py-3.5">
                <span class="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#2447F9] border border-blue-200">{{ e.industria }}</span>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1 text-[11px] text-slate-600"><MapPin :size="11" class="text-slate-400" />{{ e.ciudad }}</div>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1 text-[11px] text-slate-600"><Users :size="11" class="text-slate-400" />{{ e.contactos }}</div>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1 text-[11px] text-slate-600"><Layers :size="11" class="text-slate-400" />{{ e.servicios.length }}</div>
              </td>
              <td class="px-4 py-3.5">
                <span class="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border" :class="estadoStyle(e.estado)">{{ e.estado }}</span>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1.5">
                  <div class="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#2447F9] text-[8px] font-bold flex items-center justify-center flex-shrink-0">
                    {{ e.responsable.split(' ').map(n => n[0]).join('') }}
                  </div>
                  <span class="text-[11px] text-slate-600 truncate max-w-[100px]">{{ e.responsable }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="abrirEditar(e)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 flex items-center justify-center transition-all" title="Editar">
                    <Edit2 :size="12" />
                  </button>
                  <button @click="abrirHistorial(e)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-600 text-slate-500 flex items-center justify-center transition-all" title="Historial">
                    <Clock :size="12" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="empresasFiltradas.length === 0">
              <td colspan="9" class="text-center py-16 text-slate-400 text-[12px]">No se encontraron empresas.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <!-- Modal Nuevo/Editar -->
      <div v-if="modalVisible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="modalVisible = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[14px] font-bold text-[#0F172A]">{{ modalModo === 'nuevo' ? 'Nueva Empresa' : 'Editar Empresa' }}</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">Complete los campos requeridos</p>
            </div>
            <button @click="modalVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
          </div>
          <div class="overflow-y-auto flex-1 p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Razón Social *</label>
                <div class="relative">
                  <Building2 :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="form.razonSocial" placeholder="Ej: Global Tech S.A.S" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">NIT *</label>
                <div class="relative">
                  <Hash :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="form.nit" placeholder="900.000.000-0" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Industria</label>
                <input v-model="form.industria" placeholder="Ej: Tecnología" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Dirección</label>
                <div class="relative">
                  <MapPin :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="form.direccion" placeholder="Ej: Cra 8 #20-15" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Ciudad</label>
                <input v-model="form.ciudad" placeholder="Ej: Pereira" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
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
                  <option value="Activa">Activa</option>
                  <option value="Inactiva">Inactiva</option>
                  <option value="Prospecto">Prospecto</option>
                </select>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
            <button @click="modalVisible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
            <button @click="guardar" class="h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
              {{ modalModo === 'nuevo' ? 'Crear empresa' : 'Guardar cambios' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Drawer Historial -->
      <div v-if="drawerVisible" class="fixed inset-0 z-[99999]" @click.self="drawerVisible = false">
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" @click="drawerVisible = false" />
        <div class="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col z-10">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[13px] font-bold text-[#0F172A]">Historial</h3>
              <p class="text-[11px] text-slate-400">{{ empresaHistorial?.razonSocial }}</p>
            </div>
            <button @click="drawerVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
          </div>
          <div class="flex-1 overflow-y-auto p-5 space-y-3">
            <div v-for="(act, i) in historialMock" :key="i" class="flex gap-3">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: act.bg }">
                <ChevronRight :size="13" :style="{ color: act.color }" />
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
            <button class="w-full h-9 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold hover:bg-[#1D3DD9] transition-all">+ Registrar actividad</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
