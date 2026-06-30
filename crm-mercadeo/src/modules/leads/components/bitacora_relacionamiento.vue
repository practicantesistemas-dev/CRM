<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Phone, Mail, Calendar, MessageCircle, FileText, Plus, X, Filter } from 'lucide-vue-next'

type TipoActividad = 'Llamada' | 'Correo' | 'Reunión' | 'WhatsApp' | 'Nota'

interface Actividad {
  id: number
  tipo: TipoActividad
  contacto: string
  empresa: string
  accion: string
  proximoPaso: string
  fecha: string
  usuario: string
}

const tipoMeta: Record<TipoActividad, { icono: any; color: string; bg: string }> = {
  'Llamada':  { icono: Phone,         color: '#2447F9', bg: '#EEF2FF' },
  'Correo':   { icono: Mail,          color: '#EC4899', bg: '#FCE7F3' },
  'Reunión':  { icono: Calendar,      color: '#C9A227', bg: '#FEF9C3' },
  'WhatsApp': { icono: MessageCircle, color: '#059669', bg: '#D1FAE5' },
  'Nota':     { icono: FileText,      color: '#1A2A6C', bg: '#E8EAF6' },
}

const actividades = ref<Actividad[]>([
  { id: 1, tipo: 'Llamada',  contacto: 'Carlos Mendoza',    empresa: 'Global Tech S.A.S',     accion: 'Seguimiento propuesta Plan Liga 50 empleados', proximoPaso: 'Enviar cotización ajustada',    fecha: '2026-06-28', usuario: 'María García'  },
  { id: 2, tipo: 'Correo',   contacto: 'Ana Victoria Ruiz', empresa: 'Estética Mayo',          accion: 'Envío de propuesta comercial con tarifas 2026', proximoPaso: 'Llamada de cierre el lunes',   fecha: '2026-06-27', usuario: 'Juan López'    },
  { id: 3, tipo: 'Reunión',  contacto: 'Pedro Sánchez',     empresa: 'Constructora ABC',       accion: 'Presentación servicios brigada de salud Q3',    proximoPaso: 'Enviar acta de reunión',        fecha: '2026-06-26', usuario: 'Carlos Torres' },
  { id: 4, tipo: 'WhatsApp', contacto: 'Laura Gómez',       empresa: 'Farmacia Norte',         accion: 'Confirmación agenda tamizaje semana del 7/jul', proximoPaso: 'Coordinar con logística',       fecha: '2026-06-25', usuario: 'María García'  },
  { id: 5, tipo: 'Nota',     contacto: 'Roberto Díaz',      empresa: 'Tech Solutions',         accion: 'Cliente interesado plan empresarial Q4 2026',   proximoPaso: 'Recordar en agosto',            fecha: '2026-06-24', usuario: 'Juan López'    },
  { id: 6, tipo: 'Llamada',  contacto: 'Sandra Morales',    empresa: 'Grupo Empresarial XYZ',  accion: 'Negociación condiciones pago semestral',        proximoPaso: 'Consultar gerencia descuento',  fecha: '2026-06-23', usuario: 'Carlos Torres' },
  { id: 7, tipo: 'Correo',   contacto: 'Valentina Cruz',    empresa: 'Innova Group',           accion: 'Bienvenida al Plan Liga Empresarial',           proximoPaso: 'Programar kick-off',            fecha: '2026-06-22', usuario: 'María García'  },
  { id: 8, tipo: 'Reunión',  contacto: 'Jorge Ramírez',     empresa: 'SalvaTech',              accion: 'Primer contacto presencial en sede cliente',    proximoPaso: 'Enviar brochure digital',       fecha: '2026-06-20', usuario: 'Juan López'    },
])

const filtroTipo = ref<TipoActividad | 'todos'>('todos')
const filtroUsuario = ref('todos')
const buscar = ref('')

const actividadesFiltradas = computed(() =>
  actividades.value.filter(a => {
    const q = buscar.value.toLowerCase()
    const matchBuscar = !q || [a.contacto, a.empresa, a.accion].some(f => f.toLowerCase().includes(q))
    return matchBuscar
      && (filtroTipo.value === 'todos' || a.tipo === filtroTipo.value)
      && (filtroUsuario.value === 'todos' || a.usuario === filtroUsuario.value)
  })
)

const usuarios = computed(() => [...new Set(actividades.value.map(a => a.usuario))].sort())

const modalVisible = ref(false)
const formVacio = { tipo: 'Llamada' as TipoActividad, contacto: '', empresa: '', accion: '', proximoPaso: '', fecha: new Date().toISOString().split('T')[0], usuario: '' }
const form = reactive({ ...formVacio })

const abrirNuevo = () => { Object.assign(form, { ...formVacio, fecha: new Date().toISOString().split('T')[0] }); modalVisible.value = true }

const guardar = () => {
  if (!form.contacto || !form.accion) return
  actividades.value.unshift({ ...form, id: Date.now() })
  modalVisible.value = false
}

const tipos: TipoActividad[] = ['Llamada', 'Correo', 'Reunión', 'WhatsApp', 'Nota']
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          Bitácora de Relacionamiento
          <span class="bg-[#EEF2FF] text-[#2447F9] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ actividades.length }}</span>
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Historial completo de interacciones · llamadas, correos, reuniones</p>
      </div>
      <button @click="abrirNuevo" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
        <Plus :size="14" /> Registrar actividad
      </button>
    </div>

    <!-- Filtros rápidos por tipo -->
    <div class="flex gap-2 flex-wrap">
      <button
        @click="filtroTipo = 'todos'"
        class="flex items-center gap-1.5 h-8 px-3 rounded-xl text-[11px] font-bold transition-all"
        :class="filtroTipo === 'todos' ? 'bg-[#2447F9] text-white shadow' : 'bg-white border border-slate-200 text-slate-500 hover:border-[#2447F9] hover:text-[#2447F9]'"
      >
        Todos ({{ actividades.length }})
      </button>
      <button
        v-for="tipo in tipos"
        :key="tipo"
        @click="filtroTipo = tipo"
        class="flex items-center gap-1.5 h-8 px-3 rounded-xl text-[11px] font-bold transition-all"
        :class="filtroTipo === tipo
          ? 'text-white shadow'
          : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-700'"
        :style="filtroTipo === tipo ? { backgroundColor: tipoMeta[tipo].color } : {}"
      >
        <component :is="tipoMeta[tipo].icono" :size="11" />
        {{ tipo }} ({{ actividades.filter(a => a.tipo === tipo).length }})
      </button>
    </div>

    <!-- Toolbar -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Filter :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="buscar" placeholder="Buscar por contacto, empresa o acción..." class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
        </div>
        <select v-model="filtroUsuario" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
          <option value="todos">Todos los usuarios</option>
          <option v-for="u in usuarios" :key="u" :value="u">{{ u }}</option>
        </select>
      </div>
      <div class="mt-2 text-[11px] text-slate-400">
        Mostrando <strong class="text-slate-600">{{ actividadesFiltradas.length }}</strong> actividades
      </div>
    </div>

    <!-- Timeline -->
    <div class="space-y-3">
      <div
        v-for="a in actividadesFiltradas"
        :key="a.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex gap-4 hover:shadow-md transition-all"
      >
        <!-- Icono tipo -->
        <div class="flex-shrink-0">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="{ backgroundColor: tipoMeta[a.tipo].bg }">
            <component :is="tipoMeta[a.tipo].icono" :size="16" :style="{ color: tipoMeta[a.tipo].color }" />
          </div>
        </div>

        <!-- Contenido -->
        <div class="flex-1 min-w-0">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-[10px] font-bold uppercase tracking-wide" :style="{ color: tipoMeta[a.tipo].color }">{{ a.tipo }}</span>
              <span class="text-[12px] font-bold text-[#0F172A]">{{ a.contacto }}</span>
              <span class="text-[11px] text-slate-400">·</span>
              <span class="text-[11px] text-slate-500">{{ a.empresa }}</span>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="text-[10px] text-slate-400">{{ a.fecha }}</span>
              <div class="flex items-center gap-1">
                <div class="w-5 h-5 rounded-full bg-[#EEF2FF] text-[#2447F9] text-[7px] font-bold flex items-center justify-center">
                  {{ a.usuario.split(' ').map(n => n[0]).join('') }}
                </div>
                <span class="text-[10px] text-slate-400">{{ a.usuario }}</span>
              </div>
            </div>
          </div>

          <p class="text-[12px] text-slate-700 mb-2">{{ a.accion }}</p>

          <div v-if="a.proximoPaso" class="flex items-center gap-2 bg-[#F8FAFC] rounded-lg px-3 py-2">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex-shrink-0">Próx. paso:</span>
            <span class="text-[11px] text-[#2447F9] font-medium">{{ a.proximoPaso }}</span>
          </div>
        </div>
      </div>

      <div v-if="actividadesFiltradas.length === 0" class="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 text-[12px]">
        No se encontraron actividades con los filtros aplicados.
      </div>
    </div>

    <!-- Modal Registrar -->
    <Teleport to="body">
      <div v-if="modalVisible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="modalVisible = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[14px] font-bold text-[#0F172A]">Registrar Actividad</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">Bitácora de relacionamiento</p>
            </div>
            <button @click="modalVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
          </div>
          <div class="overflow-y-auto flex-1 p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-bold text-slate-600 mb-2 uppercase tracking-wide">Tipo de actividad</label>
                <div class="flex gap-2 flex-wrap">
                  <button
                    v-for="tipo in tipos" :key="tipo"
                    @click="form.tipo = tipo"
                    class="flex items-center gap-1.5 h-8 px-3 rounded-xl text-[11px] font-bold border transition-all"
                    :class="form.tipo === tipo ? 'text-white border-transparent shadow' : 'bg-white border-slate-200 text-slate-500'"
                    :style="form.tipo === tipo ? { backgroundColor: tipoMeta[tipo].color } : {}"
                  >
                    <component :is="tipoMeta[tipo].icono" :size="11" /> {{ tipo }}
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contacto *</label>
                <input v-model="form.contacto" placeholder="Nombre del contacto" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa</label>
                <input v-model="form.empresa" placeholder="Empresa" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Acción realizada *</label>
                <textarea v-model="form.accion" placeholder="Describa la actividad realizada..." rows="3" class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all resize-none" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Próximo paso</label>
                <input v-model="form.proximoPaso" placeholder="¿Cuál es el siguiente paso?" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha</label>
                <input v-model="form.fecha" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Usuario</label>
                <select v-model="form.usuario" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
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
            <button @click="guardar" class="h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">Guardar actividad</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
