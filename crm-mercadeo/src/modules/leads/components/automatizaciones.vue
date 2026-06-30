<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  Zap, Plus, Search, Edit2, Trash2, Play, Pause,
  Clock, CheckCircle, XCircle, X, AlertTriangle,
  Mail, Phone, Bell, Users, GitBranch, CalendarClock,
  Megaphone, FileText, RefreshCw
} from 'lucide-vue-next'

// ─── Types ─────────────────────────────────────────────────────────
type EstadoAuto = 'Activa' | 'Pausada' | 'Error'
type TipoTrigger =
  | 'Nuevo contacto'
  | 'Cambio de etapa'
  | 'Fecha de seguimiento'
  | 'Sin actividad 7 días'
  | 'Campaña enviada'
  | 'Formulario completado'
  | 'Nuevo beneficiario'
  | 'Inscripción Plan Liga'
type TipoAccion =
  | 'Enviar correo'
  | 'Crear tarea'
  | 'Notificar responsable'
  | 'Mover etapa'
  | 'Asignar etiqueta'
  | 'Crear actividad'
  | 'Enviar WhatsApp'

interface Automatizacion {
  id: number
  nombre: string
  descripcion: string
  trigger: TipoTrigger
  accion: TipoAccion
  estado: EstadoAuto
  ejecuciones: number
  ultimaEjecucion: string | null
  creadoPor: string
  creadoEn: string
  activo: boolean
}

// ─── Mock data ──────────────────────────────────────────────────────
const automatizaciones = ref<Automatizacion[]>([
  {
    id: 1,
    nombre: 'Bienvenida nuevo contacto',
    descripcion: 'Envía un correo de bienvenida cuando se registra un nuevo contacto en el CRM.',
    trigger: 'Nuevo contacto',
    accion: 'Enviar correo',
    estado: 'Activa',
    ejecuciones: 147,
    ultimaEjecucion: '2026-06-30T09:14:00',
    creadoPor: 'María García',
    creadoEn: '2026-01-15',
    activo: true,
  },
  {
    id: 2,
    nombre: 'Alerta etapa Cotización',
    descripcion: 'Notifica al responsable cuando una oportunidad avanza a la etapa de Cotización.',
    trigger: 'Cambio de etapa',
    accion: 'Notificar responsable',
    estado: 'Activa',
    ejecuciones: 83,
    ultimaEjecucion: '2026-06-29T16:45:00',
    creadoPor: 'Juan López',
    creadoEn: '2026-02-01',
    activo: true,
  },
  {
    id: 3,
    nombre: 'Seguimiento inactivo 7 días',
    descripcion: 'Crea una tarea de seguimiento si un contacto no ha tenido actividad en 7 días.',
    trigger: 'Sin actividad 7 días',
    accion: 'Crear tarea',
    estado: 'Activa',
    ejecuciones: 212,
    ultimaEjecucion: '2026-06-30T06:00:00',
    creadoPor: 'Carlos Torres',
    creadoEn: '2026-02-10',
    activo: true,
  },
  {
    id: 4,
    nombre: 'Recordatorio fecha seguimiento',
    descripcion: 'Envía un WhatsApp al responsable 1 día antes de la fecha de seguimiento programada.',
    trigger: 'Fecha de seguimiento',
    accion: 'Enviar WhatsApp',
    estado: 'Pausada',
    ejecuciones: 56,
    ultimaEjecucion: '2026-06-22T08:30:00',
    creadoPor: 'María García',
    creadoEn: '2026-03-05',
    activo: false,
  },
  {
    id: 5,
    nombre: 'Registro Plan Liga · bienvenida',
    descripcion: 'Al inscribir un nuevo titular en Plan Liga, envía correo de confirmación y crea actividad.',
    trigger: 'Inscripción Plan Liga',
    accion: 'Enviar correo',
    estado: 'Activa',
    ejecuciones: 34,
    ultimaEjecucion: '2026-06-28T11:20:00',
    creadoPor: 'Juan López',
    creadoEn: '2026-03-20',
    activo: true,
  },
  {
    id: 6,
    nombre: 'Error API correos',
    descripcion: 'Asigna etiqueta "Campaña" automáticamente cuando se envía una campaña masiva.',
    trigger: 'Campaña enviada',
    accion: 'Asignar etiqueta',
    estado: 'Error',
    ejecuciones: 18,
    ultimaEjecucion: '2026-06-25T14:10:00',
    creadoPor: 'Carlos Torres',
    creadoEn: '2026-04-01',
    activo: true,
  },
  {
    id: 7,
    nombre: 'Nuevo beneficiario · notificación',
    descripcion: 'Notifica al responsable del titular cuando se agrega un nuevo beneficiario.',
    trigger: 'Nuevo beneficiario',
    accion: 'Notificar responsable',
    estado: 'Activa',
    ejecuciones: 29,
    ultimaEjecucion: '2026-06-30T07:55:00',
    creadoPor: 'María García',
    creadoEn: '2026-04-18',
    activo: true,
  },
])

// ─── Trigger & Acción meta ──────────────────────────────────────────
const triggerMeta: Record<TipoTrigger, { icono: any; color: string; bg: string }> = {
  'Nuevo contacto':       { icono: Users,        color: '#2447F9', bg: '#EEF2FF' },
  'Cambio de etapa':      { icono: GitBranch,    color: '#1A2A6C', bg: '#E8EAF6' },
  'Fecha de seguimiento': { icono: CalendarClock, color: '#C9A227', bg: '#FEF9C3' },
  'Sin actividad 7 días': { icono: Clock,        color: '#EC4899', bg: '#FCE7F3' },
  'Campaña enviada':      { icono: Megaphone,    color: '#059669', bg: '#D1FAE5' },
  'Formulario completado':{ icono: FileText,     color: '#6366F1', bg: '#EEF2FF' },
  'Nuevo beneficiario':   { icono: Users,        color: '#EC4899', bg: '#FCE7F3' },
  'Inscripción Plan Liga':{ icono: Bell,         color: '#EC4899', bg: '#FCE7F3' },
}

const accionMeta: Record<TipoAccion, { icono: any; color: string }> = {
  'Enviar correo':          { icono: Mail,      color: '#2447F9' },
  'Crear tarea':            { icono: FileText,  color: '#C9A227' },
  'Notificar responsable':  { icono: Bell,      color: '#EC4899' },
  'Mover etapa':            { icono: GitBranch, color: '#1A2A6C' },
  'Asignar etiqueta':       { icono: Zap,       color: '#059669' },
  'Crear actividad':        { icono: RefreshCw, color: '#6366F1' },
  'Enviar WhatsApp':        { icono: Phone,     color: '#059669' },
}

const estadoStyle: Record<EstadoAuto, string> = {
  'Activa':  'text-emerald-600',
  'Pausada': 'text-amber-600',
  'Error':   'text-red-500',
}

// ─── Filters ───────────────────────────────────────────────────────
const buscar        = ref('')
const filtroEstado  = ref('todos')

const filtradas = computed(() =>
  automatizaciones.value.filter(a => {
    const q = buscar.value.toLowerCase()
    const matchQ = !q || [a.nombre, a.descripcion, a.trigger, a.accion]
      .some(f => f.toLowerCase().includes(q))
    return matchQ && (filtroEstado.value === 'todos' || a.estado === filtroEstado.value)
  })
)

// ─── Stats ─────────────────────────────────────────────────────────
const totalActivas    = computed(() => automatizaciones.value.filter(a => a.estado === 'Activa').length)
const totalEjecuciones = computed(() => automatizaciones.value.reduce((s, a) => s + a.ejecuciones, 0))
const totalError      = computed(() => automatizaciones.value.filter(a => a.estado === 'Error').length)

// ─── Toggle estado ─────────────────────────────────────────────────
const toggleActivo = (a: Automatizacion) => {
  a.activo = !a.activo
  if (a.estado === 'Error') return
  a.estado = a.activo ? 'Activa' : 'Pausada'
}

// ─── Delete ────────────────────────────────────────────────────────
const confirmarEliminar = ref<Automatizacion | null>(null)
const eliminar = () => {
  if (!confirmarEliminar.value) return
  automatizaciones.value = automatizaciones.value.filter(a => a.id !== confirmarEliminar.value!.id)
  confirmarEliminar.value = null
}

// ─── Modal crear / editar ──────────────────────────────────────────
const modalVisible  = ref(false)
const modalModo     = ref<'nuevo' | 'editar'>('nuevo')
const editandoId    = ref<number | null>(null)

const triggers: TipoTrigger[] = [
  'Nuevo contacto', 'Cambio de etapa', 'Fecha de seguimiento',
  'Sin actividad 7 días', 'Campaña enviada', 'Formulario completado',
  'Nuevo beneficiario', 'Inscripción Plan Liga',
]
const acciones: TipoAccion[] = [
  'Enviar correo', 'Crear tarea', 'Notificar responsable',
  'Mover etapa', 'Asignar etiqueta', 'Crear actividad', 'Enviar WhatsApp',
]

const formVacio = {
  nombre: '',
  descripcion: '',
  trigger: 'Nuevo contacto' as TipoTrigger,
  accion: 'Enviar correo' as TipoAccion,
}
const form = reactive({ ...formVacio })

const abrirNueva = () => {
  modalModo.value = 'nuevo'
  editandoId.value = null
  Object.assign(form, { ...formVacio })
  modalVisible.value = true
}

const abrirEditar = (a: Automatizacion) => {
  modalModo.value = 'editar'
  editandoId.value = a.id
  Object.assign(form, { nombre: a.nombre, descripcion: a.descripcion, trigger: a.trigger, accion: a.accion })
  modalVisible.value = true
}

const guardar = () => {
  if (!form.nombre) return
  if (modalModo.value === 'nuevo') {
    automatizaciones.value.unshift({
      id: Date.now(),
      nombre: form.nombre,
      descripcion: form.descripcion,
      trigger: form.trigger,
      accion: form.accion,
      estado: 'Activa',
      ejecuciones: 0,
      ultimaEjecucion: null,
      creadoPor: 'Usuario actual',
      creadoEn: new Date().toISOString().split('T')[0],
      activo: true,
    })
  } else {
    const idx = automatizaciones.value.findIndex(a => a.id === editandoId.value)
    if (idx !== -1) {
      automatizaciones.value[idx].nombre      = form.nombre
      automatizaciones.value[idx].descripcion = form.descripcion
      automatizaciones.value[idx].trigger     = form.trigger
      automatizaciones.value[idx].accion      = form.accion
    }
  }
  modalVisible.value = false
}

const formatDate = (iso: string | null) => {
  if (!iso) return 'Nunca'
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">

    <!-- ── Header ───────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          <Zap :size="20" class="text-[#C9A227]" />
          Automatizaciones
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">
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

    <!-- ── KPIs ──────────────────────────────────────────────── -->
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#D1FAE5] flex items-center justify-center mb-3">
          <CheckCircle :size="17" class="text-[#059669]" />
        </div>
        <div class="text-[28px] font-bold text-[#0F172A] leading-none">{{ totalActivas }}</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Activas</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-3">
          <Zap :size="17" class="text-[#2447F9]" />
        </div>
        <div class="text-[28px] font-bold text-[#0F172A] leading-none">{{ totalEjecuciones.toLocaleString('es-CO') }}</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Ejecuciones totales</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center mb-3">
          <XCircle :size="17" class="text-red-500" />
        </div>
        <div class="text-[28px] font-bold text-[#0F172A] leading-none">{{ totalError }}</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Con errores</div>
      </div>
    </div>

    <!-- ── Toolbar ───────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="buscar"
            placeholder="Buscar por nombre, trigger o acción..."
            class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all"
          />
        </div>
        <select
          v-model="filtroEstado"
          class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer"
        >
          <option value="todos">Estado: Todos</option>
          <option value="Activa">Activa</option>
          <option value="Pausada">Pausada</option>
          <option value="Error">Error</option>
        </select>
      </div>
      <div class="mt-2 text-[11px] text-slate-400">
        Mostrando <strong class="text-slate-600">{{ filtradas.length }}</strong> automatizaciones
      </div>
    </div>

    <!-- ── Lista ─────────────────────────────────────────────── -->
    <div class="space-y-3">
      <div
        v-for="auto in filtradas"
        :key="auto.id"
        class="bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md group"
        :class="auto.estado === 'Error' ? 'border-red-200' : 'border-slate-200'"
      >
        <!-- Error banner -->
        <div v-if="auto.estado === 'Error'" class="flex items-center gap-2 px-5 py-2 bg-red-50 border-b border-red-200">
          <AlertTriangle :size="12" class="text-red-500 shrink-0" />
          <p class="text-[11px] text-red-600 font-medium">
            Esta automatización tiene errores y se ha detenido. Revisa la configuración.
          </p>
        </div>

        <div class="flex items-start gap-4 p-5">
          <!-- Trigger icon -->
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            :style="{ backgroundColor: triggerMeta[auto.trigger].bg }"
          >
            <component :is="triggerMeta[auto.trigger].icono" :size="17" :style="{ color: triggerMeta[auto.trigger].color }" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-3 flex-wrap">
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-[13px] font-bold text-[#0F172A] truncate">{{ auto.nombre }}</h3>
                  <span
                    class="inline-flex items-center gap-1 text-[10px] font-semibold"
                    :class="estadoStyle[auto.estado]"
                  >
                    {{ auto.estado }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{{ auto.descripcion }}</p>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-1 shrink-0">
                <button
                  @click="toggleActivo(auto)"
                  class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  :class="auto.activo
                    ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'"
                  :title="auto.activo ? 'Pausar' : 'Activar'"
                >
                  <component :is="auto.activo ? Pause : Play" :size="13" />
                </button>
                <button
                  @click="abrirEditar(auto)"
                  class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 flex items-center justify-center transition-all"
                  title="Editar"
                >
                  <Edit2 :size="12" />
                </button>
                <button
                  @click="confirmarEliminar = auto"
                  class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 flex items-center justify-center transition-all"
                  title="Eliminar"
                >
                  <Trash2 :size="12" />
                </button>
              </div>
            </div>

            <!-- Trigger → Acción flow -->
            <div class="flex items-center gap-2 mt-3 flex-wrap">
              <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                <component :is="triggerMeta[auto.trigger].icono" :size="11" :style="{ color: triggerMeta[auto.trigger].color }" />
                <span class="text-[10px] font-semibold text-slate-600">{{ auto.trigger }}</span>
              </div>
              <div class="text-[10px] text-slate-400 font-bold">→</div>
              <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                <component :is="accionMeta[auto.accion].icono" :size="11" :style="{ color: accionMeta[auto.accion].color }" />
                <span class="text-[10px] font-semibold text-slate-600">{{ auto.accion }}</span>
              </div>
            </div>

            <!-- Meta row -->
            <div class="flex items-center gap-4 mt-3 flex-wrap">
              <div class="flex items-center gap-1.5 text-[10px] text-slate-400">
                <Zap :size="10" class="text-[#C9A227]" />
                <span><strong class="text-slate-600">{{ auto.ejecuciones }}</strong> ejecuciones</span>
              </div>
              <div class="flex items-center gap-1.5 text-[10px] text-slate-400">
                <Clock :size="10" />
                <span>Última: <strong class="text-slate-600">{{ formatDate(auto.ultimaEjecucion) }}</strong></span>
              </div>
              <div class="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span>Creado por <strong class="text-slate-600">{{ auto.creadoPor }}</strong> el {{ auto.creadoEn }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filtradas.length === 0" class="bg-white rounded-2xl border border-slate-200 shadow-sm text-center py-16">
        <Zap :size="32" class="text-slate-300 mx-auto mb-3" />
        <p class="text-[13px] font-semibold text-slate-500">No hay automatizaciones</p>
        <p class="text-[11px] text-slate-400 mt-1">Crea una nueva para automatizar tus procesos.</p>
        <button
          @click="abrirNueva"
          class="mt-4 flex items-center gap-1.5 h-9 px-5 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all mx-auto"
        >
          <Plus :size="13" /> Crear automatización
        </button>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         TELEPORTS
    ══════════════════════════════════════ -->
    <Teleport to="body">

      <!-- ── Modal crear / editar ─────────── -->
      <div
        v-if="modalVisible"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        @click.self="modalVisible = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[14px] font-bold text-[#0F172A]">
                {{ modalModo === 'nuevo' ? 'Nueva Automatización' : 'Editar Automatización' }}
              </h3>
              <p class="text-[11px] text-slate-400 mt-0.5">Define el disparador y la acción</p>
            </div>
            <button @click="modalVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
              <X :size="14" />
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre *</label>
              <input
                v-model="form.nombre"
                placeholder="Ej: Bienvenida nuevo contacto"
                class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Descripción</label>
              <textarea
                v-model="form.descripcion"
                placeholder="¿Qué hace esta automatización?"
                rows="2"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all resize-none"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Disparador (trigger)</label>
                <select
                  v-model="form.trigger"
                  class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer"
                >
                  <option v-for="t in triggers" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Acción</label>
                <select
                  v-model="form.accion"
                  class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer"
                >
                  <option v-for="a in acciones" :key="a" :value="a">{{ a }}</option>
                </select>
              </div>
            </div>

            <!-- Preview flow -->
            <div class="bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
              <div class="flex items-center gap-1.5 text-[11px] font-semibold" :style="{ color: triggerMeta[form.trigger].color }">
                <component :is="triggerMeta[form.trigger].icono" :size="13" />
                {{ form.trigger }}
              </div>
              <div class="text-[11px] text-slate-400 font-bold">→</div>
              <div class="flex items-center gap-1.5 text-[11px] font-semibold" :style="{ color: accionMeta[form.accion].color }">
                <component :is="accionMeta[form.accion].icono" :size="13" />
                {{ form.accion }}
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
            <button @click="modalVisible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
            <button @click="guardar" class="h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
              {{ modalModo === 'nuevo' ? 'Crear automatización' : 'Guardar cambios' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── Confirmar eliminar ────────────── -->
      <div
        v-if="confirmarEliminar"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        @click.self="confirmarEliminar = null"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
          <div class="p-6 text-center">
            <div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 :size="20" class="text-red-500" />
            </div>
            <h3 class="text-[14px] font-bold text-[#0F172A] mb-1">Eliminar automatización</h3>
            <p class="text-[12px] text-slate-500">
              ¿Eliminar <strong>"{{ confirmarEliminar.nombre }}"</strong>? Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="flex gap-2 px-6 pb-6">
            <button
              @click="confirmarEliminar = null"
              class="flex-1 h-9 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              @click="eliminar"
              class="flex-1 h-9 rounded-lg bg-red-500 text-white text-[11px] font-bold shadow hover:bg-red-600 transition-all"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>

    </Teleport>
  </div>
</template>
