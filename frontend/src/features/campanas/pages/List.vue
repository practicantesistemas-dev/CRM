<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Megaphone, FileCode2 } from 'lucide-vue-next'
import type { Campana, CampanaDraft } from '../types/campana'
import type { Plantilla, PlantillaDraft } from '../types/plantilla'
import { CAMPANA_DRAFT_VACIO, HTML_EDITOR_DEFAULT } from '../constants/campanas.constants'
import { useCampanas } from '../composables/useCampanas'
import { usePlantillas } from '../composables/usePlantillas'
import { permisosDeModulo } from '@/features/auth/composables/useAuth'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'
import KpiResumenCampanas from '../components/KpiResumenCampanas.vue'
import CampanaListItem from '../components/CampanaListItem.vue'
import PlantillaListItem from '../components/PlantillaListItem.vue'
import CampanaFormDialog from '../dialogs/CampanaFormDialog.vue'
import EditorCampanaDialog from '../dialogs/EditorCampanaDialog.vue'
import EditorPlantillaDialog from '../dialogs/EditorPlantillaDialog.vue'
import EnviarPlantillaDialog from '../dialogs/EnviarPlantillaDialog.vue'

// "gestionar" cubre crear y editar; no hay accion "eliminar" real en backend.
const { gestionar: puedeGestionar } = permisosDeModulo('campanas')

const {
  campanas, totalEnviados, totalAperturas, totalClics, totalRebotes, crearCampana,
} = useCampanas()
const { plantillas, crear, actualizar, duplicar, eliminar } = usePlantillas()

const tab = ref<'campanas' | 'plantillas'>('plantillas')

// ── Campañas (flujo existente) ───────────────────────────────────────
const modalVisible = ref(false)
const draft = ref<CampanaDraft>({ ...CAMPANA_DRAFT_VACIO })
const abrirNuevo = () => { draft.value = { ...CAMPANA_DRAFT_VACIO }; modalVisible.value = true }
const confirmarCreacion = () => { crearCampana(draft.value); modalVisible.value = false }

const modalEditorVisible = ref(false)
const campanaActiva = ref<Campana | null>(null)
const htmlEditor = ref(HTML_EDITOR_DEFAULT)
const abrirEditor = (c: Campana) => {
  campanaActiva.value = c
  htmlEditor.value = HTML_EDITOR_DEFAULT
  modalEditorVisible.value = true
}

// ── Plantillas (editor visual + envío) ───────────────────────────────
const editorPlantillaVisible = ref(false)
const plantillaEditando = ref<Plantilla | null>(null)
// Última plantilla creada/guardada: define a quién actualizar y qué enviar.
const plantillaGuardada = ref<Plantilla | null>(null)

const abrirEditorPlantilla = (p: Plantilla | null) => {
  plantillaEditando.value = p
  plantillaGuardada.value = p
  editorPlantillaVisible.value = true
}

const guardarPlantilla = (d: PlantillaDraft) => {
  const p = plantillaEditando.value
    ? actualizar(plantillaEditando.value.id, d)
    : crear(d)
  if (p) {
    plantillaEditando.value = p   // pasa a modo "editar" tras el primer guardado
    plantillaGuardada.value = p
  }
}

const enviarVisible = ref(false)
const payloadEnvio = computed(() =>
  plantillaGuardada.value
    ? { nombre: plantillaGuardada.value.nombre, asunto: plantillaGuardada.value.asunto, html: plantillaGuardada.value.html }
    : null,
)
const abrirEnvio = (p: Plantilla) => { plantillaGuardada.value = p; enviarVisible.value = true }
const onEnviarDesdeEditor = () => { enviarVisible.value = true }

// Eliminar
const confirmEliminarVisible = ref(false)
const plantillaAEliminar = ref<Plantilla | null>(null)
const pedirEliminar = (p: Plantilla) => { plantillaAEliminar.value = p; confirmEliminarVisible.value = true }
const confirmarEliminar = () => {
  if (plantillaAEliminar.value) eliminar(plantillaAEliminar.value.id)
  plantillaAEliminar.value = null
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-heading flex items-center gap-2">
          Campañas
          <span class="bg-[#EEF2FF] dark:bg-blue-950/50 text-[#2447F9] dark:text-blue-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {{ tab === 'campanas' ? campanas.length : plantillas.length }}
          </span>
        </h2>
        <p class="text-[12px] text-body mt-0.5">Plantillas de correo con editor visual · envíos y métricas</p>
      </div>
      <button
        v-if="puedeGestionar"
        @click="tab === 'campanas' ? abrirNuevo() : abrirEditorPlantilla(null)"
        class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all"
      >
        <Plus :size="14" /> {{ tab === 'campanas' ? 'Nueva campaña' : 'Nueva plantilla' }}
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 border-b border-default">
      <button
        @click="tab = 'plantillas'"
        class="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-bold border-b-2 -mb-px transition-all"
        :class="tab === 'plantillas' ? 'border-[#2447F9] text-[#2447F9] dark:text-blue-300' : 'border-transparent text-muted hover:text-body'"
      ><FileCode2 :size="13" /> Plantillas</button>
      <button
        @click="tab = 'campanas'"
        class="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-bold border-b-2 -mb-px transition-all"
        :class="tab === 'campanas' ? 'border-[#2447F9] text-[#2447F9] dark:text-blue-300' : 'border-transparent text-muted hover:text-body'"
      ><Megaphone :size="13" /> Envíos</button>
    </div>

    <!-- ── Plantillas ── -->
    <template v-if="tab === 'plantillas'">
      <div class="surface-card rounded-2xl shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 class="text-[13px] font-bold text-heading">Plantillas de correo</h3>
          <p class="text-[11px] text-muted mt-0.5">Se guardan en este navegador. Edítalas con el editor visual, descárgalas o envíalas.</p>
        </div>
        <div v-if="plantillas.length" class="divide-y divide-slate-100 dark:divide-slate-700">
          <PlantillaListItem
            v-for="p in plantillas"
            :key="p.id"
            :plantilla="p"
            @editar="abrirEditorPlantilla(p)"
            @enviar="abrirEnvio(p)"
            @duplicar="duplicar(p.id)"
            @eliminar="pedirEliminar(p)"
          />
        </div>
        <div v-else class="px-5 py-12 text-center text-[12px] text-muted">
          Aún no hay plantillas. Crea la primera con “Nueva plantilla”.
        </div>
      </div>
    </template>

    <!-- ── Envíos (campañas) ── -->
    <template v-else>
      <KpiResumenCampanas
        :total-enviados="totalEnviados"
        :total-aperturas="totalAperturas"
        :total-clics="totalClics"
        :total-rebotes="totalRebotes"
      />
      <div class="surface-card rounded-2xl shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 class="text-[13px] font-bold text-heading">Todas las campañas</h3>
        </div>
        <div class="divide-y divide-slate-100 dark:divide-slate-700">
          <CampanaListItem v-for="c in campanas" :key="c.id" :campana="c" @editar="abrirEditor(c)" />
        </div>
      </div>
    </template>

    <!-- Diálogos campañas -->
    <CampanaFormDialog v-model:visible="modalVisible" v-model:draft="draft" @submit="confirmarCreacion" />
    <EditorCampanaDialog v-model:visible="modalEditorVisible" v-model:html="htmlEditor" :campana="campanaActiva" />

    <!-- Diálogos plantillas -->
    <EditorPlantillaDialog
      v-model:visible="editorPlantillaVisible"
      :plantilla="plantillaEditando"
      @submit="guardarPlantilla"
      @enviar="onEnviarDesdeEditor"
    />
    <EnviarPlantillaDialog v-model:visible="enviarVisible" :plantilla="payloadEnvio" />

    <ConfirmDialog
      v-model:visible="confirmEliminarVisible"
      titulo="Eliminar plantilla"
      :mensaje="`Se eliminará la plantilla “${plantillaAEliminar?.nombre ?? ''}”. Esta acción no se puede deshacer.`"
      texto-confirmar="Eliminar"
      texto-cancelar="Cancelar"
      @confirmar="confirmarEliminar"
    />
  </div>
</template>
