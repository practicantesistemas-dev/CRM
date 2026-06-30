<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Search, Plus, Download, X, Edit2, Mail, Phone } from 'lucide-vue-next'

interface Proveedor {
  id: number
  nombre: string
  categoria: string
  nit: string
  correo: string
  telefono: string
  estado: 'Activo' | 'Inactivo'
}

const proveedores = ref<Proveedor[]>([
  { id: 1, nombre: 'MediSupply S.A.S', categoria: 'Insumos Médicos', nit: '900.111.222-3', correo: 'ventas@medisupply.com', telefono: '604-555-1234', estado: 'Activo' },
  { id: 2, nombre: 'PrintMax Colombia', categoria: 'Material POP', nit: '800.333.444-5', correo: 'info@printmax.co', telefono: '601-777-8888', estado: 'Activo' },
  { id: 3, nombre: 'Tech Rental Andina', categoria: 'Equipos Tecnológicos', nit: '830.555.666-7', correo: 'alquileres@techrent.co', telefono: '310-222-3333', estado: 'Inactivo' },
  { id: 4, nombre: 'Catering Eventos Plus', categoria: 'Alimentación', nit: '900.777.888-1', correo: 'eventos@cateringplus.co', telefono: '315-444-5555', estado: 'Activo' },
  { id: 5, nombre: 'Logística Eje Cafetero', categoria: 'Transporte', nit: '811.999.000-6', correo: 'ops@logisticaeje.co', telefono: '316-888-9900', estado: 'Activo' },
])

const buscar = ref('')
const filtroEstado = ref('todos')
const filtroCategoria = ref('todas')

const proveedoresFiltrados = computed(() =>
  proveedores.value.filter(p => {
    const q = buscar.value.toLowerCase()
    const matchBuscar = !q || [p.nombre, p.nit, p.correo, p.categoria].some(f => f.toLowerCase().includes(q))
    return matchBuscar
      && (filtroEstado.value === 'todos' || p.estado === filtroEstado.value)
      && (filtroCategoria.value === 'todas' || p.categoria === filtroCategoria.value)
  })
)

const categorias = computed(() => [...new Set(proveedores.value.map(p => p.categoria))].sort())

const modalVisible = ref(false)
const modalModo = ref<'nuevo' | 'editar'>('nuevo')
const proveedorEditando = ref<Proveedor | null>(null)
const formVacio = { nombre: '', categoria: '', nit: '', correo: '', telefono: '', estado: 'Activo' as const }
const form = reactive({ ...formVacio })

const abrirNuevo = () => { modalModo.value = 'nuevo'; Object.assign(form, formVacio); modalVisible.value = true }
const abrirEditar = (p: Proveedor) => { modalModo.value = 'editar'; proveedorEditando.value = p; Object.assign(form, p); modalVisible.value = true }

const guardar = () => {
  if (!form.nombre) return
  if (modalModo.value === 'nuevo') {
    proveedores.value.unshift({ ...form, id: Date.now() })
  } else if (proveedorEditando.value) {
    const idx = proveedores.value.findIndex(p => p.id === proveedorEditando.value!.id)
    if (idx !== -1) proveedores.value[idx] = { ...form, id: proveedorEditando.value.id }
  }
  modalVisible.value = false
}

const categoriaColor = (cat: string) => {
  const map: Record<string, string> = {
    'Insumos Médicos':     'text-[#065F46]',
    'Material POP':        'text-[#1E3A8A]',
    'Equipos Tecnológicos':'text-[#1A2A6C]',
    'Alimentación':        'text-[#92400E]',
    'Transporte':          'text-[#9D174D]',
  }
  return map[cat] ?? 'text-slate-500'
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          Gestión de Proveedores
          <span class="bg-[#EEF2FF] text-[#2447F9] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ proveedores.length }}</span>
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Proveedores registrados por categoría y estado</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Download :size="13" /> Exportar
        </button>
        <button @click="abrirNuevo" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
          <Plus :size="14" /> Nuevo proveedor
        </button>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="buscar" placeholder="Buscar por nombre, NIT, correo o categoría..." class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
        </div>
        <div class="flex items-center gap-2">
          <select v-model="filtroEstado" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Estado: Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          <select v-model="filtroCategoria" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todas">Categoría: Todas</option>
            <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>
      <div class="mt-2 text-[11px] text-slate-400">
        Mostrando <strong class="text-slate-600">{{ proveedoresFiltrados.length }}</strong> proveedores
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[820px]">
          <thead class="bg-[#F8FAFC] border-b border-slate-200">
            <tr>
              <th class="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Proveedor</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">NIT</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Correo</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Teléfono</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
              <th class="text-right px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="p in proveedoresFiltrados" :key="p.id" class="hover:bg-slate-50/60 transition-colors group">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-[#D1FAE5] text-[#059669] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                    {{ p.nombre.split(' ').map(w => w[0]).slice(0, 2).join('') }}
                  </div>
                  <span class="text-[12px] font-semibold text-[#0F172A]">{{ p.nombre }}</span>
                </div>
              </td>
              <td class="px-4 py-3.5">
                <span class="text-[11px] font-semibold" :class="categoriaColor(p.categoria)">{{ p.categoria }}</span>
              </td>
              <td class="px-4 py-3.5 text-[11px] text-slate-600 font-medium">{{ p.nit }}</td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1 text-[11px] text-slate-600"><Mail :size="10" class="text-slate-400" />{{ p.correo }}</div>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1 text-[11px] text-slate-600"><Phone :size="10" class="text-slate-400" />{{ p.telefono }}</div>
              </td>
              <td class="px-4 py-3.5">
                <span class="text-[11px] font-semibold" :class="p.estado === 'Activo' ? 'text-emerald-600' : 'text-slate-400'">{{ p.estado }}</span>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="abrirEditar(p)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 flex items-center justify-center transition-all" title="Editar">
                    <Edit2 :size="12" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="proveedoresFiltrados.length === 0">
              <td colspan="7" class="text-center py-16 text-slate-400 text-[12px]">No se encontraron proveedores.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="modalVisible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="modalVisible = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[14px] font-bold text-[#0F172A]">{{ modalModo === 'nuevo' ? 'Nuevo Proveedor' : 'Editar Proveedor' }}</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">Complete los campos requeridos</p>
            </div>
            <button @click="modalVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre *</label>
                <input v-model="form.nombre" placeholder="Nombre del proveedor" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Categoría</label>
                <input v-model="form.categoria" placeholder="Ej: Insumos Médicos" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">NIT</label>
                <input v-model="form.nit" placeholder="900.000.000-0" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Correo</label>
                <input v-model="form.correo" type="email" placeholder="correo@proveedor.com" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Teléfono</label>
                <input v-model="form.telefono" placeholder="300-000-0000" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
                <select v-model="form.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
            <button @click="modalVisible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
            <button @click="guardar" class="h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
              {{ modalModo === 'nuevo' ? 'Crear proveedor' : 'Guardar cambios' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
