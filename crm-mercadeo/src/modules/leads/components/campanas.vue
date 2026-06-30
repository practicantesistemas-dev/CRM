<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  Plus, X, Send, Mail, BarChart3, MousePointer,
  AlertCircle, Eye, Users, ChevronRight
} from 'lucide-vue-next'

interface Campana {
  id: number
  nombre: string
  segmento: string
  estado: 'Borrador' | 'Enviada' | 'Programada'
  enviados: number
  aperturas: number
  clics: number
  rebotes: number
  fecha: string
}

const campanas = ref<Campana[]>([
  { id: 1, nombre: 'Bienvenida Plan Liga Empresarial Q2', segmento: 'Empresas VIP Pereira', estado: 'Enviada', enviados: 312, aperturas: 187, clics: 94, rebotes: 8, fecha: '2026-06-10' },
  { id: 2, nombre: 'Recordatorio tamizajes julio', segmento: 'Prospectos sin gestión', estado: 'Enviada', enviados: 245, aperturas: 134, clics: 52, rebotes: 5, fecha: '2026-06-20' },
  { id: 3, nombre: 'Lanzamiento Brigadas Q3', segmento: 'Brigadas Medellín Q3', estado: 'Programada', enviados: 0, aperturas: 0, clics: 0, rebotes: 0, fecha: '2026-07-05' },
  { id: 4, nombre: 'Capacitaciones agosto', segmento: 'Todos', estado: 'Borrador', enviados: 0, aperturas: 0, clics: 0, rebotes: 0, fecha: '' },
])

const modalVisible = ref(false)
const modalEditorVisible = ref(false)
const campanaActiva = ref<Campana | null>(null)

const formVacio = { nombre: '', segmento: '', estado: 'Borrador' as const, enviados: 0, aperturas: 0, clics: 0, rebotes: 0, fecha: '' }
const form = reactive({ ...formVacio })

const htmlEditor = ref(`<h2 style="color:#2447F9;font-family:Inter,sans-serif">¡Hola {{nombre}}!</h2>
<p style="font-family:Inter,sans-serif;color:#334155">Te informamos sobre nuestros servicios del <strong>Plan Liga Ama Salvar Vidas</strong>.</p>
<p style="font-family:Inter,sans-serif;color:#334155">Tu empresa <strong>{{empresa}}</strong> puede beneficiarse de nuestros planes de bienestar y salud.</p>
<a href="#" style="display:inline-block;background:#2447F9;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-family:Inter,sans-serif;font-weight:bold;margin-top:16px">Conocer más</a>`)

const variables = ['{{nombre}}', '{{empresa}}', '{{cargo}}', '{{ciudad}}', '{{servicio}}']

const abrirNuevo = () => { Object.assign(form, formVacio); modalVisible.value = true }
const crearCampana = () => {
  if (!form.nombre) return
  campanas.value.unshift({ ...form, id: Date.now() })
  modalVisible.value = false
}

const abrirEditor = (c: Campana) => { campanaActiva.value = c; modalEditorVisible.value = true }

const insertarVariable = (v: string) => {
  htmlEditor.value += ` ${v}`
}

const estadoStyle = (e: string) => {
  if (e === 'Enviada')   return 'text-emerald-600'
  if (e === 'Programada') return 'text-[#1E3A8A]'
  return 'text-slate-400'
}

const tasaApertura = (c: Campana) => c.enviados > 0 ? Math.round(c.aperturas / c.enviados * 100) + '%' : '—'
const tasaClic = (c: Campana) => c.enviados > 0 ? Math.round(c.clics / c.enviados * 100) + '%' : '—'
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <!-- Header -->
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

    <!-- KPI resumen -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div class="w-8 h-8 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-3"><Send :size="15" class="text-[#2447F9]" /></div>
        <div class="text-[22px] font-bold text-[#0F172A]">{{ campanas.filter(c => c.estado === 'Enviada').reduce((acc, c) => acc + c.enviados, 0).toLocaleString('es-CO') }}</div>
        <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Total enviados</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div class="w-8 h-8 rounded-xl bg-[#FCE7F3] flex items-center justify-center mb-3"><Eye :size="15" class="text-[#EC4899]" /></div>
        <div class="text-[22px] font-bold text-[#0F172A]">{{ campanas.filter(c => c.estado === 'Enviada').reduce((acc, c) => acc + c.aperturas, 0).toLocaleString('es-CO') }}</div>
        <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Aperturas</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div class="w-8 h-8 rounded-xl bg-[#D1FAE5] flex items-center justify-center mb-3"><MousePointer :size="15" class="text-[#059669]" /></div>
        <div class="text-[22px] font-bold text-[#0F172A]">{{ campanas.filter(c => c.estado === 'Enviada').reduce((acc, c) => acc + c.clics, 0).toLocaleString('es-CO') }}</div>
        <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Clics</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div class="w-8 h-8 rounded-xl bg-[#FEF9C3] flex items-center justify-center mb-3"><AlertCircle :size="15" class="text-[#C9A227]" /></div>
        <div class="text-[22px] font-bold text-[#0F172A]">{{ campanas.filter(c => c.estado === 'Enviada').reduce((acc, c) => acc + c.rebotes, 0) }}</div>
        <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Rebotes</div>
      </div>
    </div>

    <!-- Lista campañas -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-100">
        <h3 class="text-[13px] font-bold text-[#0F172A]">Todas las campañas</h3>
      </div>
      <div class="divide-y divide-slate-100">
        <div v-for="c in campanas" :key="c.id" class="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors group">
          <div class="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
            <Mail :size="17" class="text-[#2447F9]" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-[12px] font-bold text-[#0F172A] truncate">{{ c.nombre }}</span>
              <span class="text-[10px] font-semibold flex-shrink-0" :class="estadoStyle(c.estado)">{{ c.estado }}</span>
            </div>
            <div class="flex items-center gap-2 text-[10px] text-slate-400">
              <Users :size="10" />{{ c.segmento }}
              <span v-if="c.fecha">· {{ c.fecha }}</span>
            </div>
          </div>

          <!-- Métricas -->
          <div v-if="c.estado === 'Enviada'" class="hidden sm:flex items-center gap-6">
            <div class="text-center">
              <div class="text-[13px] font-bold text-[#0F172A]">{{ c.enviados.toLocaleString('es-CO') }}</div>
              <div class="text-[9px] text-slate-400 uppercase tracking-wide">Enviados</div>
            </div>
            <div class="text-center">
              <div class="text-[13px] font-bold text-[#EC4899]">{{ tasaApertura(c) }}</div>
              <div class="text-[9px] text-slate-400 uppercase tracking-wide">Apertura</div>
            </div>
            <div class="text-center">
              <div class="text-[13px] font-bold text-[#059669]">{{ tasaClic(c) }}</div>
              <div class="text-[9px] text-slate-400 uppercase tracking-wide">Clics</div>
            </div>
            <div class="text-center">
              <div class="text-[13px] font-bold text-[#C9A227]">{{ c.rebotes }}</div>
              <div class="text-[9px] text-slate-400 uppercase tracking-wide">Rebotes</div>
            </div>
          </div>

          <button @click="abrirEditor(c)" class="flex items-center gap-1 h-8 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
            Editar <ChevronRight :size="11" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Nueva campaña -->
    <Teleport to="body">
      <div v-if="modalVisible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="modalVisible = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[14px] font-bold text-[#0F172A]">Nueva Campaña</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">Envío masivo por segmento</p>
            </div>
            <button @click="modalVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre de la campaña *</label>
              <input v-model="form.nombre" placeholder="Ej: Bienvenida Plan Liga Q3" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Segmento destinatario</label>
              <select v-model="form.segmento" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
                <option value="">Seleccionar segmento</option>
                <option value="Todos">Todos los contactos</option>
                <option value="Empresas VIP Pereira">Empresas VIP Pereira</option>
                <option value="Prospectos sin gestión">Prospectos sin gestión</option>
                <option value="Brigadas Medellín Q3">Brigadas Medellín Q3</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
                <select v-model="form.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
                  <option value="Borrador">Borrador</option>
                  <option value="Programada">Programada</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha envío</label>
                <input v-model="form.fecha" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
            <button @click="modalVisible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
            <button @click="crearCampana" class="h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">Crear campaña</button>
          </div>
        </div>
      </div>

      <!-- Editor HTML -->
      <div v-if="modalEditorVisible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="modalEditorVisible = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
            <div>
              <h3 class="text-[14px] font-bold text-[#0F172A]">Editor de Campaña</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">{{ campanaActiva?.nombre }}</p>
            </div>
            <button @click="modalEditorVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
          </div>
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <!-- Variables dinámicas -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-2 uppercase tracking-wide">Variables dinámicas</label>
              <div class="flex gap-2 flex-wrap">
                <button v-for="v in variables" :key="v" @click="insertarVariable(v)" class="inline-flex items-center h-7 px-2.5 rounded-lg bg-[#EEF2FF] text-[#2447F9] text-[10px] font-bold border border-blue-200 hover:bg-[#2447F9] hover:text-white transition-all">
                  {{ v }}
                </button>
              </div>
            </div>
            <!-- Editor -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-2 uppercase tracking-wide">Contenido HTML</label>
              <textarea v-model="htmlEditor" rows="12" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[12px] font-mono outline-none focus:border-[#2447F9] focus:bg-white transition-all resize-none" />
            </div>
            <!-- Preview -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-2 uppercase tracking-wide">Vista previa</label>
              <div class="rounded-xl border border-slate-200 bg-white p-6 overflow-auto max-h-48" v-html="htmlEditor" />
            </div>
          </div>
          <div class="flex items-center justify-between gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
            <button class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
              <BarChart3 :size="13" /> Ver métricas
            </button>
            <div class="flex gap-2">
              <button @click="modalEditorVisible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cerrar</button>
              <button class="flex items-center gap-1.5 h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all"><Send :size="13" /> Enviar campaña</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
