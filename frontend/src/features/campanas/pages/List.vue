<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import type { Campana, CampanaDraft } from '../types/campana'
import { CAMPANA_DRAFT_VACIO, HTML_EDITOR_DEFAULT } from '../constants/campanas.constants'
import { useCampanas } from '../composables/useCampanas'
import KpiResumenCampanas from '../components/KpiResumenCampanas.vue'
import CampanaListItem from '../components/CampanaListItem.vue'
import CampanaFormDialog from '../dialogs/CampanaFormDialog.vue'
import EditorCampanaDialog from '../dialogs/EditorCampanaDialog.vue'

const {
  campanas, totalEnviados, totalAperturas, totalClics, totalRebotes,
  crearCampana,
} = useCampanas()

const modalVisible = ref(false)
const draft = ref<CampanaDraft>({ ...CAMPANA_DRAFT_VACIO })

const abrirNuevo = () => {
  draft.value = { ...CAMPANA_DRAFT_VACIO }
  modalVisible.value = true
}
const confirmarCreacion = () => {
  if (!draft.value.nombre) return
  crearCampana(draft.value)
  modalVisible.value = false
}

const modalEditorVisible = ref(false)
const campanaActiva = ref<Campana | null>(null)
const htmlEditor = ref(HTML_EDITOR_DEFAULT)

const abrirEditor = (c: Campana) => {
  campanaActiva.value = c
  htmlEditor.value = HTML_EDITOR_DEFAULT
  modalEditorVisible.value = true
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          Campañas Masivas
          <span class="bg-[#EEF2FF] text-[#2447F9] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ campanas.length }}</span>
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Envíos masivos por segmento · métricas de apertura y clics</p>
      </div>
      <button @click="abrirNuevo" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
        <Plus :size="14" /> Nueva campaña
      </button>
    </div>

    <KpiResumenCampanas
      :total-enviados="totalEnviados"
      :total-aperturas="totalAperturas"
      :total-clics="totalClics"
      :total-rebotes="totalRebotes"
    />

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-100">
        <h3 class="text-[13px] font-bold text-[#0F172A]">Todas las campañas</h3>
      </div>
      <div class="divide-y divide-slate-100">
        <CampanaListItem
          v-for="c in campanas"
          :key="c.id"
          :campana="c"
          @editar="abrirEditor(c)"
        />
      </div>
    </div>

    <CampanaFormDialog v-model:visible="modalVisible" v-model:draft="draft" @submit="confirmarCreacion" />

    <EditorCampanaDialog v-model:visible="modalEditorVisible" v-model:html="htmlEditor" :campana="campanaActiva" />
  </div>
</template>
