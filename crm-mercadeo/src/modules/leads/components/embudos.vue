<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Building2, User, DollarSign, Calendar, GripVertical } from 'lucide-vue-next'

interface Tarjeta {
  id: number
  empresa: string
  contacto: string
  valor: string
  responsable: string
  seguimiento: string
  etapa: string
}

const etapas = ['Lead', 'Primer Contacto', 'Reunión', 'Cotización', 'Negociación', 'Ganado']

const etapaColor: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  'Lead':            { bg: '#F8FAFC', border: '#E2E8F0', text: '#64748B', dot: '#94A3B8' },
  'Primer Contacto': { bg: '#EEF2FF', border: '#C7D2FE', text: '#2447F9', dot: '#2447F9' },
  'Reunión':         { bg: '#FCE7F3', border: '#FBCFE8', text: '#EC4899', dot: '#EC4899' },
  'Cotización':      { bg: '#FEF9C3', border: '#FDE68A', text: '#C9A227', dot: '#C9A227' },
  'Negociación':     { bg: '#E8EAF6', border: '#C5CAE9', text: '#1A2A6C', dot: '#1A2A6C' },
  'Ganado':          { bg: '#D1FAE5', border: '#A7F3D0', text: '#059669', dot: '#059669' },
}

const tarjetas = ref<Tarjeta[]>([
  { id: 1, empresa: 'Tech Solutions',    contacto: 'Roberto Díaz',    valor: '$3.800.000',  responsable: 'Juan López',    seguimiento: '2026-07-05', etapa: 'Lead'            },
  { id: 2, empresa: 'Estética Mayo',     contacto: 'Ana Ruiz',        valor: '$12.000.000', responsable: 'Juan López',    seguimiento: '2026-07-03', etapa: 'Primer Contacto' },
  { id: 3, empresa: 'Grupo XYZ',         contacto: 'Sandra Morales',  valor: '$8.500.000',  responsable: 'Carlos Torres', seguimiento: '2026-07-02', etapa: 'Primer Contacto' },
  { id: 4, empresa: 'Farmacia Norte',    contacto: 'Laura Gómez',     valor: '$2.200.000',  responsable: 'María García',  seguimiento: '2026-07-04', etapa: 'Reunión'         },
  { id: 5, empresa: 'Innova Group',      contacto: 'Valentina Cruz',  valor: '$9.000.000',  responsable: 'Carlos Torres', seguimiento: '2026-07-01', etapa: 'Cotización'      },
  { id: 6, empresa: 'Global Tech',       contacto: 'Carlos Mendoza',  valor: '$18.000.000', responsable: 'María García',  seguimiento: '2026-07-06', etapa: 'Cotización'      },
  { id: 7, empresa: 'Constructora ABC',  contacto: 'Pedro Sánchez',   valor: '$5.500.000',  responsable: 'Carlos Torres', seguimiento: '2026-06-30', etapa: 'Negociación'     },
  { id: 8, empresa: 'SalvaTech',         contacto: 'Jorge Ramírez',   valor: '$22.000.000', responsable: 'María García',  seguimiento: '2026-07-08', etapa: 'Ganado'          },
])

// ── Drag & drop ───────────────────────────────────────────────────
const draggingId  = ref<number | null>(null)
const dropTarget  = ref('')

const onDragStart = (e: DragEvent, id: number) => {
  draggingId.value = id
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(id))
  }
}

const onDragEnd = () => {
  draggingId.value = null
  dropTarget.value = ''
}

const onDragOver = (e: DragEvent, etapa: string) => {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  dropTarget.value = etapa
}

const onDragLeave = (e: DragEvent) => {
  const el = e.currentTarget as HTMLElement
  if (!el.contains(e.relatedTarget as Node)) dropTarget.value = ''
}

const onDrop = (e: DragEvent, etapa: string) => {
  e.preventDefault()
  if (draggingId.value !== null) {
    const card = tarjetas.value.find(t => t.id === draggingId.value)
    if (card) card.etapa = etapa
  }
  draggingId.value = null
  dropTarget.value = ''
}

// ── Helpers ───────────────────────────────────────────────────────
const porEtapa = (etapa: string) => tarjetas.value.filter(t => t.etapa === etapa)

const valorEtapa = (etapa: string) => {
  const total = porEtapa(etapa).reduce((acc, t) => acc + parseFloat(t.valor.replace(/[^0-9]/g, '')), 0)
  return total > 0 ? '$' + total.toLocaleString('es-CO') : '$0'
}

const totalOportunidades = computed(() => tarjetas.value.length)
const totalValor = computed(() => {
  const t = tarjetas.value.reduce((acc, c) => acc + parseFloat(c.valor.replace(/[^0-9]/g, '')), 0)
  return '$' + t.toLocaleString('es-CO')
})

// ── Modal nueva tarjeta ───────────────────────────────────────────
const nuevaTarjetaEtapa = ref('')
const nuevaVisible      = ref(false)
const nuevaForm         = ref({ empresa: '', contacto: '', valor: '', responsable: '', seguimiento: '' })

const abrirNueva = (etapa: string) => {
  nuevaTarjetaEtapa.value = etapa
  Object.assign(nuevaForm.value, { empresa: '', contacto: '', valor: '', responsable: '', seguimiento: '' })
  nuevaVisible.value = true
}

const crearTarjeta = () => {
  if (!nuevaForm.value.empresa) return
  tarjetas.value.push({
    id: Date.now(),
    empresa:      nuevaForm.value.empresa,
    contacto:     nuevaForm.value.contacto,
    valor:        nuevaForm.value.valor || '$0',
    responsable:  nuevaForm.value.responsable,
    seguimiento:  nuevaForm.value.seguimiento,
    etapa:        nuevaTarjetaEtapa.value,
  })
  nuevaVisible.value = false
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          Embudos Comerciales
          <span class="bg-[#EEF2FF] text-[#2447F9] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ totalOportunidades }}</span>
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">
          Pipeline Kanban · arrastra las tarjetas para cambiar etapa · valor total:
          <strong class="text-[#0F172A]">{{ totalValor }}</strong>
        </p>
      </div>
      <button
        @click="abrirNueva('Lead')"
        class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all"
      >
        <Plus :size="14" /> Nueva tarjeta
      </button>
    </div>

    <!-- Kanban board -->
    <div class="flex gap-4 overflow-x-auto pb-4" style="min-height: 560px">
      <div
        v-for="etapa in etapas"
        :key="etapa"
        class="flex-shrink-0 w-64 flex flex-col gap-2 rounded-xl transition-all duration-150 p-1 -m-1"
        :class="dropTarget === etapa && draggingId !== null ? 'ring-2 ring-[#2447F9] ring-offset-1' : ''"
        @dragover="onDragOver($event, etapa)"
        @dragleave="onDragLeave($event)"
        @drop="onDrop($event, etapa)"
      >
        <!-- Column header -->
        <div
          class="flex items-center justify-between px-3 py-2 rounded-xl border"
          :style="{ backgroundColor: etapaColor[etapa].bg, borderColor: etapaColor[etapa].border }"
        >
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: etapaColor[etapa].dot }" />
            <span class="text-[11px] font-bold" :style="{ color: etapaColor[etapa].text }">{{ etapa }}</span>
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" :style="{ backgroundColor: etapaColor[etapa].dot }">
              {{ porEtapa(etapa).length }}
            </span>
          </div>
          <div class="text-[9px] font-bold text-slate-400">{{ valorEtapa(etapa) }}</div>
        </div>

        <!-- Drop zone hint -->
        <div
          v-if="dropTarget === etapa && draggingId !== null"
          class="flex-shrink-0 h-14 rounded-xl border-2 border-dashed border-[#2447F9] bg-[#EEF2FF]/60 flex items-center justify-center"
        >
          <span class="text-[11px] text-[#2447F9] font-semibold">Soltar aquí</span>
        </div>

        <!-- Cards -->
        <div class="flex flex-col gap-2 flex-1">
          <div
            v-for="t in porEtapa(etapa)"
            :key="t.id"
            :draggable="true"
            @dragstart="onDragStart($event, t.id)"
            @dragend="onDragEnd"
            class="bg-white rounded-xl border border-slate-200 shadow-sm p-3 transition-all select-none"
            :class="draggingId === t.id
              ? 'opacity-40 scale-[.97] shadow-none cursor-grabbing'
              : 'hover:shadow-md cursor-grab'"
          >
            <!-- Card header -->
            <div class="flex items-center justify-between mb-2">
              <div class="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[9px] font-bold" :style="{ backgroundColor: etapaColor[etapa].dot }">
                {{ t.empresa.split(' ').map(w => w[0]).slice(0, 2).join('') }}
              </div>
              <GripVertical :size="13" class="text-slate-300" />
            </div>

            <div class="text-[12px] font-bold text-[#0F172A] truncate flex items-center gap-1 mb-0.5">
              <Building2 :size="10" class="text-slate-400 flex-shrink-0" />{{ t.empresa }}
            </div>
            <div class="text-[10px] text-slate-400 flex items-center gap-1 mb-2">
              <User :size="9" />{{ t.contacto }}
            </div>

            <div class="flex items-center justify-between">
              <div class="text-[11px] font-bold text-[#0F172A] flex items-center gap-0.5">
                <DollarSign :size="10" class="text-emerald-500" />{{ t.valor.replace('$', '') }}
              </div>
              <div class="text-[9px] text-slate-400 flex items-center gap-1">
                <Calendar :size="9" />{{ t.seguimiento }}
              </div>
            </div>

            <div class="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5">
              <div class="w-4 h-4 rounded-full bg-[#EEF2FF] text-[#2447F9] text-[7px] font-bold flex items-center justify-center flex-shrink-0">
                {{ t.responsable.split(' ').map(n => n[0]).join('') }}
              </div>
              <span class="text-[9px] text-slate-400 truncate">{{ t.responsable }}</span>
            </div>
          </div>

          <!-- Add in column -->
          <button
            @click="abrirNueva(etapa)"
            class="flex items-center justify-center gap-1 w-full py-2 rounded-xl border border-dashed border-slate-300 text-slate-400 text-[11px] hover:border-[#2447F9] hover:text-[#2447F9] transition-all"
          >
            <Plus :size="12" /> Agregar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal nueva tarjeta -->
    <Teleport to="body">
      <div
        v-if="nuevaVisible"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        @click.self="nuevaVisible = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[14px] font-bold text-[#0F172A]">Nueva Tarjeta</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">Etapa: <strong>{{ nuevaTarjetaEtapa }}</strong></p>
            </div>
            <button @click="nuevaVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa *</label>
              <input v-model="nuevaForm.empresa" placeholder="Nombre empresa" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contacto</label>
              <input v-model="nuevaForm.contacto" placeholder="Nombre contacto" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Valor</label>
                <input v-model="nuevaForm.valor" placeholder="$0" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Seguimiento</label>
                <input v-model="nuevaForm.seguimiento" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Responsable</label>
              <select v-model="nuevaForm.responsable" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
                <option value="">Seleccionar</option>
                <option value="María García">María García</option>
                <option value="Juan López">Juan López</option>
                <option value="Carlos Torres">Carlos Torres</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
            <button @click="nuevaVisible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
            <button @click="crearTarjeta" class="h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">Crear tarjeta</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
