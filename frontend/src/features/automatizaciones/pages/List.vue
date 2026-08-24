<script setup lang="ts">
import { ref } from 'vue'
import { Zap, Plus, Search, CheckCircle, XCircle } from 'lucide-vue-next'
import type { Automatizacion, AutomatizacionDraft } from '../types/automatizacion'
import { AUTOMATIZACION_DRAFT_VACIO } from '../constants/automatizaciones.constants'
import { useAutomatizaciones } from '../composables/useAutomatizaciones'
import AutomatizacionCard from '../components/AutomatizacionCard.vue'
import AutomatizacionFormDialog from '../dialogs/AutomatizacionFormDialog.vue'
import ConfirmarEliminarDialog from '../dialogs/ConfirmarEliminarDialog.vue'

const {
  buscar, filtroEstado,
  filtradas, totalActivas, totalEjecuciones, totalError,
  enviandoWebhook, errorWebhook,
  toggleActivo, eliminar, crearAutomatizacion, actualizarAutomatizacion,
} = useAutomatizaciones()

const modalVisible = ref(false)
const modalModo = ref<'nuevo' | 'editar'>('nuevo')
const editando = ref<Automatizacion | null>(null)
const draft = ref<AutomatizacionDraft>({ ...AUTOMATIZACION_DRAFT_VACIO })

const abrirNueva = () => {
  modalModo.value = 'nuevo'
  editando.value = null
  draft.value = { ...AUTOMATIZACION_DRAFT_VACIO }
  modalVisible.value = true
}
const abrirEditar = (a: Automatizacion) => {
  modalModo.value = 'editar'
  editando.value = a
  draft.value = { nombre: a.nombre, descripcion: a.descripcion, accion: a.accion, correos: a.correos, asunto: a.asunto, cuerpo: a.cuerpo }
  modalVisible.value = true
}
const guardar = async () => {
  if (modalModo.value === 'nuevo') {
    await crearAutomatizacion(draft.value)
  } else if (editando.value) {
    await actualizarAutomatizacion(editando.value.id, draft.value)
  }
  modalVisible.value = false
}

const confirmarEliminar = ref<Automatizacion | null>(null)
const eliminarConfirmado = () => {
  if (!confirmarEliminar.value) return
  eliminar(confirmarEliminar.value.id)
  confirmarEliminar.value = null
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-heading flex items-center gap-2">
          <Zap :size="20" class="text-[#C9A227]" />
          Automatizaciones
        </h2>
        <p class="text-[12px] text-body mt-0.5">
          Reglas de automatización de procesos comerciales y de marketing
        </p>
      </div>
      <button
        @click="abrirNueva"
        class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all"
      >
        <Plus :size="14" /> Nueva automatización
      </button>
    </div>

    <div v-if="errorWebhook" class="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-[12px] text-red-600 dark:text-red-400">
      {{ errorWebhook }}
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="surface-card rounded-2xl shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#D1FAE5] dark:bg-emerald-950/50 flex items-center justify-center mb-3">
          <CheckCircle :size="17" class="text-[#059669] dark:text-emerald-400" />
        </div>
        <div class="text-[28px] font-bold text-heading leading-none">{{ totalActivas }}</div>
        <div class="text-[11px] font-semibold text-subtle uppercase tracking-wide mt-1">Activas</div>
      </div>
      <div class="surface-card rounded-2xl shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#EEF2FF] dark:bg-blue-950/50 flex items-center justify-center mb-3">
          <Zap :size="17" class="text-[#2447F9] dark:text-blue-400" />
        </div>
        <div class="text-[28px] font-bold text-heading leading-none">{{ totalEjecuciones.toLocaleString('es-CO') }}</div>
        <div class="text-[11px] font-semibold text-subtle uppercase tracking-wide mt-1">Ejecuciones totales</div>
      </div>
      <div class="surface-card rounded-2xl shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center mb-3">
          <XCircle :size="17" class="text-red-500 dark:text-red-400" />
        </div>
        <div class="text-[28px] font-bold text-heading leading-none">{{ totalError }}</div>
        <div class="text-[11px] font-semibold text-subtle uppercase tracking-wide mt-1">Con errores</div>
      </div>
    </div>

    <div class="surface-card rounded-2xl shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            v-model="buscar"
            placeholder="Buscar por nombre o acción..."
            class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[12px] outline-none focus:border-[#2447F9] dark:focus:border-[#2447F9] focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
        </div>
        <select
          v-model="filtroEstado"
          class="h-9 px-3 rounded-lg input-surface text-[11px] font-medium outline-none cursor-pointer"
        >
          <option value="todos">Estado: Todos</option>
          <option value="Activa">Activa</option>
          <option value="Pausada">Pausada</option>
          <option value="Error">Error</option>
        </select>
      </div>
      <div class="mt-2 text-[11px] text-muted">
        Mostrando <strong class="text-body">{{ filtradas.length }}</strong> automatizaciones
      </div>
    </div>

    <div class="space-y-3">
      <AutomatizacionCard
        v-for="auto in filtradas"
        :key="auto.id"
        :automatizacion="auto"
        @toggle-activo="toggleActivo(auto)"
        @editar="abrirEditar(auto)"
        @eliminar="confirmarEliminar = auto"
      />

      <div v-if="filtradas.length === 0" class="surface-card rounded-2xl shadow-sm text-center py-16">
        <Zap :size="32" class="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <p class="text-[13px] font-semibold text-subtle">No hay automatizaciones</p>
        <p class="text-[11px] text-muted mt-1">Crea una nueva para automatizar tus procesos.</p>
        <button
          @click="abrirNueva"
          class="mt-4 flex items-center gap-1.5 h-9 px-5 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all mx-auto"
        >
          <Plus :size="13" /> Crear automatización
        </button>
      </div>
    </div>

    <AutomatizacionFormDialog v-model:visible="modalVisible" v-model:draft="draft" :modo="modalModo" :guardando="enviandoWebhook" @submit="guardar" />

    <ConfirmarEliminarDialog
      :automatizacion="confirmarEliminar"
      @confirmar="eliminarConfirmado"
      @cancelar="confirmarEliminar = null"
    />
  </div>
</template>
