<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Search, Plus, Download, Copy, X, Save, SlidersHorizontal, Users } from 'lucide-vue-next'

interface Segmento {
  id: number
  nombre: string
  empresa: string
  servicio: string
  estado: string
  etiqueta: string
  ciudad: string
  responsable: string
  total: number
  creadoEn: string
}

const segmentosGuardados = ref<Segmento[]>([
  { id: 1, nombre: 'Empresas VIP Pereira', empresa: 'todas', servicio: 'Plan Liga Empresarial', estado: 'Activo', etiqueta: 'VIP', ciudad: 'Pereira', responsable: 'todos', total: 34, creadoEn: '2026-06-01' },
  { id: 2, nombre: 'Prospectos sin gestión', empresa: 'todas', servicio: 'todos', estado: 'Prospecto', etiqueta: 'todos', ciudad: 'todas', responsable: 'María García', total: 67, creadoEn: '2026-05-20' },
  { id: 3, nombre: 'Brigadas Medellín Q3', empresa: 'todas', servicio: 'Brigadas de Salud', estado: 'todos', etiqueta: 'todos', ciudad: 'Medellín', responsable: 'Carlos Torres', total: 22, creadoEn: '2026-06-15' },
])

const filtros = reactive({
  empresa: '',
  servicio: 'todos',
  estado: 'todos',
  etiqueta: 'todos',
  ciudad: 'todas',
  responsable: 'todos',
})

const nombreSegmento = ref('')
const mostrarGuardar = ref(false)

const filtrosActivos = computed(() =>
  [filtros.empresa, filtros.servicio !== 'todos', filtros.estado !== 'todos', filtros.etiqueta !== 'todos', filtros.ciudad !== 'todas', filtros.responsable !== 'todos'].filter(Boolean).length
)

const resultadoMock = computed(() => {
  let base = 1248
  if (filtros.empresa) base = Math.floor(base * 0.3)
  if (filtros.servicio !== 'todos') base = Math.floor(base * 0.6)
  if (filtros.estado !== 'todos') base = Math.floor(base * 0.5)
  if (filtros.etiqueta !== 'todos') base = Math.floor(base * 0.4)
  if (filtros.ciudad !== 'todas') base = Math.floor(base * 0.3)
  if (filtros.responsable !== 'todos') base = Math.floor(base * 0.4)
  return Math.max(base, 1)
})

const limpiar = () => {
  Object.assign(filtros, { empresa: '', servicio: 'todos', estado: 'todos', etiqueta: 'todos', ciudad: 'todas', responsable: 'todos' })
}

const guardarSegmento = () => {
  if (!nombreSegmento.value) return
  segmentosGuardados.value.unshift({
    id: Date.now(),
    nombre: nombreSegmento.value,
    ...filtros,
    total: resultadoMock.value,
    creadoEn: new Date().toISOString().split('T')[0],
  })
  nombreSegmento.value = ''
  mostrarGuardar.value = false
}

const duplicar = (s: Segmento) => {
  segmentosGuardados.value.unshift({ ...s, id: Date.now(), nombre: `${s.nombre} (copia)`, creadoEn: new Date().toISOString().split('T')[0] })
}

const eliminar = (id: number) => {
  segmentosGuardados.value = segmentosGuardados.value.filter(s => s.id !== id)
}

const cargarSegmento = (s: Segmento) => {
  Object.assign(filtros, { empresa: s.empresa === 'todas' ? '' : s.empresa, servicio: s.servicio, estado: s.estado, etiqueta: s.etiqueta, ciudad: s.ciudad, responsable: s.responsable })
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A]">Segmentación</h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Filtra, guarda y exporta segmentos de contactos</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Download :size="13" /> Exportar
        </button>
        <button @click="mostrarGuardar = true" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
          <Save :size="13" /> Guardar segmento
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div class="flex items-center gap-2 mb-4">
        <SlidersHorizontal :size="15" class="text-[#2447F9]" />
        <h3 class="text-[13px] font-bold text-[#0F172A]">Filtros de segmentación</h3>
        <span v-if="filtrosActivos > 0" class="bg-[#2447F9] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{{ filtrosActivos }} activos</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Empresa</label>
          <div class="relative">
            <Search :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input v-model="filtros.empresa" placeholder="Buscar empresa..." class="w-full h-9 pl-8 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Servicio</label>
          <select v-model="filtros.servicio" class="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
            <option value="todos">Todos los servicios</option>
            <option value="Plan Liga Empresarial">Plan Liga Empresarial</option>
            <option value="Plan Liga Individual">Plan Liga Individual</option>
            <option value="Tamizajes">Tamizajes</option>
            <option value="Brigadas de Salud">Brigadas de Salud</option>
            <option value="Capacitaciones">Capacitaciones</option>
            <option value="Programas de Bienestar">Programas de Bienestar</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Estado</label>
          <select v-model="filtros.estado" class="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
            <option value="todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Prospecto">Prospecto</option>
            <option value="En proceso">En proceso</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Etiqueta</label>
          <select v-model="filtros.etiqueta" class="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
            <option value="todos">Todas las etiquetas</option>
            <option value="VIP">VIP</option>
            <option value="Plan Liga">Plan Liga</option>
            <option value="Interesado">Interesado</option>
            <option value="Empresarial">Empresarial</option>
            <option value="Nuevo">Nuevo</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Ciudad</label>
          <select v-model="filtros.ciudad" class="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
            <option value="todas">Todas las ciudades</option>
            <option value="Pereira">Pereira</option>
            <option value="Bogotá">Bogotá</option>
            <option value="Medellín">Medellín</option>
            <option value="Cali">Cali</option>
            <option value="Manizales">Manizales</option>
            <option value="Barranquilla">Barranquilla</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Responsable</label>
          <select v-model="filtros.responsable" class="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
            <option value="todos">Todos</option>
            <option value="María García">María García</option>
            <option value="Juan López">Juan López</option>
            <option value="Carlos Torres">Carlos Torres</option>
          </select>
        </div>
      </div>

      <!-- Resultado -->
      <div class="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
        <div class="flex items-center gap-2">
          <Users :size="15" class="text-[#2447F9]" />
          <span class="text-[13px] font-bold text-[#0F172A]">{{ resultadoMock.toLocaleString('es-CO') }}</span>
          <span class="text-[12px] text-slate-500">contactos en este segmento</span>
        </div>
        <button v-if="filtrosActivos > 0" @click="limpiar" class="flex items-center gap-1 h-8 px-3 rounded-lg border border-red-200 bg-red-50 text-[11px] font-semibold text-red-500 hover:bg-red-100 transition-all">
          <X :size="11" /> Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Modal guardar segmento -->
    <div v-if="mostrarGuardar" class="bg-white rounded-2xl border border-[#2447F9] shadow-lg p-5">
      <h4 class="text-[12px] font-bold text-[#0F172A] mb-3">Guardar segmento actual</h4>
      <div class="flex gap-2">
        <input v-model="nombreSegmento" placeholder="Nombre del segmento..." class="flex-1 h-9 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" @keydown.enter="guardarSegmento" />
        <button @click="guardarSegmento" class="h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold hover:bg-[#1D3DD9] transition-all">Guardar</button>
        <button @click="mostrarGuardar = false" class="h-9 px-3 rounded-lg border border-slate-200 text-slate-500 text-[11px] hover:bg-slate-50 transition-all">Cancelar</button>
      </div>
    </div>

    <!-- Segmentos guardados -->
    <div>
      <h3 class="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-3">Segmentos guardados ({{ segmentosGuardados.length }})</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <div v-for="s in segmentosGuardados" :key="s.id" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all group">
          <div class="flex items-start justify-between mb-3">
            <div>
              <div class="text-[13px] font-bold text-[#0F172A]">{{ s.nombre }}</div>
              <div class="text-[10px] text-slate-400 mt-0.5">Creado {{ s.creadoEn }}</div>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="duplicar(s)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-400 flex items-center justify-center transition-all" title="Duplicar"><Copy :size="11" /></button>
              <button @click="eliminar(s.id)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 flex items-center justify-center transition-all" title="Eliminar"><X :size="11" /></button>
            </div>
          </div>

          <div class="flex flex-wrap gap-1.5 mb-3">
            <span v-if="s.servicio !== 'todos'" class="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#EEF2FF] text-[#2447F9] border border-blue-200">{{ s.servicio }}</span>
            <span v-if="s.estado !== 'todos'" class="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{{ s.estado }}</span>
            <span v-if="s.etiqueta !== 'todos'" class="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FEF9C3] text-[#C9A227] border border-amber-200">{{ s.etiqueta }}</span>
            <span v-if="s.ciudad !== 'todas'" class="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">{{ s.ciudad }}</span>
            <span v-if="s.responsable !== 'todos'" class="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FCE7F3] text-[#EC4899] border border-pink-200">{{ s.responsable }}</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <Users :size="13" class="text-[#2447F9]" />
              <span class="text-[13px] font-bold text-[#0F172A]">{{ s.total.toLocaleString('es-CO') }}</span>
              <span class="text-[11px] text-slate-400">contactos</span>
            </div>
            <div class="flex gap-1">
              <button @click="cargarSegmento(s)" class="h-7 px-2.5 rounded-lg border border-slate-200 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cargar</button>
              <button class="h-7 px-2.5 rounded-lg border border-slate-200 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                <Download :size="11" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
