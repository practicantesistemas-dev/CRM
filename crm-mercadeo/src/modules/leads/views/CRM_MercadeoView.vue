<template>
  <div class="min-h-screen bg-slate-50 font-sans flex flex-col">
    
    <header class="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight">CRM MERCADEO</h1>
        <p class="text-xs font-semibold text-blue-600 uppercase tracking-wider">Módulo: Gestión de Contactos</p>
      </div>

      <div class="flex items-center gap-3 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
        <span class="text-xs font-bold text-slate-500 pl-2">Origen Lead:</span>
        <select v-model="filtroOrigen" class="bg-white border-none rounded-lg p-1.5 text-xs font-medium text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500">
          <option value="todos">Todos los Orígenes</option>
          <option value="Facebook Ads">Facebook Ads</option>
          <option value="Google Ads">Google Ads</option>
          <option value="WhatsApp Directo">WhatsApp Directo</option>
          <option value="Referido">Referidos</option>
        </select>
      </div>
    </header>

    <div class="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 p-6 overflow-hidden">
      
      <section class="xl:col-span-2 flex flex-col gap-4">
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-3 items-center justify-between">
          <input 
            v-model="busqueda" 
            type="text" 
            placeholder="🔎 Buscar por nombre o campaña (Optimizado)..." 
            class="flex-1 min-w-[250px] border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
          <div class="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
            <button @click="filtroRol = 'todos'" :class="['btn-filtro-rol', filtroRol === 'todos' ? 'activo' : '']">Todos</button>
            <button @click="filtroRol = 'titular'" :class="['btn-filtro-rol', filtroRol === 'titular' ? 'activo' : '']">Titulares</button>
            <button @click="filtroRol = 'beneficiario'" :class="['btn-filtro-rol', filtroRol === 'beneficiario' ? 'activo' : '']">Beneficiarios</button>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col justify-between">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th class="p-4">Contacto</th>
                <th class="p-4">Tipo</th>
                <th class="p-4">Datos Clave</th>
                <th class="p-4">Estado</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm text-slate-600">
              <tr 
                v-for="contacto in contactosFiltrados" 
                :key="contacto.id" 
                :class="['fila-contacto', contactoSeleccionado?.id === contacto.id ? 'seleccionada' : '']"
                @click="seleccionarContacto(contacto)"
              >
                <td class="p-4">
                  <div class="font-bold text-slate-800">{{ contacto.nombre }}</div>
                  <div class="text-xs text-slate-400">Camp: {{ contacto.campana }}</div>
                </td>
                <td class="p-4">
                  <span :class="['badge-rol', contacto.rol]">
                    {{ contacto.rol }}
                  </span>
                </td>
                <td class="p-4">
                  <div class="text-xs font-semibold text-slate-700">📞 {{ contacto.telefono }}</div>
                  <div class="text-[11px] text-slate-400">Edad: {{ contacto.edad }}</div>
                </td>
                <td class="p-4">
                  <span :class="['badge-estado', contacto.estado.replace(' ', '-')]">
                    ● {{ contacto.estado }}
                  </span>
                </td>
                <td class="p-4 text-right text-blue-500 font-bold text-xs">Gestionar →</td>
              </tr>
            </tbody>
          </table>

          <div class="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center text-xs">
            <span class="text-slate-500 font-medium">Página {{ paginaActual }} de {{ totalPaginas }}</span>
            <div class="flex gap-2">
              <button @click="cambiarPagina(paginaActual - 1)" :disabled="paginaActual === 1" class="px-3 py-1.5 bg-white border rounded shadow-sm disabled:opacity-50">◀ Ant</button>
              <button @click="cambiarPagina(paginaActual + 1)" :disabled="paginaActual === totalPaginas" class="px-3 py-1.5 bg-white border rounded shadow-sm disabled:opacity-50">Sig ▶</button>
            </div>
          </div>
        </div>
      </section>

      <aside class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div v-if="contactoSeleccionado" class="flex flex-col h-full">
          <div class="p-4 bg-slate-900 text-white">
            <span class="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">{{ contactoSeleccionado.origen }}</span>
            <h2 class="text-lg font-bold mt-1">{{ contactoSeleccionado.nombre }}</h2>
          </div>

          <div class="flex border-b border-slate-200 bg-slate-50">
            <button @click="subVistaActiva = 'servicios'" :class="['tab-nav', subVistaActiva === 'servicios' ? 'activa-servicios' : '']">👁️ Servicios</button>
            <button @click="subVistaActiva = 'seguimiento'" :class="['tab-nav', subVistaActiva === 'seguimiento' ? 'activa-seguimiento' : '']">💼 Seguimiento</button>
          </div>

          <div class="p-4 flex-1 overflow-y-auto">
            <SubVistaServicios 
              v-if="subVistaActiva === 'servicios'" 
              :contacto="contactoSeleccionado" 
            />
            <SubVistaSeguimiento 
              v-else-if="subVistaActiva === 'seguimiento'" 
              :contacto="contactoSeleccionado"
              @nuevaNota="procesarNuevaNota"
            />
          </div>
        </div>
        <div v-else class="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
          <span class="text-4xl mb-2">👈</span>
          <p class="text-sm font-medium">Selecciona un registro para auditar el CRM.</p>
        </div>
      </aside>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue'
import SubVistaServicios from '../components/SubVistaServicios.vue'
import SubVistaSeguimiento from '../components/SubVistaSeguimiento.vue'

type RolContacto = 'todos' | 'titular' | 'beneficiario'
type EstadoLead = 'Prospecto' | 'Interesado' | 'Cita Agendada' | 'Cliente Cerrado'
type SubVista = 'servicios' | 'seguimiento'

interface Contacto {
  id: number; nombre: string; rol: 'titular' | 'beneficiario'; telefono: string;
  edad: number; sexo: 'm' | 'f'; origen: string; campana: string;
  estado: EstadoLead; servicios: string[]; historial: string[]
}

const busqueda = ref<string>('')
const filtroRol = ref<RolContacto>('todos')
const filtroOrigen = ref<string>('todos')
const paginaActual = ref<number>(1)
const totalPaginas = ref<number>(3)

const contactosFiltrados = shallowRef<Contacto[]>([])
const contactoSeleccionado = ref<Contacto | null>(null)
const subVistaActiva = ref<SubVista>('servicios')

const simularApiBackend = () => {
  contactosFiltrados.value = [
    { id: 10 + paginaActual.value, nombre: `Paciente Muestra ${paginaActual.value}A`, rol: 'titular', telefono: '300-1111', edad: 34, sexo: 'm', origen: 'Facebook Ads', campana: 'Estética Mayo', estado: 'Interesado', servicios: ['Limpieza Avanzada'], historial: ['Interesado en costos.'] },
    { id: 20 + paginaActual.value, nombre: `Paciente Muestra ${paginaActual.value}B`, rol: 'beneficiario', telefono: '300-2222', edad: 19, sexo: 'f', origen: 'Google Ads', campana: 'Ortodoncia', estado: 'Prospecto', servicios: [], historial: [] }
  ]
}

let timer: ReturnType<typeof setTimeout>
watch(busqueda, () => {
  clearTimeout(timer)
  timer = setTimeout(() => { paginaActual.value = 1; simularApiBackend() }, 300)
})

watch([filtroRol, filtroOrigen, paginaActual], () => simularApiBackend())
simularApiBackend()

const seleccionarContacto = (contacto: Contacto) => { contactoSeleccionado.value = contacto }
const cambiarPagina = (p: number) => { if(p >= 1 && p <= totalPaginas.value) paginaActual.value = p }

const procesarNuevaNota = (nota: string) => {
  if (contactoSeleccionado.value) {
    contactoSeleccionado.value.historial.unshift(nota)
  }
}
</script>

<style scoped>
.btn-filtro-rol {
  @apply px-3 py-1.5 text-xs font-bold rounded-md transition-all;
}
.btn-filtro-rol.activo {
  @apply bg-white text-slate-800 shadow-sm;
}
.fila-contacto {
  @apply hover:bg-blue-50/40 transition-colors cursor-pointer text-sm;
}
.fila-contacto.seleccionada {
  @apply bg-blue-50 border-l-4 border-blue-600;
}
.badge-rol {
  @apply px-2 py-0.5 rounded text-[11px] font-bold uppercase;
}
.badge-rol.titular { @apply bg-emerald-100 text-emerald-800; }
.badge-rol.beneficiario { @apply bg-purple-100 text-purple-800; }

.badge-estado {
  @apply px-2 py-1 rounded-full text-xs font-medium;
}
.badge-estado.Prospecto { @apply bg-blue-100 text-blue-800; }
.badge-estado.Interesado { @apply bg-amber-100 text-amber-800; }

.tab-nav {
  @apply flex-1 py-3 text-xs font-bold uppercase border-b-2 tracking-wider transition-all text-slate-500;
}
.activa-servicios { @apply border-blue-600 text-blue-600 bg-white; }
.activa-seguimiento { @apply border-amber-500 text-amber-600 bg-white; }
</style>