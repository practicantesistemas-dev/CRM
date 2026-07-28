<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, ClipboardList, CheckCircle, Loader2 } from 'lucide-vue-next'
import DatePicker from 'primevue/datepicker'
import type { Titular, Beneficiario, SeguimientoDraft, TipoSeguimiento } from '../types/plan-liga'
import { TIPO_SEG_META } from '../constants/plan-liga.constants'
import { registrarSeguimiento } from '../services/plan-liga.api'
import { seguimientoSchema } from '../schemas/seguimiento.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'
import BuscadorEntidad, { type OpcionBuscador } from '@/shared/components/BuscadorEntidad.vue'
import { getOportunidades } from '@/features/oportunidades/services/oportunidades.api'

// beneficiario: cuando se registra el seguimiento desde un beneficiario puntual (no el
// titular). El endpoint de bitácora solo tiene titular_id, así que el seguimiento siempre
// queda ligado al titular; el nombre del beneficiario se antepone a la descripción.
const props = defineProps<{ titular: Titular | null; beneficiario?: Beneficiario | null }>()
const visible = defineModel<boolean>('visible', { required: true })

const segGuardado = ref(false)
const guardando = ref(false)
const error = ref<string | null>(null)
const formSeg = ref<SeguimientoDraft>({
  tipo: 'Nota', accion: '', proximoPaso: '', fecha: new Date().toISOString().split('T')[0], oportunidadId: null,
})

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(seguimientoSchema, formSeg)

// El DatePicker trabaja con Date; formSeg.fecha se maneja como string 'YYYY-MM-DD'.
const formatFechaLocal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const parseFechaLocal = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
const fechaSeg = computed<Date>({
  get: () => parseFechaLocal(formSeg.value.fecha),
  set: (d) => { formSeg.value.fecha = formatFechaLocal(d) },
})
const hoy = new Date()

const opcionesOportunidades = computed<OpcionBuscador[]>(() =>
  getOportunidades()
    .filter(o => o.planLigaTitularId === props.titular?.id)
    .map(o => ({ id: o.id, label: o.servicio, sublabel: `${o.estado} · ${o.valor}` })),
)

watch(visible, (v) => {
  if (!v) return
  formSeg.value = { tipo: 'Nota', accion: '', proximoPaso: '', fecha: new Date().toISOString().split('T')[0], oportunidadId: null }
  segGuardado.value = false
  error.value = null
})

const guardarSeguimiento = onValidSubmit(async () => {
  if (!props.titular) return
  guardando.value = true
  error.value = null
  try {
    await registrarSeguimiento(props.titular, formSeg.value, props.beneficiario?.nombre)
    segGuardado.value = true
    setTimeout(() => { visible.value = false; segGuardado.value = false }, 1200)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo registrar el seguimiento.'
  } finally {
    guardando.value = false
  }
})
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="visible = false">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
        <div>
          <h3 class="text-[14px] font-bold text-[#0F172A] flex items-center gap-2"><ClipboardList :size="15" class="text-[#059669]" />Registrar seguimiento</h3>
          <p class="text-[11px] text-slate-400 mt-0.5">
            <template v-if="props.beneficiario">{{ props.beneficiario.nombre }} · Beneficiario de {{ props.titular?.nombre }}</template>
            <template v-else>{{ props.titular?.nombre }} · {{ props.titular?.empresa }}</template>
          </p>
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
          <DatePicker
            v-model="fechaSeg"
            :min-date="hoy"
            date-format="dd/mm/yy"
            show-icon
            icon-display="input"
            fluid
            placeholder="Selecciona una fecha"
            input-class="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-[12px] font-medium text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 focus:bg-white transition-all"
          />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Oportunidad relacionada (opcional)</label>
          <BuscadorEntidad
            v-model="formSeg.oportunidadId"
            :opciones="opcionesOportunidades"
            placeholder="Buscar oportunidad de este titular..."
            vacio="Este titular aún no tiene oportunidades asociadas"
          />
        </div>
        <p v-if="error" class="text-[11px] text-red-600 font-medium">{{ error }}</p>
      </div>
      <div v-if="!segGuardado" class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
        <button @click="visible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
        <button @click="guardarSeguimiento" :disabled="guardando"
          class="flex items-center gap-1.5 h-9 px-6 rounded-lg bg-[#059669] text-white text-[11px] font-bold shadow hover:bg-[#047857] disabled:opacity-60 disabled:cursor-not-allowed transition-all">
          <Loader2 v-if="guardando" :size="12" class="animate-spin" />
          Guardar en Bitácora
        </button>
      </div>
    </div>
  </div>
</template>
