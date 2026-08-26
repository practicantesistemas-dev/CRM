<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Loader2, AlertCircle, Plus, Edit2, Trash2, Search } from 'lucide-vue-next'
import type { Proveedor } from '../types/proveedor'
import type { ActividadServicio, ActividadServicioDraft } from '../types/actividadServicio'
import { useActividadesProveedor } from '../composables/useActividadesProveedor'
import ActividadServicioFormDialog from './ActividadServicioFormDialog.vue'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'
import { permisosDeModulo } from '@/features/auth/composables/useAuth'

// Las actividades no tienen modulo de permisos propio: cuelgan de proveedores.
const { gestionar: puedeGestionar, eliminar: puedeEliminar } = permisosDeModulo('proveedores')

const props = defineProps<{ proveedor: Proveedor | null }>()
const visible = defineModel<boolean>('visible', { required: true })

const {
  actividades, cargando, error, cargar,
  crear, actualizar, guardando, errorGuardar,
  eliminar,
} = useActividadesProveedor()

const ACTIVIDAD_DRAFT_VACIO = (proveedorId: number): ActividadServicioDraft => ({
  proveedorId, nombre: '', cantidad: 0, precio: 0, descripcion: '',
})

const buscar = ref('')

// Cada vez que se abre el drawer con un proveedor distinto, recarga sus actividades
// (sin búsqueda: solo las 4 más recientes).
watch([visible, () => props.proveedor], ([v, p]) => {
  if (v && p) {
    buscar.value = ''
    cargar(p.id)
  }
})

// La búsqueda se debounce para no disparar una petición por cada tecla; al buscar se
// levanta el límite de 4 para poder encontrar cualquier actividad del proveedor.
let busquedaTimeout: ReturnType<typeof setTimeout> | undefined
watch(buscar, (q) => {
  if (!props.proveedor) return
  clearTimeout(busquedaTimeout)
  busquedaTimeout = setTimeout(() => cargar(props.proveedor!.id, q || undefined), 350)
})

const modalVisible = ref(false)
const modalModo = ref<'nuevo' | 'editar'>('nuevo')
const actividadEditando = ref<ActividadServicio | null>(null)
const draft = ref<ActividadServicioDraft>(ACTIVIDAD_DRAFT_VACIO(0))

const abrirNuevo = () => {
  if (!props.proveedor) return
  modalModo.value = 'nuevo'
  actividadEditando.value = null
  draft.value = ACTIVIDAD_DRAFT_VACIO(props.proveedor.id)
  modalVisible.value = true
}
const abrirEditar = (a: ActividadServicio) => {
  modalModo.value = 'editar'
  actividadEditando.value = a
  draft.value = { proveedorId: a.proveedorId, nombre: a.nombre, cantidad: a.cantidad, precio: a.precio, descripcion: a.descripcion }
  modalVisible.value = true
}
const guardar = async () => {
  const ok = modalModo.value === 'nuevo'
    ? await crear(draft.value)
    : actividadEditando.value ? await actualizar(actividadEditando.value.id, draft.value) : false
  if (ok) modalVisible.value = false
}

const confirmBorrarVisible = ref(false)
const actividadABorrar = ref<ActividadServicio | null>(null)
const pedirBorrar = (a: ActividadServicio) => {
  actividadABorrar.value = a
  confirmBorrarVisible.value = true
}
const confirmarBorrado = async () => {
  if (actividadABorrar.value) await eliminar(actividadABorrar.value.id)
  actividadABorrar.value = null
}

const formatoMoneda = (n: number) => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[9999]">
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
    <div class="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl flex flex-col z-10">
      <div class="flex items-center justify-between px-5 py-4 border-b border-default surface-header">
        <div>
          <h3 class="text-[13px] font-bold text-heading">Actividades del proveedor</h3>
          <p class="text-[11px] text-muted">{{ proveedor?.nombre }}</p>
        </div>
        <button @click="visible = false" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400"><X :size="14" /></button>
      </div>

      <div class="px-5 pt-4 space-y-3">
        <div class="relative">
          <Search :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input v-model="buscar" placeholder="Buscar por nombre o descripción..."
            class="w-full h-9 pl-8 pr-3 rounded-lg input-surface text-[12px] outline-none focus:border-[#2447F9] focus:bg-white dark:focus:bg-slate-800 transition-all" />
        </div>
        <button v-if="puedeGestionar" @click="abrirNuevo" class="w-full flex items-center justify-center gap-1.5 h-9 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
          <Plus :size="14" /> Nueva actividad
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-5 space-y-3">
        <p v-if="!buscar" class="text-[10px] text-muted -mt-1 mb-1">Mostrando las 4 más recientes. Busca para ver el resto.</p>
        <div v-if="cargando" class="flex items-center justify-center gap-2 text-[11px] text-muted py-8">
          <Loader2 :size="14" class="animate-spin" /> Cargando actividades...
        </div>
        <div v-else-if="error" class="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2">
          <AlertCircle :size="13" class="text-red-500 dark:text-red-400 shrink-0" />
          <p class="text-[11px] text-red-600 dark:text-red-400 font-medium">{{ error }}</p>
        </div>
        <p v-else-if="actividades.length === 0 && buscar" class="text-center text-[11px] text-muted py-8">No se encontraron actividades para "{{ buscar }}".</p>
        <p v-else-if="actividades.length === 0" class="text-center text-[11px] text-muted py-8">Este proveedor aún no tiene actividades registradas.</p>
        <template v-else>
          <div v-for="a in actividades" :key="a.id" class="surface-sunken rounded-xl p-3.5 group">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="text-[12px] font-semibold text-heading truncate">{{ a.nombre }}</p>
                <p v-if="a.descripcion" class="text-[11px] text-subtle mt-0.5">{{ a.descripcion }}</p>
                <div class="flex items-center gap-3 mt-1.5 text-[10px] text-muted font-medium">
                  <span>Cantidad: {{ a.cantidad }}</span>
                  <span>Precio: {{ formatoMoneda(a.precio) }}</span>
                </div>
              </div>
              <div class="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button v-if="puedeGestionar" @click="abrirEditar(a)" class="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 hover:bg-[#EEF2FF] dark:hover:bg-blue-950/50 hover:text-[#2447F9] dark:hover:text-blue-400 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all" title="Editar">
                  <Edit2 :size="11" />
                </button>
                <button v-if="puedeEliminar" @click="pedirBorrar(a)" class="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all" title="Eliminar">
                  <Trash2 :size="11" />
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <ActividadServicioFormDialog
      v-model:visible="modalVisible"
      v-model:draft="draft"
      :modo="modalModo"
      :guardando="guardando"
      :error="errorGuardar"
      @submit="guardar"
    />

    <ConfirmDialog
      v-model:visible="confirmBorrarVisible"
      titulo="Eliminar actividad"
      :mensaje="`¿Eliminar la actividad ${actividadABorrar?.nombre}? Esta acción no se puede deshacer.`"
      @confirmar="confirmarBorrado"
    />
  </div>
</template>
