<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, ClipboardList, CheckCircle } from 'lucide-vue-next'
import type { Titular, SeguimientoDraft, TipoSeguimiento } from '../types/plan-liga'
import { TIPO_SEG_META } from '../constants/plan-liga.constants'
import { seguimientoSchema } from '../schemas/seguimiento.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'

const props = defineProps<{ titular: Titular | null }>()
const visible = defineModel<boolean>('visible', { required: true })

const segGuardado = ref(false)
const formSeg = ref<SeguimientoDraft>({
  tipo: 'Nota', accion: '', proximoPaso: '', fecha: new Date().toISOString().split('T')[0],
})

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(seguimientoSchema, formSeg)

watch(visible, (v) => {
  if (!v) return
  formSeg.value = { tipo: 'Nota', accion: '', proximoPaso: '', fecha: new Date().toISOString().split('T')[0] }
  segGuardado.value = false
})

const guardarSeguimiento = onValidSubmit(() => {
  segGuardado.value = true
  setTimeout(() => { visible.value = false; segGuardado.value = false }, 1200)
})
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="visible = false">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
        <div>
          <h3 class="text-[14px] font-bold text-[#0F172A] flex items-center gap-2"><ClipboardList :size="15" class="text-[#059669]" />Registrar seguimiento</h3>
          <p class="text-[11px] text-slate-400 mt-0.5">{{ props.titular?.nombre }} · {{ props.titular?.empresa }}</p>
        </div>
        <button @click="visible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
      </div>
      <div v-if="segGuardado" class="p-8 text-center">
        <CheckCircle :size="36" class="text-[#059669] mx-auto mb-3" />
        <p class="text-[13px] font-bold text-[#0F172A]">Seguimiento registrado</p>
        <p class="text-[11px] text-slate-400 mt-1">Se guardó en la Bitácora de Relacionamiento</p>
      </div>
      <div v-else class="p-6 space-y-4">
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-2 uppercase tracking-wide">Tipo de actividad</label>
          <div class="flex flex-wrap gap-2">
            <button v-for="(meta, tipo) in TIPO_SEG_META" :key="tipo" @click="formSeg.tipo = tipo as TipoSeguimiento"
              class="flex items-center gap-1.5 h-8 px-3 rounded-lg border text-[11px] font-semibold transition-all"
              :class="formSeg.tipo === tipo ? 'text-white border-transparent shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'"
              :style="formSeg.tipo === tipo ? { backgroundColor: meta.color } : {}">
              <component :is="meta.icono" :size="12" />{{ tipo }}
            </button>
          </div>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">¿Qué se hizo? *</label>
          <textarea v-model="formSeg.accion" @blur="tocar('accion')" rows="3" placeholder="Describe la actividad realizada..."
            class="w-full px-4 py-2.5 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all resize-none"
            :class="fieldStateClass(esVisible('accion') && !!errors.accion, esVisible('accion') && !errors.accion && !!formSeg.accion, 'border-slate-200 focus:border-[#059669]')" />
          <FieldError :message="esVisible('accion') ? errors.accion : undefined" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Próximo paso</label>
          <input v-model="formSeg.proximoPaso" placeholder="¿Qué sigue? (opcional)" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#059669] focus:bg-white transition-all" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha</label>
          <input v-model="formSeg.fecha" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#059669] focus:bg-white transition-all" />
        </div>
      </div>
      <div v-if="!segGuardado" class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
        <button @click="visible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
        <button @click="guardarSeguimiento" class="h-9 px-6 rounded-lg bg-[#059669] text-white text-[11px] font-bold shadow hover:bg-[#047857] transition-all">Guardar en Bitácora</button>
      </div>
    </div>
  </div>
</template>
