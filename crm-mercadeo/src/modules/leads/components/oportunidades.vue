<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  Search, Plus, X, Edit2,
  Building2, User, Layers, DollarSign, Trophy, XCircle
} from 'lucide-vue-next'

interface Oportunidad {
  id: number
  empresa: string
  contacto: string
  servicio: string
  responsable: string
  valor: string
  probabilidad: number
  estado: 'Lead' | 'Primer Contacto' | 'Reunión' | 'Cotización' | 'Negociación' | 'Ganada' | 'Perdida'
}

const oportunidades = ref<Oportunidad[]>([
  { id: 1, empresa: 'Global Tech S.A.S', contacto: 'Carlos Mendoza', servicio: 'Plan Liga Empresarial', responsable: 'María García', valor: '$18.000.000', probabilidad: 75, estado: 'Cotización' },
  { id: 2, empresa: 'Constructora ABC', contacto: 'Pedro Sánchez', servicio: 'Brigadas de Salud', responsable: 'Carlos Torres', valor: '$5.500.000', probabilidad: 90, estado: 'Negociación' },
  { id: 3, empresa: 'Farmacia Norte', contacto: 'Laura Gómez', servicio: 'Tamizajes', responsable: 'María García', valor: '$2.200.000', probabilidad: 40, estado: 'Reunión' },
  { id: 4, empresa: 'Estética Mayo', contacto: 'Ana Ruiz', servicio: 'Plan Liga Empresarial', responsable: 'Juan López', valor: '$12.000.000', probabilidad: 60, estado: 'Primer Contacto' },
  { id: 5, empresa: 'Tech Solutions', contacto: 'Roberto Díaz', servicio: 'Capacitaciones', responsable: 'Juan López', valor: '$3.800.000', probabilidad: 25, estado: 'Lead' },
  { id: 6, empresa: 'Innova Group', contacto: 'Valentina Cruz', servicio: 'Plan Liga Empresarial', responsable: 'Carlos Torres', valor: '$22.000.000', probabilidad: 95, estado: 'Ganada' },
  { id: 7, empresa: 'SalvaTech', contacto: 'Jorge Ramírez', servicio: 'Programas de Bienestar', responsable: 'María García', valor: '$4.100.000', probabilidad: 10, estado: 'Perdida' },
])

const buscar = ref('')
const filtroEstado = ref('todos')
const filtroResponsable = ref('todos')

const oportunidadesFiltradas = computed(() =>
  oportunidades.value.filter(o => {
    const q = buscar.value.toLowerCase()
    const matchBuscar = !q || [o.empresa, o.contacto, o.servicio].some(f => f.toLowerCase().includes(q))
    return matchBuscar
      && (filtroEstado.value === 'todos' || o.estado === filtroEstado.value)
      && (filtroResponsable.value === 'todos' || o.responsable === filtroResponsable.value)
  })
)

const responsables = computed(() => [...new Set(oportunidades.value.map(o => o.responsable))].sort())

const valorTotal = computed(() => {
  const activas = oportunidades.value.filter(o => !['Ganada', 'Perdida'].includes(o.estado))
  return activas.length + ' activas'
})

const etapas: Oportunidad['estado'][] = ['Lead', 'Primer Contacto', 'Reunión', 'Cotización', 'Negociación', 'Ganada', 'Perdida']

const modalVisible = ref(false)
const modalModo = ref<'nuevo' | 'editar'>('nuevo')
const oportunidadEditando = ref<Oportunidad | null>(null)
const formVacio = {
  empresa: '', contacto: '', servicio: '', responsable: '',
  valor: '', probabilidad: 50, estado: 'Lead' as const
}
const form = reactive({ ...formVacio })

const abrirNuevo = () => { modalModo.value = 'nuevo'; Object.assign(form, formVacio); modalVisible.value = true }
const abrirEditar = (o: Oportunidad) => { modalModo.value = 'editar'; oportunidadEditando.value = o; Object.assign(form, o); modalVisible.value = true }

const guardar = () => {
  if (!form.empresa || !form.servicio) return
  if (modalModo.value === 'nuevo') {
    oportunidades.value.unshift({ ...form, id: Date.now() })
  } else if (oportunidadEditando.value) {
    const idx = oportunidades.value.findIndex(o => o.id === oportunidadEditando.value!.id)
    if (idx !== -1) oportunidades.value[idx] = { ...form, id: oportunidadEditando.value.id }
  }
  modalVisible.value = false
}

const ganar = (o: Oportunidad) => { o.estado = 'Ganada'; o.probabilidad = 100 }
const perder = (o: Oportunidad) => { o.estado = 'Perdida'; o.probabilidad = 0 }

const estadoStyle = (e: string) => {
  const map: Record<string, string> = {
    'Lead':           'text-slate-400',
    'Primer Contacto':'text-[#1E3A8A]',
    'Reunión':        'text-[#9D174D]',
    'Cotización':     'text-amber-600',
    'Negociación':    'text-[#1A2A6C]',
    'Ganada':         'text-emerald-600',
    'Perdida':        'text-red-500',
  }
  return map[e] ?? 'bg-slate-100 text-slate-500 border-slate-200'
}

const probColor = (p: number) => p >= 70 ? 'bg-emerald-500' : p >= 40 ? 'bg-amber-400' : 'bg-red-400'
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          Gestión de Oportunidades
          <span class="bg-[#FCE7F3] text-[#EC4899] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ valorTotal }}</span>
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Pipeline comercial · empresas, contactos y servicios asociados</p>
      </div>
      <button @click="abrirNuevo" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
        <Plus :size="14" /> Nueva oportunidad
      </button>
    </div>

    <!-- Resumen rápido de etapas -->
    <div class="grid grid-cols-3 sm:grid-cols-5 xl:grid-cols-7 gap-3">
      <div v-for="etapa in etapas" :key="etapa" class="bg-white rounded-xl border border-slate-200 shadow-sm p-3 text-center cursor-pointer hover:border-[#2447F9] transition-all" @click="filtroEstado = filtroEstado === etapa ? 'todos' : etapa" :class="filtroEstado === etapa ? 'border-[#2447F9] bg-[#EEF2FF]' : ''">
        <div class="text-[20px] font-bold" :class="filtroEstado === etapa ? 'text-[#2447F9]' : 'text-[#0F172A]'">
          {{ oportunidades.filter(o => o.estado === etapa).length }}
        </div>
        <div class="text-[9px] font-bold text-slate-500 uppercase tracking-wide mt-0.5 truncate">{{ etapa }}</div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="buscar" placeholder="Buscar por empresa, contacto o servicio..." class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
        </div>
        <div class="flex items-center gap-2">
          <select v-model="filtroEstado" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Etapa: Todas</option>
            <option v-for="e in etapas" :key="e" :value="e">{{ e }}</option>
          </select>
          <select v-model="filtroResponsable" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Responsable: Todos</option>
            <option v-for="r in responsables" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[1000px]">
          <thead class="bg-[#F8FAFC] border-b border-slate-200">
            <tr>
              <th class="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Empresa · Contacto</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Servicio</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Valor</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Etapa</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Responsable</th>
              <th class="text-right px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="o in oportunidadesFiltradas" :key="o.id" class="hover:bg-slate-50/60 transition-colors group">
              <td class="px-5 py-3.5">
                <div class="text-[12px] font-semibold text-[#0F172A] flex items-center gap-1.5"><Building2 :size="12" class="text-slate-400" />{{ o.empresa }}</div>
                <div class="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5"><User :size="10" />{{ o.contacto }}</div>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1 text-[11px] text-slate-600"><Layers :size="11" class="text-slate-400" />{{ o.servicio }}</div>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1 text-[13px] font-bold text-[#0F172A]"><DollarSign :size="12" class="text-slate-400" />{{ o.valor }}</div>
              </td>
              <td class="px-4 py-3.5">
                <span class="text-[11px] font-semibold" :class="estadoStyle(o.estado)">{{ o.estado }}</span>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1.5">
                  <div class="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#2447F9] text-[8px] font-bold flex items-center justify-center flex-shrink-0">
                    {{ o.responsable.split(' ').map(n => n[0]).join('') }}
                  </div>
                  <span class="text-[11px] text-slate-600 truncate max-w-[90px]">{{ o.responsable }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="abrirEditar(o)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 flex items-center justify-center transition-all" title="Editar"><Edit2 :size="12" /></button>
                  <button v-if="!['Ganada','Perdida'].includes(o.estado)" @click="ganar(o)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-500 flex items-center justify-center transition-all" title="Marcar ganada"><Trophy :size="12" /></button>
                  <button v-if="!['Ganada','Perdida'].includes(o.estado)" @click="perder(o)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 flex items-center justify-center transition-all" title="Marcar perdida"><XCircle :size="12" /></button>
                </div>
              </td>
            </tr>
            <tr v-if="oportunidadesFiltradas.length === 0">
              <td colspan="7" class="text-center py-16 text-slate-400 text-[12px]">No se encontraron oportunidades.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="modalVisible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="modalVisible = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[14px] font-bold text-[#0F172A]">{{ modalModo === 'nuevo' ? 'Nueva Oportunidad' : 'Editar Oportunidad' }}</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">Pipeline comercial</p>
            </div>
            <button @click="modalVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
          </div>
          <div class="overflow-y-auto flex-1 p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa *</label>
                <input v-model="form.empresa" placeholder="Nombre empresa" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contacto</label>
                <input v-model="form.contacto" placeholder="Nombre contacto" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Servicio *</label>
                <select v-model="form.servicio" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
                  <option value="">Seleccionar servicio</option>
                  <option value="Plan Liga Empresarial">Plan Liga Empresarial</option>
                  <option value="Plan Liga Individual">Plan Liga Individual</option>
                  <option value="Tamizajes">Tamizajes</option>
                  <option value="Brigadas de Salud">Brigadas de Salud</option>
                  <option value="Capacitaciones">Capacitaciones</option>
                  <option value="Programas de Bienestar">Programas de Bienestar</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Valor</label>
                <input v-model="form.valor" placeholder="$0" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Probabilidad ({{ form.probabilidad }}%)</label>
                <input v-model.number="form.probabilidad" type="range" min="0" max="100" step="5" class="w-full h-2 rounded-lg appearance-none cursor-pointer mt-3" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Etapa</label>
                <select v-model="form.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
                  <option v-for="e in etapas" :key="e" :value="e">{{ e }}</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Responsable</label>
                <select v-model="form.responsable" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
                  <option value="">Seleccionar</option>
                  <option value="María García">María García</option>
                  <option value="Juan López">Juan López</option>
                  <option value="Carlos Torres">Carlos Torres</option>
                </select>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
            <button @click="modalVisible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
            <button @click="guardar" class="h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
              {{ modalModo === 'nuevo' ? 'Crear oportunidad' : 'Guardar cambios' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
