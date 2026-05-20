
<template>
  <div class="min-h-screen bg-slate-50 font-sans flex flex-col">
    
    <header class="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-slate-900 tracking-tight">CRM MERCADEO</h1>
        <p class="text-xs font-semibold text-blue-600 uppercase tracking-wider">Módulo: Gestión de Contactos</p>
      </div>
    </header>

    <div class="bg-white m-6 mb-0 p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
      
      <div class="flex flex-wrap gap-4 items-center justify-between">
        
        <div class="flex-1 min-w-[320px]">
          <label class="text-[11px] font-bold text-slate-700 uppercase block mb-1.5 tracking-wide">
            Buscar Prospecto
          </label>
          <input 
            v-model="busqueda" 
            type="text" 
            placeholder="Ingrese Cédula, Nombre completo o Teléfono..." 
            class="w-full border-2 border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-600 bg-white font-medium text-slate-800 placeholder-slate-400 shadow-sm transition-colors"
          />
        </div>

        <div>
          <label class="text-[11px] font-bold text-slate-600 uppercase block mb-1.5 tracking-wide">Tipo de Contacto</label>
          <div class="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button @click="filtroRol = 'todos'" :class="['btn-filtro-rol', filtroRol === 'todos' ? 'activo' : '']">Todos</button>
            <button @click="filtroRol = 'titular'" :class="['btn-filtro-rol', filtroRol === 'titular' ? 'activo' : '']">Titulares</button>
            <button @click="filtroRol = 'beneficiario'" :class="['btn-filtro-rol', filtroRol === 'beneficiario' ? 'activo' : '']">Beneficiarios</button>
          </div>
        </div>
      </div>

      <hr class="border-slate-100" />

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Estado Comercial</label>
          <select v-model="filtroEstado" class="bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="todos">Todos los Estados</option>
            <option value="Prospecto">Prospecto</option>
            <option value="Interesado">Interesado</option>
            <option value="Cita Agendada">Cita Agendada</option>
            <option value="Cliente Cerrado">Cliente Cerrado</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Canal de Origen</label>
          <select v-model="filtroOrigen" class="bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="todos">Todos los Orígenes</option>
            <option value="Facebook Ads">Facebook Ads</option>
            <option value="Google Ads">Google Ads</option>
            <option value="WhatsApp Directo">WhatsApp Directo</option>
            <option value="Referido">Referidos</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Campaña</label>
          <select v-model="filtroCampana" class="bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="todos">Todas las Campañas</option>
            <option value="Estética Mayo">Estética Mayo</option>
            <option value="Ortodoncia">Ortodoncia</option>
            <option value="Diseño de Sonrisa">Diseño de Sonrisa</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Género</label>
          <select v-model="filtroSexo" class="bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="todos">Todos</option>
            <option value="m">Masculino</option>
            <option value="f">Femenino</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Edad Segmento</label>
          <select v-model="filtroEdad" class="bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="todos">Cualquiera</option>
            <option value="joven">Jóvenes (&lt; 25)</option>
            <option value="adulto">Adultos (25 - 50)</option>
            <option value="mayor">Mayores (&gt; 50)</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Registrados Desde</label>
          <input 
            v-model="filtroFechaDesde" 
            type="date" 
            class="bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-700 shadow-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-1">
        <button 
          @click="limpiarFiltros" 
          class="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors border border-slate-200"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>

    <div class="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 p-6 overflow-hidden">
      
      <section class="xl:col-span-2 flex flex-col gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col justify-between">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th class="p-4">Contacto / Campaña</th>
                <th class="p-4">Tipo</th>
                <th class="p-4">Teléfono</th>
                <th class="p-4">Demografía</th>
                <th class="p-4">Fecha Ingreso</th>
                <th class="p-4">Estado Actual</th>
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
                  <div class="font-bold text-slate-800 text-sm">{{ contacto.nombre }}</div>
                  <div class="text-xs font-semibold text-blue-600">Camp: {{ contacto.campana }}</div>
                </td>
                <td class="p-4">
                  <span :class="['badge-rol', contacto.rol]">
                    {{ contacto.rol }}
                  </span>
                </td>
                <td class="p-4 text-xs font-mono font-semibold text-slate-700">
                  {{ contacto.telefono }}
                </td>
                <td class="p-4 text-xs">
                  <div class="font-semibold text-slate-700">{{ contacto.edad }} años</div>
                  <div class="text-[10px] text-slate-400 font-bold uppercase">{{ contacto.sexo === 'm' ? 'Masculino' : 'Femenino' }}</div>
                </td>
                <td class="p-4 text-xs text-slate-500 font-medium">
                  {{ contacto.fechaIngreso }}
                </td>
                <td class="p-4">
                  <span :class="['badge-estado', contacto.estado.replace(' ', '-')]">
                    {{ contacto.estado }}
                  </span>
                </td>
                <td class="p-4 text-right text-blue-600 font-bold text-xs hover:underline">Gestionar</td>
              </tr>
              <tr v-if="contactosFiltrados.length === 0">
                <td colspan="7" class="p-8 text-center text-slate-400 italic text-sm">
                  Ningún prospecto coincide con la segmentación seleccionada.
                </td>
              </tr>
            </tbody>
          </table>

          <div class="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center text-xs">
            <span class="text-slate-500 font-medium">Página {{ paginaActual }} de {{ totalPaginas }}</span>
            <div class="flex gap-2">
              <button @click="cambiarPagina(paginaActual - 1)" :disabled="paginaActual === 1" class="px-3 py-1.5 bg-white border rounded shadow-sm disabled:opacity-50 font-semibold">Anterior</button>
              <button @click="cambiarPagina(paginaActual + 1)" :disabled="paginaActual === totalPaginas" class="px-3 py-1.5 bg-white border rounded shadow-sm disabled:opacity-50 font-semibold">Siguiente</button>
            </div>
          </div>
        </div>
      </section>

      <aside class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div v-if="contactoSeleccionado" class="flex flex-col h-full">
          <div class="p-4 bg-slate-900 text-white">
            <span class="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">{{ contactoSeleccionado.origen }}</span>
            <h2 class="text-base font-bold mt-1.5 tracking-tight">{{ contactoSeleccionado.nombre }}</h2>
          </div>

          <div class="flex border-b border-slate-200 bg-slate-50">
            <button @click="subVistaActiva = 'servicios'" :class="['tab-nav', subVistaActiva === 'servicios' ? 'activa-servicios' : '']">Servicios</button>
            <button @click="subVistaActiva = 'seguimiento'" :class="['tab-nav', subVistaActiva === 'seguimiento' ? 'activa-seguimiento' : '']">Historial Bitácora</button>
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
        <div v-else class="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-50/50">
          <p class="text-sm font-semibold text-slate-500">Ningún lead seleccionado</p>
          <p class="text-xs text-slate-400 mt-1 max-w-[220px]">Seleccione un registro de la lista izquierda para auditar sus servicios y llamadas.</p>
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
  estado: EstadoLead; servicios: string[]; historial: string[];
  fechaIngreso: string;
}

const busqueda = ref<string>('')
const filtroRol = ref<RolContacto>('todos')
const filtroOrigen = ref<string>('todos')
const filtroEstado = ref<string>('todos')
const filtroCampana = ref<string>('todos')
const filtroSexo = ref<string>('todos')
const filtroEdad = ref<string>('todos')
const filtroFechaDesde = ref<string>('')

const paginaActual = ref<number>(1)
const totalPaginas = ref<number>(3)

const contactosFiltrados = shallowRef<Contacto[]>([])
const contactoSeleccionado = ref<Contacto | null>(null)
const subVistaActiva = ref<SubVista>('servicios')

const simularApiBackend = () => {
  contactosFiltrados.value = [
    { 
      id: 10 + paginaActual.value, 
      nombre: `Carlos Mendoza`, 
      rol: 'titular', 
      telefono: '300-555-0192', 
      edad: 34, 
      sexo: 'm', 
      fechaIngreso: '2026-03-15', 
      origen: 'Facebook Ads', 
      campana: 'Estética Mayo', 
      estado: 'Interesado', 
      servicios: ['Limpieza Avanzada'], 
      historial: ['Llamar por la tarde. Interesado en promociones vigentes.'] 
    },
    { 
      id: 20 + paginaActual.value, 
      nombre: `Mariana Gómez`, 
      rol: 'beneficiario', 
      telefono: '315-777-4422', 
      edad: 22, 
      sexo: 'f', 
      fechaIngreso: '2026-04-01', 
      origen: 'Google Ads', 
      campana: 'Ortodoncia', 
      estado: 'Prospecto', 
      servicios: [], 
      historial: [] 
    }
  ]
}

const limpiarFiltros = () => {
  busqueda.value = ''
  filtroRol.value = 'todos'
  filtroOrigen.value = 'todos'
  filtroEstado.value = 'todos'
  filtroCampana.value = 'todos'
  filtroSexo.value = 'todos'
  filtroEdad.value = 'todos'
  filtroFechaDesde.value = ''
}

let timer: ReturnType<typeof setTimeout>
watch(busqueda, () => {
  clearTimeout(timer)
  timer = setTimeout(() => { paginaActual.value = 1; simularApiBackend() }, 300)
})

watch([filtroRol, filtroOrigen, filtroEstado, filtroCampana, filtroSexo, filtroEdad, filtroFechaDesde, paginaActual], () => {
  simularApiBackend()
})

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
@reference "../../../style.css";

.btn-filtro-rol {
  @apply px-3 py-1 text-xs font-semibold rounded transition-all text-slate-500;
}
.btn-filtro-rol.activo {
  @apply bg-white text-slate-900 shadow-sm border border-slate-200;
}
.fila-contacto {
  @apply hover:bg-slate-50 transition-colors cursor-pointer text-sm;
}
.fila-contacto.seleccionada {
  @apply bg-blue-50/60 border-l-4 border-blue-600;
}
.badge-rol {
  @apply px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider;
}
.badge-rol.titular { @apply bg-emerald-50 text-emerald-700 border border-emerald-200/50; }
.badge-rol.beneficiario { @apply bg-purple-50 text-purple-700 border border-purple-200/50; }

.badge-estado {
  @apply px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide;
}
.badge-estado.Prospecto { @apply bg-slate-100 text-slate-700; }
.badge-estado.Interesado { @apply bg-amber-50 text-amber-700 border border-amber-200/40; }
.badge-estado.Cita-Agendada { @apply bg-blue-50 text-blue-700 border border-blue-200/40; }
.badge-estado.Cliente-Cerrado { @apply bg-emerald-50 text-emerald-700 border border-emerald-200/40; }

.tab-nav {
  @apply flex-1 py-3 text-xs font-semibold uppercase border-b-2 tracking-wider transition-all text-slate-400 bg-slate-50/50;
}
.activa-servicios { @apply border-blue-600 text-blue-600 bg-white font-bold; }
.activa-seguimiento { @apply border-blue-600 text-blue-600 bg-white font-bold; }
</style>

